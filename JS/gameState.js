// js/gameState.js
export const gameState = {
  state: "title",
  score: 0,
  combo: 0,
  maxCombo: 0,
  missCount: 0,
  totalCount: 0,
  timeLeft: 60,
  selectedCourse: null,
  words: [],
  currentJP: "",
  currentRomaji: "",
  missData: {},

  reset() {
    this.state = "loading";
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.missCount = 0;
    this.totalCount = 0;
    this.timeLeft = 60;
    this.words = [];
    this.currentJP = "";
    this.currentRomaji = "";
    this.missData = {};
  }
};
