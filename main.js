import * as THREE from 'three';

// ═══════════════════════════════════════════════════════
// PORTFOLIO DATA  ← edit this with your real info
// ═══════════════════════════════════════════════════════
const DATA = {
  name:    'Eugene',
  initials:'E.G.',
  role:    'Full Stack Developer',
  bio:     'I build things for the web with a focus on clean code, great UX, and performant systems. Passionate about creative tech and interactive experiences.',
  bio2:    'Currently exploring the intersection of game development and web — this portfolio is a small example of that.',
  github:  'https://github.com/Fineturkey',
  linkedin:'https://www.linkedin.com/in/eugene-gu/',
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
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x04040f);
scene.fog = new THREE.FogExp2(0x04040f, 0.006);

const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 300);

// ═══════════════════════════════════════════════════════
// LIGHTING
// ═══════════════════════════════════════════════════════
scene.add(new THREE.AmbientLight(0x111133, 3));

const sun = new THREE.DirectionalLight(0x8899ff, 1.2);
sun.position.set(40, 80, 40);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
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

const animatedObjects = [];
const islandPointLights = [];

// ═══════════════════════════════════════════════════════
// STARS
// ═══════════════════════════════════════════════════════
function buildStars() {
  // Main white star field — full sphere, dense
  const N = 7000;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(Math.random() * 2 - 1);
    const r     = 170 + Math.random() * 70;
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.cos(phi);
    pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mainStars = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.28, transparent: true, opacity: 0.8, sizeAttenuation: true }));
  scene.add(mainStars);

  // Blue-white hot stars
  const bPos = new Float32Array(700 * 3);
  for (let i = 0; i < 700; i++) {
    const theta = Math.random() * Math.PI * 2, phi = Math.acos(Math.random() * 2 - 1);
    const r = 165 + Math.random() * 75;
    bPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    bPos[i*3+1] = r * Math.cos(phi);
    bPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
  scene.add(new THREE.Points(bGeo, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.5, transparent: true, opacity: 0.9, sizeAttenuation: true })));

  // Yellow/orange stars
  const yPos = new Float32Array(400 * 3);
  for (let i = 0; i < 400; i++) {
    const theta = Math.random() * Math.PI * 2, phi = Math.acos(Math.random() * 2 - 1);
    const r = 160 + Math.random() * 80;
    yPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    yPos[i*3+1] = r * Math.cos(phi);
    yPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const yGeo = new THREE.BufferGeometry();
  yGeo.setAttribute('position', new THREE.BufferAttribute(yPos, 3));
  scene.add(new THREE.Points(yGeo, new THREE.PointsMaterial({ color: 0xffddaa, size: 0.55, transparent: true, opacity: 0.75, sizeAttenuation: true })));

  // Red giant stars — large, few
  const rPos = new Float32Array(150 * 3);
  for (let i = 0; i < 150; i++) {
    const theta = Math.random() * Math.PI * 2, phi = Math.acos(Math.random() * 2 - 1);
    const r = 160 + Math.random() * 80;
    rPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    rPos[i*3+1] = r * Math.cos(phi);
    rPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const rGeo = new THREE.BufferGeometry();
  rGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
  scene.add(new THREE.Points(rGeo, new THREE.PointsMaterial({ color: 0xff8855, size: 0.75, transparent: true, opacity: 0.7, sizeAttenuation: true })));

  return mainStars;
}
const stars = buildStars();

// ═══════════════════════════════════════════════════════
// NEBULA CLOUDS + MILKY WAY
// ═══════════════════════════════════════════════════════
(function buildNebulae() {
  // Build a particle-based nebula cloud with two blended colors
  function nebulaCloud(cx, cy, cz, spread, flatness, col1, col2, count, ptSize, opacity) {
    const pos  = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const c1 = new THREE.Color(col1), c2 = new THREE.Color(col2), tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);
      const r     = Math.pow(Math.random(), 0.55) * spread;
      pos[i*3]   = cx + r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = cy + r * Math.cos(phi) * flatness;
      pos[i*3+2] = cz + r * Math.sin(phi) * Math.sin(theta);
      tmp.lerpColors(c1, c2, Math.random());
      cols[i*3] = tmp.r; cols[i*3+1] = tmp.g; cols[i*3+2] = tmp.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(cols, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
      size: ptSize, transparent: true, opacity, sizeAttenuation: true,
      vertexColors: true, depthWrite: false
    })));
  }

  // Purple-pink nebula (upper right)
  nebulaCloud( 130,  85,  -100, 60, 0.45, 0x9922ff, 0xff33aa, 1200, 1.8, 0.6);
  // Deep blue nebula (left sky)
  nebulaCloud(-120,  75,    90, 65, 0.5,  0x1144ff, 0x33ccff, 1000, 1.6, 0.55);
  // Orange-red emission nebula (far ahead)
  nebulaCloud(  60,  95,   165, 55, 0.5,  0xff3311, 0xffaa11, 900,  1.5, 0.55);
  // Teal nebula (back left)
  nebulaCloud(-150,  65,   -75, 50, 0.45, 0x00ffcc, 0x0066ff, 750,  1.4, 0.5);
  // Gold dust (upper center)
  nebulaCloud(  15, 120,  -145, 45, 0.4,  0xffcc44, 0xff8822, 600,  1.3, 0.45);
  // Green ghost nebula (right back)
  nebulaCloud( 160,  70,    80, 42, 0.5,  0x44ff88, 0x0088ff, 500,  1.2, 0.4);

  // ── Milky Way band ──
  // Dense strip of small white/blue stars wrapped around a great circle
  const MW = 5000;
  const mwPos = new Float32Array(MW * 3);
  for (let i = 0; i < MW; i++) {
    const theta   = Math.random() * Math.PI * 2;
    const bandLat = (Math.random() - 0.5) * 0.22;        // narrow latitude band
    const r       = 178 + Math.random() * 28;
    // Tilt the band ~35° from horizontal for a natural look
    const bx = r * Math.cos(bandLat) * Math.cos(theta);
    const by = r * Math.sin(bandLat);
    const bz = r * Math.cos(bandLat) * Math.sin(theta);
    // Rotate band around Z axis 35°
    const cos35 = Math.cos(0.6), sin35 = Math.sin(0.6);
    mwPos[i*3]   = bx;
    mwPos[i*3+1] = by * cos35 - bz * sin35 + 30;
    mwPos[i*3+2] = by * sin35 + bz * cos35;
  }
  const mwGeo = new THREE.BufferGeometry();
  mwGeo.setAttribute('position', new THREE.BufferAttribute(mwPos, 3));
  scene.add(new THREE.Points(mwGeo, new THREE.PointsMaterial({
    color: 0xddeeff, size: 0.18, transparent: true, opacity: 0.4, sizeAttenuation: true
  })));

  // ── Distant galaxy smudge (Andromeda-like oval blob) ──
  const GAL = 800;
  const galPos = new Float32Array(GAL * 3);
  for (let i = 0; i < GAL; i++) {
    const a   = Math.random() * Math.PI * 2;
    const rad = Math.pow(Math.random(), 0.4) * 18;
    galPos[i*3]   = -110 + rad * Math.cos(a) * 2.2;
    galPos[i*3+1] =   95 + rad * Math.sin(a) * 0.7;
    galPos[i*3+2] =  -90 + rad * Math.cos(a);
  }
  const galGeo = new THREE.BufferGeometry();
  galGeo.setAttribute('position', new THREE.BufferAttribute(galPos, 3));
  scene.add(new THREE.Points(galGeo, new THREE.PointsMaterial({
    color: 0xffeedd, size: 0.22, transparent: true, opacity: 0.5, sizeAttenuation: true, depthWrite: false
  })));
})();

