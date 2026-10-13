// Utility functions and constants
const $ = s => document.querySelector(s);
const RM = matchMedia('(prefers-reduced-motion:reduce)').matches;

// Finish options
const FIN = [
  { n: 'Gloss Black', c: ['#59606b', '#15171b', '#040506'] },
  { n: 'Matte Black', c: ['#44484e', '#25272b', '#121315'] },
  { n: 'Metallic Silver', c: ['#fff', '#bcc4cc', '#6a717a'] },
  { n: 'Bronze', c: ['#f0c294', '#a06c40', '#4a2f1d'] },
  { n: 'Chrome', c: ['#fff', '#8fa6bd', '#eef3f8'] }
];

// Design options
const DES = {
  multi: ['Multi-Spoke', 'Alloy'],
  five: ['Five-Spoke', 'Alloy'],
  split: ['Split-Spoke', 'Sport'],
  mesh: ['Mesh', 'Sport'],
  turbine: ['Turbine', 'Luxury'],
  aero: ['Aero', 'Luxury']
};

/*
  Car data.
  p = real photo settings (side-profile photo with transparent background):
    src : path to the photo
    w   : [x1, x2]  horizontal centre of the REAR and FRONT wheel, as a fraction of image width (0..1)
    y   : vertical centre of the wheels, as a fraction of image height (0..1)
    r   : tyre radius as a fraction of image width
  b / g are the old drawn shapes, used only if the photo file is missing.
*/
const CARS = [
  {
    n: 'BMW M4',
    p: { src: 'cars/bmw-m4.png', w: [0.22, 0.78], y: 0.70, r: 0.10 },
    c: ['#3a78ff', '#0b2a7a'],
    b: 'M70 262C68 240 84 228 130 222L250 208C285 176 335 152 410 148L500 150C560 154 615 188 655 204L720 214C748 220 756 240 752 262Z',
    g: 'M285 204C312 178 350 162 410 160L495 162C535 166 575 186 610 204Z',
    sz: [19, 20, 21],
    def: { d: 'multi', f: 0, s: 19 }
  },
  {
    n: 'Mercedes-Benz S-Class',
    p: { src: 'cars/mercedes-s-class.png', w: [0.21, 0.79], y: 0.72, r: 0.10 },
    c: ['#c4ccd6', '#4b535d'],
    b: 'M50 262C48 238 64 226 100 222L220 214C250 186 300 168 380 164L520 164C575 168 620 190 668 208L728 218C756 224 762 242 758 262Z',
    g: 'M255 212C285 190 320 178 380 176L525 176C565 180 600 196 636 210Z',
    sz: [19, 20, 21],
    def: { d: 'five', f: 2, s: 19 }
  },
  {
    n: 'Porsche 911',
    p: { src: 'cars/porsche-911.png', w: [0.22, 0.77], y: 0.70, r: 0.10 },
    c: ['#e0343a', '#6a0b12'],
    b: 'M85 262C80 238 96 226 140 220L230 206C270 170 330 150 400 150C470 150 540 168 590 198L690 212C735 218 748 238 744 262Z',
    g: 'M265 204C300 176 345 162 400 162C455 162 510 176 560 200Z',
    sz: [19, 20, 21],
    def: { d: 'split', f: 2, s: 20 }
  },
  {
    n: 'Audi RS7',
    p: { src: 'cars/audi-rs7.png', w: [0.21, 0.79], y: 0.71, r: 0.10 },
    c: ['#9aa1aa', '#2f3338'],
    b: 'M60 262C58 238 76 226 115 222L240 210C290 174 350 156 430 154C510 154 575 176 640 204L722 214C752 220 758 240 754 262Z',
    g: 'M275 208C320 180 370 168 430 167C500 167 560 186 612 206Z',
    sz: [20, 21],
    def: { d: 'mesh', f: 1, s: 20 }
  },
  {
    n: 'Ford Mustang GT',
    p: { src: 'cars/ford-mustang-gt.png', w: [0.22, 0.78], y: 0.70, r: 0.10 },
    c: ['#ff8a2a', '#8a3500'],
    b: 'M70 262C66 236 84 224 120 220L225 212C255 178 300 160 360 158L450 160C510 166 560 192 600 208L728 216C752 222 758 242 754 262Z',
    g: 'M262 210C288 184 322 172 362 171L445 173C490 178 530 194 560 208Z',
    sz: [18, 19, 20],
    def: { d: 'five', f: 0, s: 19 }
  }
];

