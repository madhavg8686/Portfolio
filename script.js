(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer:fine)').matches;

  /* ---------- Loader: bouncing-ball game + expanding pill ---------- */
  var loader = $('loader');
  if (document.documentElement.classList.contains('is-loading')) {
    var lines = $('game-lines'), ball = document.querySelector('.game-ball'), game = $('game');
    for (var i = 0; i < 20; i++) lines.appendChild(document.createElement('i'));
    var bars = lines.children, bx = 0, by = 0, vx = 2.2, vy = 1.6, raf;
    (function play() {
      var w = game.clientWidth - 12, h = game.clientHeight - 12;
      bx += vx; by += vy;
      if (bx < 0 || bx > w) { vx = -vx; bx = Math.max(0, Math.min(w, bx)); }
      if (by < 0 || by > h) { vy = -vy; by = Math.max(0, Math.min(h, by)); }
      ball.style.transform = 'translate(' + bx + 'px,' + by + 'px)';
      var idx = Math.min(19, Math.floor(bx / (w / 20)));
      if (bars[idx]) { bars[idx].classList.add('hit'); (function (b) { setTimeout(function () { b.classList.remove('hit'); }, 250); })(bars[idx]); }
      raf = requestAnimationFrame(play);
    })();

    var pct = 0, fill = $('loader-fill'), label = $('loader-pct'), pill = $('loader-pill'), finished = false;
    var finish = function () {
      if (finished) return; finished = true;
      clearInterval(timer);
      fill.style.width = '100%'; label.textContent = '100%';
      pill.classList.add('expand');
      setTimeout(function () {
        loader.classList.add('done');
        setTimeout(function () { document.documentElement.classList.remove('is-loading'); cancelAnimationFrame(raf); }, 650);
      }, 700);
    };
    var timer = setInterval(function () {
      pct = Math.min(100, pct + Math.ceil(Math.random() * 4));
      fill.style.width = pct + '%'; label.textContent = pct + '%';
      if (pct >= 100) finish();
    }, 70);
    $('loader-skip').addEventListener('click', finish);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });
  }

  /* ---------- Clock ---------- */
  var clock = $('clock');
  function tick() { try { clock.textContent = 'Chennai, ' + new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST'; } catch (e) {} }
  tick(); setInterval(tick, 30000);

  /* ---------- Scroll reveals ---------- */
  var targets = document.querySelectorAll('.section>*,.card,.row,.certs li,.facts div');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .12 });
    targets.forEach(function (t) { t.classList.add('reveal'); io.observe(t); });
  }

  /* ---------- Canary slider ---------- */
  var slider = $('canary'), out = $('canary-out'), v2 = $('split-v2');
  function canary() {
    var c = +slider.value;
    out.textContent = 'Stable v1: ' + (100 - c) + '% · Canary v2: ' + c + '% (weight ' + (c / 100).toFixed(2) + ')' + (c === 0 ? ' · all traffic on stable' : c === 100 ? ' · full blue/green flip' : '');
    v2.style.width = c + '%';
  }
  slider.addEventListener('input', canary); canary();

  /* ---------- Copy email ---------- */
  $('copy').addEventListener('click', function () {
    var t = $('toast');
    function show(m) { t.textContent = m; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2000); }
    if (navigator.clipboard) navigator.clipboard.writeText('madhav.g8686@gmail.com').then(function () { show('Email copied'); }, function () { show('Copy failed. Select the address instead.'); });
    else show('Copy not supported. Select the address instead.');
  });

  /* ---------- Cursor follower ---------- */
  var mx = innerWidth / 2, my = innerHeight / 2;
  addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
  if (fine && !reduced) {
    var dot = $('cursor'), ring = $('follower'), rx = mx, ry = my;
    (function loop() {
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) { ring.classList.toggle('hover', !!e.target.closest('a,button,input,.tp,.droid')); });
  }

  /* ---------- Sentinel bot ---------- */
  var droid = $('droid');
  if (fine && !reduced) {
    var x = innerWidth - 140, y = innerHeight - 160, pupils = droid.querySelectorAll('.droid-eye i'), flame = $('droid-flame'), bubble = $('droid-bubble');
    var msgs = ['Cloud Sentinel online · 99.99% OK', 'terraform plan: 0 to destroy', 'Alarm state: OK', 'Canary healthy. Shifting traffic.', 'Hire Madhav: madhav.g8686@gmail.com', 'Rolled back in 1 alias repoint'], mi = 0, talkT;
    function say(m) { bubble.textContent = m; droid.classList.add('talk'); clearTimeout(talkT); talkT = setTimeout(function () { droid.classList.remove('talk'); }, 3000); }
    (function loop() {
      var tx = mx + 50, ty = my + 50, dx = tx - x, dy = ty - y;
      x += dx * .05; y += dy * .05;
      droid.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      var ex = Math.max(-3, Math.min(3, dx / 40)), ey = Math.max(-3, Math.min(3, dy / 40));
      pupils.forEach(function (p) { p.style.transform = 'translate(' + ex + 'px,' + ey + 'px)'; });
      flame.classList.toggle('boost', Math.abs(dx) + Math.abs(dy) > 120);
      requestAnimationFrame(loop);
    })();
    droid.addEventListener('click', function () { mi = (mi + 1) % msgs.length; say(msgs[mi]); });
    setTimeout(function () { say(msgs[0]); }, 3500);
  }

  /* ---------- Tech stack physics arena ---------- */
  var arena = $('arena'), pills = [].slice.call(arena.querySelectorAll('.tp'));
  if (reduced) { arena.classList.add('static'); return; }
  var W, H, items = [], started = false, G = .5, drag = null;
  function measure() { W = arena.clientWidth; H = arena.clientHeight; }
  function init() {
    measure();
    items = pills.map(function (el, i) {
      var w = el.offsetWidth, h = el.offsetHeight;
      return { el: el, w: w, h: h, x: Math.random() * Math.max(1, W - w), y: -h - i * 70, vx: (Math.random() - .5) * 4, vy: 0 };
    });
    (function step() {
      items.forEach(function (p) {
        if (p !== drag) {
          p.vy += G; p.x += p.vx; p.y += p.vy;
          if (p.x < 0) { p.x = 0; p.vx *= -.6; } if (p.x + p.w > W) { p.x = W - p.w; p.vx *= -.6; }
          if (p.y + p.h > H) { p.y = H - p.h; p.vy *= -.45; p.vx *= .96; if (Math.abs(p.vy) < 1) p.vy = 0; }
        }
      });
      for (var a = 0; a < items.length; a++) for (var b = a + 1; b < items.length; b++) {
        var A = items[a], B = items[b];
        var dx = (A.x + A.w / 2) - (B.x + B.w / 2), dy = (A.y + A.h / 2) - (B.y + B.h / 2);
        var ox = (A.w + B.w) / 2 - Math.abs(dx), oy = (A.h + B.h) / 2 - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          var sa = A === drag ? 0 : (B === drag ? 1 : .5), sb = B === drag ? 0 : (A === drag ? 1 : .5);
          if (oy < ox) {
            var s = dy < 0 ? -1 : 1; A.y += s * oy * sa; B.y -= s * oy * sb;
            var t = A.vy; A.vy = B.vy * .5; B.vy = t * .5;
          } else {
            var s2 = dx < 0 ? -1 : 1; A.x += s2 * ox * sa; B.x -= s2 * ox * sb;
            var t2 = A.vx; A.vx = B.vx * .8; B.vx = t2 * .8;
          }
        }
      }
      items.forEach(function (p) { p.x = Math.max(0, Math.min(W - p.w, p.x)); p.y = Math.min(H - p.h, p.y); p.el.style.transform = 'translate(' + p.x + 'px,' + p.y + 'px)'; });
      requestAnimationFrame(step);
    })();
  }
  new IntersectionObserver(function (es, o) { if (es[0].isIntersecting && !started) { started = true; init(); o.disconnect(); } }, { threshold: .3 }).observe(arena);
  var ox0, oy0, lx, ly;
  arena.addEventListener('pointerdown', function (e) {
    var el = e.target.closest('.tp'); if (!el) return;
    drag = items.filter(function (p) { return p.el === el; })[0]; if (!drag) return;
    var r = arena.getBoundingClientRect(); ox0 = e.clientX - r.left - drag.x; oy0 = e.clientY - r.top - drag.y; lx = e.clientX; ly = e.clientY;
    el.classList.add('drag'); el.setPointerCapture(e.pointerId);
  });
  arena.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var r = arena.getBoundingClientRect();
    drag.x = e.clientX - r.left - ox0; drag.y = e.clientY - r.top - oy0;
    drag.vx = (e.clientX - lx) * .8; drag.vy = (e.clientY - ly) * .8; lx = e.clientX; ly = e.clientY;
  });
  function drop() { if (drag) { drag.el.classList.remove('drag'); drag = null; } }
  arena.addEventListener('pointerup', drop); arena.addEventListener('pointercancel', drop);
  addEventListener('resize', measure);
})();
