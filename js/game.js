/* ============================================================
   game.js
   ゲーム本体ロジック
   - 単語生成
   - 入力判定
   - HP管理
   - 攻撃処理
   - 勝敗判定
   - リザルト画面へ遷移
   ============================================================ */

import { shootKiBall, fireBeam, enemyDamageFlash, playerDamageFlash, screenShake, showHitEffect } from "./effects.js";
import { playSE, playBGM, stopAllBGM } from "./audio.js";

/* ------------------------------------------------------------
   DOM 要素
   ------------------------------------------------------------ */
const wordBox = document.getElementById("current-word");
const input = document.getElementById("type-input");

const playerHPBar = document.querySelector("#player-hp div");
const enemyHPBar = document.querySelector("#enemy-hp div");

const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

/* ------------------------------------------------------------
   ゲーム用変数
   ------------------------------------------------------------ */
let words = [];              // 単語リスト
let currentWord = "";        // 現在の単語
let score = 0;               // スコア
let hitCount = 0;            // 正解数
let typeCount = 0;           // 入力総数

let playerHP = 100;
let enemyHP = 100;

let gameEnd = false;

/* ------------------------------------------------------------
   コース別単語セット
   ------------------------------------------------------------ */
const wordSets = {
  easy: ["cat", "dog", "sun", "red", "blue", "apple", "star"],
  normal: ["window", "planet", "dragon", "battle", "energy", "future"],
  hard: ["universe", "galaxy", "dimension", "explosion", "transcend"]
};


/* ============================================================
   ゲーム開始
   ============================================================ */
export function startGame() {
  // コース取得
  const course = localStorage.getItem("course") || "easy";
  words = [...wordSets[course]];

  // BGM
  playBGM("game");

  // 初回単語
  nextWord();

  // 入力欄フォーカス
  input.focus();
}


/* ============================================================
   次の単語をセット
   ============================================================ */
function nextWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  wordBox.textContent = currentWord;
  input.value = "";
}


/* ============================================================
   入力イベント
   ============================================================ */
input.addEventListener("input", () => {
  if (gameEnd) return;

  typeCount++;

  // タイプ音
  playSE("type");

  if (input.value === currentWord) {
    // 正解
    hitCount++;
    score += 100;

    // 敵に攻撃
    enemyHP -= 10;
    updateHP();

    // エフェクト
    shootKiBall();
    enemyDamageFlash();
    screenShake();
    showHitEffect();

    // 次の単語へ
    nextWord();

    // 敵撃破？
    if (enemyHP <= 0) {
      endGame("win");
    }
  }
});


/* ============================================================
   HPバー更新
   ============================================================ */
function updateHP() {
  playerHPBar.style.width = playerHP + "%";
  enemyHPBar.style.width = enemyHP + "%";
}


/* ============================================================
   敵の攻撃（一定間隔）
   ============================================================ */
setInterval(() => {
  if (gameEnd) return;

  // 敵の攻撃
  playerHP -= 5;
  updateHP();

  playerDamageFlash();
  screenShake();

  if (playerHP <= 0) {
    endGame("lose");
  }
}, 2500);


/* ============================================================
   ゲーム終了
   ============================================================ */
function endGame(result) {
  gameEnd = true;

  stopAllBGM();
  playBGM("result");

  // 命中率
  const accuracy = typeCount === 0 ? 0 : Math.round((hitCount / typeCount) * 100);

  // リザルト情報を保存
  localStorage.setItem("result-name", localStorage.getItem("playerName"));
  localStorage.setItem("result-score", score);
  localStorage.setItem("result-accuracy", accuracy);
  localStorage.setItem("result-status", result);

  // リザルト画面へ
  setTimeout(() => {
    window.location.href = "results.html";
  }, 800);
}