// Preload car photos; any that fail fall back to the drawn car
const loadCar = c => new Promise(res => {
  const im = new Image();
  im.onload = () => { c.ok = true; c.nw = im.naturalWidth; c.nh = im.naturalHeight; res(); };
  im.onerror = () => { c.ok = false; res(); };
  im.src = c.p.src;
});

// Helper to create polygons
const sp = (a, r0, r1, w0, w1) => {
  const c = Math.cos(a), s = Math.sin(a);
  const f = n => n.toFixed(1);
  return `<polygon points="${f(r0 * c - w0 * s)},${f(r0 * s + w0 * c)} ${f(r1 * c - w1 * s)},${f(r1 * s + w1 * c)} ${f(r1 * c + w1 * s)},${f(r1 * s - w1 * c)} ${f(r0 * c + w0 * s)},${f(r0 * s - w0 * c)}"/>`;
};

// Generate repeated patterns
const N = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');

// Wheel shape definitions
const SP = {
  multi: R => N(10, i => sp(i * Math.PI / 5, R * 0.2, R * 0.93, R * 0.045, R * 0.06)),
  five: R => N(5, i => sp(i * 1.2566, R * 0.2, R * 0.93, R * 0.13, R * 0.2)),
  split: R => N(5, i => sp(i * 1.2566 - 0.1, R * 0.2, R * 0.93, R * 0.04, R * 0.05) + sp(i * 1.2566 + 0.1, R * 0.2, R * 0.93, R * 0.04, R * 0.05)),
  mesh: R => `
    <g fill="none" stroke="inherit" stroke-width="${R * 0.05}">
      ${[0.35, 0.55, 0.75, 0.9].map(k => `<circle r="${R * k}"/>`).join('')}
      ${N(16, i => {
        const a = i * Math.PI / 8;
        return `<path d="M0 0L${Math.cos(a) * R * 0.93} ${Math.sin(a) * R * 0.93}"/>`;
      })}
    </g>
  `,
  turbine: R => `
    <g fill="none" stroke="inherit" stroke-width="${R * 0.085}" stroke-linecap="round">
      ${N(12, i => {
        const a = i * Math.PI / 6;
        const p = (t, r) => `${Math.cos(t) * r * R} ${Math.sin(t) * r * R}`;
        return `<path d="M${p(a, 0.22)}Q${p(a + 0.25, 0.6)} ${p(a + 0.7, 0.9)}"/>`;
      })}
    </g>
  `,
  aero: R => `
    <circle r="${R * 0.93}"/>
    <g fill="#06080a" opacity=".9">
      ${N(8, i => sp(i * Math.PI / 4 + 0.4, R * 0.5, R * 0.82, R * 0.05, R * 0.07))}
    </g>
  `
};

// Wheel rendering function
const wheelM = (s, d, f) => {
  const R = 34 + (s - 18) * 4;
  const u = `url(#fin${f})`;
  return `
    <circle r="58" fill="#0a0b0d"/>
    <circle r="57" fill="none" stroke="#2b3038" stroke-width="1.5"/>
    <circle r="52" fill="none" stroke="#14171b" stroke-width="1"/>
    <circle r="${R}" fill="${u}"/>
    <circle r="${R * 0.94}" fill="#06080a"/>
    <circle r="${R * 0.82}" fill="#1c2026" stroke="#2f353d"/>
    <path d="M${R * 0.3} ${-R * 0.78}A${R * 0.8} ${R * 0.8} 0 0 1 ${R * 0.8} ${-R * 0.3}" fill="none" stroke="#65AFFF" stroke-width="${R * 0.16}" stroke-linecap="round"/>
    <g class="rot" fill="${u}" stroke="${u}">
      ${SP[d](R)}
      <circle r="${R * 0.2}"/>
      <circle r="${R * 0.08}" fill="#07090b" stroke="none"/>
    </g>
    <circle class="rp" r="64" fill="none" stroke="#65AFFF" stroke-width="2" opacity="0"/>
  `;
};

// Global state
const S = { car: 0, ...CARS[0].def, cmp: false, cat: 'all', zoom: 1, rev: false };

// Initialize gradients for finishes
$('#df').insertAdjacentHTML(
  'beforeend',
  FIN.map((f, i) => `
    <radialGradient id="fin${i}" gradientUnits="userSpaceOnUse" cx="-14" cy="-16" r="70">
      <stop offset="0" stop-color="${f.c[0]}"/>
      <stop offset=".55" stop-color="${f.c[1]}"/>
      <stop offset="1" stop-color="${f.c[2]}"/>
    </radialGradient>
  `).join('')
);

