  /* ============ Reveal on scroll ============ */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
  document.querySelectorAll('.reveal').forEach(el=>{
    if(!el.classList.contains('in')) io.observe(el);
  });

  /* ============ Number counters ============ */
  const cio = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        const raw = el.textContent.replace(/\s|,/g,'');
        const target = parseFloat(el.dataset.count);
        const dur = 1800; const start = performance.now();
        function step(now){
          const t = Math.min(1,(now-start)/dur);
          const v = target * (1 - Math.pow(1-t, 3));
          el.textContent = Math.round(v).toLocaleString('es-AR');
          if(t<1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString('es-AR');
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      }
    });
  }, {threshold: .4});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

  /* ============ Nav entrance + scroll state ============ */
  const nav = document.getElementById('nav');
  nav.style.transition = 'opacity .8s ease, border-color .3s, background .3s';
  requestAnimationFrame(() => {
    nav.style.opacity = '1';
  });
  window.addEventListener('scroll', ()=>{
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, {passive:true});

  /* ============ Hero parallax ============ */
  const heroBg = document.getElementById('heroBg');
  let rafId = null;
  function updateParallax(){
    const y = window.scrollY;
    if(y < window.innerHeight * 1.2){
      heroBg.style.transform = `translateY(${y * 0.35}px) scale(${1 + y * 0.0002})`;
    }
    rafId = null;
  }
  window.addEventListener('scroll', ()=>{
    if(!rafId) rafId = requestAnimationFrame(updateParallax);
  }, {passive:true});

  /* ============ Sticky pin — image switch on scroll ============ */
  const captionsFallback = [
    'Línea SMT · pick-and-place dual',
    'Inserción THT · soldadura ola selectiva',
    'Test funcional · jig dedicado por producto',
    'Ensamble final · packaging del cliente'
  ];
  document.querySelectorAll('.pin-wrap').forEach(wrap => {
    const steps = wrap.querySelectorAll('.pin-step');
    const pinImgs = wrap.querySelectorAll('.pin-img');
    const pinDots = wrap.querySelectorAll('.pin-progress span');
    const pinCap = wrap.querySelector('.pin-caption');
    
    const pio = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const i = parseInt(e.target.dataset.step, 10);
          pinImgs.forEach((img, idx)=>img.classList.toggle('active', idx===i));
          pinDots.forEach((d, idx)=>d.classList.toggle('on', idx===i));
          if(pinCap){
            pinCap.textContent = e.target.dataset.caption || captionsFallback[i] || '';
          }
        }
      });
    }, { threshold: 0, rootMargin: '-50% 0px -45% 0px' });
    steps.forEach(s => pio.observe(s));
  });

  /* ============ Capacidades — scroll-driven showcase ============ */
  const capsRight = document.querySelector('.caps-pin-right');
  if(capsRight && window.matchMedia('(min-width: 1025px)').matches){
    const triggers = capsRight.querySelectorAll('.caps-trigger');
    const cards    = capsRight.querySelectorAll('.caps-card');
    const cpNow    = document.querySelector('.caps-pager .cp-now');
    const cpFill   = document.querySelector('.caps-pager .cp-fill');
    const total    = triggers.length;

    function setActive(i){
      cards.forEach((c, idx) => {
        c.classList.toggle('is-active', idx === i);
        c.classList.toggle('is-past',   idx <  i);  // las anteriores giran hacia arriba
      });
      if(cpNow)  cpNow.textContent  = String(i + 1).padStart(2, '0');
      if(cpFill) cpFill.style.width = `${((i + 1) / total) * 100}%`;
    }

    const capsIO = new IntersectionObserver((entries) => {
      // Cuando hay varios triggers visibles, tomamos el más cercano al centro
      let bestIdx = -1, bestRatio = 0;
      entries.forEach(e => {
        if(e.isIntersecting && e.intersectionRatio > bestRatio){
          bestRatio = e.intersectionRatio;
          bestIdx   = parseInt(e.target.dataset.step, 10);
        }
      });
      if(bestIdx >= 0) setActive(bestIdx);
    }, { threshold: [0, .25, .5, .75, 1], rootMargin: '-40% 0px -40% 0px' });

    triggers.forEach(t => capsIO.observe(t));
  }

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
