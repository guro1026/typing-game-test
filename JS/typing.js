// js/typing.js
import { gameState } from "./gameState.js";
import { ui } from "./ui.js";
import { audio } from "./audio.js";
import { effects } from "./effects.js";

export const typing = {
  handleKey(e) {
    if (gameState.state !== "playing") return;
    if (e.target.tagName === "INPUT") return;

    const key = e.key.toLowerCase();
    const target = gameState.currentRomaji[0]?.toLowerCase();

    ui.highlightKey(e.key);

    if (!target) return;

    gameState.totalCount++;

    if (key === target) {
      audio.hit();

      gameState.currentRomaji = gameState.currentRomaji.slice(1);
      ui.updateWord(gameState.currentJP, gameState.currentRomaji);

      let add = 1;
      if (gameState.combo >= 5) add = 5;
      else if (gameState.combo >= 3) add = 3;

      gameState.score += add;
      ui.updateHUD(gameState);

      effects.updateKiColor(gameState.combo);

      if (gameState.currentRomaji.length === 0) {
        effects.growKi();

        gameState.combo++;
        if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;

        ui.updateHUD(gameState);
        setTimeout(() => this.nextWord(), 200);
      }

    } else {
      audio.beep();
      gameState.missCount++;
      gameState.combo = 0;

      ui.updateHUD(gameState);
      effects.updateKiColor(0);

      const wrongKey = key.toUpperCase();
      if (!gameState.missData[wrongKey]) gameState.missData[wrongKey] = 0;
      gameState.missData[wrongKey]++;
    }
  },

  nextWord() {
    if (!gameState.words.length) return;
    const line = gameState.words[Math.floor(Math.random() * gameState.words.length)];
    const cols = line.split(",");

    gameState.currentJP = cols[0].trim();
    gameState.currentRomaji = cols[2].trim();

    ui.updateWord(gameState.currentJP, gameState.currentRomaji);
  }
};