const LS = 'rimstudio-cfg';
const cfgKey = () => JSON.stringify([S.car, S.d, S.f, S.s]);
let saved = null;
try {
  saved = localStorage.getItem(LS);
  if (saved) {
    const [c, d, f, s] = JSON.parse(saved);
    if (CARS[c] && DES[d] && FIN[f] && CARS[c].sz.includes(s)) {
      S.car = c;
      S.d = d;
      S.f = f;
      S.s = s;
    }
  }
} catch (e) {}

const cur = () => (S.cmp ? CARS[S.car].def : S);
let wl = [...document.querySelectorAll('#wl .wi')];
let rots = [];
let rps = [];

function renderW(kick = true) {
  const c = cur();
  wl.forEach(w => (w.innerHTML = wheelM(c.s, c.d, c.f)));
  rots = [...document.querySelectorAll('#wl .rot')];
  rps = [...document.querySelectorAll('#wl .rp')];
  if (kick) {
    pop = 0;
    rip = 0;
    spin = Math.max(spin, 26);
  }
}

// Show the selected car: real photo if available, drawn car otherwise.
// Wheels always sit at SVG x=215 and x=595, y=270; the photo is scaled and
// shifted so its wheel centres land exactly there.
function paint() {
  const c = CARS[S.car];
  const ph = $('#photo');
  let k = 1;

  if (c.ok) {
    const [fx1, fx2] = c.p.w;
    const iw = (595 - 215) / (fx2 - fx1);
    const ih = iw * c.nh / c.nw;
    ph.setAttribute('href', c.p.src);
    ph.setAttribute('x', (215 - fx1 * iw).toFixed(1));
    ph.setAttribute('y', (270 - c.p.y * ih).toFixed(1));
    ph.setAttribute('width', iw.toFixed(1));
    ph.setAttribute('height', ih.toFixed(1));
    ph.setAttribute('display', 'inline');
    $('#vec').style.display = 'none';
    k = (c.p.r * iw) / 58;
  } else {
    ph.setAttribute('display', 'none');
    $('#vec').style.display = '';
    ['#body', '#bcp'].forEach(s => $(s).setAttribute('d', c.b));
    $('#glass').setAttribute('d', c.g);
    $('#gh').setAttribute('d', c.g);
    $('#p0').setAttribute('stop-color', c.c[0]);
    $('#p1').setAttribute('stop-color', c.c[1]);
  }

  wl.forEach((w, i) => w.setAttribute('transform', `translate(${i ? 595 : 215} 270) scale(${k.toFixed(3)})`));
  $('#cn').innerHTML = `<span>${c.n.toUpperCase()}</span>`;
}

// UI generation
function buildStrip() {
  $('#strip').innerHTML = CARS.map((c, i) => `
    <button class="cc" data-i="${i}" aria-label="${c.n}">
      ${c.ok
        ? `<img src="${c.p.src}" alt="">`
        : `<svg viewBox="40 140 730 190">
            <path d="${c.b}" fill="${c.c[0]}"/>
            <path d="${c.g}" fill="#0b1118"/>
            <circle cx="215" cy="270" r="50" fill="#0a0b0d"/>
            <circle cx="595" cy="270" r="50" fill="#0a0b0d"/>
            <circle cx="215" cy="270" r="30" fill="#aab"/>
            <circle cx="595" cy="270" r="30" fill="#aab"/>
          </svg>`}
      <span>${c.n.replace('Mercedes-Benz ', 'Mercedes ')}</span>
    </button>
  `).join('');
}

$('#sw').innerHTML = FIN.map((f, i) => `
  <button data-f="${i}" aria-label="${f.n}" title="${f.n}" style="background:radial-gradient(circle at 35% 30%,${f.c[0]},${f.c[1]} 55%,${f.c[2]})"></button>
`).join('');

$('#sz').innerHTML = [18, 19, 20, 21]
  .map(s => `<button data-s="${s}">${s}"</button>`)
  .join('');

function grid() {
  $('#grid').innerHTML = Object.keys(DES)
    .filter(k => S.cat == 'all' || DES[k][1] == S.cat)
    .map((k, i) => `
      <button class="tile" data-d="${k}" style="animation-delay:${i * 60}ms">
        <span class="ti"><svg viewBox="-60 -60 120 120"></svg></span>
        <span class="tl"></span>
      </button>
    `)
    .join('');
  ui();
}

