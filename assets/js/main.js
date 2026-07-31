/* ==========================================================================
   Daco Technologies — interacciones
   1. Reveal de secciones al entrar en viewport
   2. "Agua": halo que sigue el cursor + ondas concéntricas
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ------------------------------------------------------------------------
     1. Reveal
     ------------------------------------------------------------------------ */

  function initReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!targets.length) return;

    // Sin IntersectionObserver o con movimiento reducido: mostrar todo de una vez.
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        el.classList.add('is-visible');
        el.addEventListener('animationend', function onEnd() {
          el.removeEventListener('animationend', onEnd);
          el.classList.add('is-revealed');
        });
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    Array.prototype.forEach.call(targets, function (el, i) {
      // Escalonado de 4 en 4, igual que el diseño original.
      el.style.setProperty('--reveal-delay', (i % 4) * 60 + 'ms');
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------------
     2. Efecto agua
     ------------------------------------------------------------------------ */

  function initWater() {
    var bg = document.querySelector('[data-bg]');
    if (!bg) return;

    // Solo con puntero de precisión: en táctil no hay cursor que seguir.
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (reduceMotion.matches) return;

    var layer = bg.querySelector('[data-ripples]');
    var glow = bg.querySelector('[data-glow]');
    if (!layer || !glow) return;

    var gx = 0, gy = 0, tx = 0, ty = 0;
    var lastRipple = 0;
    var raf = null;

    function loop() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = 'translate(' + gx + 'px, ' + gy + 'px)';
      raf = requestAnimationFrame(loop);
    }

    function onMove(e) {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = '1';

      var now = performance.now();
      if (now - lastRipple < 110) return;
      lastRipple = now;

      var size = 160 + Math.random() * 160;
      var duration = 1.4 + Math.random() * 0.6;
      var drop = document.createElement('div');
      drop.className = 'ripple';
      drop.style.left = e.clientX + 'px';
      drop.style.top = e.clientY + 'px';
      drop.style.width = size + 'px';
      drop.style.height = size + 'px';
      drop.style.setProperty('--ripple-duration', duration + 's');
      layer.appendChild(drop);

      drop.addEventListener('animationend', function () {
        drop.remove();
      });
    }

    function onLeave() {
      glow.style.opacity = '0';
    }

    // Pausar el rAF cuando la pestaña no está visible.
    function onVisibility() {
      if (document.hidden) {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
      } else if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    }

    raf = requestAnimationFrame(loop);
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
  }

  function init() {
    initReveal();
    initWater();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
