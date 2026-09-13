import { sound } from './audio.js';
import { CanvasFx } from './canvasFx.js';
import { SceneController } from './scenes.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Background Canvas FX
  const canvas = document.getElementById('bg-canvas');
  const canvasFx = new CanvasFx(canvas);

  // Initialize Scene State Controller
  const sceneController = new SceneController(canvasFx);

  // Sound Toggle Interaction
  const soundBtn = document.getElementById('btn-sound-toggle');
  const soundLabel = soundBtn ? soundBtn.querySelector('.sound-label') : null;

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const isUnmuted = sound.toggleMute();
      if (isUnmuted) {
        soundBtn.classList.add('active');
        if (soundLabel) soundLabel.textContent = 'Airport Audio: ON';
        sound.playChime();
      } else {
        soundBtn.classList.remove('active');
        if (soundLabel) soundLabel.textContent = 'Enable Airport Sound';
      }
    });
  }

  // First interaction starts audio context in background
  const resumeAudioOnInteract = () => {
    sound.init();
    window.removeEventListener('pointerdown', resumeAudioOnInteract);
    window.removeEventListener('keydown', resumeAudioOnInteract);
  };
  window.addEventListener('pointerdown', resumeAudioOnInteract);
  window.addEventListener('keydown', resumeAudioOnInteract);
});
