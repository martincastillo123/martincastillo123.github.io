  /* ============ Reveal on scroll — smooth fade-up ============ */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
  document.querySelectorAll('.reveal').forEach(el=>{
    if(!el.classList.contains('in-view')) io.observe(el);
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

  /* ============ Capacidades — mazo de cartas ============ */
  (function initCaps(){
    const wrapper = document.querySelector('.caps-scroll-wrapper');
    if(!wrapper) return;

    const cards   = Array.from(wrapper.querySelectorAll('.caps-card'));
    const cpNow   = document.querySelector('.caps-pager .cp-now');
    const cpFill  = document.querySelector('.caps-pager .cp-fill');
    const btnPrev = document.getElementById('capsPrev');
    const btnNext = document.getElementById('capsNext');
    const total   = cards.length;
    let   active  = 0;

    function applyActive(i){
      active = Math.max(0, Math.min(total - 1, i));

      cards.forEach((c, idx) => {
        // quitar clases y atributos anteriores
        c.classList.remove('is-active', 'is-past');
        c.removeAttribute('data-rank');

        if(idx === active){
          c.classList.add('is-active');
        } else if(idx > active){
          // cartas siguientes — peeking de atrás
          const rank = idx - active;
          if(rank <= 3) c.dataset.rank = rank;
          // rank > 3 queda con opacity 0 por CSS base
        }
        // cartas anteriores: quedan ocultas (opacity 0 base)
      });

      if(cpNow)  cpNow.textContent  = String(active + 1).padStart(2, '0');
      if(cpFill) cpFill.style.width = `${((active + 1) / total) * 100}%`;
      if(btnPrev) btnPrev.disabled = active === 0;
      if(btnNext) btnNext.disabled = active === total - 1;
    }

    applyActive(0);

    if(btnPrev) btnPrev.addEventListener('click', () => applyActive(active - 1));
    if(btnNext) btnNext.addEventListener('click', () => applyActive(active + 1));
  })();

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

  /* ============ Sticky Curtain Reveal ============ */
  (function initCurtain(){
    const sections = Array.from(document.querySelectorAll('.section-stack'));
    if(sections.length < 2) return;

    function onScroll(){
      const vh = window.innerHeight;

      sections.forEach((sec, i) => {
        const next = sections[i + 1];
        if(!next) return;

        // La "cortina" siguiente empieza a cubrir cuando su top toca la base del viewport.
        // progress 0 = siguiente no visible, 1 = siguiente llegó al top (cubre todo).
        const nextTop  = next.getBoundingClientRect().top;
        const progress = Math.max(0, Math.min(1, (vh - nextTop) / vh));

        if(progress > 0){
          // La sección que queda atrás: escala y opacidad decaen
          // pero SOLO cuando la siguiente ya está en la mitad inferior (progress > 0.5).
          // Así la sección se ve completa hasta que la cortina llega al centro.
          const fadeProgress = Math.max(0, (progress - 0.5) / 0.5);
          const scale   = 1 - fadeProgress * 0.08;
          const opacity = 1 - fadeProgress;
          sec.style.transform = `scale(${scale.toFixed(4)})`;
          sec.style.opacity   = Math.max(0, opacity).toFixed(3);
        } else {
          sec.style.transform = '';
          sec.style.opacity   = '';
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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
        forms.forEach(f => {
          const active = f.id === `form-${target}`;
          f.classList.toggle('is-active', active);
          if(active){
            // re-trigger animation
            f.style.animation = 'none';
            void f.offsetWidth;
            f.style.animation = '';
          }
        });
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

  /* ============ Planta — carrusel manual ============ */
  (function initPlantaCarousel(){
    const carousel = document.getElementById('plantaCarousel');
    if(!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.pc-slide'));
    const dots   = Array.from(carousel.querySelectorAll('.pc-dot'));
    const btnPrev = document.getElementById('plantaPrev');
    const btnNext = document.getElementById('plantaNext');
    const total   = slides.length;
    let   current = 0;
    let   busy    = false;

    function goTo(next){
      if(busy || next === current) return;
      busy = true;

      const prev = current;
      current = (next + total) % total;

      // Reset spec-card animations in new slide
      slides[current].querySelectorAll('.spec-card').forEach(c=>{
        c.style.animation = 'none';
        void c.offsetWidth;
        c.style.animation = '';
      });

      slides[prev].classList.remove('is-active');
      slides[prev].classList.add('is-exit');
      slides[current].classList.add('is-active');

      dots.forEach((d, i) => d.classList.toggle('is-on', i === current));
      if(btnPrev) btnPrev.disabled = false;
      if(btnNext) btnNext.disabled = false;

      setTimeout(()=>{
        slides[prev].classList.remove('is-exit');
        busy = false;
      }, 580);
    }

    if(btnPrev) btnPrev.addEventListener('click', ()=> goTo(current - 1));
    if(btnNext) btnNext.addEventListener('click', ()=> goTo(current + 1));

    // Swipe en touch
    let tx0 = 0;
    carousel.addEventListener('touchstart', e=>{ tx0 = e.touches[0].clientX; }, {passive:true});
    carousel.addEventListener('touchend',   e=>{
      const dx = e.changedTouches[0].clientX - tx0;
      if(Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    }, {passive:true});
  })();
