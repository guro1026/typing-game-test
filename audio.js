// audio.js
export const audio = {
  bgm: null,
  seHit: null,
  seBeep: null,

  init() {
    this.bgm = new Audio("sounds/BGM.mp3");
    this.bgm.loop = true;
    this.bgm.volume = 0;

    this.seHit = new Audio("sounds/hit.mp3");
    this.seHit.volume = 0.6;

    this.seBeep = new Audio("sounds/beep.mp3");
    this.seBeep.volume = 0.6;
  },

  playBGM() {
    this.bgm.play().catch(() => {});
  },

  setVolume(v) {
    this.bgm.volume = v / 100;
  },

  hit() {
    this.seHit.currentTime = 0;
    this.seHit.play();
  },

  beep() {
    this.seBeep.currentTime = 0;
    this.seBeep.play();
  }
};