// ═══════════════════════════════════════════════════════
// SPIRAL GALAXIES
// ═══════════════════════════════════════════════════════
(function buildGalaxies() {
  function makeSpiral(cx, cy, cz, tiltX, tiltZ, col1, col2, count, radius) {
    const pos  = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const c1 = new THREE.Color(col1), c2 = new THREE.Color(col2), tmp = new THREE.Color();
    const arms = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const t = Math.pow(Math.random(), 0.45);
      const armAngle = ((i % arms) / arms) * Math.PI * 2;
      const spin = t * Math.PI * 4.2;
      const angle = armAngle + spin;
      const r = t * radius;
      const scatter = (0.5 + t * 0.5) * radius * 0.1;
      pos[i*3]   = Math.cos(angle) * r + (Math.random() - 0.5) * scatter;
      pos[i*3+1] = (Math.random() - 0.5) * radius * 0.07 * (1 - t * 0.5);
      pos[i*3+2] = Math.sin(angle) * r + (Math.random() - 0.5) * scatter;
      tmp.lerpColors(c1, c2, t * 0.8 + Math.random() * 0.2);
      cols[i*3] = tmp.r; cols[i*3+1] = tmp.g; cols[i*3+2] = tmp.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(cols, 3));
    const g = new THREE.Points(geo, new THREE.PointsMaterial({
      size: 0.5, transparent: true, opacity: 0.72, sizeAttenuation: true,
      vertexColors: true, depthWrite: false
    }));
    g.position.set(cx, cy, cz);
    g.rotation.x = tiltX;
    g.rotation.z = tiltZ;
    return g;
  }

  [
    {  p: [ 85,  62, -132], t: [ 0.7,  0.3], c1: 0xffdd99, c2: 0xffffff, r: 22 },
    {  p: [-105, 78,  115], t: [ 0.4, -0.5], c1: 0x8855ff, c2: 0xddbbff, r: 19 },
    {  p: [ 118, 52,   85], t: [-0.6,  0.2], c1: 0x33aaff, c2: 0xaaddff, r: 21 },
    {  p: [ -68, 95, -118], t: [ 0.8,  0.4], c1: 0xff8833, c2: 0xffcc88, r: 17 },
    {  p: [  45, 115,  138],t: [ 0.3, -0.7], c1: 0x88ffcc, c2: 0x33ffaa, r: 15 },
    {  p: [-138, 68,   45], t: [-0.5,  0.6], c1: 0xff33aa, c2: 0xffaacc, r: 20 },
    {  p: [  22, 105, -155],t: [ 0.6, -0.3], c1: 0x44ddff, c2: 0xaaeeff, r: 14 },
  ].forEach(({ p, t, c1, c2, r }) => {
    const gal = makeSpiral(p[0], p[1], p[2], t[0], t[1], c1, c2, 1600, r);
    scene.add(gal);
    animatedObjects.push({ mesh: gal, kind: 'rotY', speed: 0.00012 + Math.random() * 0.00008 });
  });
})();

// ═══════════════════════════════════════════════════════
// CIRCUIT FLOOR DATA STREAMS
// ═══════════════════════════════════════════════════════
(function buildCircuitFloor() {
  const cell = 10;
  const half = 20;

  // Collect all segment pairs per color bucket (3 draw calls instead of 120)
  const buckets = [[], [], []];
  for (let i = 0; i < 120; i++) {
    const b = Math.floor(Math.random() * 3);
    let x = (Math.floor(Math.random() * half * 2) - half) * cell;
    let z = (Math.floor(Math.random() * half * 2) - half) * cell;
    const pts = [new THREE.Vector3(x, 0.018, z)];
    const segs = 2 + Math.floor(Math.random() * 7);
    for (let s = 0; s < segs; s++) {
      if (Math.random() > 0.5) x += (Math.ceil(Math.random() * 4) * (Math.random() > 0.5 ? 1 : -1)) * cell;
      else                     z += (Math.ceil(Math.random() * 4) * (Math.random() > 0.5 ? 1 : -1)) * cell;
      x = Math.max(-198, Math.min(198, x));
      z = Math.max(-198, Math.min(198, z));
      pts.push(new THREE.Vector3(x, 0.018, z));
    }
    for (let p = 0; p < pts.length - 1; p++) buckets[b].push(pts[p], pts[p + 1]);
  }
  [[0x00d4ff, 0.09], [0x9b59ff, 0.07], [0x39ff14, 0.06]].forEach(([color, opacity], idx) => {
    if (!buckets[idx].length) return;
    scene.add(new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(buckets[idx]),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity })
    ));
  });

  // Junction nodes — 1 InstancedMesh instead of 100 separate Meshes
  const nodeColors = [new THREE.Color(0x00d4ff), new THREE.Color(0x9b59ff), new THREE.Color(0x39ff14), new THREE.Color(0xff6b35)];
  const nodeInst = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.13, 5, 4),
    new THREE.MeshStandardMaterial({ emissiveIntensity: 2.8, roughness: 0 }),
    100
  );
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 100; i++) {
    const col = nodeColors[Math.floor(Math.random() * 4)];
    dummy.position.set(
      (Math.floor(Math.random() * half * 2) - half) * cell,
      0.022,
      (Math.floor(Math.random() * half * 2) - half) * cell
    );
    dummy.updateMatrix();
    nodeInst.setMatrixAt(i, dummy.matrix);
    nodeInst.setColorAt(i, col);
  }
  nodeInst.instanceMatrix.needsUpdate = true;
  nodeInst.instanceColor.needsUpdate = true;
  scene.add(nodeInst);
})();

