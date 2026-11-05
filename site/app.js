/**
 * Pathfolio — Production Client Application & Motion Engine
 * Faithfully implemented from owner-supplied design (my-design/home.html)
 * Powered by GSAP, ScrollTrigger, and Lenis smooth scrolling.
 */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const root = document.documentElement;
const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasG = typeof window.gsap !== 'undefined';

if (rm) root.classList.add('rm');

// Theme Toggle
const th = $('#th');
if (th) {
  th.onclick = () => {
    const n = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = n;
    try {
      localStorage.setItem('pf-theme', n);
    } catch (e) {}
    colors();
  };
}

// Split text utility for editorial display headlines
function split(el) {
  el.setAttribute('aria-label', el.textContent);
  (function w(n) {
    [...n.childNodes].forEach((c) => {
      if (c.nodeType == 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) {
            f.append(' ');
            return;
          }
          const s = document.createElement('span');
          s.className = 'w';
          s.setAttribute('aria-hidden', 'true');
          [...t].forEach((ch) => {
            const k = document.createElement('span');
            k.className = 'ch';
            k.textContent = ch;
            s.append(k);
          });
          f.append(s);
        });
        c.replaceWith(f);
      } else {
        w(c);
      }
    });
  })(el);
}

$$('[data-split]').forEach(split);

// Mobile navigation drawer controller
const mobToggle = $('#mob-toggle');
const mobMenu = $('#mob-menu');
const mobBackdrop = $('#mob-backdrop');

function openMobMenu() {
  if (!mobToggle || !mobMenu) return;
  mobToggle.setAttribute('aria-expanded', 'true');
  mobToggle.setAttribute('aria-label', 'Close navigation menu');
  mobMenu.classList.add('is-open');
  mobMenu.setAttribute('aria-hidden', 'false');
  if (mobBackdrop) {
    mobBackdrop.classList.add('is-open');
    mobBackdrop.setAttribute('aria-hidden', 'false');
  }
  document.body.style.overflow = 'hidden';
  const firstLink = mobMenu.querySelector('a');
  if (firstLink) firstLink.focus();
}

function closeMobMenu() {
  if (!mobToggle || !mobMenu) return;
  mobToggle.setAttribute('aria-expanded', 'false');
  mobToggle.setAttribute('aria-label', 'Open navigation menu');
  mobMenu.classList.remove('is-open');
  mobMenu.setAttribute('aria-hidden', 'true');
  if (mobBackdrop) {
    mobBackdrop.classList.remove('is-open');
    mobBackdrop.setAttribute('aria-hidden', 'true');
  }
  document.body.style.overflow = '';
}

if (mobToggle && mobMenu) {
  mobToggle.addEventListener('click', () => {
    const isOpen = mobToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMobMenu();
    } else {
      openMobMenu();
    }
  });

  if (mobBackdrop) {
    mobBackdrop.addEventListener('click', closeMobMenu);
  }

  mobMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      closeMobMenu();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobToggle.getAttribute('aria-expanded') === 'true') {
      closeMobMenu();
      mobToggle.focus();
    }
  });
}

// Odometer numbers setup
$$('.od').forEach((o) => {
  const s = String(o.dataset.n || '0');
  const label = o.getAttribute('aria-label') || s;
  o.innerHTML =
    `<span class="sr-only">${label}</span>` +
    `<span class="od-strip" aria-hidden="true">` +
    [...s]
      .map(
        () =>
          `<span class="od-col">` +
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => `<b>${d}</b>`).join('') +
          `</span>`
      )
      .join('') +
    `</span>`;
});

