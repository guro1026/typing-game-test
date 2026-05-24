// js/audio.js
export const audio = {
  bgm: null,
  volume: 0.5,

  init() {
    this.bgm = new Audio("sounds/bgm.mp3");
    this.bgm.loop = true;
    this.setVolume(50);
  },

  playBGM() {
    if (!this.bgm) return Promise.resolve();
    return this.bgm.play();
  },

  setVolume(v) {
    const vol = Math.max(0, Math.min(100, Number(v) || 0)) / 100;
    this.volume = vol;
    if (this.bgm) this.bgm.volume = vol;
  },

  beep() {
    const se = new Audio("sounds/beep.mp3");
    se.volume = this.volume;
    se.play();
  },

  hit() {
    const se = new Audio("sounds/hit.mp3");
    se.volume = this.volume;
    se.play();
  }
};