// ═══════════════════════════════════════════════════════
// PLAYER SHIP
// ═══════════════════════════════════════════════════════
function buildShip() {
  const g = new THREE.Group();
  const metal  = (col) => new THREE.MeshStandardMaterial({ color: col, metalness: 0.82, roughness: 0.22 });
  const emit   = (col, ei) => new THREE.MeshStandardMaterial({ color: col, emissive: new THREE.Color(col), emissiveIntensity: ei, metalness: 0.1, roughness: 0 });
  const glass  = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5, emissive: 0x2266ff, emissiveIntensity: 0.6, metalness: 0, roughness: 0 });

  // ── Main fuselage (tapered) ──
  const hullFront = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 1.1), metal(0xd8e8ff));
  hullFront.position.z = 0.42; hullFront.castShadow = true; g.add(hullFront);
  const hullRear  = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.22, 0.85), metal(0xbccde0));
  hullRear.position.z = -0.38; hullRear.castShadow = true; g.add(hullRear);

  // Nose cone
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.55, 6), metal(0xe8f0ff));
  nose.rotation.x = -Math.PI / 2; nose.position.z = 1.02; g.add(nose);

  // ── Wings — swept delta shape ──
  [-1, 1].forEach(side => {
    // Inner wing panel
    const inner = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.85), metal(0xaabbd0));
    inner.position.set(side * 0.82, -0.07, 0.0); g.add(inner);
    // Outer swept panel
    const outer = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.055, 0.6), metal(0x8899bb));
    outer.position.set(side * 1.5, -0.09, 0.15);
    outer.rotation.y = side * 0.18; g.add(outer);
    // Wing tip light strip
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.55), emit(0x4488ff, 2.5));
    strip.position.set(side * 1.88, -0.06, 0.12); g.add(strip);
    // Nav light point
    const nav = new THREE.PointLight(0x4488ff, 1.5, 5);
    nav.position.set(side * 1.9, 0, 0.12); g.add(nav);
  });

  // ── Fuselage spine panels ──
  [0.3, -0.1, -0.45].forEach((z, i) => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.22), metal(0x99aabb));
    panel.position.set(0, 0.14, z); g.add(panel);
  });

  // ── Cockpit ──
  const cockpitBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.45), metal(0x334455));
  cockpitBase.position.set(0, 0.13, 0.38); g.add(cockpitBase);
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55),
    glass
  );
  dome.position.set(0, 0.19, 0.36); g.add(dome);

  // ── Engine pods (x3 — two side, one center) ──
  [[-0.42, -0.08, -0.72], [0.42, -0.08, -0.72], [0, -0.1, -0.78]].forEach(([px, py, pz], idx) => {
    const podR = idx === 2 ? 0.13 : 0.11;
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(podR, podR + 0.035, 0.58, 10), metal(0x7788aa));
    pod.rotation.x = Math.PI / 2; pod.position.set(px, py, pz); g.add(pod);

    // Inner exhaust rings
    [0, 1].forEach(ri => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(podR - 0.01, 0.018, 6, 18),
        emit(0x4488ff, 3 - ri)
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(px, py, pz - 0.24 - ri * 0.1); g.add(ring);
    });

    // Exhaust glow disc
    const disc = new THREE.Mesh(new THREE.CircleGeometry(podR, 10), emit(0x66aaff, 6));
    disc.rotation.y = Math.PI; disc.position.set(px, py, pz - 0.31); g.add(disc);
  });

  // Single strong engine light
  const engineLight = new THREE.PointLight(0x4488ff, 6, 10);
  engineLight.position.set(0, -0.1, -1.1); g.add(engineLight);

  // Underbelly heat shield stripe
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.03, 1.4), emit(0x2244aa, 0.8));
  stripe.position.set(0, -0.12, 0.05); g.add(stripe);

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
  animatedObjects.push({ mesh: rim, kind: 'pulse', base: 2.0, amp: 0.35, speed: 0.0009, phase: Math.random() * Math.PI * 2 });

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
    // ── ICE PLANET (Saturn-like) ──
    const icePlanet = new THREE.Mesh(
      new THREE.SphereGeometry(3.0, 40, 30),
      new THREE.MeshStandardMaterial({ color: 0x9ecfdf, emissive: new THREE.Color(0x00d4ff), emissiveIntensity: 0.08, roughness: 0.55, metalness: 0.05 })
    );
    icePlanet.position.y = 4.5;
    g.add(icePlanet);
    animatedObjects.push({ mesh: icePlanet, kind: 'rotY', speed: 0.0025 });

    // Atmosphere shell
    const iceAtmo = new THREE.Mesh(new THREE.SphereGeometry(3.3, 32, 24), new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 0.12, transparent: true, opacity: 0.14, side: THREE.BackSide }));
    iceAtmo.position.y = 4.5;
    g.add(iceAtmo);

    // Ring system (3 rings, tilted)
    const ringGroup = new THREE.Group();
    ringGroup.position.y = 4.5;
    ringGroup.rotation.x = 0.38;
    g.add(ringGroup);
    [{ r: 4.4, t: 0.28, o: 0.75 }, { r: 5.3, t: 0.22, o: 0.55 }, { r: 6.1, t: 0.12, o: 0.32 }].forEach(d => {
      ringGroup.add(new THREE.Mesh(
        new THREE.TorusGeometry(d.r, d.t, 2, 90),
        new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 0.7, transparent: true, opacity: d.o })
      ));
    });

    // Orbiting moon
    const moonPivot = new THREE.Object3D();
    moonPivot.position.y = 4.5;
    g.add(moonPivot);
    animatedObjects.push({ mesh: moonPivot, kind: 'rotY', speed: 0.006 });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), new THREE.MeshStandardMaterial({ color: 0xaac8d8, roughness: 0.88 }));
    moon.position.set(5.8, 1.0, 0);
    moonPivot.add(moon);

  } else if (id === 'projects') {
    // ── GAS GIANT ──
    const gasPlanet = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, 40, 30),
      new THREE.MeshStandardMaterial({ color: 0x5c2d8a, emissive: new THREE.Color(0x9b59ff), emissiveIntensity: 0.15, roughness: 0.65 })
    );
    gasPlanet.position.y = 4.5;
    g.add(gasPlanet);
    animatedObjects.push({ mesh: gasPlanet, kind: 'rotY', speed: 0.004 });

    // Atmosphere
    const gasAtmo = new THREE.Mesh(new THREE.SphereGeometry(3.82, 32, 24), new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 0.1, transparent: true, opacity: 0.16, side: THREE.BackSide }));
    gasAtmo.position.y = 4.5;
    g.add(gasAtmo);

    // Cloud band lines
    [-1.0, -0.3, 0.3, 1.0].forEach((yOff, idx) => {
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(3.52, 0.06, 2, 80),
        new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 1.2 + idx * 0.2, transparent: true, opacity: 0.3 + idx * 0.06 })
      );
      band.position.y = 4.5 + yOff;
      g.add(band);
    });

    // Large moon with own atmosphere
    const gasMoonPivot = new THREE.Object3D();
    gasMoonPivot.position.y = 4.5;
    gasMoonPivot.rotation.x = 0.28;
    g.add(gasMoonPivot);
    animatedObjects.push({ mesh: gasMoonPivot, kind: 'rotY', speed: 0.005 });
    const gasMoon = new THREE.Mesh(new THREE.SphereGeometry(0.68, 20, 16), new THREE.MeshStandardMaterial({ color: 0x3d1f5e, emissive: new THREE.Color(0x9b59ff), emissiveIntensity: 0.18, roughness: 0.75 }));
    gasMoon.position.set(6.2, 0, 0);
    gasMoonPivot.add(gasMoon);

  } else if (id === 'resume') {
    // ── STAR with corona & flares ──
    const starCore = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 40, 30),
      new THREE.MeshStandardMaterial({ color: 0xddffd0, emissive: C, emissiveIntensity: 2.8, roughness: 0 })
    );
    starCore.position.y = 4.5;
    g.add(starCore);
    animatedObjects.push({ mesh: starCore, kind: 'pulse', base: 2.8, amp: 0.7, speed: 0.001, phase: 0 });

    // Corona glow shells
    [{ r: 3.0, ei: 0.35, o: 0.14 }, { r: 3.8, ei: 0.2, o: 0.08 }, { r: 5.0, ei: 0.1, o: 0.04 }].forEach(d => {
      const shell = new THREE.Mesh(new THREE.SphereGeometry(d.r, 32, 24), new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: d.ei, transparent: true, opacity: d.o, side: THREE.BackSide }));
      shell.position.y = 4.5;
      g.add(shell);
    });

    // Solar flare arcs (rotating cone spikes)
    for (let i = 0; i < 7; i++) {
      const flareGrp = new THREE.Group();
      flareGrp.position.y = 4.5;
      flareGrp.rotation.y = (i / 7) * Math.PI * 2;
      flareGrp.rotation.z = 0.25 + Math.random() * 0.35;
      g.add(flareGrp);
      const flare = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 2.0, 4),
        new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 4, transparent: true, opacity: 0.6 })
      );
      flare.position.y = 3.2;
      flareGrp.add(flare);
      animatedObjects.push({ mesh: flareGrp, kind: 'rotY', speed: 0.0008 + i * 0.00025 });
    }

    // Extra bright point light for this star
    const starLight = new THREE.PointLight(color, 14, 38);
    starLight.position.y = 4.5;
    g.add(starLight);

  } else if (id === 'contact') {
    // ── BLACK HOLE with accretion disk ──
    const bhCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 40, 30),
      new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1 })
    );
    bhCore.position.y = 4.5;
    g.add(bhCore);

    // Event horizon glow rim
    const evHorizon = new THREE.Mesh(
      new THREE.SphereGeometry(1.68, 40, 30),
      new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 0.5, transparent: true, opacity: 0.22, side: THREE.BackSide })
    );
    evHorizon.position.y = 4.5;
    g.add(evHorizon);
    animatedObjects.push({ mesh: evHorizon, kind: 'pulse', base: 0.5, amp: 0.25, speed: 0.0014, phase: 0 });

    // Inner accretion disk (fast spin)
    const innerDisk = new THREE.Group();
    innerDisk.position.y = 4.5;
    innerDisk.rotation.x = 0.18;
    g.add(innerDisk);
    animatedObjects.push({ mesh: innerDisk, kind: 'rotY', speed: 0.012 });
    [{ r: 2.2, t: 0.38, c: 0xff6b35, ei: 3.5, o: 0.95 }, { r: 3.0, t: 0.3, c: 0xff8c50, ei: 2.5, o: 0.8 }].forEach(d => {
      innerDisk.add(new THREE.Mesh(new THREE.TorusGeometry(d.r, d.t, 3, 90), new THREE.MeshStandardMaterial({ color: d.c, emissive: new THREE.Color(d.c), emissiveIntensity: d.ei, transparent: true, opacity: d.o })));
    });

    // Outer accretion disk (slower spin)
    const outerDisk = new THREE.Group();
    outerDisk.position.y = 4.5;
    outerDisk.rotation.x = 0.22;
    outerDisk.rotation.z = 0.05;
    g.add(outerDisk);
    animatedObjects.push({ mesh: outerDisk, kind: 'rotY', speed: 0.006 });
    [{ r: 3.9, t: 0.24, c: 0xffaa66, ei: 1.6, o: 0.65 }, { r: 4.8, t: 0.16, c: 0xffcc88, ei: 1.0, o: 0.4 }, { r: 5.7, t: 0.1, c: 0xffddb0, ei: 0.5, o: 0.2 }].forEach(d => {
      outerDisk.add(new THREE.Mesh(new THREE.TorusGeometry(d.r, d.t, 3, 90), new THREE.MeshStandardMaterial({ color: d.c, emissive: new THREE.Color(d.c), emissiveIntensity: d.ei, transparent: true, opacity: d.o })));
    });

    // Gravitational lensing rings
    for (let i = 1; i <= 4; i++) {
      const lensRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.68 + i * 0.28, 0.025, 6, 40),
        new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 2.5, transparent: true, opacity: 0.55 - i * 0.1 })
      );
      lensRing.position.y = 4.5;
      g.add(lensRing);
      animatedObjects.push({ mesh: lensRing, kind: 'pulse', base: 2.5, amp: 0.6, speed: 0.0018 + i * 0.0008, phase: i * 1.1 });
    }
  }

  g.position.set(x, 0, z);
  scene.add(g);
}