function ui() {
  const c = cur();
  const car = CARS[S.car];
  document.querySelectorAll('.tile').forEach(t => {
    const k = t.dataset.d;
    t.classList.toggle('on', k == S.d);
    t.querySelector('svg').innerHTML = wheelM(S.s, k, S.f).replace(/<circle class="rp".*?\/>/, '');
    t.querySelector('.tl').textContent = `${S.s} ${DES[k][0]}`;
  });
  document.querySelectorAll('#sw button').forEach(b => b.classList.toggle('on', +b.dataset.f == S.f));
  $('#fnm').textContent = FIN[S.f].n;
  document.querySelectorAll('#sz button').forEach(b => {
    const s = +b.dataset.s;
    const ok = car.sz.includes(s);
    b.classList.toggle('dis', !ok);
    b.setAttribute('aria-disabled', !ok);
    b.classList.toggle('on', s == S.s);
  });
  document.querySelectorAll('.cc').forEach(b => b.classList.toggle('on', +b.dataset.i == S.car));
  const set = (id, t) => {
    const e = $(id);
    if (e.textContent != t) {
      e.textContent = t;
      e.classList.remove('bump');
      void e.offsetWidth;
      e.classList.add('bump');
    }
  };
  set('#dd', DES[c.d][0]);
  set('#df2', FIN[c.f].n);
  set('#ds', `${c.s}"`);
  set('#dfit', `Unverified · ${car.sz[0]}–${car.sz.at(-1)}" in preview`);
  $('#chip').classList.toggle('on', S.cmp);
  $('#cp').classList.toggle('on', S.cmp);
  $('#sp').classList.toggle('on', S.rev);
  const fv = saved === cfgKey();
  $('#fav').classList.toggle('on', fv);
  $('#sv2').classList.toggle('on', fv);
}

