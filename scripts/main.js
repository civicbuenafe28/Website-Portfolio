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
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const id = e.target.id;
        navMap.forEach((a, key) => a.classList.toggle('is-active', key === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => io.observe(s));
  }

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
