/* ============================================================
   Cylgem — Motor de contenido unificado (Supabase + ES/EN)
   ------------------------------------------------------------
   Toda la copia del sitio vive en la tabla `site_content` de
   Supabase (clave → { value, value_en }). Este archivo:
   • trae esas filas una sola vez por carga de página
   • las cachea en localStorage para pintar instantáneo en la
     próxima visita mientras se refresca en segundo plano
   • aplica el idioma activo sobre atributos data-i18n*
   • si Supabase tarda o falla, el HTML ya tiene el español real
     hardcodeado — el sitio nunca se ve en blanco

   Atributos soportados:
     data-i18n="key"        → innerHTML (admite <br>, <span>, etc.)
     data-i18n-ph="key"      → placeholder
     data-i18n-aria="key"    → aria-label
     data-i18n-alt="key"     → alt (imágenes)
     data-i18n-href="key"    → href (links/PDFs, valor = URL completa)
     data-i18n-mailto="key"  → href="mailto:VALOR" (valor = solo el email)
     data-i18n-bg="key"      → reemplaza url(...) dentro de background-image
                               (independiente del idioma — misma foto en ES/EN)
   ============================================================ */
(function () {
  const SUPABASE_URL = 'https://ttcilugbybfekocqpiur.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Y2lsdWdieWJmZWtvY3FwaXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMzEzMDUsImV4cCI6MjA5NjcwNzMwNX0.E1fFy8Ri6YlCtrvNhJ2o_UpIXMuOY_B9F_STGYHDdqU';
  const STORE_KEY = 'cylgem_lang';
  const CACHE_KEY = 'cylgem_content_cache_v1';

  let rows = {}; // key -> { value, value_en }

  function pick(key, lang) {
    const r = rows[key];
    if (!r) return null;
    /* Si se pide EN pero no hay value_en, siempre retorna ES (nunca mezcla idiomas) */
    if (lang === 'en') return r.value_en ? r.value_en : r.value;
    return (r.value != null && r.value !== '') ? r.value : null;
  }

  function getInitialLang() {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved === 'es' || saved === 'en') return saved;
    return (navigator.language || 'es').toLowerCase().startsWith('en') ? 'en' : 'es';
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) rows = JSON.parse(raw) || {};
    } catch (e) { rows = {}; }
  }

  function saveCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(rows)); } catch (e) { /* noop */ }
  }

  function apply(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = pick(el.getAttribute('data-i18n'), lang);
      if (val != null) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const val = pick(el.getAttribute('data-i18n-ph'), lang);
      if (val != null) el.setAttribute('placeholder', val);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const val = pick(el.getAttribute('data-i18n-aria'), lang);
      if (val != null) el.setAttribute('aria-label', val);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(el => {
      const val = pick(el.getAttribute('data-i18n-alt'), lang);
      if (val != null) el.setAttribute('alt', val);
    });
    document.querySelectorAll('[data-i18n-href]').forEach(el => {
      const val = pick(el.getAttribute('data-i18n-href'), lang);
      if (val != null) el.setAttribute('href', val);
    });
    document.querySelectorAll('[data-i18n-mailto]').forEach(el => {
      const val = pick(el.getAttribute('data-i18n-mailto'), lang);
      if (val != null) el.setAttribute('href', 'mailto:' + val);
    });
    document.querySelectorAll('[data-i18n-bg]').forEach(el => {
      const val = pick(el.getAttribute('data-i18n-bg'), 'es'); // las fotos no dependen del idioma
      if (val != null && el.style.backgroundImage) {
        el.style.backgroundImage = el.style.backgroundImage.replace(/url\([^)]+\)/, `url('${val}')`);
      }
    });
  }

  function updateToggleUI(lang) {
    document.querySelectorAll('.lang-opt').forEach(opt => {
      opt.classList.toggle('is-active', opt.dataset.lang === lang);
    });
  }

  window.setLang = function (lang) {
    if (lang !== 'es' && lang !== 'en') lang = 'es';
    document.documentElement.lang = lang;
    localStorage.setItem(STORE_KEY, lang);
    window.CYLGEM_LANG = lang;
    apply(lang);
    updateToggleUI(lang);
  };

  window.getLang = function () { return window.CYLGEM_LANG || getInitialLang(); };

  function bindToggle(el) {
    if (!el) return;
    el.addEventListener('click', e => {
      const opt = e.target.closest('.lang-opt');
      const target = (opt && opt.dataset.lang)
        ? opt.dataset.lang
        : (window.getLang() === 'es' ? 'en' : 'es');
      window.setLang(target);
    });
  }

  async function init() {
    const lang = getInitialLang();
    window.CYLGEM_LANG = lang;
    document.documentElement.lang = lang;
    updateToggleUI(lang);
    bindToggle(document.getElementById('langToggle'));
    bindToggle(document.getElementById('mobileLangToggle'));

    // Pintado instantáneo con el último contenido conocido (si hay caché de una visita anterior)
    loadCache();
    if (Object.keys(rows).length) apply(lang);

    // Se refresca contra Supabase en segundo plano; si falla, se queda con la
    // caché (o, en la primera visita nunca, con el español ya hardcodeado en el HTML).
    try {
      if (typeof supabase === 'undefined') return;
      const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data } = await client.from('site_content').select('key, value, value_en');
      if (data && data.length) {
        const fresh = {};
        data.forEach(r => { fresh[r.key] = { value: r.value, value_en: r.value_en }; });
        rows = fresh;
        saveCache();
        apply(window.getLang());
      }
    } catch (e) { /* sin conexión a Supabase: se mantiene lo ya pintado */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
