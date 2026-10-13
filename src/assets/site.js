(function () {
  // The store button for the visitor's browser becomes the primary one.
  var isFirefox = /firefox|fxios/i.test(navigator.userAgent);
  document.querySelectorAll('.btn-' + (isFirefox ? 'firefox' : 'chrome')).forEach(function (b) {
    b.classList.add('primary');
    if (b.previousElementSibling) b.parentNode.insertBefore(b, b.parentNode.firstChild);
  });

  // Remember a language picked by hand, so the root address opens it next time.
  document.querySelectorAll('a[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('synckai-lang', a.getAttribute('data-lang')); } catch (e) {}
    });
  });

  // Close the language menu when clicking elsewhere.
  var menu = document.querySelector('.lang');
  if (menu) document.addEventListener('click', function (e) { if (!menu.contains(e.target)) menu.open = false; });

  // Hero demo: the playhead reaches the credits marker, then the episode is saved.
  var demo = document.querySelector('.demo');
  if (!demo) return;
  var track = demo.querySelector('.track');
  var now = demo.querySelector('.now');
  var TOTAL = 23 * 60 + 40, START = 0.8, CREDITS = 0.92, END = 0.97;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf = 0, timers = [];

  function setPos(p) {
    track.style.setProperty('--p', (p * 100).toFixed(2) + '%');
    var s = Math.round(p * TOTAL);
    now.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }
  function tween(from, to, ms, done) {
    var t0 = performance.now();
    function step(t) {
      var k = Math.min(1, (t - t0) / ms);
      setPos(from + (to - from) * k);
      if (k < 1) raf = requestAnimationFrame(step); else if (done) done();
    }
    raf = requestAnimationFrame(step);
  }
  function reset() {
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout); timers = [];
    demo.classList.remove('credits', 'saved');
    setPos(START);
  }
  function play() {
    reset();
    if (reduce) { setPos(CREDITS); demo.classList.add('credits', 'saved'); return; }
    timers.push(setTimeout(function () {
      tween(START, CREDITS, 3200, function () {
        demo.classList.add('credits');
        timers.push(setTimeout(function () { demo.classList.add('saved'); }, 700));
        tween(CREDITS, END, 9000);
      });
    }, 700));
  }

  demo.querySelector('.replay').addEventListener('click', play);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { io.disconnect(); play(); }
    }, { threshold: 0.4 });
    io.observe(demo);
  } else {
    play();
  }
})();
