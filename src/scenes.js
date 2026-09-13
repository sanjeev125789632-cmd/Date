import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { sound } from './audio.js';

export class SceneController {
  constructor(canvasFx) {
    this.canvasFx = canvasFx;
    this.currentScene = 1;
    this.totalScenes = 10;
    this.isTransitioning = false;

    this.navItems = document.querySelectorAll('.nav-item');
    this.initElements();
    this.initMicroInteractions();
  }

  initElements() {
    // Scene 01 Elements
    this.prologueMsg = document.getElementById('prologue-msg');
    this.btnEnterAirport = document.getElementById('btn-enter-airport');

    // Scene 02 Elements
    this.btnSecurityYes = document.getElementById('btn-security-yes');
    this.btnSecurityNo = document.getElementById('btn-security-no');
    this.typewriterTarget = document.getElementById('typewriter-target');
    this.scannerLaser = document.getElementById('scanner-laser');
    this.scanTelemetry = document.getElementById('scan-telemetry');
    this.clearanceStatusText = document.getElementById('clearance-status-text');

    // Scene 03 Elements
    this.btnCheckinYes = document.getElementById('btn-checkin-yes');
    this.btnCheckinMaybe = document.getElementById('btn-checkin-maybe');
    this.maybeFeedbackMsg = document.getElementById('maybe-feedback-msg');
    this.boardLiveClock = document.getElementById('board-live-clock');

    // Scene 04 Elements
    this.btnBoardNow = document.getElementById('btn-board-now');
    this.boardingPassCard = document.getElementById('boarding-pass-card');

    // Scene 06 Elements
    this.btnAircraftYes = document.getElementById('btn-aircraft-yes');
    this.btnAircraftNotYet = document.getElementById('btn-aircraft-notyet');
    this.aircraftNotYetMsg = document.getElementById('aircraft-notyet-msg');
    this.aircraftHeroImg = document.getElementById('aircraft-hero-img');
    this.doorTarget = document.getElementById('door-target');

    // Scene 07 Elements
    this.portalOverlay = document.getElementById('portal-overlay');

    // Scene 08 Elements
    this.btnCabinYes = document.getElementById('btn-cabin-yes');

    // Scene 09 Elements
    this.hudAltitude = document.getElementById('hud-altitude');
    this.hudAirspeed = document.getElementById('hud-airspeed');
    this.hudHeartrate = document.getElementById('hud-heartrate');

    // Scene 10 Elements
    this.btnFinaleCta = document.getElementById('btn-finale-cta');
    this.souvenirModal = document.getElementById('souvenir-modal');
    this.btnModalClose = document.getElementById('btn-modal-close');
    this.btnModalDone = document.getElementById('btn-modal-done');

    // Live departure board clock
    this.startClock();
  }

