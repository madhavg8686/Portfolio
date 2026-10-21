(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Loader (first visit per session only; skippable)
  var loader = $('loader');
  if (document.documentElement.classList.contains('is-loading')) {
    var pct = 0, fill = $('loader-fill'), label = $('loader-pct');
    var finish = function () {
      clearInterval(timer);
      loader.classList.add('done');
      setTimeout(function () { document.documentElement.classList.remove('is-loading'); }, 400);
      try { sessionStorage.setItem('seen', '1'); } catch (e) {}
    };
    var timer = setInterval(function () {
      pct = Math.min(100, pct + 8);
      fill.style.width = pct + '%';
      label.textContent = pct + '%';
      if (pct >= 100) finish();
    }, 80);
    $('loader-skip').addEventListener('click', finish);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
  }

  // Clock (Chennai time)
  var clock = $('clock');
  function tick() {
    try {
      clock.textContent = 'Chennai, ' + new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST';
    } catch (e) {}
  }
  tick(); setInterval(tick, 30000);

  // Tech pills: toggle highlight
  $('pills').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (b) b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  });

  // Canary slider
  var slider = $('canary'), out = $('canary-out'), v2 = $('split-v2');
  function canary() {
    var c = +slider.value;
    out.textContent = 'Stable v1: ' + (100 - c) + '% · Canary v2: ' + c + '% (weight ' + (c / 100).toFixed(2) + ')' +
      (c === 0 ? ' · all traffic on stable' : c === 100 ? ' · full blue/green flip' : '');
    v2.style.width = c + '%';
  }
  slider.addEventListener('input', canary); canary();

  // Copy email
  $('copy').addEventListener('click', function () {
    var t = $('toast');
    function show(msg) { t.textContent = msg; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2000); }
    if (navigator.clipboard) {
      navigator.clipboard.writeText('madhav.g8686@gmail.com').then(function () { show('Email copied'); }, function () { show('Copy failed. Select the address above instead.'); });
    } else { show('Copy not supported. Select the address above instead.'); }
  });

  // Sentinel droid: follows the cursor, eyes look at it. Desktop, motion-OK only.
  var droid = $('droid');
  if (!reduced && matchMedia('(pointer:fine)').matches) {
    var tx = innerWidth - 120, ty = innerHeight - 120, x = tx, y = ty, pupils = droid.querySelectorAll('.droid-eye i');
    addEventListener('mousemove', function (e) { tx = e.clientX + 40; ty = e.clientY + 40; });
    (function loop() {
      x += (tx - x) * 0.06; y += (ty - y) * 0.06;
      droid.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      var dx = Math.max(-3, Math.min(3, (tx - x) / 30)), dy = Math.max(-3, Math.min(3, (ty - y) / 30));
      pupils.forEach(function (p) { p.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; });
      requestAnimationFrame(loop);
    })();
    setTimeout(function () { droid.classList.add('talk'); setTimeout(function () { droid.classList.remove('talk'); }, 3500); }, 2500);
  }
})();
