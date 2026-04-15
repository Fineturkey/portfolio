import * as THREE from 'three';

// ═══════════════════════════════════════════════════════
// PORTFOLIO DATA  ← edit this with your real info
// ═══════════════════════════════════════════════════════
const DATA = {
  name:    'Eugene',
  initials:'E',
  role:    'Full Stack Developer',
  bio:     'I build things for the web with a focus on clean code, great UX, and performant systems. Passionate about creative tech and interactive experiences.',
  bio2:    'Currently exploring the intersection of game development and web — this portfolio is a small example of that.',
  github:  'https://github.com/yourusername',
  linkedin:'https://linkedin.com/in/yourusername',
  email:   'eugene7098@gmail.com',

  projects: [
    { name: 'Project Alpha', desc: 'Full-stack web app with real-time sync and auth.', tags: ['React', 'Node.js', 'MongoDB'], link: '#' },
    { name: 'Project Beta',  desc: 'ML pipeline for image classification at scale.',   tags: ['Python', 'TensorFlow', 'AWS'], link: '#' },
    { name: 'Project Gamma', desc: 'Real-time collaboration board with WebSockets.',   tags: ['Vue.js', 'Socket.io', 'Redis'], link: '#' },
    { name: 'Project Delta', desc: 'Mobile-first e-commerce with Stripe payments.',    tags: ['React Native', 'Stripe', 'Firebase'], link: '#' },
  ],

  skills: [
    { name: 'JavaScript / TypeScript', pct: 90 },
    { name: 'React / Next.js',          pct: 85 },
    { name: 'Node.js / Python',         pct: 80 },
    { name: 'SQL & NoSQL',              pct: 75 },
    { name: 'AWS / Cloud',              pct: 68 },
    { name: 'UI/UX Design',             pct: 62 },
  ],

  experience: [
    { role: 'Software Engineer', company: 'Tech Company', date: '2023 – Present', desc: 'Building scalable web apps, leading frontend development, and improving CI/CD pipelines.' },
    { role: 'Junior Developer',  company: 'Startup Inc.',  date: '2021 – 2023',   desc: 'Shipped full-stack features end-to-end and improved system performance by 40%.' },
  ],
};

// ═══════════════════════════════════════════════════════
// ZONE DEFINITIONS
// ═══════════════════════════════════════════════════════
const ZONES = [
  { id: 'about',    label: 'About Me',  x:   0, z: -35, color: 0x00d4ff, hex: '#00d4ff' },
  { id: 'projects', label: 'Projects',  x:  35, z:   0, color: 0x9b59ff, hex: '#9b59ff' },
  { id: 'resume',   label: 'Resume',    x: -35, z:   0, color: 0x39ff14, hex: '#39ff14' },
  { id: 'contact',  label: 'Contact',   x:   0, z:  35, color: 0xff6b35, hex: '#ff6b35' },
];

// ═══════════════════════════════════════════════════════
// RENDERER / SCENE / CAMERA
// ═══════════════════════════════════════════════════════
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04040f);
scene.fog = new THREE.FogExp2(0x04040f, 0.016);

const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 300);

// ═══════════════════════════════════════════════════════
// LIGHTING
// ═══════════════════════════════════════════════════════
scene.add(new THREE.AmbientLight(0x111133, 3));

const sun = new THREE.DirectionalLight(0x8899ff, 1.2);
sun.position.set(40, 80, 40);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.near = 0.5;
sun.shadow.camera.far = 250;
sun.shadow.camera.left = sun.shadow.camera.bottom = -90;
sun.shadow.camera.right = sun.shadow.camera.top = 90;
scene.add(sun);

// ═══════════════════════════════════════════════════════
// GROUND + GRID
// ═══════════════════════════════════════════════════════
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(400, 400),
  new THREE.MeshStandardMaterial({ color: 0x060616, roughness: 1 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(400, 100, 0x0d0d28, 0x0a0a20);
grid.position.y = 0.01;
scene.add(grid);

// ═══════════════════════════════════════════════════════
// STARS
// ═══════════════════════════════════════════════════════
function buildStars() {
  const N = 3000;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(Math.random() * 2 - 1);
    const r     = 160 + Math.random() * 60;
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = Math.abs(r * Math.cos(phi)) + 15;
    pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const stars = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, transparent: true, opacity: 0.7, sizeAttenuation: true }));
  scene.add(stars);
  return stars;
}
const stars = buildStars();