ZONES.forEach(buildIsland);

// ── Holographic light shafts over each zone ──
ZONES.forEach(zone => {
  // Wide outer shaft
  const shaftOuter = new THREE.Mesh(
    new THREE.ConeGeometry(9, 70, 10, 1, true),
    new THREE.MeshBasicMaterial({ color: zone.color, transparent: true, opacity: 0.018, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  shaftOuter.position.set(zone.x, 35, zone.z);
  scene.add(shaftOuter);

  // Tight inner shaft
  const shaftInner = new THREE.Mesh(
    new THREE.ConeGeometry(3, 70, 6, 1, true),
    new THREE.MeshBasicMaterial({ color: zone.color, transparent: true, opacity: 0.05, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  shaftInner.position.set(zone.x, 35, zone.z);
  scene.add(shaftInner);

  // Ground halo ring
  const halo = new THREE.Mesh(
    new THREE.RingGeometry(7, 10, 32),
    new THREE.MeshBasicMaterial({ color: zone.color, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.set(zone.x, 0.05, zone.z);
  scene.add(halo);
  animatedObjects.push({ mesh: halo, kind: 'pulseOpacity', base: 0.1, amp: 0.05, speed: 0.001, phase: Math.random() * Math.PI * 2 });
});

// ── Holographic scan rings on zone platforms ──
ZONES.forEach(zone => {
  const scanRing = new THREE.Mesh(
    new THREE.TorusGeometry(8.5, 0.08, 4, 50),
    new THREE.MeshStandardMaterial({ color: zone.color, emissive: new THREE.Color(zone.color), emissiveIntensity: 1.5, transparent: true, opacity: 0.6 })
  );
  scanRing.rotation.x = Math.PI / 2;
  scanRing.position.set(zone.x, 0.08, zone.z);
  scene.add(scanRing);
  animatedObjects.push({ mesh: scanRing, kind: 'pulse', base: 1.5, amp: 0.7, speed: 0.0012, phase: Math.random() * Math.PI * 2 });
});

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
animatedObjects.push({ mesh: hubRing, kind: 'rotY', speed: 0.0018 });

// ═══════════════════════════════════════════════════════
// MEGA BACKGROUND PLANET
// ═══════════════════════════════════════════════════════
(function buildBgPlanet() {
  const grp = new THREE.Group();
  grp.position.set(-145, 72, -210);
  scene.add(grp);

  // Planet body
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(52, 56, 40),
    new THREE.MeshStandardMaterial({ color: 0x1e3a6e, emissive: 0x0a1830, emissiveIntensity: 0.3, roughness: 0.7 })
  );
  grp.add(body);
  animatedObjects.push({ mesh: body, kind: 'rotY', speed: 0.00032 });

  // Atmosphere shell
  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(56, 48, 36),
    new THREE.MeshStandardMaterial({ color: 0x3366cc, emissive: 0x1133aa, emissiveIntensity: 0.22, transparent: true, opacity: 0.22, side: THREE.BackSide })
  );
  grp.add(atmo);

  // Cloud bands
  [-14, -4, 6, 18].forEach((yOff, i) => {
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(52.5, 1.4, 2, 100),
      new THREE.MeshStandardMaterial({ color: 0x4477bb, emissive: 0x223388, emissiveIntensity: 0.35, transparent: true, opacity: 0.35 + i * 0.04 })
    );
    band.position.y = yOff;
    grp.add(band);
  });

  // Ring system
  const ringGrp = new THREE.Group();
  ringGrp.rotation.x = 0.22;
  grp.add(ringGrp);
  [
    { r: 70,  t: 4.0, o: 0.55 },
    { r: 85,  t: 5.0, o: 0.42 },
    { r: 100, t: 3.0, o: 0.28 },
    { r: 114, t: 1.8, o: 0.16 },
  ].forEach(d => {
    ringGrp.add(new THREE.Mesh(
      new THREE.TorusGeometry(d.r, d.t, 2, 130),
      new THREE.MeshStandardMaterial({ color: 0x99aabb, emissive: 0x334455, emissiveIntensity: 0.25, transparent: true, opacity: d.o, side: THREE.DoubleSide })
    ));
  });

  // Subtle ambient glow from planet
  const bgGlow = new THREE.PointLight(0x2244aa, 0.6, 350);
  grp.add(bgGlow);
})();

// ═══════════════════════════════════════════════════════
// WORLD DETAILS — asteroids, crystals, pylons, mesas
// ═══════════════════════════════════════════════════════
(function buildWorldDetails() {
  // ── Floating asteroid clusters ──
  const clusterPos = [[58,18],[-58,-18],[22,-60],[-22,60],[65,-62],[-65,62],[40,-20],[-40,20]];
  clusterPos.forEach(([cx, cz]) => {
    const count = 6 + Math.floor(Math.random() * 7);
    for (let i = 0; i < count; i++) {
      const sz = 0.35 + Math.random() * 1.1;
      const rock = new THREE.Mesh(
        new THREE.IcosahedronGeometry(sz, 0),
        new THREE.MeshStandardMaterial({ color: 0x3a4455, roughness: 0.92, metalness: 0.15 })
      );
      rock.position.set(
        cx + (Math.random() - 0.5) * 16,
        sz * 0.5 + Math.random() * 3.5,
        cz + (Math.random() - 0.5) * 16
      );
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rock.castShadow = true;
      scene.add(rock);
      if (Math.random() > 0.45) {
        animatedObjects.push({ mesh: rock, kind: 'floatRot', floatSeed: Math.random() * 10, floatAmp: 0.003, floatSpeed: 0.002 + Math.random() * 0.003, rx: (Math.random()-0.5)*0.003, ry: (Math.random()-0.5)*0.003 });
      }
    }
  });

  // ── Crystal spire clusters ──
  const crystalZones = [
    [48, 48, 0x00d4ff], [-48,-48, 0x9b59ff], [72,-28, 0x39ff14], [-72, 28, 0xff6b35],
    [30, 68, 0x00d4ff], [-30,-68, 0xff6b35],
  ];
  crystalZones.forEach(([cx, cz, col]) => {
    const C = new THREE.Color(col);
    for (let i = 0; i < 9; i++) {
      const h = 1.2 + Math.random() * 3.8;
      const r = 0.1 + Math.random() * 0.18;
      const crystal = new THREE.Mesh(
        new THREE.ConeGeometry(r, h, 5 + Math.floor(Math.random() * 2)),
        new THREE.MeshStandardMaterial({ color: C, emissive: C, emissiveIntensity: 0.5 + Math.random() * 0.6, transparent: true, opacity: 0.65 + Math.random() * 0.35 })
      );
      crystal.position.set(cx + (Math.random()-0.5)*12, h/2, cz + (Math.random()-0.5)*12);
      crystal.rotation.y = Math.random() * Math.PI;
      crystal.rotation.z = (Math.random()-0.5) * 0.18;
      scene.add(crystal);
    }
    const gLight = new THREE.PointLight(col, 3.5, 22);
    gLight.position.set(cx, 2.5, cz);
    scene.add(gLight);
    animatedObjects.push({ mesh: gLight, kind: 'pulseLight', base: 3.5, amp: 1.2, speed: 0.001 + Math.random() * 0.0005, phase: Math.random() * Math.PI * 2 });
  });

  // ── Energy pylons ──
  [[32,22],[-32,-22],[22,-42],[-22,42],[52,-12],[-52,12],[44,-52],[-44,52]].forEach(([px, pz]) => {
    // Base plate
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 0.25, 6), new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.85 }));
    base.position.set(px, 0.125, pz);
    scene.add(base);
    // Shaft
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 5, 6), new THREE.MeshStandardMaterial({ color: 0x2a3a55, roughness: 0.5, metalness: 0.5 }));
    shaft.position.set(px, 2.6, pz);
    scene.add(shaft);
    // Orb
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.24, 14, 10), new THREE.MeshStandardMaterial({ color: 0x55aaff, emissive: 0x2266ff, emissiveIntensity: 3.5 }));
    orb.position.set(px, 5.3, pz);
    scene.add(orb);
    animatedObjects.push({ mesh: orb, kind: 'pulse', base: 3.5, amp: 1.5, speed: 0.0014 + Math.random() * 0.001, phase: Math.random() * Math.PI * 2 });
    const pl = new THREE.PointLight(0x4488ff, 2.5, 14);
    pl.position.set(px, 5.5, pz);
    scene.add(pl);
    animatedObjects.push({ mesh: pl, kind: 'pulseLight', base: 2.5, amp: 1.0, speed: 0.0014, phase: Math.random() * Math.PI * 2 });
  });

  // ── Rocky mesas ──
  [[60,60,3.2],[-60,60,2.6],[60,-60,2.2],[-60,-60,3.8],[0,70,2.4],[70,0,3],[-70,0,2.8]].forEach(([mx,mz,mh]) => {
    const sides = 7 + Math.floor(Math.random() * 3);
    const mesa = new THREE.Mesh(
      new THREE.CylinderGeometry(4 + Math.random()*3, 5 + Math.random()*3, mh, sides),
      new THREE.MeshStandardMaterial({ color: 0x0c0c1e, roughness: 0.95 })
    );
    mesa.position.set(mx, mh/2, mz);
    mesa.castShadow = true;
    scene.add(mesa);
    // Glowing top cap
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 0.08, sides), new THREE.MeshStandardMaterial({ color: 0x112244, emissive: 0x1133aa, emissiveIntensity: 0.4 }));
    cap.position.set(mx, mh + 0.04, mz);
    scene.add(cap);
  });

  // ── Floating debris rings (around world edge) ──
  for (let i = 0; i < 35; i++) {
    const a = (i / 35) * Math.PI * 2;
    const r = 68 + Math.random() * 8;
    const debris = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.2 + Math.random() * 0.55, 0),
      new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.9 })
    );
    debris.position.set(Math.cos(a) * r, 0.8 + Math.random() * 2.5, Math.sin(a) * r);
    debris.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    scene.add(debris);
    animatedObjects.push({ mesh: debris, kind: 'floatRot', floatSeed: i * 0.7, floatAmp: 0.004, floatSpeed: 0.002 + Math.random() * 0.002, rx: 0.002, ry: 0.003 });
  }
})();

