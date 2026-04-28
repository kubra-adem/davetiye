// Personalized invitation: read slug from path or query, look up guest name.
//
// URL formats supported:
//   https://kubra-adem.github.io/davetiye/sn.aliaydin   (preferred — via 404.html fallback)
//   https://kubra-adem.github.io/davetiye/?g=sn.aliaydin
//
// guests.json maps slug -> display name.

(function () {
  // Returns the directory portion of the current URL (always ends with /)
  function siteBase() {
    return window.location.pathname.replace(/[^/]*$/, '');
  }

  function extractSlug() {
    // 1) Query param ?g=
    const qs = new URLSearchParams(window.location.search);
    const fromQuery = qs.get('g');
    if (fromQuery) return decodeURIComponent(fromQuery).trim();

    // 2) Last path segment (e.g. /davetiye/sn.aliaydin -> sn.aliaydin)
    const path = (window.location.pathname || '').replace(/^\/+|\/+$/g, '');
    if (!path) return null;

    const last = path.split('/').filter(Boolean).pop();
    if (!last) return null;
    if (last.toLowerCase().endsWith('.html')) return null;
    if (['index', '404', 'davetiye'].includes(last.toLowerCase())) return null;

    return decodeURIComponent(last).trim();
  }

  function setName(name) {
    const el = document.getElementById('guest-name');
    if (!el) return;
    el.textContent = name;
  }

  async function init() {
    const slug = extractSlug();
    if (!slug) return; // keep default greeting

    try {
      const res = await fetch(siteBase() + 'guests.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('guests.json fetch failed (' + res.status + ')');
      const guests = await res.json();

      // Case-insensitive lookup
      const key = Object.keys(guests).find(
        (k) => k.toLowerCase() === slug.toLowerCase()
      );
      if (key) {
        setName('Sn. ' + guests[key]);
      }
    } catch (err) {
      console.warn('[davetiye] guest lookup failed:', err);
    }
  }

  // Reveal-on-scroll: add `.in-view` to each .page section as it enters the viewport.
  function setupReveal() {
    const pages = document.querySelectorAll('.page');
    if (!pages.length) return;

    // Mark the first page in-view immediately so the welcome animates on load.
    pages[0].classList.add('in-view');

    if (!('IntersectionObserver' in window)) {
      pages.forEach((p) => p.classList.add('in-view'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            // Remove so animation replays on scroll-back.
            entry.target.classList.remove('in-view');
          }
        });
      },
      { threshold: 0.35 }
    );

    pages.forEach((p) => io.observe(p));
  }

  // Music toggle. iOS Safari ignores preload="auto" and never fires
  // canplaythrough before the first user gesture — so we show the button
  // immediately and call play() synchronously on tap (the only thing iOS allows).
  function setupMusic() {
    const audio = document.getElementById('bg-audio');
    const btn = document.getElementById('music-toggle');
    if (!audio || !btn) return;

    audio.volume = 0.7;
    btn.hidden = false;

    audio.addEventListener('error', () => {
      btn.hidden = true;
    });

    btn.addEventListener('click', () => {
      if (audio.paused) {
        const p = audio.play();
        if (p && typeof p.catch === 'function') {
          p.catch((err) => console.warn('[davetiye] audio play blocked:', err));
        }
      } else {
        audio.pause();
      }
    });

    audio.addEventListener('play',  () => {
      btn.classList.add('is-playing');
      btn.setAttribute('aria-pressed', 'true');
    });
    audio.addEventListener('pause', () => {
      btn.classList.remove('is-playing');
      btn.setAttribute('aria-pressed', 'false');
    });
  }

  function start() {
    init();
    setupReveal();
    setupMusic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