// ═══════════════════════════════════════════════════════
// PLAYER SHIP
// ═══════════════════════════════════════════════════════
function buildShip() {
  const g = new THREE.Group();

  const std = (col, emissive = 0x000000, ei = 0) =>
    new THREE.MeshStandardMaterial({ color: col, emissive, emissiveIntensity: ei, metalness: 0.75, roughness: 0.25 });

  // Hull body
  const hull = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.22, 1.5), std(0xdde8ff));
  hull.castShadow = true;
  g.add(hull);

  // Wings
  const wing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.09, 0.75), std(0xaabbdd));
  wing.position.set(0, -0.07, 0.1);
  wing.castShadow = true;
  g.add(wing);

  // Swept wing fins
  [-1.2, 1.2].forEach(x => {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.45), std(0x4488ff, 0x2266ff, 1));
    fin.position.set(x, -0.04, 0.15);
    g.add(fin);
    const tl = new THREE.PointLight(0x4488ff, 2, 4);
    tl.position.set(x, 0, 0.15);
    g.add(tl);
  });

  // Cockpit dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.55, emissive: 0x2266ff, emissiveIntensity: 0.5, metalness: 0.1, roughness: 0 })
  );
  dome.position.set(0, 0.12, 0.28);
  g.add(dome);

  // Engine pods
  [-0.38, 0.38].forEach(x => {
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.5, 8), std(0x8899bb));
    pod.rotation.x = Math.PI / 2;
    pod.position.set(x, -0.06, -0.7);
    g.add(pod);

    // Exhaust glow disc
    const glow = new THREE.Mesh(
      new THREE.CircleGeometry(0.09, 8),
      new THREE.MeshStandardMaterial({ color: 0x66aaff, emissive: 0x4488ff, emissiveIntensity: 4, side: THREE.DoubleSide })
    );
    glow.rotation.y = Math.PI;
    glow.position.set(x, -0.06, -0.97);
    g.add(glow);
  });

  const engineLight = new THREE.PointLight(0x4488ff, 4, 7);
  engineLight.position.set(0, -0.1, -1);
  g.add(engineLight);

  return g;
}

const ship = buildShip();
ship.position.set(0, 0.7, 0);
scene.add(ship);

// ═══════════════════════════════════════════════════════
// CANVAS LABEL SPRITE
// ═══════════════════════════════════════════════════════
function makeLabel(text, hex) {
  const W = 512, H = 96;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(4,4,20,0.75)';
  ctx.beginPath(); ctx.roundRect(6, 6, W-12, H-12, 14); ctx.fill();
  ctx.strokeStyle = hex; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(6, 6, W-12, H-12, 14); ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 46px "Segoe UI", Arial';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, W/2, H/2);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cv), transparent: true }));
  sprite.scale.set(10, 1.9, 1);
  return sprite;
}

// ═══════════════════════════════════════════════════════
// ISLANDS
// ═══════════════════════════════════════════════════════
const animatedObjects = []; // { mesh, kind, ... }
const islandPointLights = [];

