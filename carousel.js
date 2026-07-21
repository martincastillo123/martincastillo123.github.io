/* ============================================================
   Cylgem — Carrusel de logos de clientes (dinámico, Supabase)
   ------------------------------------------------------------
   Los logos viven en la tabla `client_logos` (no en site_content,
   porque acá se pueden agregar o quitar marcas — una lista de
   largo variable, no un set fijo de claves).

   Cada fila trae su propia calibración óptica (scale) y si hace
   falta invertir el color (logos blancos tipo Newsan), para no
   perder el ajuste fino ya hecho a mano por marca. Un logo nuevo
   agregado desde el admin arranca en scale=1 / invert=false.
   ============================================================ */
(function () {
  const SUPABASE_URL = 'https://ttcilugbybfekocqpiur.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0Y2lsdWdieWJmZWtvY3FwaXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMzEzMDUsImV4cCI6MjA5NjcwNzMwNX0.E1fFy8Ri6YlCtrvNhJ2o_UpIXMuOY_B9F_STGYHDdqU';

  function escapeAttr(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function slideHTML(row) {
    const styleParts = [`--logo-scale:${Number(row.scale) || 1}`];
    if (row.invert) styleParts.push('filter:brightness(0)');
    return `<div class="carousel-slide"><img src="${escapeAttr(row.image_url)}" alt="${escapeAttr(row.alt)}" class="carousel-logo" style="${styleParts.join(';')}" loading="lazy" /></div>`;
  }

  async function init() {
    const track = document.getElementById('carouselTrack');
    if (!track || typeof supabase === 'undefined') return;

    try {
      const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data } = await client
        .from('client_logos')
        .select('alt, image_url, scale, invert, sort_order')
        .order('sort_order', { ascending: true });

      if (!data || !data.length) return;

      // Se arma el HTML de los logos una vez y se inyecta DOS veces seguidas
      // (mismo truco que antes con el marcado estático) para que el loop
      // infinito de CSS (translateX(-50%)) no tenga costuras.
      const slidesHTML = data.map(slideHTML).join('');
      track.innerHTML = slidesHTML + slidesHTML;
    } catch (e) { /* sin conexión: el carrusel queda vacío, no rompe el resto de la página */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