const names = ['Saved', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
function hs(i) {
  $$('.hd6 i').forEach((d, k) => d.classList.toggle('on', k === i));
  const hst = $('#hst');
  const htl = $('#htl');
  if (hst) hst.textContent = names[i];
  if (htl) htl.textContent = 'Moved to ' + names[i];
}
if ($('.hd6')) hs(3);

// Background Canvas
const cv = $('#bg');
let cx, W, H, col = ['#2DD4BF', '#E0A06A'], P = [];
function colors() {
  if (!cv) return;
  const s = getComputedStyle(root);
  col = [s.getPropertyValue('--acc').trim(), s.getPropertyValue('--brass').trim()];
  if (rm) draw();
}

function size() {
  if (!cv) return;
  const r = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  cv.width = W * r;
  cv.height = H * r;
  cx.setTransform(r, 0, 0, r, 0, 0);
  P = Array.from({ length: W < 600 ? 34 : 70 }, (_, i) => ({
    x: Math.random() * W,
    y: Math.random() * H,
    z: 0.3 + Math.random() * 0.7,
    s: 6 + Math.random() * 14,
    r: Math.random() * 6.28,
    vr: (Math.random() - 0.5) * 0.004,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -0.1 - Math.random() * 0.25,
    c: i % 3 ? 0 : 1
  }));
}

function draw() {
  if (!cx) return;
  cx.clearRect(0, 0, W, H);
  const sy = scrollY;
  P.forEach((p) => {
    const y = (((p.y - sy * p.z * 0.25) % H) + H) % H;
    cx.save();
    cx.translate(p.x, y);
    cx.rotate(p.r);
    cx.globalAlpha = 0.1 + 0.28 * p.z;
    cx.strokeStyle = col[p.c];
    cx.lineWidth = 1;
    cx.strokeRect(-p.s / 2, -p.s * 0.65, p.s, p.s * 1.3);
    if (p.s > 14) {
      cx.beginPath();
      cx.moveTo(-p.s / 3, -p.s * 0.2);
      cx.lineTo(p.s / 3, -p.s * 0.2);
      cx.stroke();
    }
    cx.restore();
  });
}

function tick() {
  P.forEach((p) => {
    p.x = (p.x + p.vx + W) % W;
    p.y = (p.y + p.vy + H) % H;
    p.r += p.vr;
  });
  draw();
  requestAnimationFrame(tick);
}

if (cv) {
  cx = cv.getContext('2d');
  addEventListener('resize', () => {
    size();
    if (rm) draw();
  });
  size();
  colors();
  rm ? draw() : tick();
}

// App tour platform toggle
$$('.tb button').forEach((b) =>
  b.addEventListener('click', () => {
    $$('.tb button').forEach((x) => x.setAttribute('aria-selected', x === b));
    const sc = $('#scene');
    if (sc) sc.dataset.p = b.dataset.p;
  })
);

// Milestone Pipeline Stage logic
const st = $$('.stn');
const car = $('#car');
const bar = $('#bar');
let cur = -1;

function setStage(i) {
  if (i === cur || !st[i]) return;
  cur = i;
  st.forEach((s, k) => {
    s.classList.toggle('on', k <= i);
    s.classList.toggle('cur', k === i);
  });
  const b = $('b', st[i]).textContent;
  const tel = $('#tele');
  const dn = $('#dn');
  const dd = $('#dd');
  if (tel) tel.textContent = 'STAGE 0' + (i + 1) + ' / 06 · ' + b.toUpperCase();
  if (dn) dn.textContent = b;
  if (dd) dd.textContent = st[i].dataset.d;
  if (hasG && !rm && dn && dd) {
    gsap.fromTo('#dn,#dd', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, overwrite: true });
  }
}

if (st.length) setStage(0);

const stpLi = $$('#stp li');