// ═══════════════════════════════════════════════════════
// METEOR SYSTEM
// ═══════════════════════════════════════════════════════
const activeMeteors = [];
let meteorTimer = 0;

function spawnMeteor() {
  const a = Math.random() * Math.PI * 2;
  const sx = Math.cos(a) * 175, sz = Math.sin(a) * 175;
  const sy = 58 + Math.random() * 48;
  const tx = (Math.random() - 0.5) * 70, tz = (Math.random() - 0.5) * 70, ty = -20;
  const dir = new THREE.Vector3(tx-sx, ty-sy, tz-sz).normalize();
  const speed = 1.6 + Math.random() * 1.6;
  const trailLen = 9 + Math.random() * 7;

  const g = new THREE.Group();
  g.position.set(sx, sy, sz);

  // Head
  g.add(Object.assign(new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 6, 4),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xddeeff, emissiveIntensity: 7 })
  )));

  // Trail cylinder
  const trail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.18, trailLen, 4),
    new THREE.MeshStandardMaterial({ color: 0xaaccff, emissive: 0x5577ff, emissiveIntensity: 2.5, transparent: true, opacity: 0.8 })
  );
  trail.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0), dir.clone().negate());
  trail.position.copy(dir.clone().negate().multiplyScalar(trailLen / 2));
  g.add(trail);

  const mLight = new THREE.PointLight(0x99bbff, 4, 18);
  g.add(mLight);

  scene.add(g);
  activeMeteors.push({ mesh: g, dir, speed, life: 0, maxLife: 70 + Math.floor(Math.random() * 50) });
}