function buildIsland(zone) {
  const { x, z, color, hex, label, id } = zone;
  const g = new THREE.Group();
  const C = new THREE.Color(color);

  // ── Base platform ──
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 10, 1.3, 10),
    new THREE.MeshStandardMaterial({ color: 0x0c0c1e, roughness: 0.9 })
  );
  base.position.y = -0.65; base.castShadow = true; base.receiveShadow = true;
  g.add(base);

  // Top deck
  const deck = new THREE.Mesh(
    new THREE.CylinderGeometry(7.7, 8, 0.28, 10),
    new THREE.MeshStandardMaterial({ color: 0x111126, emissive: C, emissiveIntensity: 0.05, roughness: 0.7 })
  );
  deck.position.y = 0.14; deck.receiveShadow = true;
  g.add(deck);

  // Glowing rim torus
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(7.9, 0.13, 8, 40),
    new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 2.5, transparent: true, opacity: 0.9 })
  );
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.28;
  g.add(rim);
  animatedObjects.push({ mesh: rim, kind: 'pulse', base: 2.5, amp: 0.5, speed: 0.0018, phase: Math.random() * Math.PI * 2 });

  // Floating label sprite
  const lbl = makeLabel(label, hex);
  lbl.position.set(0, 7.5, 0);
  g.add(lbl);

  // Island light
  const ptLight = new THREE.PointLight(color, 5, 28);
  ptLight.position.y = 3;
  g.add(ptLight);
  islandPointLights.push(ptLight);

  const underLight = new THREE.PointLight(color, 2, 14);
  underLight.position.y = -2;
  g.add(underLight);

  // ── Island-specific decorations ──
  if (id === 'about') {
    // Tall glowing monolith
    const mono = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 5.5, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x050510, emissive: C, emissiveIntensity: 0.4 })
    );
    mono.position.set(0, 3, 0); g.add(mono);

    // Horizontal scan lines on monolith face
    for (let i = 0; i < 6; i++) {
      const line = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.045, 0.06),
        new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 4 })
      );
      line.position.set(0, 1.0 + i * 0.65, 0.14);
      g.add(line);
    }

    // Orbital ring + planet
    const pivot = new THREE.Object3D();
    pivot.position.set(0, 2.8, 0);
    pivot.rotation.x = 0.6;
    g.add(pivot);
    animatedObjects.push({ mesh: pivot, kind: 'rotY', speed: 0.009 });

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.8, 0.05, 6, 36),
      new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 1.2, transparent: true, opacity: 0.55 })
    );
    pivot.add(orbitRing);

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 8),
      new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 2 })
    );
    planet.position.set(2.8, 0, 0);
    pivot.add(planet);

  } else if (id === 'projects') {
    // Floating wireframe + solid cubes
    const configs = [
      { p: [-2.5, 2, -2],   s: 0.9, wire: false },
      { p: [ 2.5, 1.8, -1], s: 0.75, wire: true },
      { p: [ 0,   3.2, 2],  s: 1.0, wire: false },
      { p: [-2.8, 1.2, 1.8],s: 0.65, wire: true },
      { p: [ 2.8, 2.5, 1.5],s: 0.8, wire: false },
    ];
    configs.forEach(({ p, s, wire }, i) => {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(s, s, s),
        new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: wire ? 1.5 : 0.3, transparent: true, opacity: 0.75, wireframe: wire })
      );
      cube.position.set(...p);
      g.add(cube);
      animatedObjects.push({
        mesh: cube, kind: 'floatRot',
        floatSeed: i * 1.3, floatAmp: 0.015, floatSpeed: 0.013 + i * 0.003,
        rx: (Math.random() - 0.5) * 0.018, ry: (Math.random() - 0.5) * 0.018
      });
    });

  } else if (id === 'resume') {
    // Bar chart columns
    const bars = [0.72, 0.88, 0.60, 0.84, 0.76];
    bars.forEach((h, i) => {
      const height = h * 5.5;
      const xp = (i - 2) * 1.9;

      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, height, 0.85),
        new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 0.15 + h * 0.3, transparent: true, opacity: 0.8 })
      );
      bar.position.set(xp, height / 2, 0); bar.castShadow = true;
      g.add(bar);

      // Bright cap
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(0.87, 0.12, 0.87),
        new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 4 })
      );
      cap.position.set(xp, height + 0.06, 0);
      g.add(cap);
    });

  } else if (id === 'contact') {
    // Satellite dish
    const dishGroup = new THREE.Group();
    dishGroup.position.set(0, 2.2, -1.8);
    g.add(dishGroup);
    animatedObjects.push({ mesh: dishGroup, kind: 'rotY', speed: 0.006 });

    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.2),
      new THREE.MeshStandardMaterial({ color: 0x121222, emissive: C, emissiveIntensity: 0.2, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
    );
    dish.rotation.x = Math.PI / 2;
    dishGroup.add(dish);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 2.8, 6),
      new THREE.MeshStandardMaterial({ color: 0x334466 })
    );
    pole.position.y = -1.4;
    dishGroup.add(pole);

    // Signal rings floating above dish
    for (let i = 1; i <= 3; i++) {
      const sring = new THREE.Mesh(
        new THREE.TorusGeometry(i * 0.75, 0.04, 6, 24),
        new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 2 - i * 0.4, transparent: true, opacity: 0.65 - i * 0.1 })
      );
      sring.rotation.x = Math.PI / 2;
      sring.position.set(-2.5, 2.8 + i * 0.6, 0);
      g.add(sring);
      animatedObjects.push({ mesh: sring, kind: 'floatRot', floatSeed: i * 0.9, floatAmp: 0.012, floatSpeed: 0.02, rx: 0, ry: 0 });
    }
  }

  g.position.set(x, 0, z);
  scene.add(g);
}

