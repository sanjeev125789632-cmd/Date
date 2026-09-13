// High-performance canvas effects for runway lights, fog, cabin window & takeoff

export class CanvasFx {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mode = 'runway'; // 'runway' | 'aircraft' | 'cabin' | 'takeoff' | 'finale'
    this.animId = null;
    this.time = 0;
    this.mouse = { x: this.width / 2, y: this.height / 2, tx: this.width / 2, ty: this.height / 2 };

    // Stars & Fog
    this.stars = [];
    this.fogParticles = [];
    this.takeoffStreaks = [];
    this.clouds = [];

    this.initEntities();
    this.resize();

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.tx = e.clientX;
      this.mouse.ty = e.clientY;
    });

    this.loop = this.loop.bind(this);
    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  initEntities() {
    // 120 ambient stars
    this.stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2
    }));

    // Low ground fog
    this.fogParticles = Array.from({ length: 30 }, () => ({
      x: Math.random() * this.width,
      y: this.height * 0.6 + Math.random() * (this.height * 0.4),
      radius: Math.random() * 150 + 100,
      alpha: Math.random() * 0.06 + 0.02,
      vx: (Math.random() - 0.5) * 0.3
    }));

    // Takeoff speed streaks
    this.takeoffStreaks = Array.from({ length: 60 }, () => ({
      x: (Math.random() - 0.5) * this.width * 2,
      y: (Math.random() - 0.5) * this.height * 2,
      z: Math.random() * 1000 + 100,
      len: Math.random() * 80 + 30
    }));

    // Soft stylized clouds
    this.clouds = Array.from({ length: 18 }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * (this.height * 0.7),
      width: Math.random() * 300 + 200,
      height: Math.random() * 100 + 60,
      speed: Math.random() * 0.4 + 0.2,
      alpha: Math.random() * 0.12 + 0.04
    }));
  }

  setMode(mode) {
    this.mode = mode;
  }

  start() {
    if (!this.animId) {
      this.animId = requestAnimationFrame(this.loop);
    }
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  loop() {
    this.time += 0.016;
    // Smooth mouse lerp
    this.mouse.x += (this.mouse.tx - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.ty - this.mouse.y) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    switch (this.mode) {
      case 'runway':
        this.renderRunway();
        break;
      case 'aircraft':
        this.renderAircraftAtmosphere();
        break;
      case 'corridor':
        this.renderCorridor();
        break;
      case 'cabin':
        this.renderCabinWindow();
        break;
      case 'takeoff':
        this.renderTakeoff();
        break;
      case 'finale':
        this.renderFinale();
        break;
      default:
        this.renderRunway();
    }

    this.animId = requestAnimationFrame(this.loop);
  }

  renderRunway() {
    const cx = this.width / 2 + (this.mouse.x - this.width / 2) * 0.04;
    const cy = this.height * 0.48;

    // Horizon subtle glow
    const hGrad = this.ctx.createRadialGradient(cx, cy + 80, 20, cx, cy + 80, this.width * 0.6);
    hGrad.addColorStop(0, 'rgba(16, 42, 56, 0.4)');
    hGrad.addColorStop(1, 'rgba(7, 21, 29, 0)');
    this.ctx.fillStyle = hGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Stars in night sky
    this.stars.forEach(s => {
      const a = s.alpha * (0.6 + 0.4 * Math.sin(this.time * 2 + s.phase));
      this.ctx.fillStyle = `rgba(247, 247, 245, ${a})`;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y * 0.6, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Converging Runway Lights
    const numLights = 24;
    for (let i = 0; i < numLights; i++) {
      const progress = (i / numLights + (this.time * 0.08) % (1 / numLights));
      const pExp = Math.pow(progress, 2.4); // perspective distortion
      const y = cy + pExp * (this.height - cy);
      const spread = (this.width * 0.4) * pExp;

      const size = Math.max(1, pExp * 4.5);
      const glow = Math.max(2, pExp * 16);
      const alpha = Math.min(1, pExp * 1.2);

      // Left runway edge light (Cyan)
      this.drawGlowLight(cx - spread, y, size, glow, `rgba(0, 229, 255, ${alpha})`, `rgba(0, 229, 255, ${alpha * 0.25})`);
      // Right runway edge light (Cyan)
      this.drawGlowLight(cx + spread, y, size, glow, `rgba(0, 229, 255, ${alpha})`, `rgba(0, 229, 255, ${alpha * 0.25})`);

      // Centerline dashed lights (Amber/Gold)
      if (i % 2 === 0) {
        this.drawGlowLight(cx, y, size * 0.8, glow * 0.7, `rgba(255, 184, 48, ${alpha})`, `rgba(255, 184, 48, ${alpha * 0.2})`);
      }
    }

    // Airport Beacon tower light (pulsing red/amber in far distance)
    const beaconAlpha = 0.5 + 0.5 * Math.sin(this.time * 4);
    this.drawGlowLight(cx + this.width * 0.22, cy - 10, 3, 22, `rgba(225, 10, 59, ${beaconAlpha})`, `rgba(225, 10, 59, ${beaconAlpha * 0.4})`);

    // Ground fog
    this.renderFog();
  }

  renderAircraftAtmosphere() {
    const cx = this.width / 2;
    const cy = this.height * 0.55;

    // Soft overhead hangar/runway spotlight
    const grad = this.ctx.createRadialGradient(cx, cy - 80, 40, cx, cy, this.width * 0.5);
    grad.addColorStop(0, 'rgba(30, 58, 76, 0.35)');
    grad.addColorStop(0.6, 'rgba(10, 29, 39, 0.2)');
    grad.addColorStop(1, 'rgba(7, 21, 29, 0)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Subtle runway guide lights along the ground
    const groundY = this.height * 0.88;
    const count = 12;
    for (let i = 0; i <= count; i++) {
      const lx = (this.width / count) * i;
      const pulse = 0.6 + 0.4 * Math.sin(this.time * 1.5 + i * 0.5);
      const isRed = (i % 3 === 0);
      const color = isRed ? `rgba(225, 10, 59, ${pulse * 0.8})` : `rgba(0, 229, 255, ${pulse * 0.7})`;
      const glow = isRed ? `rgba(225, 10, 59, ${pulse * 0.2})` : `rgba(0, 229, 255, ${pulse * 0.2})`;
      this.drawGlowLight(lx, groundY, 3, 16, color, glow);
    }

    // Light sheen sweep line across ground
    const sweepX = (Math.sin(this.time * 0.6) * 0.5 + 0.5) * this.width;
    const sweepGrad = this.ctx.createLinearGradient(sweepX - 100, 0, sweepX + 100, 0);
    sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sweepGrad.addColorStop(0.5, 'rgba(247, 247, 245, 0.05)');
    sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.ctx.fillStyle = sweepGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.renderFog();
  }

  renderCorridor() {
    // Parallax jet bridge perspective lines
    const cx = this.width / 2;
    const cy = this.height / 2;

    this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.15)';
    this.ctx.lineWidth = 1;

    // Perspective corridor ribs moving forward
    const numRibs = 8;
    for (let i = 0; i < numRibs; i++) {
      const p = (i / numRibs + (this.time * 0.3) % (1 / numRibs));
      const w = this.width * p;
      const h = this.height * p;
      this.ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
    }

    // Warm runway glow visible outside corridor windows
    const grad = this.ctx.createLinearGradient(0, this.height, 0, this.height * 0.4);
    grad.addColorStop(0, 'rgba(255, 184, 48, 0.12)');
    grad.addColorStop(1, 'rgba(7, 21, 29, 0)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  renderCabinWindow() {
    // Luxury aircraft window: Sunset transitioning to twilight stars
    // Sky background gradient: Deep navy to warm rose-amber horizon
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, '#07151D');
    skyGrad.addColorStop(0.45, '#172738');
    skyGrad.addColorStop(0.72, '#4A1E2F');
    skyGrad.addColorStop(0.88, '#C5002E');
    skyGrad.addColorStop(1.0, '#E5A93C');
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Stars appearing in upper sky
    this.stars.forEach(s => {
      if (s.y < this.height * 0.5) {
        const a = s.alpha * (0.5 + 0.5 * Math.sin(this.time * 2 + s.phase));
        this.ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    // Drifting clouds beneath window
    this.clouds.forEach(c => {
      c.x -= c.speed * 0.8;
      if (c.x + c.width < 0) c.x = this.width + c.width;

      const grad = this.ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.width / 2);
      grad.addColorStop(0, `rgba(242, 181, 195, ${c.alpha * 1.5})`);
      grad.addColorStop(0.6, `rgba(201, 208, 212, ${c.alpha})`);
      grad.addColorStop(1, 'rgba(10, 29, 39, 0)');
      this.ctx.fillStyle = grad;

      this.ctx.beginPath();
      this.ctx.ellipse(c.x, c.y, c.width / 2, c.height / 2, 0, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  renderTakeoff() {
    const cx = this.width / 2;
    const cy = this.height / 2;

    // Dark high-speed flight tunnel
    this.ctx.fillStyle = '#07151D';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Accelerating light streaks rushing toward viewer
    this.takeoffStreaks.forEach(s => {
      s.z -= 28; // high speed
      if (s.z <= 10) {
        s.z = 1000;
        s.x = (Math.random() - 0.5) * this.width * 2;
        s.y = (Math.random() - 0.5) * this.height * 2;
      }

      const k = 400 / s.z;
      const px = cx + s.x * k;
      const py = cy + s.y * k;

      const prevK = 400 / (s.z + s.len);
      const prevX = cx + s.x * prevK;
      const prevY = cy + s.y * prevK;

      const alpha = Math.min(1, (1000 - s.z) / 400);

      this.ctx.beginPath();
      this.ctx.moveTo(prevX, prevY);
      this.ctx.lineTo(px, py);
      this.ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.7})`;
      this.ctx.lineWidth = Math.max(1, k * 2.5);
      this.ctx.stroke();
    });

    // Runway flash pulses
    const flash = Math.sin(this.time * 18);
    if (flash > 0.85) {
      this.ctx.fillStyle = 'rgba(255, 184, 48, 0.08)';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  renderFinale() {
    // Serene night sky above clouds
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    skyGrad.addColorStop(0, '#040C12');
    skyGrad.addColorStop(0.5, '#07151D');
    skyGrad.addColorStop(0.85, '#0E2330');
    skyGrad.addColorStop(1, '#1A394B');
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Brilliant sparkling stars & constellations
    this.stars.forEach(s => {
      const a = s.alpha * (0.4 + 0.6 * Math.sin(this.time * 1.8 + s.phase));
      this.ctx.fillStyle = `rgba(247, 247, 245, ${a})`;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius * 1.1, 0, Math.PI * 2);
      this.ctx.fill();

      // Occasional star cross-glimmer
      if (s.radius > 1.4) {
        this.ctx.strokeStyle = `rgba(242, 181, 195, ${a * 0.6})`;
        this.ctx.lineWidth = 0.6;
        this.ctx.beginPath();
        this.ctx.moveTo(s.x - 6, s.y);
        this.ctx.lineTo(s.x + 6, s.y);
        this.ctx.moveTo(s.x, s.y - 6);
        this.ctx.lineTo(s.x, s.y + 6);
        this.ctx.stroke();
      }
    });

    // Cloud deck at the bottom
    const cloudTop = this.height * 0.75;
    const cGrad = this.ctx.createLinearGradient(0, cloudTop, 0, this.height);
    cGrad.addColorStop(0, 'rgba(201, 208, 212, 0.15)');
    cGrad.addColorStop(0.4, 'rgba(242, 181, 195, 0.12)');
    cGrad.addColorStop(1, 'rgba(10, 29, 39, 0.8)');
    this.ctx.fillStyle = cGrad;
    this.ctx.fillRect(0, cloudTop, this.width, this.height - cloudTop);

    // Gentle floating stardust sparks
    for (let i = 0; i < 15; i++) {
      const sparkX = ((this.width * 0.07 * i + this.time * 20) % this.width);
      const sparkY = this.height * 0.4 + Math.sin(this.time + i) * 60;
      const sparkA = 0.3 + 0.3 * Math.sin(this.time * 3 + i);
      this.drawGlowLight(sparkX, sparkY, 1.5, 10, `rgba(242, 181, 195, ${sparkA})`, `rgba(225, 10, 59, ${sparkA * 0.3})`);
    }
  }

  renderFog() {
    this.fogParticles.forEach(p => {
      p.x += p.vx;
      if (p.x < -p.radius) p.x = this.width + p.radius;
      if (p.x > this.width + p.radius) p.x = -p.radius;

      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
      grad.addColorStop(0, `rgba(201, 208, 212, ${p.alpha})`);
      grad.addColorStop(1, 'rgba(7, 21, 29, 0)');
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawGlowLight(x, y, radius, glowRadius, coreColor, glowColor) {
    const g = this.ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
    g.addColorStop(0, coreColor);
    g.addColorStop(0.3, glowColor);
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = g;
    this.ctx.beginPath();
    this.ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = coreColor;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
