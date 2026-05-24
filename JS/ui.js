// js/ui.js
export const ui = {
  showTitle() {
    document.getElementById("title-screen").style.display = "flex";
    document.getElementById("game-screen").style.display = "none";
  },

  showGame() {
    document.getElementById("title-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
  },

  updateHUD(game) {
    document.getElementById("hud-score").textContent = game.score;
    document.getElementById("hud-combo").textContent = game.combo;
    document.getElementById("hud-time").textContent = game.timeLeft;
  },

  updateWord(jp, romaji) {
    document.getElementById("word-jp").textContent = jp;
    document.getElementById("word-romaji").textContent = romaji;
  },

  highlightKey(key) {
    const upper = key.toUpperCase();
    const keyEl = [...document.querySelectorAll(".key")]
      .find(k => k.textContent.toUpperCase() === upper);

    if (!keyEl) return;

    keyEl.classList.add("active");
    setTimeout(() => keyEl.classList.remove("active"), 150);
  }
};
