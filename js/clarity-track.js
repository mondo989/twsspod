/**
 * Microsoft Clarity custom events + session tags.
 * Requires the Clarity snippet in <head> (defines window.clarity).
 */
(function () {
  function track(name) {
    if (typeof window.clarity === 'function') {
      window.clarity('event', name);
    }
  }

  function setTag(key, value) {
    if (typeof window.clarity === 'function') {
      window.clarity('set', key, value);
    }
  }

  window.twssTrack = track;

  function classifyOutbound(hostname) {
    const h = hostname.replace(/^www\./, '');
    if (h.includes('eventbrite')) return 'cta_eventbrite_tickets';
    if (h === 'open.spotify.com' || h.endsWith('.spotify.com')) return 'listen_spotify';
    if (h === 'podcasts.apple.com' || h === 'music.apple.com') return 'listen_apple_podcasts';
    if (h.includes('amazon.')) return 'listen_amazon_music';
    if (h === 'facebook.com' || h.endsWith('.facebook.com')) return 'social_facebook';
    if (h === 'instagram.com' || h.endsWith('.instagram.com')) return 'social_instagram';
    if (h === 'x.com' || h === 'twitter.com') return 'social_x';
    if (h === 'youtube.com' || h === 'youtu.be' || h.endsWith('.youtube.com')) return 'social_youtube';
    return 'outbound_link';
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    var path = window.location.pathname || '';
    var scholarship = /scholarship\.html$/i.test(path);
    setTag('twss_page', scholarship ? 'scholarship' : 'home');

    document.addEventListener('click', function (e) {
      var toggle = e.target.closest('.nav__toggle');
      if (toggle) {
        track('nav_mobile_toggle');
        return;
      }

      var a = e.target.closest('a[href]');
      if (!a) return;

      var href = (a.getAttribute('href') || '').trim();
      var full = a.href;

      try {
        var u = new URL(full);
        if (u.origin !== window.location.origin) {
          track(classifyOutbound(u.hostname));
          return;
        }
      } catch (_) {
        return;
      }

      if (/scholarship\.html/i.test(href)) {
        track('cta_scholarship_page');
        return;
      }

      if (/index\.html/i.test(href) || href === '/') {
        track('nav_home');
        return;
      }

      if (href === '#subscribe' || href.endsWith('#subscribe')) {
        track('cta_scroll_subscribe');
        return;
      }

      if (href === '#podcasts' || href.endsWith('#podcasts')) {
        track('cta_scroll_podcasts');
        return;
      }

      if (href === '#scholarship' || href.endsWith('#scholarship')) {
        track('cta_scroll_scholarship');
        return;
      }

      if (href.startsWith('mailto:')) {
        track('cta_mailto');
        return;
      }

      if (href.startsWith('#') && href.length > 1) {
        track('cta_scroll_section');
      }
    });

    document.getElementById('galleryPrev')?.addEventListener('click', function () {
      track('gallery_prev');
    });
    document.getElementById('galleryNext')?.addEventListener('click', function () {
      track('gallery_next');
    });
    document.querySelectorAll('.gallery__dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        track('gallery_dot');
      });
    });

    document.getElementById('subscribeForm')?.addEventListener('submit', function () {
      track('subscribe_submit_attempt');
    });
  });
})();
