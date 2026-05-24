// ui.js

export const ui = {
  updateHUD(state) {
    document.getElementById("hud-time").textContent = state.timeLeft;
    document.getElementById("hud-score").textContent = state.score;
    document.getElementById("hud-combo").textContent = state.combo;
  },

  showWord(jp, romaji, index) {
    const jpEl = document.getElementById("word-jp");
    const romajiEl = document.getElementById("word-romaji");

    jpEl.textContent = jp;

    const done = romaji.slice(0, index);
    const rest = romaji.slice(index);
    romajiEl.innerHTML = `<span style="color:#fff;">${done}</span><span style="color:#aee7ff;">${rest}</span>`;
  }
};
