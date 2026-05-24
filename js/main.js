// ============================
// main.js（全体制御）
// ============================

import { audio } from "./audio.js";
import { showTitle, showGame } from "./screens.js";
import { startTitle } from "./title.js";
import { startGameLogic, endGameLogic } from "./game.js";

// ----------------------------
// 状態管理
// ----------------------------
export let state = "title";
export let timerInterval = null;

// ----------------------------
// 初期化
// ----------------------------
window.addEventListener("DOMContentLoaded", () => {
  audio.init();
  startTitle();      // タイトル画面の初期化
  showTitle();       // タイトル表示
});

// ----------------------------
// ゲーム開始（title.js から呼ばれる）
// ----------------------------
export function startGame(course) {
  state = "loading";

  showGame();        // 画面切り替え
  audio.playBGM();   // BGM開始

  startGameLogic(course); // ゲームロジック開始
}

// ----------------------------
// ESCでタイトルへ戻る
// ----------------------------
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    returnToTitle();
  }
});

export function returnToTitle() {
  if (timerInterval) clearInterval(timerInterval);

  state = "title";

  showTitle();
  startTitle(); // タイトルUIを再表示
}

// ----------------------------
// ゲーム終了（game.js から呼ばれる）
// ----------------------------
export function endGame() {
  endGameLogic();
}
