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
