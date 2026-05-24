// typing.js

import { gameState } from "./gameState.js";
import { ui } from "./ui.js";
import { effects } from "./effects.js";
import { audio } from "./audio.js";

export const typing = {
  nextWord() {
    if (!gameState.words.length) {
      document.getElementById("word-jp").textContent = "";
      document.getElementById("word-romaji").textContent = "";
      return;
    }

    const line = gameState.words[Math.floor(Math.random() * gameState.words.length)];
    const [jp, romaji] = line.split(",");

    gameState.currentWord = jp;
    gameState.currentRomaji = (romaji || "").trim().toLowerCase();
    gameState.currentIndex = 0;

    ui.showWord(gameState.currentWord, gameState.currentRomaji, gameState.currentIndex);
  },

  handleKey(e) {
    if (gameState.state !== "playing") return;
    const key = e.key.toLowerCase();
    if (!key.match(/^[a-z]$/)) return;

    const expected = gameState.currentRomaji[gameState.currentIndex];

    gameState.totalCount++;

    if (key === expected) {
      // 正解
      gameState.currentIndex++;
      gameState.score += 10;
      gameState.combo++;
      if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;

      effects.addKi(3);
      audio.typeGood();
    } else {
      // ミス
      gameState.combo = 0;
      gameState.missCount++;
      gameState.missData.push({
        word: gameState.currentWord,
        input: key,
        correct: expected
      });
      effects.addKi(-5);
      audio.typeMiss();
    }

    ui.updateHUD(gameState);
    ui.showWord(gameState.currentWord, gameState.currentRomaji, gameState.currentIndex);

    if (gameState.currentIndex >= gameState.currentRomaji.length) {
      this.nextWord();
    }
  }
};
