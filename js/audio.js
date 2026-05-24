// ============================
// audio.js（最終完成版）
// ============================
//
// ・BGM / SE を1回だけ読み込んで使い回す
// ・miss音は beep に統一
// ・毎回 new Audio() を廃止（遅延・スマホ問題を解決）
// ・音量同期に完全対応
// ・ファイル名は bgm.mp3 / hit.mp3 / beep.mp3（小文字）
// ============================

export const audio = {
  bgm: null,
  volume: 0,

  // ----------------------------
  // 初期化（BGM + SE を1回だけ読み込む）
  // ----------------------------
  init() {
    // BGM（小文字ファイル名に対応）
    this.bgm = new Audio("sounds/bgm.mp3");
    this.bgm.loop = true;
    this.bgm.volume = 0;

    // 効果音（毎回 new しない → 遅延なし）
    this.seHit = new Audio("sounds/hit.mp3");
    this.seBeep = new Audio("sounds/beep.mp3");

    // 初期音量を反映
    this.seHit.volume = this.volume;
    this.seBeep.volume = this.volume;
  },

  // ----------------------------
  // BGM 再生（自動再生ブロック対策）
  // ----------------------------
  async playBGM() {
    if (!this.bgm) this.init();
    try {
      await this.bgm.play();
    } catch (e) {
      console.warn("BGM 自動再生ブロック:", e);
      throw e;
    }
  },

  // ----------------------------
  // 音量設定（BGM + SE 同期）
  // ----------------------------
  setVolume(v) {
    this.volume = Number(v) / 100;

    if (this.bgm) this.bgm.volume = this.volume;
    if (this.seHit) this.seHit.volume = this.volume;
    if (this.seBeep) this.seBeep.volume = this.volume;
  },

  // ----------------------------
  // 効果音（使い回し）
  // ----------------------------
  beep() {
    this.seBeep.currentTime = 0;
    this.seBeep.play();
  },

  typeGood() {
    this.seHit.currentTime = 0;
    this.seHit.play();
  },

  // ★ miss は beep に統一
  typeMiss() {
    this.seBeep.currentTime = 0;
    this.seBeep.play();
  },

  // ★ beam も hit で統一（あなたの元コード準拠）
  beam() {
    this.seHit.currentTime = 0;
    this.seHit.play();
  }
};
