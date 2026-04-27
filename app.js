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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
