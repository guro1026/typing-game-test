// ======================================================
// 🔊 効果音（SE）
// ======================================================
let seHit = new Audio("sounds/hit.mp3");
let seBeep = new Audio("sounds/beep.mp3");

// ======================================================
// 🟦 グローバル変数
// ======================================================
let state = "title";
let selectedCourse = null;

let words = [];
let currentJP = "";
let currentRomaji = "";
let originalRomaji = "";

let score = 0;
let combo = 0;
let maxCombo = 0;

let timeLeft = 60;
let timerInterval = null;

let totalTyped = 0;
let missCount = 0;
let missVowel = 0;
let missConsonant = 0;
let missYouon = 0;

let kiPower = 0;

let client = null;

// ======================================================
// HUD 更新
// ======================================================
function updateHUD() {
  document.getElementById("hud-score").textContent = score;
  document.getElementById("hud-combo").textContent = combo;
  document.getElementById("hud-time").textContent = timeLeft;
}

// ======================================================
// ▶ ゲーム開始
// ======================================================
window.startGame = function () {

  state = "loading";

  // 画面切り替え
  document.getElementById("title-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  // 性別によるキャラ切り替え
  const playerName = localStorage.getItem("playerName") || "";
  const character = document.getElementById("character");
  const kiBall = document.getElementById("ki-ball");
  const bgLayer = document.getElementById("bg-layer-game");

  fetch("employee_list.csv")
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split("\n").slice(1);
      let gender = "unknown";

      for (const line of lines) {
        const [name, g] = line.split(",").map(s => s.trim());
        if (name === playerName) {
          gender = g;
          break;
        }
      }

      localStorage.setItem("gender", gender);

      if (gender === "female") {
        character.src = "images/character/women/kiball_woman.png";
      } else {
        character.src = "images/character/men/kiball_man.png";
      }

      if (bgLayer) {
        bgLayer.style.backgroundImage =
          gender === "female"
            ? 'url("images/bg/game_bg_woman.png")'
            : 'url("images/bg/game_bg_man.png")';
      }

      kiBall.style.backgroundImage =
        gender === "female"
          ? 'url("images/kiball/pink.png")'
          : 'url("images/kiball/blue.png")';
    });

  // ステータス初期化
  score = 0;
  combo = 0;
  maxCombo = 0;
  timeLeft = 60;

  totalTyped = 0;
  missCount = 0;
  missVowel = 0;
  missConsonant = 0;
  missYouon = 0;

  updateHUD();

  // 気弾初期化
  kiPower = 0;
  kiBall.style.opacity = "1";
  kiBall.style.transform = "translate(-50%, -50%) scale(0.02)";

  // コース取得
  selectedCourse = localStorage.getItem("selectedCourse");

  // CSV 読み込み後に開始
  loadCSV(selectedCourse).then(() => {
    startTimer();
    nextWord();
  });
};

// ======================================================
// タイマー
// ======================================================
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft--;
    updateHUD();

    // ★残り3秒でかめはめ波
    if (timeLeft === 3) {
      fireKamehameha();
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// ======================================================
// CSV 読み込み
// ======================================================
function loadCSV(course) {
  return fetch(`words_${course}.csv`)
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split("\n");
      words = lines.slice(1).map(line => line.trim());
    });
}

// ======================================================
// 次のお題
// ======================================================
function nextWord() {
  if (timeLeft <= 0) return;
  if (!words.length) return;

  const line = words[Math.floor(Math.random() * words.length)].trim();
  const cols = line.split(",").map(c => c.trim());

  currentJP = cols[0] || "";
  currentRomaji = cols[2] || "";
  originalRomaji = currentRomaji;

  document.getElementById("word-jp").textContent = currentJP;
  document.getElementById("word-romaji").textContent = currentRomaji;

  state = "playing";
}

