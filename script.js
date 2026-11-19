cat > script.js <<'EOF'
'use strict';
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, m) { return Math.max(-m, Math.min(m, v)); };

  (function () {
    var c = document.getElementById('sky'), x = c.getContext('2d');
    var w, h, stars = [], mouse = { x: -999, y: -999 }, link = 120, raf = 0, timer;
    var colors = ['#ffffff', '#19f2ff', '#ff8cec'];

    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = innerWidth; h = innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      x.setTransform(dpr, 0, 0, dpr, 0, 0);
      link = w < 600 ? 95 : 125;
      var n = Math.round(Math.min(80, Math.max(28, w * h / 11000)));
      stars = [];
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
          r: Math.random() * 1.2 + .5, t: Math.random() * 6.28,
          col: colors[(Math.random() * 3) | 0]
        });
      }
    }

    function draw(move) {
      x.clearRect(0, 0, w, h);
      var i, j, a, b, dx, dy, d2, L2 = link * link, al;
      for (i = 0; i < stars.length; i++) {
        a = stars[i];
        if (move) {
          a.x += a.vx; a.y += a.vy; a.t += .03;
          if (a.x < -10) a.x = w + 10; else if (a.x > w + 10) a.x = -10;
          if (a.y < -10) a.y = h + 10; else if (a.y > h + 10) a.y = -10;
        }
      }
      x.lineWidth = 1;
      for (i = 0; i < stars.length; i++) {
        a = stars[i];
        for (j = i + 1; j < stars.length; j++) {
          b = stars[j]; dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy;
          if (d2 < L2) {
            al = (1 - d2 / L2) * .4;
            x.strokeStyle = 'rgba(25,242,255,' + al.toFixed(3) + ')';
            x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
          }
        }
        dx = a.x - mouse.x; dy = a.y - mouse.y; d2 = dx * dx + dy * dy;
        if (d2 < L2 * 1.6) {
          al = (1 - d2 / (L2 * 1.6)) * .6;
          x.strokeStyle = 'rgba(255,43,214,' + al.toFixed(3) + ')';
          x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(mouse.x, mouse.y); x.stroke();
        }
      }
      for (i = 0; i < stars.length; i++) {
        a = stars[i];
        x.globalAlpha = .65 + .35 * Math.sin(a.t);
        x.fillStyle = a.col;
        x.beginPath(); x.arc(a.x, a.y, a.r, 0, 6.2832); x.fill();
      }
      x.globalAlpha = 1;
    }

    function loop() { draw(true); raf = requestAnimationFrame(loop); }
    function start() { if (!raf && !reduce) raf = requestAnimationFrame(loop); }
    function stop() { cancelAnimationFrame(raf); raf = 0; }

    size();
    if (reduce) draw(false); else start();
    addEventListener('resize', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { size(); if (reduce) draw(false); }, 150);
    });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
  })();

  (function () {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var root = document.documentElement;
    var dot = document.querySelector('.cur-dot'), ring = document.querySelector('.cur-ring');
    var tx = 0, ty = 0, rx = 0, ry = 0, raf = 0;
    root.classList.add('has-cursor');

    function frame() {
      rx += (tx - rx) * .2; ry += (ty - ry) * .2;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      if (Math.abs(tx - rx) > .1 || Math.abs(ty - ry) > .1) raf = requestAnimationFrame(frame);
      else raf = 0;
    }
    addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
      root.classList.add('show');
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      ring.classList.toggle('on', !!(e.target.closest && e.target.closest('a,button,[role=tab],.badge')));
    });
    addEventListener('pointerdown', function () { ring.classList.add('down'); });
    addEventListener('pointerup', function () { ring.classList.remove('down'); });
    document.addEventListener('pointerleave', function () { root.classList.remove('show'); });
  })();

  (function () {
    var swing = document.getElementById('swing'), badge = document.getElementById('badge');
    var a = .08, va = 0, s = 0, vs = 0, last = 0, run = false;

    function apply() {
      swing.style.transform = 'rotate(' + a.toFixed(4) + 'rad)';
      badge.style.transform = 'perspective(600px) rotateY(' + s.toFixed(2) + 'deg)';
      badge.style.setProperty('--sh', (50 + s * .9).toFixed(1) + '%');
    }
    function step(now) {
      var dt = Math.min(.033, (now - last) / 1000 || .016);
      last = now;
      va += -22 * Math.sin(a) * dt; va *= Math.exp(-.8 * dt); a += va * dt;
      vs += (-60 * s - 5 * vs) * dt; s += vs * dt;
      a = clamp(a, 1.1); s = clamp(s, 75);
      if (Math.abs(a) < .0006 && Math.abs(va) < .01 && Math.abs(s) < .1 && Math.abs(vs) < .2) {
        a = s = va = vs = 0; apply(); run = false; return;
      }
      apply();
      requestAnimationFrame(step);
    }
    function wake() { if (!run) { run = true; last = performance.now(); requestAnimationFrame(step); } }
    function kick(k) {
      va = clamp(va - k * 2.6, 6); vs = clamp(vs + k * 520, 900);
      wake();
    }

    badge.addEventListener('pointerdown', function (e) {
      var r = badge.getBoundingClientRect();
      var k = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      if (Math.abs(k) < .25) k = (Math.random() < .5 ? -1 : 1) * .25;
      kick(clamp(k, 1));
    });
    badge.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); kick(Math.random() < .5 ? -.8 : .8); }
    });
    apply();
    if (!reduce) wake();
  })();

  (function () {
    var el = document.getElementById('typed');
    var phrases = [
      'Привет, я Рэй (или просто Макс)',
      'Кодю сайты и рисую арты',
      'Жду первого снега и запаха мандаринов',
      'Учусь быть легендой'
    ];
    if (reduce) { el.textContent = phrases[0]; return; }
    var i = 0, j = 0, del = false;
    function tick() {
      var p = phrases[i];
      if (!del) {
        j++; el.textContent = p.slice(0, j);
        if (j === p.length) { del = true; return setTimeout(tick, 1700); }
        return setTimeout(tick, 50 + Math.random() * 50);
      }
      j--; el.textContent = p.slice(0, j);
      if (j === 0) { del = false; i = (i + 1) % phrases.length; return setTimeout(tick, 350); }
      setTimeout(tick, 25);
    }
    tick();
  })();

  (function () {
    var tabs = Array.prototype.slice.call(document.querySelectorAll('[role=tab]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('[role=tabpanel]'));
    function open(id, focus) {
      if (!document.getElementById('p-' + id)) id = 'about';
      tabs.forEach(function (t) {
        var on = t.dataset.tab === id;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        if (on) { t.scrollIntoView({ inline: 'center', block: 'nearest' }); if (focus) t.focus(); }
      });
      panels.forEach(function (p) { p.hidden = p.id !== 'p-' + id; });
      if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    }
    tabs.forEach(function (t, n) {
      t.addEventListener('click', function () { open(t.dataset.tab); });
      t.addEventListener('keydown', function (e) {
        var m = { ArrowRight: n + 1, ArrowLeft: n - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (m === undefined) return;
        e.preventDefault();
        open(tabs[(m + tabs.length) % tabs.length].dataset.tab, true);
      });
    });
    addEventListener('hashchange', function () { open(location.hash.slice(1)); });
    open(location.hash.slice(1) || 'about');
  })();

  (function () {
    var thoughts = [
      '«Жизнь — как кубик Рубика. Иногда чтобы собрать, нужно всё сломать».',
      '😎 Когда код работает, но ты не знаешь почему. Не трогай его!',
      '«Мышонок в безопасности, пока рядом Мявка».',
      '💻 Пытаюсь понять, почему кулон летает, а не висит.'
    ];
    var i = 0, el = document.getElementById('thought'), busy = false;
    document.getElementById('next').addEventListener('click', function () {
      if (busy) return; busy = true;
      el.classList.add('out');
      setTimeout(function () {
        i = (i + 1) % thoughts.length; el.textContent = thoughts[i];
        el.classList.remove('out'); busy = false;
      }, 250);
    });
  })();
})();
EOF
