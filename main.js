  /* ============ Nav entrance + scroll state ============ */
  const nav = document.getElementById('nav');
  nav.style.transition = 'opacity .6s ease, border-color .3s, background .3s';
  requestAnimationFrame(() => {
    nav.style.opacity = '1';
  });
  window.addEventListener('scroll', ()=>{
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, {passive:true});

  /* ============ Mobile menu toggle ============ */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  function closeMenu(){
    if(!navToggle || !mobileMenu) return;
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }
  function openMenu(){
    if(!navToggle || !mobileMenu) return;
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }
  if(navToggle && mobileMenu){
    navToggle.addEventListener('click', ()=>{
      if(navToggle.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
    // Cierra al clickear un link del menú
    mobileMenu.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', closeMenu);
    });
    // Cierra con Escape
    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
    });
    // Cierra si pasa a desktop
    window.addEventListener('resize', ()=>{
      if(window.innerWidth > 1024 && mobileMenu.classList.contains('is-open')) closeMenu();
    });
  }

  /* ============ Capacidades — acordeón (solo mobile) ============ */
  (function initCapAccordion(){
    const cards = document.querySelectorAll('.cap-steps .cap-card');
    if(!cards.length) return;
    const mq = window.matchMedia('(max-width: 768px)');
    cards.forEach(card => {
      const title = card.querySelector('.cap-card-title');
      if(title){
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-expanded', 'false');
      }
      const toggle = () => {
        if(!mq.matches) return;          // en desktop el texto está siempre visible
        const open = card.classList.toggle('is-open');
        card.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', e => {
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(); }
      });
    });
    // Al pasar a desktop, limpia el estado colapsado
    mq.addEventListener('change', e => {
      if(!e.matches) cards.forEach(c => {
        c.classList.remove('is-open');
        c.setAttribute('aria-expanded', 'false');
      });
    });
  })();

  /* ============ Contacto — tabs ============ */
  (function initContactTabs(){
    const tabs  = document.querySelectorAll('.ctab');
    const forms = document.querySelectorAll('.cform');
    if(!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t  => t.classList.toggle('is-active',  t.dataset.tab === target));
        forms.forEach(f => f.classList.toggle('is-active', f.id === `form-${target}`));
      });
    });
  })();

  /* ============ Empresa — tabs (Historia/Misión/Visión/Valores) ============ */
  (function initEsenciaTabs(){
    const tabs   = document.querySelectorAll('.es-tab');
    const panels = document.querySelectorAll('.es-panel');
    if(!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t   => t.classList.toggle('is-active',  t.dataset.tab === target));
        panels.forEach(p => p.classList.toggle('is-active', p.id === `panel-${target}`));
      });
    });
  })();

  /* ============ Smooth anchor scroll ============ */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if(id.length > 1 && document.querySelector(id)){
        e.preventDefault();
        document.querySelector(id).scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  /* ============ Contacto — envío de los formularios (FormSubmit) ============
     Cada <form> ya apunta a su https://formsubmit.co/EMAIL correspondiente
     (ver index.html). B2B y Soporte se mandan por fetch (sin recargar la
     página). RRHH lleva un archivo adjunto (el CV) — los adjuntos son poco
     confiables contra el endpoint /ajax/ de FormSubmit, así que ese formulario
     se manda de forma nativa (recarga la página) y vuelve a #contacto con un
     parámetro que detectamos acá para mostrar el mismo mensaje de éxito. */
  (function initContactForms(){
    function setStatus(form, tipo, texto) {
      const el = form.querySelector('.cform-status');
      if (!el) return;
      el.textContent = texto;
      el.className = 'cform-status' + (tipo ? ' is-' + tipo : '');
    }

    // RRHH: arma el link de retorno (funciona igual en local o en el dominio real)
    // y deja que el formulario se mande nativo, sin interceptarlo. Si se abre
    // el archivo directo (file://) no hay origin real — mejor no mandar
    // "_next" en ese caso que mandar un link roto (FormSubmit rechaza el
    // envío entero si "_next" no es una URL válida).
    const rrhhNext = document.getElementById('rrhh-next');
    if (rrhhNext) {
      if (location.protocol.startsWith('http')) {
        rrhhNext.value = location.origin + location.pathname + '?enviado=rrhh#contacto';
      } else {
        rrhhNext.remove();
      }
    }

    // Muestra el nombre del PDF/DOC elegido en el botón de adjuntar,
    // para confirmar visualmente que sí se seleccionó un archivo.
    const cvInput = document.getElementById('rh-cv');
    if (cvInput) {
      const cvLabelText = document.querySelector('label[for="rh-cv"] span');
      const textoOriginal = cvLabelText ? cvLabelText.textContent : '';
      cvInput.addEventListener('change', () => {
        if (!cvLabelText) return;
        cvLabelText.textContent = cvInput.files.length
          ? cvInput.files[0].name
          : textoOriginal;
      });
    }

    // B2B y Soporte: interceptados por fetch para no recargar la página.
    document.querySelectorAll('.cform[action]:not(#form-rrhh)').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('.cform-btn');
        const originalBtnHTML = btn.innerHTML;
        btn.disabled = true;
        btn.textContent = 'Enviando…';
        setStatus(form, '', '');

        try {
          const ajaxUrl = form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
          const res = await fetch(ajaxUrl, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' },
          });
          if (!res.ok) throw new Error('formsubmit-error');

          setStatus(form, 'ok', '¡Gracias! Recibimos tu mensaje y te vamos a responder a la brevedad.');
          form.reset();
        } catch (err) {
          console.error('Contacto:', err);
          setStatus(form, 'err', 'Hubo un problema al enviar. Probá de nuevo o escribinos directamente por mail.');
        } finally {
          btn.disabled = false;
          btn.innerHTML = originalBtnHTML;
        }
      });
    });

    // Si volvimos acá después de un envío nativo de RRHH, mostramos el
    // mismo mensaje de éxito y activamos esa pestaña.
    if (location.search.includes('enviado=rrhh')) {
      const rrhhTab = document.querySelector('.ctab[data-tab="rrhh"]');
      const rrhhForm = document.getElementById('form-rrhh');
      if (rrhhTab) rrhhTab.click();
      if (rrhhForm) setStatus(rrhhForm, 'ok', '¡Gracias! Recibimos tu postulación y tu CV — te contactamos si surge una oportunidad.');
      history.replaceState(null, '', location.pathname + location.hash);
    }
  })();