// ======================================================
// キー入力
// ======================================================
document.addEventListener("keydown", e => {
  if (state !== "playing") return;
  if (timeLeft <= 0) return;

  const key = e.key.toLowerCase();
  if (!/^[a-z]$/.test(key)) return;

  const target = currentRomaji[0]?.toLowerCase();
  totalTyped++;

  highlightKey(e.key);

  if (!target) return;

  const seEnabled = localStorage.getItem("seEnabled") === "1";

  if (key === target) {

    if (seEnabled) {
      seHit.currentTime = 0;
      seHit.play();
    }

    currentRomaji = currentRomaji.slice(1);
    document.getElementById("word-romaji").textContent = currentRomaji;

    let add = 1;
    if (combo >= 5) add = 5;
    else if (combo >= 3) add = 3;

    const willClear = currentRomaji.length === 0;
    const nextCombo = combo + 1;

    if (willClear) {
      if (nextCombo === 10) add *= 10;
      if (nextCombo === 15) add *= 15;
      if (nextCombo === 20) add *= 20;
    }

    score += add;
    updateHUD();

    if (currentRomaji.length === 0) {
      combo++;
      if (combo > maxCombo) maxCombo = combo;

      growKi();

      updateHUD();
      setTimeout(nextWord, 200);
    }

  } else {

    if (seEnabled) {
      seBeep.currentTime = 0;
      seBeep.play();
    }

    missCount++;

    if ("aiueo".includes(target)) missVowel++;
    else if (target === "y") missYouon++;
    else missConsonant++;

    combo = 0;
    updateHUD();
  }
});

// ======================================================
// キーボード光演出
// ======================================================
function highlightKey(key) {
  const upper = key.toUpperCase();
  const keyEl = [...document.querySelectorAll(".key")]
    .find(k => k.textContent.toUpperCase() === upper);

  if (!keyEl) return;

  keyEl.classList.add("active");
  setTimeout(() => keyEl.classList.remove("active"), 150);
}

// ======================================================
// 気弾成長
// ======================================================
function updateKiBall() {
  const ball = document.getElementById("ki-ball");
  const scale = 0.1 + (kiPower / 100) * 0.5;
  ball.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function growKi() {
  if (combo === 1) kiPower += 6;
  else kiPower += 0.5;

  if (kiPower > 100) kiPower = 100;
  updateKiBall();
}

// ======================================================
// かめはめ波（テンプレート方式）
// ======================================================
function fireKamehameha() {
  const character = document.getElementById("character");
  const gender = localStorage.getItem("gender");

  character.src = gender === "female"
    ? "images/character/women/kamehameha_woman.png"
    : "images/character/men/kamehameha_man.png";

  fadeKiBall();

  const tpl = document.getElementById("kame-template");
  const fire = tpl.content.firstElementChild.cloneNode(true);

  fire.src = gender === "female"
    ? "images/character/women/fire_woman.png"
    : "images/character/men/fire_man.png";

  document.body.appendChild(fire);

  setTimeout(() => fire.style.opacity = 0, 50);

  setTimeout(() => {
    if (fire && fire.parentNode) fire.remove();
  }, 1600);
}

// ======================================================
// 気弾フェード（テンプレート方式）
// ======================================================
function fadeKiBall() {
  const tpl = document.getElementById("kiball-fade-template");
  const fade = tpl.content.firstElementChild.cloneNode(true);

  const gender = localStorage.getItem("gender");

  fade.style.backgroundImage =
    gender === "female"
      ? 'url("images/kiball/pink.png")'
      : 'url("images/kiball/blue.png")';

  document.body.appendChild(fade);

  setTimeout(() => {
    fade.style.opacity = 0;
    fade.style.transform = "translate(-50%, -50%) scale(1.5)";
  }, 50);

  setTimeout(() => {
    if (fade && fade.parentNode) fade.remove();
  }, 1600);
}

// ======================================================
// ビーム演出
// ======================================================
function fireBeam() {
  const beam = document.getElementById("beam");
  beam.classList.add("beam-fire");
  setTimeout(() => beam.classList.remove("beam-fire"), 500);
}

// ======================================================
// 敵撃破ロジック
// ======================================================
function getDefeatedEnemy(score) {
  if (score <= 10000) return "サイバイマン";
  if (score <= 20000) return "ラディッツ";
  if (score <= 30000) return "ナッパ";
  if (score <= 40000) return "ベジータ（初期）";
  if (score <= 50000) return "フリーザ（第1形態）";
  if (score <= 60000) return "フリーザ（最終形態）";
  if (score <= 70000) return "セル（完全体）";
  if (score <= 80000) return "魔人ブウ（善）";
  if (score <= 90000) return "魔人ブウ（純粋）";
  if (score <= 100000) return "ビルス";
  return "破壊神クラス撃破";
}

// ======================================================
// 弱点分析コメント
// ======================================================
function getWeaknessComment(accuracy, v, c, y) {
  if (accuracy >= 95) return "お前…強くなったな。もう上級者の領域だぞ。";

  const maxMiss = Math.max(v, c, y);

  if (maxMiss === 0) return "まだまだ伸びしろだらけだな…修行を続けろ！";
  if (max