// Reduced Motion & No-GSAP fallback state
if (!hasG || rm) {
  $$('.od').forEach((o) => {
    const s = String(o.dataset.n || '0');
    $$('.od-col', o).forEach((c, k) => {
      const d = +s[k];
      const targetIndex = (d === 0 ? 10 : d);
      c.style.transform = 'translateY(-' + ((targetIndex / 11) * 100) + '%)';
    });
  });
  if (st.length) setStage(5);
  if (bar) bar.style.transform = 'scaleX(1)';
  if (car) car.style.left = '91.667%';
  stpLi.forEach((l) => l.classList.add('on'));
  const sp = $('#spath');
  if (sp) sp.style.strokeDashoffset = 0;
  const pbd = $('#pbd');
  if (pbd) pbd.style.strokeDashoffset = 0;
  const fl = $('#fl');
  if (fl) fl.style.transform = 'none';
  const chk = $('.chk path');
  if (chk) chk.style.strokeDashoffset = 0;
} else {
  // GSAP & ScrollTrigger Animations
  gsap.registerPlugin(ScrollTrigger);

  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) =>
      a.addEventListener('click', (e) => {
        const h = a.getAttribute('href');
        if (h === '#' || !h) return;
        const t = $(h);
        if (t) {
          e.preventDefault();
          lenis.scrollTo(t, { offset: -60 });
        }
      })
    );
  }

  // Hero entrance & perspective settling
  if ($('.hero')) {
    const hl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    hl.from('.ln>span', { yPercent: 115, duration: 1.2, stagger: 0.14 }, 0.1)
      .from('.hs', { y: 30, opacity: 0, duration: 1, stagger: 0.12 }, 0.6)
      .from('#dos', { y: 90, opacity: 0, duration: 1.4 }, 0.3)
      .from('#dsc', { rotateX: 38, rotateY: -30, duration: 1.8, ease: 'expo.out' }, 0.3);

    gsap.set('#hero-underlay-1', { rotate: -3, x: -10, y: 6, z: -40 });
    gsap.set('#hero-underlay-2', { rotate: 2.5, x: 12, y: -4, z: -20 });
    gsap.set('.ft', { z: 6 });
    gsap.set('#hero-dossier-tab', { z: 12 });

    const fan = gsap.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
    });
    const k = innerWidth > 1100 ? 1 : 0.5;
    fan.to('#hero-underlay-1', { rotate: -12, x: -70 * k, y: 44, ease: 'none' }, 0)
      .to('#hero-underlay-2', { rotate: 9, x: 80 * k, y: -24, ease: 'none' }, 0)
      .to('#hero-dossier-tab', { y: -40, x: 24, ease: 'none' }, 0);

    let hi = 0;
    setInterval(() => {
      hi = (hi + 1) % 4;
      hs(hi);
    }, 1800);

    if ($('.chk path')) {
      gsap.fromTo(
        '.chk path',
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.7, repeat: -1, repeatDelay: 2.4, ease: 'power2.out' }
      );
    }

    if (matchMedia('(pointer:fine)').matches && $('#dos')) {
      const rx = gsap.quickTo('#dos', 'rotationY', { duration: 0.8 });
      const ry = gsap.quickTo('#dos', 'rotationX', { duration: 0.8 });
      addEventListener('mousemove', (e) => {
        rx((e.clientX / innerWidth - 0.5) * 10);
        ry(-(e.clientY / innerHeight - 0.5) * 8);
      });

      $$('.mag').forEach((b) => {
        const x = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' });
        const y = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
        b.addEventListener('mousemove', (e) => {
          const r = b.getBoundingClientRect();
          x((e.clientX - r.left - r.width / 2) * 0.3);
          y((e.clientY - r.top - r.height / 2) * 0.4);
        });
        b.addEventListener('mouseleave', () => {
          x(0);
          y(0);
        });
      });
    }
  }

  // Odometer animation
  $$('.od').forEach((o) => {
    const s = String(o.dataset.n || '0');
    $$('.od-col', o).forEach((c, k) => {
      const d = +s[k];
      const targetIndex = (d === 0 ? 10 : d);
      gsap.to(c, {
        yPercent: -((targetIndex / 11) * 100),
        duration: 2.2 + k * 0.4,
        delay: 1.1,
        ease: 'power4.inOut'
      });
    });
  });

  // Split-text reveals
  $$('[data-split]').forEach((h) => {
    if (h.classList.contains('fw')) return;
    gsap.from($$('.ch', h), {
      yPercent: 115,
      rotate: 5,
      duration: 1,
      stagger: 0.018,
      ease: 'power4.out',
      scrollTrigger: { trigger: h, start: 'top 88%' }
    });
  });

  if ($('.fw .ch').length) {
    gsap.from('.fw .ch', {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.05,
      ease: 'power4.out',
      scrollTrigger: { trigger: '.fw', start: 'top 95%' }
    });
  }

  if ($('#fl')) {
    gsap.from('#fl', {
      scaleX: 0,
      duration: 1.6,
      ease: 'power4.inOut',
      scrollTrigger: { trigger: '#fl', start: 'top 98%' }
    });
  }

  $$('.lead,.tags,.tb,details,.pl,.lim').forEach((e) =>
    gsap.from(e, {
      y: 36,
      opacity: 0,
      filter: 'blur(8px)',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: e, start: 'top 90%' }
    })
  );

  // Velocity-skewed ticker marquee
  let pos = 0, vel = 0;
  const m1 = $('#m1'), m2 = $('#m2');
  if (m1 && m2) {
    ScrollTrigger.create({
      onUpdate: (s) => {
        vel = s.getVelocity();
      }
    });

    gsap.ticker.add(() => {
      vel *= 0.9;
      const v = Math.min(Math.abs(vel) / 260, 18);
      pos += 1 + v;
      [[m1, -1], [m2, 1]].forEach(([e, d]) => {
        const w = e.scrollWidth / 2;
        const x = d < 0 ? -(pos % w) : -w + (pos % w);
        gsap.set(e, { x, skewX: Math.max(-12, Math.min(12, vel / -220)) * (d < 0 ? 1 : -1) });
      });
    });
  }

  // Chapter 1: Pipeline runway scrub
  if ($('.run') && bar && car) {
    ScrollTrigger.create({
      trigger: '.run',
      start: 'top 60%',
      end: 'bottom 60%',
      scrub: 0.6,
      onUpdate: (s) => {
        setStage(Math.min(5, Math.round(s.progress * 5)));
        gsap.set(bar, { scaleX: s.progress });
        car.style.left = (8.333 + s.progress * 83.333) + '%';
      }
    });
    gsap.from('.stn', { y: 50, stagger: 0.1, duration: 0.9, scrollTrigger: { trigger: '.rule', start: 'top 95%' } });
  }

  // Chapter 2: STAR Evidence deck
  const mm = gsap.matchMedia();
  if ($('#deck')) {
    mm.add('(min-width:901px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '#deck', start: 'top 85%', end: 'center 50%', scrub: 0.7 }
      });
      $$('.fr').forEach((f, i) =>
        tl.from(f, { x: i % 2 ? 130 : 70, y: i < 2 ? -70 : 70, rotate: (i - 1.5) * 9, opacity: 0, duration: 1, ease: 'power3.out' }, i * 0.55)
      );
      tl.to('#spath', { strokeDashoffset: 0, duration: 2, ease: 'none' }, 0.3)
        .from('#citation-stage-pill', { y: 30, opacity: 0, scale: 0.8, duration: 0.8 }, '>-.2')
        .to({}, { duration: 0.6 });
    });

    mm.add('(max-width:900px)', () => {
      $$('.fr').forEach((f) =>
        gsap.from(f, { y: 50, opacity: 0, duration: 0.8, scrollTrigger: { trigger: f, start: 'top 92%' } })
      );
      gsap.to('#spath', {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#deck', start: 'top 70%', end: 'bottom 60%', scrub: true }
      });
    });
  }

  // Chapter 3: Sovereign Vault Envelope & Wax Seal
  if ($('#env')) {
    const vt = gsap.timeline({
      scrollTrigger: {
        trigger: '#env',
        start: 'top 80%',
        end: 'bottom 45%',
        scrub: 0.8,
        onUpdate: (s) => stpLi.forEach((l, k) => l.classList.toggle('on', s.progress >= k / 4 + 0.02))
      }
    });
    vt.from('.doc', { y: -150, opacity: 0, stagger: 0.2, duration: 1, ease: 'power2.out' })
      .from('#flap', { rotateX: 179, duration: 1, ease: 'power2.inOut' })
      .from('#seal', { scale: 2.6, opacity: 0, rotate: -40, duration: 0.6, ease: 'back.out(2)' });
  }

  // Privacy illustration
  if ($('#pbd')) {
    gsap.from('#pbd', {
      strokeDashoffset: 1,
      ease: 'none',
      scrollTrigger: { trigger: '.pv', start: 'top 80%', end: 'center 50%', scrub: true }
    });
  }

  if ($$('#recs rect').length) {
    $$('#recs rect').forEach((r, i) =>
      gsap.to(r, {
        y: (i % 2 ? -1 : 1) * 14,
        x: (i % 3 - 1) * 10,
        duration: 3 + i * 0.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    );
  }

  if ($('#pgate')) {
    gsap.to('#pgate', { strokeDashoffset: -24, duration: 1.2, repeat: -1, ease: 'none' });
  }

  // Chapter 4: App Tour mockups
  if ($('#phone') && $('#win')) {
    gsap.to('#phone', {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: { trigger: '#scene', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.to('#win', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: '#scene', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    gsap.from('.bars i', {
      scaleX: 0,
      stagger: 0.12,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '#phone', start: 'top 80%' }
    });
  }

  // Guide line scrub
  if ($('#gl')) {
    gsap.to('#gl', { '--g': 1, duration: 0 });
    gsap.from('#gl', {
      '--g': 0,
      ease: 'none',
      scrollTrigger: { trigger: '#gl', start: 'top 85%', end: 'top 35%', scrub: true }
    });
    gsap.from('#gl li', { y: 40, opacity: 0, stagger: 0.12, duration: 0.9, scrollTrigger: { trigger: '#gl', start: 'top 85%' } });
  }

  // Section 05: Closing CTA
  if ($('#cin')) {
    gsap.fromTo(
      '#cin',
      { clipPath: 'inset(12% 8% round 32px)' },
      { clipPath: 'inset(0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: '.close', start: 'top 85%', end: 'top 10%', scrub: true } }
    );
    gsap.from('.lw', {
      opacity: 0.12,
      stagger: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: '.lit', start: 'top 85%', end: 'top 35%', scrub: true }
    });
    if ($('#closing-leaf-left')) {
      gsap.from('#closing-leaf-left', {
        rotateY: 80,
        x: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.close', start: 'top 60%', end: 'center center', scrub: true }
      });
    }
    if ($('#closing-leaf-right')) {
      gsap.from('#closing-leaf-right', {
        rotateY: -80,
        x: 80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.close', start: 'top 60%', end: 'center center', scrub: true }
      });
    }
    gsap.from('.cc .acts .btn', {
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      scrollTrigger: { trigger: '.cc .acts', start: 'top 92%' }
    });
  }

  if ($('.fc>div').length) {
    gsap.from('.fc>div', { y: 40, opacity: 0, stagger: 0.1, duration: 0.9, scrollTrigger: { trigger: '.fc', start: 'top 92%' } });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
}