function updateMeteors() {
  meteorTimer++;
  if (meteorTimer > 90 + Math.random() * 150) { spawnMeteor(); meteorTimer = 0; }

  for (let i = activeMeteors.length - 1; i >= 0; i--) {
    const m = activeMeteors[i];
    m.life++;
    m.mesh.position.addScaledVector(m.dir, m.speed);
    const fadeStart = m.maxLife * 0.65;
    if (m.life > fadeStart) {
      const fade = 1 - (m.life - fadeStart) / (m.maxLife - fadeStart);
      m.mesh.children.forEach(c => { if (c.material) { c.material.opacity = fade; c.material.emissiveIntensity *= 0.995; } });
    }
    if (m.life >= m.maxLife) { scene.remove(m.mesh); activeMeteors.splice(i, 1); }
  }
}

// ═══════════════════════════════════════════════════════
// CONTROLS
// ═══════════════════════════════════════════════════════
const keys = new Set();
window.addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
window.addEventListener('keyup',   e => keys.delete(e.key.toLowerCase()));

// Mouse camera look
let mouseX = 0, mouseY = 0, camMouseX = 0, camMouseY = 0;
window.addEventListener('mousemove', e => {
  mouseX = (e.clientX / innerWidth)  * 2 - 1;
  mouseY = (e.clientY / innerHeight) * 2 - 1;
});

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
const fwdVec = new THREE.Vector3();
const SPEED = 0.030, TURN = 0.014, DAMP = 0.91, BOUND = 78;

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
    <div class="sec-rule"></div>
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
    <div class="sec-rule"></div>
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
    <div class="sec-rule"></div>
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
    <div class="sec-rule"></div>
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
  // Smoothly track mouse — slow lag makes it feel weighty
  camMouseX += (mouseX - camMouseX) * 0.028;
  camMouseY += (mouseY - camMouseY) * 0.028;

  const dist = 13;
  // Mouse X orbits the camera around the ship (yaw offset)
  const camAngle = angle + camMouseX * 0.55;
  // Mouse Y raises/lowers the camera height
  const camH = 7.5 + camMouseY * 3.5;

  camTarget.set(
    ship.position.x - Math.sin(camAngle) * dist,
    ship.position.y + camH,
    ship.position.z - Math.cos(camAngle) * dist
  );
  camera.position.lerp(camTarget, 0.042);

  // Always look at the ship, with slight vertical tilt from mouse
  camLook.set(
    ship.position.x,
    ship.position.y + 0.5 - camMouseY * 1.8,
    ship.position.z
  );
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

  fwdVec.set(Math.sin(angle), 0, Math.cos(angle));
  if (fwd)  vel.addScaledVector(fwdVec,  SPEED);
  if (back) vel.addScaledVector(fwdVec, -SPEED * 0.5);

  vel.multiplyScalar(DAMP);

  // Soft boundary bounce
  if (Math.abs(ship.position.x) > BOUND) vel.x -= Math.sign(ship.position.x) * 0.2;
  if (Math.abs(ship.position.z) > BOUND) vel.z -= Math.sign(ship.position.z) * 0.2;

  ship.position.add(vel);
  ship.position.y = 0.68 + Math.sin(t * 0.0009) * 0.07;

  detectZone();
}

