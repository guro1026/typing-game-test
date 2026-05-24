// audio.js

export const audio = {
  bgm: null,
  volume: 0,

  init() {
    this.bgm = new Audio("audio/bgm.mp3");
    this.bgm.loop = true;
    this.bgm.volume = 0;
  },

  async playBGM() {
    if (!this.bgm) this.init();
    try {
      await this.bgm.play();
    } catch (e) {
      console.warn("BGM 自動再生ブロック:", e);
      throw e;
    }
  },

  setVolume(v) {
    this.volume = Number(v) / 100;
    if (this.bgm) this.bgm.volume = this.volume;
  },

  beep() {
    const se = new Audio("audio/se_beep.mp3");
    se.volume = this.volume;
    se.play();
  },

  typeGood() {
    const se = new Audio("audio/se_type_good.mp3");
    se.volume = this.volume;
    se.play();
  },

  typeMiss() {
    const se = new Audio("audio/se_type_miss.mp3");
    se.volume = this.volume;
    se.play();
  },

  beam() {
    const se = new Audio("audio/se_beam.mp3");
    se.volume = this.volume;
    se.play();
  }
};