ZONES.forEach(buildIsland);

// ═══════════════════════════════════════════════════════
// CONNECTING PATHS (dim light lines between hub & islands)
// ═══════════════════════════════════════════════════════
ZONES.forEach(zone => {
  const pts = [];
  for (let i = 0; i <= 30; i++) {
    const t = i / 30;
    pts.push(new THREE.Vector3(zone.x * t, 0.04, zone.z * t));
  }
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({ color: zone.color, transparent: true, opacity: 0.12 })
  );
  scene.add(line);
});

// Central hub marker
const hubRing = new THREE.Mesh(
  new THREE.TorusGeometry(2, 0.06, 6, 32),
  new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5, transparent: true, opacity: 0.3 })
);
hubRing.rotation.x = Math.PI / 2; hubRing.position.y = 0.05;
scene.add(hubRing);
animatedObjects.push({ mesh: hubRing, kind: 'rotY', speed: 0.004 });

// ═══════════════════════════════════════════════════════
// CONTROLS
// ═══════════════════════════════════════════════════════
const keys = new Set();
window.addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
window.addEventListener('keyup',   e => keys.delete(e.key.toLowerCase()));

// Touch fallback
let touchDX = 0, touchDY = 0, touchBaseX = 0, touchBaseY = 0;
canvas.addEventListener('touchstart', e => { touchBaseX = e.touches[0].clientX; touchBaseY = e.touches[0].clientY; }, { passive: true });
canvas.addEventListener('touchmove',  e => {
  touchDX = e.touches[0].clientX - touchBaseX;
  touchDY = e.touches[0].clientY - touchBaseY;
}, { passive: true });
canvas.addEventListener('touchend', () => { touchDX = 0; touchDY = 0; });

let angle = 0;
const vel = new THREE.Vector3();
const SPEED = 0.19, TURN = 0.048, DAMP = 0.86, BOUND = 78;

// ═══════════════════════════════════════════════════════
// ZONE DETECTION
// ═══════════════════════════════════════════════════════
const promptEl    = document.getElementById('zone-prompt');
const promptName  = document.getElementById('zone-prompt-name');
let activeZone    = null;

function detectZone() {
  let found = null, best = Infinity;
  for (const z of ZONES) {
    const dx = ship.position.x - z.x, dz = ship.position.z - z.z;
    const d = Math.sqrt(dx*dx + dz*dz);
    if (d < 11 && d < best) { found = z; best = d; }
  }
  if (found !== activeZone) {
    activeZone = found;
    if (found) {
      promptName.textContent = found.label;
      promptName.style.color = found.hex;
    }
    promptEl.classList.toggle('visible', !!found);
  }
}

// ═══════════════════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════════════════
const modal      = document.getElementById('modal');
const modalPanel = document.getElementById('modal-panel');
const modalBody  = document.getElementById('modal-body');
document.getElementById('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

function openModal(zone) {
  modal.classList.add('open');
  modalPanel.setAttribute('data-zone', zone.id);
  modalBody.innerHTML = buildContent(zone.id);
  if (zone.id === 'resume') {
    requestAnimationFrame(() => {
      document.querySelectorAll('.skill-fill').forEach(el => {
        el.style.width = el.dataset.pct + '%';
      });
    });
  }
}

function closeModal() { modal.classList.remove('open'); }

window.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'e' && activeZone) openModal(activeZone);
  if (e.key === 'Escape') closeModal();
});

