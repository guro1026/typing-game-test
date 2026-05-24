// ============================
// game.js（ゲームロジック）
// ============================

import { audio } from "./audio.js";
import { state, timerInterval, endGame } from "./main.js";
import { supa } from "./supabase.js";
import { highlightKey } from "./keyboard.js";

// ----------------------------
// ゲーム用変数
// ----------------------------
let words = [];
let currentJP = "";
let currentRomaji = "";
let originalRomaji = "";

let score = 0;
let combo = 0;
let maxCombo = 0;
let timeLeft = 60;

let kiPower = 0;

// ★ 追加：タイプ数カウント
let total = 0;
let miss = 0;
let accuracy = 0;

// ----------------------------
// ゲーム開始
// ----------------------------
export function startGameLogic(course) {
  score = 0;
  combo = 0;
  maxCombo = 0;
  timeLeft = 60;

  // ★ カウンター初期化
  total = 0;
  miss = 0;
  accuracy = 0;

  updateHUD();

  initKiBall();
  startTimer();
  loadCSV(course);
}

// ----------------------------
// タイマー
// ----------------------------
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  window.timerInterval = setInterval(() => {
    timeLeft--;
    updateHUD();

    if (timeLeft <= 0) {
      clearInterval(window.timerInterval);
      endGame();
    }
  }, 1000);
}

// ----------------------------
// CSV読み込み
// ----------------------------
function loadCSV(course) {
  fetch(`words_${course}.csv`)
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split("\n");
      words = lines.slice(1).map(line => line.trim());
      nextWord();
    });
}

// ----------------------------
// 次の単語
// ----------------------------
function nextWord() {
  if (timeLeft <= 0) return;

  const line = words[Math.floor(Math.random() * words.length)];
  const cols = line.split(",").map(c => c.trim());

  currentJP = cols[0] || "";
  currentRomaji = cols[2] || "";
  originalRomaji = currentRomaji;

  updateDisplay();
}

// ----------------------------
// 表示更新
// ----------------------------
function updateDisplay() {
  document.getElementById("word-jp").textContent = currentJP;
  document.getElementById("word-romaji").textContent = currentRomaji;
}

// ----------------------------
// HUD更新
// ----------------------------
function updateHUD() {
  document.getElementById("hud-score").textContent = score;
  document.getElementById("hud-combo").textContent = combo;
  document.getElementById("hud-time").textContent = timeLeft;
}

// ----------------------------
// タイピング判定
// ----------------------------
document.addEventListener("keydown", e => {
  if (state !== "playing") return;
  if (timeLeft <= 0) return;

  const key = e.key.toLowerCase();
  const target = currentRomaji[0]?.toLowerCase();

  highlightKey(e.key);

  if (!target) return;

  // ★ 総タイプ数
  total++;

  if (key === target) {
    audio.typeGood();

    currentRomaji = currentRomaji.slice(1);
    updateDisplay();

    let add = 1;
    if (combo >= 5) add = 5;
    else if (combo >= 3) add = 3;

    score += add;
    updateHUD();

    updateKiColor(combo);

    if (currentRomaji.length === 0) {
      growKi();

      combo++;
      if (combo > maxCombo) maxCombo = combo;
      updateHUD();

      setTimeout(nextWord, 200);
    }

  } else {
    // ★ ミス
    miss++;

    audio.typeMiss();
    combo = 0;
    updateHUD();
    updateKiColor(combo);
  }

  // ★ 正確率
  accuracy = total > 0 ? Math.floor((total - miss) / total * 100) : 0;
});

// ----------------------------
// 気弾
// ----------------------------
function initKiBall() {
  kiPower = 0;
  const ball = document.getElementById("ki-ball");
  ball.classList.remove("white", "gold");
  ball.classList.add("blue");
  ball.classList.remove("pulse");
  ball.style.transform = "translate(-50%, -50%) scale(0.02)";
}

function updateKiBall() {
  const ball = document.getElementById("ki-ball");
  const scale = 0.1 + (kiPower / 100) * 0.5;
  ball.style.transform = `translate(-50%, -50%) scale(${scale})`;

  if (kiPower >= 100) {
    ball.classList.add("pulse");
  }
}

function updateKiColor(combo) {
  const ball = document.getElementById("ki-ball");
  ball.classList.remove("blue", "white", "gold");

  if (combo >= 20) ball.classList.add("gold");
  else if (combo >= 10) ball.classList.add("white");
  else ball.classList.add("blue");
}

function growKi() {
  kiPower += 0.5;
  if (kiPower > 100) kiPower = 100;
  updateKiBall();
}

// ----------------------------
// ビーム
// ----------------------------
function fireBeam() {
  const beam = document.getElementById("beam");
  beam.classList.add("beam-fire");
  audio.beam();

  setTimeout(() => {
    beam.classList.remove("beam-fire");
  }, 500);
}

// ----------------------------
// ゲーム終了処理
// ----------------------------
export function endGameLogic() {
  kiPower = 100;
  updateKiBall();

  document.body.classList.add("flash");
  setTimeout(() => {
    document.body.classList.remove("flash");
  }, 300);

  fireBeam();

  // ★ Supabase 保存
  supa.saveScore({
    name: localStorage.getItem("playerName"),
    score,
    total,
    miss,
    accuracy
  });

  setTimeout(() => {
    alert(`修行終了！\nスコア：${score}\n最大コンボ：${maxCombo}`);
    location.reload();
  }, 700);
}