function animateObjects(t) {
  for (const o of animatedObjects) {
    const m = o.mesh;
    if (o.kind === 'pulse') {
      m.material.emissiveIntensity = o.base + Math.sin(t * o.speed + o.phase) * o.amp;
    } else if (o.kind === 'pulseOpacity') {
      m.material.opacity = o.base + Math.sin(t * o.speed + o.phase) * o.amp;
    } else if (o.kind === 'pulseLight') {
      m.intensity = o.base + Math.sin(t * o.speed + o.phase) * o.amp;
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
    l.intensity = 4.5 + Math.sin(t * 0.0008 + i * 1.3) * 0.5;
  });

  // Stars slow drift
  stars.rotation.y += 0.000018;
}

// ═══════════════════════════════════════════════════════
// RENDER LOOP
// ═══════════════════════════════════════════════════════
let scrollMode = false;
let cinematicAngle = Math.PI * 0.85;
const CINEMATIC_RADIUS = 22, CINEMATIC_HEIGHT = 14;

function cinematicCamera() {
  cinematicAngle += 0.00022;
  const cx = Math.sin(cinematicAngle) * CINEMATIC_RADIUS;
  const cz = Math.cos(cinematicAngle) * CINEMATIC_RADIUS;
  camera.position.lerp(new THREE.Vector3(cx, CINEMATIC_HEIGHT, cz), 0.018);
  camera.lookAt(new THREE.Vector3(0, 3, 0));
}