function buildContent(id) {
  if (id === 'about') return `
    <div class="sec-eyebrow">Hello, world</div>
    <div class="sec-title">About Me</div>
    <div class="about-layout">
      <div class="avatar-ring">${DATA.initials}</div>
      <div>
        <div class="about-name">${DATA.name}</div>
        <div class="about-role">${DATA.role}</div>
        <p class="about-bio">${DATA.bio}</p>
        <p class="about-bio">${DATA.bio2}</p>
        <div class="pill-row">
          <a class="pill" href="${DATA.github}" target="_blank">⌥ GitHub</a>
          <a class="pill" href="${DATA.linkedin}" target="_blank">in LinkedIn</a>
          <a class="pill" href="mailto:${DATA.email}">✉ Email</a>
        </div>
      </div>
    </div>`;

  if (id === 'projects') return `
    <div class="sec-eyebrow">My Work</div>
    <div class="sec-title">Projects</div>
    <div class="projects-grid">
      ${DATA.projects.map(p => `
        <div class="proj-card">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <a class="proj-link" href="${p.link}" target="_blank">View →</a>
        </div>`).join('')}
    </div>`;

  if (id === 'resume') return `
    <div class="sec-eyebrow">Background</div>
    <div class="sec-title">Resume</div>
    <div class="resume-cols">
      <div>
        <div class="resume-sub">Skills</div>
        ${DATA.skills.map(s => `
          <div class="skill-item">
            <div class="skill-header"><span>${s.name}</span><span>${s.pct}%</span></div>
            <div class="skill-track"><div class="skill-fill" data-pct="${s.pct}"></div></div>
          </div>`).join('')}
        <a class="resume-dl" href="#" download>↓ Download PDF</a>
      </div>
      <div>
        <div class="resume-sub">Experience</div>
        ${DATA.experience.map(e => `
          <div class="exp-item">
            <div class="exp-role">${e.role}</div>
            <div class="exp-co">${e.company}</div>
            <div class="exp-date">${e.date}</div>
            <div class="exp-desc">${e.desc}</div>
          </div>`).join('')}
      </div>
    </div>`;

  if (id === 'contact') return `
    <div class="sec-eyebrow">Let's Talk</div>
    <div class="sec-title">Contact</div>
    <p class="contact-intro">I'm always open to new projects, interesting ideas, or just a good conversation. Hit me up through any of the channels below.</p>
    <div class="contact-list">
      <a class="contact-row" href="mailto:${DATA.email}">
        <div class="contact-icon">✉</div>
        <div><h4>Email</h4><p>${DATA.email}</p></div>
      </a>
      <a class="contact-row" href="${DATA.github}" target="_blank">
        <div class="contact-icon">⌥</div>
        <div><h4>GitHub</h4><p>Check out my repositories</p></div>
      </a>
      <a class="contact-row" href="${DATA.linkedin}" target="_blank">
        <div class="contact-icon">in</div>
        <div><h4>LinkedIn</h4><p>Connect professionally</p></div>
      </a>
    </div>`;

  return '';
}

// ═══════════════════════════════════════════════════════
// MINIMAP
// ═══════════════════════════════════════════════════════
const mmCanvas = document.getElementById('minimap');
const mmCtx    = mmCanvas.getContext('2d');
const MM = 130, SCALE = MM / (BOUND * 2);

function drawMinimap() {
  mmCtx.clearRect(0, 0, MM, MM);
  mmCtx.fillStyle = 'rgba(4,4,15,0.92)';
  mmCtx.fillRect(0, 0, MM, MM);

  // Zone blobs
  ZONES.forEach(z => {
    const mx = (z.x + BOUND) * SCALE, my = (z.z + BOUND) * SCALE;
    mmCtx.beginPath(); mmCtx.arc(mx, my, 7, 0, Math.PI * 2);
    mmCtx.fillStyle = z.hex + '33'; mmCtx.fill();
    mmCtx.strokeStyle = z.hex; mmCtx.lineWidth = 1.5; mmCtx.stroke();
  });

  // Ship arrow
  const px = (ship.position.x + BOUND) * SCALE;
  const pz = (ship.position.z + BOUND) * SCALE;
  mmCtx.save();
  mmCtx.translate(px, pz);
  mmCtx.rotate(-angle);
  mmCtx.fillStyle = '#fff';
  mmCtx.beginPath();
  mmCtx.moveTo(0, -5); mmCtx.lineTo(3.5, 4); mmCtx.lineTo(-3.5, 4);
  mmCtx.closePath(); mmCtx.fill();
  mmCtx.restore();
}