function toast(t) {
  const e = $('#ts');
  e.textContent = t;
  e.classList.add('on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove('on'), 1800);
}

function flash() {
  const f = $('#fs');
  f.classList.remove('go');
  void f.offsetWidth;
  f.classList.add('go');
}

function change(fn) {
  S.cmp = false;
  fn();
  renderW();
  ui();
}

$('#grid').onclick = e => {
  const t = e.target.closest('.tile');
  if (t) change(() => (S.d = t.dataset.d));
};
$('#sw').onclick = e => {
  const b = e.target.closest('button');
  if (b) change(() => (S.f = +b.dataset.f));
};
$('#sz').onclick = e => {
  const b = e.target.closest('button');
  if (b && !b.classList.contains('dis')) change(() => (S.s = +b.dataset.s));
};
$('#tabs').onclick = e => {
  const b = e.target.closest('button');
  if (!b) return;
  S.cat = b.dataset.c;
  const bs = [...$('#tabs').querySelectorAll('button')];
  bs.forEach(x => x.classList.toggle('on', x == b));
  $('#tabs i').style.transform = `translateX(${bs.indexOf(b) * 100}%)`;
  grid();
};

let busy = false;
$('#strip').onclick = e => {
  const b = e.target.closest('.cc');
  if (!b || busy || +b.dataset.i == S.car) return;
  busy = true;
  const i = +b.dataset.i;
  S.cmp = false;
  document.querySelectorAll('.cc').forEach(x => x.classList.toggle('on', x == b));
  go(
    carX,
    950,
    RM ? 1 : 450,
    p => p * p,
    () => {
      S.car = i;
      const sz = CARS[i].sz;
      if (!sz.includes(S.s)) S.s = sz.reduce((a, x) => (Math.abs(x - S.s) < Math.abs(a - S.s) ? x : a));
      paint();
      renderW(false);
      ui();
      carX = -950;
      prevX = -950;
      go(-950, 0, RM ? 1 : 1200, p => 1 - Math.pow(1 - p, 3), () => (busy = false));
    }
  );
};
$('#rst').onclick = () => {
  const d = CARS[S.car].def;
  Object.assign(S, d, { cmp: false, zoom: 1, rev: false });
  renderW();
  ui();
  flash();
  toast('Original wheels restored');
};
$('#zi').onclick = () => (S.zoom = Math.min(2.4, S.zoom + 0.35));
$('#zo').onclick = () => (S.zoom = Math.max(1, S.zoom - 0.35));
$('#zr').onclick = () => (S.zoom = 1);
$('#sp').onclick = () => {
  S.rev = !S.rev;
  ui();
};
$('#cp').onclick = () => {
  S.cmp = !S.cmp;
  renderW();
  flash();
  ui();
};
function save() {
  try {
    if (saved === cfgKey()) {
      localStorage.removeItem(LS);
      saved = null;
      toast('Removed from saved');
    } else {
      saved = cfgKey();
      localStorage.setItem(LS, saved);
      toast('Configuration saved');
    }
  } catch (e) {
    toast('Saving is unavailable here');
  }
  ui();
}
$('#fav').onclick = $('#sv2').onclick = save;

// Engine
let ang = 0,
  spin = 0,
  pop = 1,
  rip = 1,
  carX = 0,
  prevX = 0,
  tw = null,
  tx = 0,
  ty = 0,
  cx = 0,
  cy = 0,
  zc = 1,
  lastB = -1;

const go = (a, b, d, e, cb) => {
  tw = { a, b, d, e, t: performance.now(), cb };
};
const sv = $('#sv'),
  cg = $('#carG'),
  cb = $('#carBody'),
  cam = $('#cam'),
  shn = $('#shn'),
  bm = $('#bm'),
  st = $('#stage');

function loop(t) {
  if (tw) {
    const p = Math.min(1, (t - tw.t) / tw.d);
    carX = tw.a + (tw.b - tw.a) * tw.e(p);
    if (p >= 1) {
      const x = tw;
      tw = null;
      x.cb && x.cb();
    }
  }
  const dx = carX - prevX;
  prevX = carX;
  ang = (ang + dx * 0.85 + (RM ? 0 : 0.22) + spin + (S.rev ? 18 : 0)) % 360;
  spin *= 0.955;
  pop = Math.min(1, pop + 0.035);
  rip = Math.min(1, rip + 0.025);
  const c = 1.70158,
    q = pop - 1,
    k = 0.5 + 0.5 * (1 + (c + 1) * q * q * q + c * q * q);
  rots.forEach(r => r.setAttribute('transform', `rotate(${ang.toFixed(1)}) scale(${k.toFixed(3)})`));
  rps.forEach(r => {
    r.setAttribute('r', (62 + rip * 40).toFixed(1));
    r.setAttribute('opacity', ((1 - rip) * 0.9).toFixed(2));
  });
  const tr = `translate(${carX.toFixed(1)} 0)`;
  cg.setAttribute('transform', tr);
  cb.setAttribute('transform', tr);
  const bl = Math.min(8, Math.abs(carX) / 110);
  if (Math.abs(bl - lastB) > 0.05) {
    sv.style.filter = bl > 0.1 ? `blur(${bl.toFixed(1)}px)` : '';
    lastB = bl;
  }
  shn.setAttribute('x', (((t * 0.07) % 1700) - 600).toFixed(0));
  cx += (tx - cx) * 0.06;
  cy += (ty - cy) * 0.06;
  zc += (S.zoom - zc) * 0.08;
  cam.style.transform = `perspective(1300px) rotateY(${(cx * 5).toFixed(2)}deg) rotateX(${(-cy * 2.5).toFixed(2)}deg) scale(${zc.toFixed(3)})`;
  bm.style.transform = `translate(${(-cx * 16).toFixed(1)}px,${(-cy * 8).toFixed(1)}px)`;
  requestAnimationFrame(loop);
}

st.addEventListener('pointermove', e => {
  const r = st.getBoundingClientRect();
  tx = (e.clientX - r.left) / r.width * 2 - 1;
  ty = (e.clientY - r.top) / r.height * 2 - 1;
  st.style.setProperty('--mx', e.clientX - r.left + 'px');
  st.style.setProperty('--my', e.clientY - r.top + 'px');
});
st.addEventListener('pointerleave', () => {
  tx = 0;
  ty = 0;
});

// Dust effect
const cv = $('#cv'),
  cx2 = cv.getContext('2d'),
  P = Array.from({ length: 55 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.5 + 0.4, v: Math.random() * 0.00025 + 0.00008, a: Math.random() * 6 }));
function dust(t) {
  cv.width = cv.clientWidth;
  cv.height = cv.clientHeight;
  cx2.clearRect(0, 0, cv.width, cv.height);
  P.forEach(p => {
    p.y -= p.v;
    p.x += Math.sin(t / 2500 + p.a) * 0.0002;
    if (p.y < 0) p.y = 1;
    cx2.globalAlpha = 0.25 + 0.3 * Math.sin(t / 900 + p.a);
    cx2.fillStyle = '#bcd8ff';
    cx2.beginPath();
    cx2.arc(p.x * cv.width, p.y * cv.height, p.r, 0, 7);
    cx2.fill();
  });
  requestAnimationFrame(dust);
}

// Start once the car photos have loaded (or failed and fallen back)
Promise.all(CARS.map(loadCar)).then(() => {
  buildStrip();
  paint();
  grid();
  renderW(false);
  carX = -950;
  prevX = -950;
  if (!RM) requestAnimationFrame(dust);
  requestAnimationFrame(loop);
  setTimeout(() => {
    $('#intro').classList.add('out');
    renderW(true);
    go(-950, 0, RM ? 1 : 1900, p => 1 - Math.pow(1 - p, 4), null);
  }, RM ? 0 : 1700);
});