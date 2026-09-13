// High-fidelity synthesized Airport Sound Engine using Web Audio API
// No external mp3/wav files required - 100% instant, reliable, zero load failures.

class AirportSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.cabinDroneNode = null;
    this.cabinDroneGain = null;
    this.takeoffNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.cabinDroneGain) {
        this.cabinDroneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
    }
    return !this.isMuted;
  }

  setMuted(muted) {
    this.init();
    this.isMuted = muted;
    if (this.isMuted && this.cabinDroneGain) {
      this.cabinDroneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }
  }

  // Classic Airport Two-Tone Chime (Ding-Dong: F4 -> A4)
  playChime() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const tones = [
      { freq: 392.00, start: 0, dur: 0.8 }, // G4
      { freq: 523.25, start: 0.35, dur: 1.2 } // C5
    ];

    tones.forEach(t => {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(t.freq, now + t.start);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(t.freq * 2, now + t.start);

      gain.gain.setValueAtTime(0, now + t.start);
      gain.gain.linearRampToValueAtTime(0.18, now + t.start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t.start + t.dur);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now + t.start);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(filter);
      filter.connect(this.ctx.destination);

      osc.start(now + t.start);
      osc.stop(now + t.start + t.dur);
      osc2.start(now + t.start);
      osc2.stop(now + t.start + t.dur);
    });
  }

  // Mechanical Split-Flap board clicking sound
  playFlapClick() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.015;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600 + Math.random() * 400, now);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Security Scanner sweep and approval chord
  playScannerBeep() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.25);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playAccessGranted() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);

      gain.gain.setValueAtTime(0.12, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.6);
    });
  }

  // Boarding Pass mechanical printer sound
  playPrinterSound() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = 1.6;
    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const t = i / this.ctx.sampleRate;
      const step = Math.sin(t * 120) > 0 ? 1 : -1;
      data[i] = (Math.random() * 0.4 + step * 0.15) * 0.2;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.linearRampToValueAtTime(1400, now + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.08, now + dur - 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Atmospheric jet cabin rumble (luxurious low-frequency cabin ambient)
  startCabinDrone() {
    if (this.cabinDroneGain) return;
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);

    // Low sub tone for jet engine rumble
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(58, now);

    this.cabinDroneGain = this.ctx.createGain();
    this.cabinDroneGain.gain.setValueAtTime(0.0001, now);
    const targetGain = this.isMuted ? 0 : 0.08;
    this.cabinDroneGain.gain.linearRampToValueAtTime(targetGain, now + 2.0);

    whiteNoise.connect(filter);
    filter.connect(this.cabinDroneGain);
    subOsc.connect(this.cabinDroneGain);
    this.cabinDroneGain.connect(this.ctx.destination);

    whiteNoise.start(now);
    subOsc.start(now);
  }

  // Dramatic Takeoff Thrust spool-up
  playTakeoffThrust() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const dur = 4.5;

    const bufferSize = this.ctx.sampleRate * dur;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(120, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 3.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 2.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Button hover / UI micro-feedback
  playHover() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  // Button click confirmation
  playClick() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(659.25, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Finale harp / romantic celestial chime
  playFinaleCelebration() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const chord = [392, 493.88, 587.33, 783.99, 987.77, 1174.66]; // Gmaj9
    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);

      gain.gain.setValueAtTime(0.08, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 1.8);
    });
  }
}

export const sound = new AirportSoundEngine();