function loop(t) {
  requestAnimationFrame(loop);
  if (scrollMode) {
    cinematicCamera();
  } else {
    updateShip(t);
    updateCamera();
    drawMinimap();
  }
  animateObjects(t);
  updateMeteors();
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
  pct += Math.random() * 8;
  fillEl.style.width = Math.min(pct, 100) + '%';
  if (pct < 100) {
    setTimeout(tick, 160 + Math.random() * 200);
  } else {
    setTimeout(() => {
      loadingEl.classList.add('fade-out');
      setTimeout(() => loadingEl.remove(), 1100);
    }, 600);
  }
}

// Render immediately behind the loading screen so shaders compile before reveal
requestAnimationFrame(loop);
tick();

// ═══════════════════════════════════════════════════════
// SCROLL PAGE — TRANSMISSION MODE
// ═══════════════════════════════════════════════════════

function buildScrollPage() {
  const page = document.getElementById('scroll-page');

  page.innerHTML = `
    <!-- Hero -->
    <section class="sp-hero">
      <div class="hero-signal">INCOMING TRANSMISSION</div>
      <h1 class="hero-name">${DATA.name.toUpperCase()}</h1>
      <div class="hero-role">${DATA.role}</div>
      <p class="hero-desc">${DATA.bio}</p>
      <div class="hero-coords">
        <div class="hero-coord-item">
          <span class="hero-coord-label">Sector</span>
          <span class="hero-coord-val">ALPHA-7</span>
        </div>
        <div class="hero-coord-item">
          <span class="hero-coord-label">Status</span>
          <span class="hero-coord-val">ONLINE</span>
        </div>
        <div class="hero-coord-item">
          <span class="hero-coord-label">Signal</span>
          <span class="hero-coord-val">100%</span>
        </div>
      </div>
      <div class="hero-scroll-hint">SCROLL TO EXPLORE</div>
    </section>

    <!-- About -->
    <section class="sp-section">
      <div class="sp-inner">
        <div class="sp-zone-badge">◈ SECTOR 01 · 00°N 35°W · ICE PLANET</div>
        <div class="sp-panel" data-zone="about">
          <div class="sec-eyebrow">Hello, world</div>
          <div class="sec-title">About Me</div>
          <div class="sec-rule" style="color:#00d4ff"></div>
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
          </div>
        </div>
      </div>
    </section>

    <div class="sp-divider"><div class="sp-divider-line"></div><div class="sp-divider-dot"></div><div class="sp-divider-line"></div></div>

    <!-- Projects -->
    <section class="sp-section">
      <div class="sp-inner">
        <div class="sp-zone-badge">◈ SECTOR 02 · 35°N 00°E · GAS GIANT</div>
        <div class="sp-panel" data-zone="projects">
          <div class="sec-eyebrow">My Work</div>
          <div class="sec-title">Projects</div>
          <div class="sec-rule" style="color:#9b59ff"></div>
          <div class="projects-grid">
            ${DATA.projects.map(p => `
              <div class="proj-card">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="tag-row">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                <a class="proj-link" href="${p.link}" target="_blank">View →</a>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <div class="sp-divider"><div class="sp-divider-line"></div><div class="sp-divider-dot"></div><div class="sp-divider-line"></div></div>

    <!-- Resume -->
    <section class="sp-section">
      <div class="sp-inner">
        <div class="sp-zone-badge">◈ SECTOR 03 · 35°S 00°W · STELLAR CORE</div>
        <div class="sp-panel" data-zone="resume">
          <div class="sec-eyebrow">Background</div>
          <div class="sec-title">Resume</div>
          <div class="sec-rule" style="color:#39ff14"></div>
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
          </div>
        </div>
      </div>
    </section>

    <div class="sp-divider"><div class="sp-divider-line"></div><div class="sp-divider-dot"></div><div class="sp-divider-line"></div></div>

    <!-- Contact -->
    <section class="sp-section">
      <div class="sp-inner">
        <div class="sp-zone-badge">◈ SECTOR 04 · 00°S 35°E · EVENT HORIZON</div>
        <div class="sp-panel" data-zone="contact">
          <div class="sec-eyebrow">Let's Talk</div>
          <div class="sec-title">Contact</div>
          <div class="sec-rule" style="color:#ff6b35"></div>
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
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="sp-footer">
      <div class="sp-footer-name">Eugene · Portfolio</div>
      <div class="sp-footer-coords">α 04h 35m · δ +16° 30′ · DIST 412 ly</div>
      <button class="sp-return-btn" id="sp-return-btn">◈ RETURN TO SHIP</button>
    </footer>
  `;

  // Intersection observer for panel reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Trigger skill bars when resume panel appears
        if (entry.target.dataset.zone === 'resume') {
          setTimeout(() => {
            entry.target.querySelectorAll('.skill-fill').forEach(el => {
              el.style.width = el.dataset.pct + '%';
            });
          }, 150);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  page.querySelectorAll('.sp-panel').forEach(el => observer.observe(el));

  document.getElementById('sp-return-btn').addEventListener('click', () => setScrollMode(false));
}

function setScrollMode(on) {
  scrollMode = on;
  const page    = document.getElementById('scroll-page');
  const toggle  = document.getElementById('mode-toggle');
  const hud     = document.getElementById('hud');
  const hudEls  = ['name-tag', 'minimap-wrap', 'zone-prompt', 'controls-bar'];

  if (on) {
    page.classList.add('open');
    page.scrollTop = 0;
    toggle.classList.add('active');
    toggle.querySelector('.mt-text').textContent = 'RETURN';
    hudEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.opacity = '0'; });
    ship.visible = false;
    closeModal();
  } else {
    page.classList.remove('open');
    toggle.classList.remove('active');
    toggle.querySelector('.mt-text').textContent = 'TRANSMISSION';
    hudEls.forEach(id => { const el = document.getElementById(id); if (el) el.style.opacity = ''; });
    ship.visible = true;
  }
}

buildScrollPage();

document.getElementById('mode-toggle').addEventListener('click', () => setScrollMode(!scrollMode));

