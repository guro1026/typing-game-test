// gameState.js

export const gameState = {
  state: "title", // title / playing / end
  selectedCourse: null,
  timeLeft: 60,
  score: 0,
  combo: 0,
  maxCombo: 0,
  totalCount: 0,
  missCount: 0,
  missData: [], // { word, input, correct }

  words: [],
  currentWord: "",
  currentRomaji: "",
  currentIndex: 0,

  reset() {
    this.state = "title";
    this.timeLeft = 60;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.totalCount = 0;
    this.missCount = 0;
    this.missData = [];
    this.words = [];
    this.currentWord = "";
    this.currentRomaji = "";
    this.currentIndex = 0;
  }
};