  startClock() {
    const updateTime = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      if (this.boardLiveClock) {
        this.boardLiveClock.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} LOCAL`;
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  initMicroInteractions() {
    // Prologue fade-in on start
    if (this.prologueMsg) {
      gsap.to(this.prologueMsg, {
        opacity: 1,
        duration: 1.5,
        delay: 0.4,
        yoyo: true,
        repeat: 1,
        repeatDelay: 2
      });
    }

    // Hover audio on all buttons
    document.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('mouseenter', () => sound.playHover());
    });

    // Scene 01: Enter Airport
    if (this.btnEnterAirport) {
      this.btnEnterAirport.addEventListener('click', () => {
        sound.playClick();
        sound.playChime();
        this.goToScene(2);
      });
    }

    // Scene 02: Evasive NO button
    if (this.btnSecurityNo) {
      const noPhrases = [
        "Are you sure?",
        "Wrong gate 😌",
        "Try again",
        "There's only one valid option",
        "Our flight is waiting! ✈️"
      ];
      let phraseIdx = 0;

      const evade = () => {
        sound.playHover();
        const offsetX = (Math.random() - 0.5) * 120;
        const offsetY = (Math.random() - 0.5) * 60;
        gsap.to(this.btnSecurityNo, {
          x: offsetX,
          y: offsetY,
          duration: 0.3,
          ease: "power2.out"
        });
        phraseIdx = (phraseIdx + 1) % noPhrases.length;
        this.btnSecurityNo.querySelector('span').textContent = noPhrases[phraseIdx];
      };

      this.btnSecurityNo.addEventListener('mouseenter', evade);
      this.btnSecurityNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        evade();
      }, { passive: false });

      this.btnSecurityNo.addEventListener('click', () => {
        evade();
      });
    }

    // Scene 02: YES -> Security Scanner
    if (this.btnSecurityYes) {
      this.btnSecurityYes.addEventListener('click', () => {
        this.runSecurityScan();
      });
    }

    // Scene 03: Split Flap MAYBE & YES
    if (this.btnCheckinMaybe) {
      this.btnCheckinMaybe.addEventListener('click', () => {
        sound.playClick();
        if (this.maybeFeedbackMsg) {
          this.maybeFeedbackMsg.textContent = "Checking alternate flights...";
          gsap.fromTo(this.maybeFeedbackMsg, { opacity: 0 }, { opacity: 1, duration: 0.3 });
          setTimeout(() => {
            this.maybeFeedbackMsg.textContent = "No better flights found. Only one perfect connection.";
            sound.playChime();
            gsap.fromTo(this.btnCheckinYes, { scale: 1 }, { scale: 1.12, duration: 0.4, yoyo: true, repeat: 2 });
          }, 1200);
        }
      });
    }

    if (this.btnCheckinYes) {
      this.btnCheckinYes.addEventListener('click', () => {
        sound.playClick();
        sound.playChime();
        this.goToScene(4);
      });
    }

    // Scene 04: Boarding Pass 3D Tilt & Boarding Button
    if (this.boardingPassCard) {
      const card = this.boardingPassCard;
      window.addEventListener('mousemove', (e) => {
        if (this.currentScene !== 4) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (window.innerWidth / 2);
        const dy = (e.clientY - cy) / (window.innerHeight / 2);
        gsap.to(card, {
          rotateY: dx * 8,
          rotateX: -dy * 8,
          duration: 0.4,
          ease: "power1.out"
        });
      });
    }

    if (this.btnBoardNow) {
      this.btnBoardNow.addEventListener('click', () => {
        sound.playClick();
        sound.playChime();
        this.goToScene(5);
      });
    }

    // Scene 06: Aircraft Reveal Buttons
    if (this.btnAircraftNotYet) {
      this.btnAircraftNotYet.addEventListener('click', () => {
        sound.playClick();
        if (this.aircraftNotYetMsg) {
          this.aircraftNotYetMsg.textContent = "The captain says we can't depart without you ✈️";
          gsap.fromTo(this.aircraftNotYetMsg, { opacity: 0 }, { opacity: 1, duration: 0.3 });
          gsap.fromTo(this.btnAircraftYes, { scale: 1 }, { scale: 1.08, duration: 0.35, yoyo: true, repeat: 2 });
        }
      });
    }

    if (this.btnAircraftYes) {
      this.btnAircraftYes.addEventListener('click', () => {
        sound.playClick();
        this.enterAircraftDoorTransition();
      });
    }

    // Scene 08: Cabin YES ❤️
    if (this.btnCabinYes) {
      this.btnCabinYes.addEventListener('click', () => {
        sound.playClick();
        sound.playChime();
        this.goToScene(9);
      });
    }

    // Scene 10: Finale CTA & Modal
    if (this.btnFinaleCta) {
      this.btnFinaleCta.addEventListener('click', () => {
        sound.playClick();
        sound.playFinaleCelebration();
        this.triggerRomanticConfetti();
        if (this.souvenirModal) {
          this.souvenirModal.classList.add('open');
        }
      });
    }

    if (this.btnModalClose) {
      this.btnModalClose.addEventListener('click', () => {
        sound.playClick();
        if (this.souvenirModal) this.souvenirModal.classList.remove('open');
      });
    }

    if (this.btnModalDone) {
      this.btnModalDone.addEventListener('click', () => {
        sound.playClick();
        sound.playFinaleCelebration();
        this.triggerRomanticConfetti();
        if (this.souvenirModal) this.souvenirModal.classList.remove('open');
      });
    }
  }

  // Scene 02: Run Security Scanner
  runSecurityScan() {
    sound.playClick();
    sound.playScannerBeep();

    if (this.clearanceStatusText) {
      this.clearanceStatusText.textContent = "BIOMETRIC SCANNING...";
      this.clearanceStatusText.style.color = "var(--cyan-runway)";
    }

    if (this.scannerLaser) {
      this.scannerLaser.style.display = 'block';
      gsap.fromTo(this.scannerLaser, 
        { top: '0%', opacity: 1 }, 
        { top: '100%', opacity: 1, duration: 1.2, ease: "power1.inOut" }
      );
    }

    if (this.scanTelemetry) {
      this.scanTelemetry.style.display = 'block';
      gsap.fromTo(this.scanTelemetry, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.6 });
    }

    setTimeout(() => {
      sound.playAccessGranted();
      if (this.clearanceStatusText) {
        this.clearanceStatusText.textContent = "CLEARANCE: APPROVED";
        this.clearanceStatusText.style.color = "var(--emerald-clearance)";
      }
      setTimeout(() => {
        this.goToScene(3);
      }, 1400);
    }, 1400);
  }

  // Typewriter effect for Scene 02
  startTypewriter() {
    if (!this.typewriterTarget) return;
    const text = "A date with me.";
    this.typewriterTarget.textContent = "";
    let i = 0;
    const type = () => {
      if (i < text.length) {
        this.typewriterTarget.textContent += text.charAt(i);
        i++;
        sound.playHover();
        setTimeout(type, 85);
      }
    };
    setTimeout(type, 400);
  }

  // Scene 03: Split Flap Board Animator
  setupSplitFlapBoard() {
    const flapData = {
      flight: "DT-1402",
      destination: "DATE",
      status: "ON TIME",
      gate: "♡01",
      passenger: "YOU"
    };

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789♡- ";

    Object.keys(flapData).forEach(key => {
      const container = document.querySelector(`[data-flap="${key}"]`);
      if (!container) return;
      container.innerHTML = "";
      const targetStr = flapData[key];

      for (let i = 0; i < targetStr.length; i++) {
        const charBox = document.createElement('div');
        charBox.className = 'flap-char';
        charBox.textContent = ' ';
        container.appendChild(charBox);

        const targetChar = targetStr[i];
        let currentStep = 0;
        const totalSteps = 6 + i * 2;

        const flipInterval = setInterval(() => {
          currentStep++;
          if (currentStep >= totalSteps) {
            charBox.textContent = targetChar;
            charBox.classList.remove('flipping');
            clearInterval(flipInterval);
          } else {
            const randChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            charBox.textContent = randChar;
            charBox.classList.add('flipping');
            sound.playFlapClick();
          }
        }, 60);
      }
    });
  }

  // Scene 04: Boarding Pass Print Animation
  animateBoardingPassPrint() {
    sound.playPrinterSound();
    if (this.boardingPassCard) {
      gsap.fromTo(this.boardingPassCard, 
        { y: -180, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" }
      );
    }
  }

  // Scene 05: Gate PA announcement & transition
  animateGateAnnouncement() {
    sound.playChime();
    this.canvasFx.setMode('corridor');

    // Smoothly progress after reading announcement
    setTimeout(() => {
      if (this.currentScene === 5) {
        this.goToScene(6);
      }
    }, 4500);
  }

  // Scene 06: Aircraft Reveal
  animateAircraftReveal() {
    this.canvasFx.setMode('aircraft');
    if (this.aircraftHeroImg) {
      gsap.fromTo(this.aircraftHeroImg,
        { opacity: 0, scale: 0.92, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.8, ease: "power2.out" }
      );
    }
  }

  // Scene 07: Seamless Zoom toward Aircraft Door
  enterAircraftDoorTransition() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    sound.playClick();
    sound.playChime();

    if (this.aircraftHeroImg) {
      // Zoom right into the aircraft forward entry door (Door L1)
      gsap.to(this.aircraftHeroImg, {
        scale: 4.8,
        transformOrigin: "31% 55%",
        filter: "blur(8px)",
        duration: 1.6,
        ease: "power2.in"
      });
    }

    if (this.portalOverlay) {
      gsap.to(this.portalOverlay, {
        opacity: 1,
        duration: 1.2,
        delay: 0.4,
        ease: "power2.in",
        onComplete: () => {
          this.goToScene(8);
          // Reset zoom and fade out portal overlay
          if (this.aircraftHeroImg) {
            gsap.set(this.aircraftHeroImg, { scale: 1, filter: "blur(0px)" });
          }
          gsap.to(this.portalOverlay, { opacity: 0, duration: 0.8 });
          this.isTransitioning = false;
        }
      });
    } else {
      setTimeout(() => {
        this.goToScene(8);
        this.isTransitioning = false;
      }, 1400);
    }
  }

  // Scene 08: Cabin Scene
  setupCabinScene() {
    this.canvasFx.setMode('cabin');
    sound.startCabinDrone();
  }

  // Scene 09: Takeoff Sequence
  animateTakeoffSequence() {
    this.canvasFx.setMode('takeoff');
    sound.playTakeoffThrust();

    // Subtle realistic vibration on stage
    const stage = document.getElementById('experience-stage');
    gsap.to(stage, {
      x: "random(-2, 2)",
      y: "random(-2, 2)",
      repeat: 30,
      duration: 0.08,
      yoyo: true,
      ease: "none",
      onComplete: () => {
        gsap.set(stage, { x: 0, y: 0 });
      }
    });

    // Altitude counter
    let alt = 0;
    const altInterval = setInterval(() => {
      alt += Math.floor(Math.random() * 800 + 400);
      if (alt >= 35000) {
        alt = 35000;
        clearInterval(altInterval);
      }
      if (this.hudAltitude) this.hudAltitude.textContent = `${alt.toLocaleString()} FT`;
    }, 70);

    // Airspeed counter
    let speed = 0;
    const speedInterval = setInterval(() => {
      speed += Math.floor(Math.random() * 15 + 10);
      if (speed >= 490) {
        speed = 490;
        clearInterval(speedInterval);
      }
      if (this.hudAirspeed) this.hudAirspeed.textContent = `${speed} KTS`;
    }, 80);

    // Heart rate counter
    let hr = 75;
    const hrInterval = setInterval(() => {
      hr += Math.floor(Math.random() * 3 + 1);
      if (hr >= 120) {
        hr = 120;
        clearInterval(hrInterval);
      }
      if (this.hudHeartrate) this.hudHeartrate.textContent = `${hr} BPM ↑`;
    }, 120);

    // After 4.8s, break through clouds to Finale
    setTimeout(() => {
      this.goToScene(10);
    }, 4800);
  }

  // Scene 10: Finale Above Clouds
  setupFinale() {
    this.canvasFx.setMode('finale');
    sound.playFinaleCelebration();
    this.triggerRomanticConfetti();
  }

  triggerRomanticConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#C5002E', '#E10A3B', '#F2B5C3', '#FFB830', '#F7F7F5']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#C5002E', '#E10A3B', '#F2B5C3', '#FFB830', '#F7F7F5']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }

  // Master Scene Transition Controller
  goToScene(sceneNumber) {
    if (sceneNumber < 1 || sceneNumber > this.totalScenes) return;
    if (sceneNumber === this.currentScene && this.isTransitioning) return;

    const currentEl = document.getElementById(`scene-${String(this.currentScene).padStart(2, '0')}`);
    const nextEl = document.getElementById(`scene-${String(sceneNumber).padStart(2, '0')}`);

    if (currentEl) {
      currentEl.classList.remove('active');
    }

    this.currentScene = sceneNumber;
    this.updateJourneyNav(sceneNumber);

    if (nextEl) {
      nextEl.classList.add('active');
    }

    // Trigger scene-specific logic
    switch (sceneNumber) {
      case 1:
        this.canvasFx.setMode('runway');
        break;
      case 2:
        this.canvasFx.setMode('runway');
        this.startTypewriter();
        break;
      case 3:
        this.canvasFx.setMode('runway');
        this.setupSplitFlapBoard();
        break;
      case 4:
        this.canvasFx.setMode('runway');
        this.animateBoardingPassPrint();
        break;
      case 5:
        this.animateGateAnnouncement();
        break;
      case 6:
        this.animateAircraftReveal();
        break;
      case 8:
        this.setupCabinScene();
        break;
      case 9:
        this.animateTakeoffSequence();
        break;
      case 10:
        this.setupFinale();
        break;
    }
  }

  updateJourneyNav(activeStep) {
    this.navItems.forEach(item => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active');
      if (step < activeStep) {
        item.classList.add('completed');
        const check = item.querySelector('.step-check');
        if (check) check.textContent = ' ✓';
      } else if (step === activeStep) {
        item.classList.add('active');
        item.classList.remove('completed');
        const check = item.querySelector('.step-check');
        if (check) check.textContent = '';
      } else {
        item.classList.remove('completed');
        const check = item.querySelector('.step-check');
        if (check) check.textContent = '';
      }
    });
  }
}
