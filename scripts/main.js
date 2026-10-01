(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- code-rain background (kept from the original site, toned down) ---- */
  const canvas = $('#tech-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    const chars = '01<>/{}[]();=+*#&ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const size = 16;
    let drops = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = innerWidth * ratio;
      canvas.height = innerHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      drops = Array.from({ length: Math.ceil(innerWidth / size) }, () => Math.random() * -100);
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 11, 20, 0.2)';
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      ctx.font = `${size - 2}px "Share Tech Mono", monospace`;
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.7 ? 'rgba(167,139,250,0.8)' : 'rgba(94,231,247,0.75)';
        ctx.fillText(ch, i * size, y * size);
        drops[i] = (y * size > innerHeight && Math.random() > 0.975) ? 0 : y + 0.8;
      });
    };

    resize();
    let timer = setInterval(draw, 55);
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      clearInterval(timer);
      if (!document.hidden) timer = setInterval(draw, 55);
    });
  }

  /* ---- mobile menu ---- */
  const toggle = $('#menu-toggle');
  const links = $('#nav-links');
  const setMenu = (open) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle?.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---- email app chooser ---- */
  const emailDialog = $('#email-dialog');
  const emailDialogClose = $('#email-dialog-close');
  $$('[data-email-trigger]').forEach(trigger => trigger.addEventListener('click', () => {
    if (typeof emailDialog?.showModal === 'function') emailDialog.showModal();
  }));
  emailDialogClose?.addEventListener('click', () => emailDialog.close());
  emailDialog?.addEventListener('click', event => {
    if (event.target === emailDialog) emailDialog.close();
  });

  /* ---- back-to-top links ---- */
  $$('a[href="#top"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  /* ---- nav border + active link ---- */
  const nav = $('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  if ('IntersectionObserver' in window) {
    const map = new Map($$('a', links).map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        map.forEach((a, id) => a.classList.toggle('is-active', id === e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => spy.observe(s));

    /* gentle reveal for panels below the fold only */
    if (!reduceMotion) {
      const items = $$('.panel, .project, .contact');
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.remove('is-pending');
            reveal.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      items.forEach(el => {
        if (el.getBoundingClientRect().top > innerHeight) {
          el.classList.add('reveal', 'is-pending');
          reveal.observe(el);
        }
      });
    }
  }

  /* ---- copy email ---- */
  const copyBtn = $('#copy-email');
  const emailEl = $('#email-text');
  copyBtn?.addEventListener('click', async () => {
    const reset = (t) => { copyBtn.textContent = t; setTimeout(() => (copyBtn.textContent = 'Copy'), 1800); };
    try {
      await navigator.clipboard.writeText(emailEl.textContent.trim());
      reset('Copied!');
    } catch {
      const r = document.createRange();
      r.selectNodeContents(emailEl);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
      reset('Selected');
    }
  });

  /* ---- certificate lightbox ---- */
  const box = $('#lightbox');
  const boxImg = $('#lightbox-img');
  const boxCap = $('#lightbox-cap');
  let lastFocus = null;
  const closeBox = () => {
    box.hidden = true;
    boxImg.removeAttribute('src');
    document.body.style.overflow = '';
    lastFocus?.focus();
  };
  $$('[data-full]').forEach(btn => btn.addEventListener('click', () => {
    lastFocus = btn;
    boxImg.src = btn.dataset.full;
    boxImg.alt = `Certificate: ${btn.dataset.caption}`;
    boxCap.textContent = btn.dataset.caption;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lightbox-close').focus();
  }));
  $('#lightbox-close')?.addEventListener('click', closeBox);
  box?.addEventListener('click', e => { if (e.target === box || e.target.classList.contains('lightbox__fig')) closeBox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box && !box.hidden) closeBox(); });

  /* ---- footer year ---- */
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
