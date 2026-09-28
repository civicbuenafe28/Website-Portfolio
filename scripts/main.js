(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;

  /* ---- theme toggle (remembers choice when storage is available) ---- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }
  };
  const saved = store.get('cvb-theme');
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  const isDark = () =>
    root.dataset.theme ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
  $('#theme-toggle')?.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set('cvb-theme', next);
  });

  /* ---- mobile menu ---- */
  const menuBtn = $('#menu-toggle');
  const links = $('#nav-links');
  const setMenu = (open) => {
    links.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn?.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
  $$('a', links).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---- nav border + active section ---- */
  const nav = $('.nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const navMap = new Map($$('a', links).map(a => [a.getAttribute('href').slice(1), a]));
  const sectionFor = { about: 'work' }; // "about" sits between Work and Experience
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = sectionFor[e.target.id] || e.target.id;
        navMap.forEach((a, key) => a.classList.toggle('is-active', key === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => io.observe(s));
  }

  /* ---- project filter ---- */
  const filters = $$('.filter');
  const items = $$('#project-list > li');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach(b => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    items.forEach(li => { li.hidden = !(f === 'all' || li.dataset.lang === f); });
  }));

  /* ---- certificate lightbox ---- */
  const box = $('#lightbox');
  const boxImg = $('#lightbox-img');
  const boxCap = $('#lightbox-cap');
  let lastFocus = null;
  const openBox = (btn) => {
    lastFocus = btn;
    const cap = $('span', btn).textContent;
    boxImg.src = btn.dataset.full;
    boxImg.alt = `Certificate: ${cap}`;
    boxCap.textContent = cap;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lightbox-close').focus();
  };
  const closeBox = () => {
    box.hidden = true;
    boxImg.removeAttribute('src');
    document.body.style.overflow = '';
    lastFocus?.focus();
  };
  $$('#certs button').forEach(b => b.addEventListener('click', () => openBox(b)));
  $('#lightbox-close')?.addEventListener('click', closeBox);
  box?.addEventListener('click', e => { if (e.target === box) closeBox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) closeBox(); });

  /* ---- copy email ---- */
  const copyBtn = $('#copy-email');
  const emailEl = $('#email-text');
  copyBtn?.addEventListener('click', async () => {
    const text = emailEl.textContent.trim();
    const done = (label) => {
      copyBtn.textContent = label;
      setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1800);
    };
    try {
      await navigator.clipboard.writeText(text);
      done('Copied');
    } catch {
      const r = document.createRange();
      r.selectNodeContents(emailEl);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
      done('Selected');
    }
  });

  /* ---- footer year ---- */
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
