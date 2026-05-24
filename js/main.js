// ============================
// main.js（ゲーム全体の状態管理）
// ============================

// ----------------------------
// 他ファイルの機能を読み込む
// ----------------------------
import { showTitle, showGame } from "./screens.js";   // 画面切り替え
import { startGameLogic } from "./game.js";           // ゲームロジック開始
import { applyUITheme, applyCharacterImage, applyKiColorTheme } from "./ui.js"; // UIテーマ関連
import { audio } from "./audio.js";                   // BGM・SE

// ----------------------------
// ゲーム全体の状態
// "title"   → タイトル画面
// "playing" → ゲーム中
// ----------------------------
export let state = "title";

// ----------------------------
// タイマー管理用
// 他ファイルからも参照するので export
// ----------------------------
export let timerInterval = null;

// ----------------------------
// ページ読み込み時の初期化
// ----------------------------
window.addEventListener("DOMContentLoaded", () => {
  // UIテーマ（男/女）を localStorage から復元
  const savedTheme = localStorage.getItem("uiTheme") || "male";
  applyUITheme(savedTheme);

  // キャラ画像も復元
  applyCharacterImage(savedTheme);

  // 気弾の色も復元
  applyKiColorTheme(savedTheme);

  // タイトル画面を表示
  showTitle();

  // BGM を再生（音量は audio.js が管理）
  audio.playBGM();
});

// ----------------------------
// ゲーム開始（タイトル画面から呼ばれる）
// ----------------------------
export function startGame(course) {
  // 状態をゲーム中に変更
  state = "playing";

  // ゲーム画面へ切り替え
  showGame();

  // ゲームロジック開始（CSV読み込み・タイマー開始など）
  startGameLogic(course);
}

// ----------------------------
// ゲーム終了（game.js から呼ばれる）
// ----------------------------
export function endGame() {
  // 状態をタイトルに戻す
  state = "title";

  // タイマー停止
  if (timerInterval) clearInterval(timerInterval);

  // 結果画面へ遷移（game.js 側で results.html に飛ばす）
  // ここでは画面切り替えはしない
}