// ═══════════════════════════════════════════════════════
// CAMERA
// ═══════════════════════════════════════════════════════
const camTarget = new THREE.Vector3();
const camLook   = new THREE.Vector3();

function updateCamera() {
  const dist = 13, h = 8;
  camTarget.set(
    ship.position.x - Math.sin(angle) * dist,
    ship.position.y + h,
    ship.position.z - Math.cos(angle) * dist
  );
  camera.position.lerp(camTarget, 0.07);
  camLook.copy(ship.position).y += 0.6;
  camera.lookAt(camLook);
}

// ═══════════════════════════════════════════════════════
// UPDATE LOOP
// ═══════════════════════════════════════════════════════
function updateShip(t) {
  const left  = keys.has('a') || keys.has('arrowleft')  || touchDX < -22;
  const right = keys.has('d') || keys.has('arrowright') || touchDX >  22;
  const fwd   = keys.has('w') || keys.has('arrowup')    || touchDY < -22;
  const back  = keys.has('s') || keys.has('arrowdown')  || touchDY >  22;

  if (left)  angle += TURN;
  if (right) angle -= TURN;

  ship.rotation.y = angle;

  const fwdVec = new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle));
  if (fwd)  vel.addScaledVector(fwdVec,  SPEED);
  if (back) vel.addScaledVector(fwdVec, -SPEED * 0.5);

  vel.multiplyScalar(DAMP);

  // Soft boundary bounce
  if (Math.abs(ship.position.x) > BOUND) vel.x -= Math.sign(ship.position.x) * 0.2;
  if (Math.abs(ship.position.z) > BOUND) vel.z -= Math.sign(ship.position.z) * 0.2;

  ship.position.add(vel);
  ship.position.y = 0.68 + Math.sin(t * 0.00185) * 0.13; // hover bob

  detectZone();
}

function animateObjects(t) {
  for (const o of animatedObjects) {
    const m = o.mesh;
    if (o.kind === 'pulse') {
      m.material.emissiveIntensity = o.base + Math.sin(t * o.speed + o.phase) * o.amp;
    } else if (o.kind === 'rotY') {
      m.rotation.y += o.speed;
    } else if (o.kind === 'floatRot') {
      m.position.y += Math.sin(t * o.floatSpeed + o.floatSeed) * o.floatAmp;
      if (o.rx) m.rotation.x += o.rx;
      if (o.ry) m.rotation.y += o.ry;
    }
  }

  // Breathe island point lights
  islandPointLights.forEach((l, i) => {
    l.intensity = 5 + Math.sin(t * 0.0017 + i * 1.3) * 1;
  });

  // Stars slow drift
  stars.rotation.y += 0.00004;
}

// ═══════════════════════════════════════════════════════
// RENDER LOOP
// ═══════════════════════════════════════════════════════
function loop(t) {
  requestAnimationFrame(loop);
  updateShip(t);
  updateCamera();
  animateObjects(t);
  drawMinimap();
  renderer.render(scene, camera);
}

// ═══════════════════════════════════════════════════════
// RESIZE
// ═══════════════════════════════════════════════════════
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ═══════════════════════════════════════════════════════
// BOOT — fake load bar then reveal world
// ═══════════════════════════════════════════════════════
const loadingEl = document.getElementById('loading');
const fillEl    = document.getElementById('loader-fill');
let pct = 0;

function tick() {
  pct += Math.random() * 18;
  fillEl.style.width = Math.min(pct, 100) + '%';
  if (pct < 100) {
    setTimeout(tick, 80 + Math.random() * 120);
  } else {
    setTimeout(() => {
      loadingEl.classList.add('fade-out');
      setTimeout(() => loadingEl.remove(), 900);
      requestAnimationFrame(loop);
    }, 350);
  }
}

tick();
