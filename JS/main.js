// ===============================
// main.js（完全統合版）
// 旧UI（画像ベース）に完全対応
// 社員名簿チェック / 男女UI切替 / CSV読み込み
// 気弾 / ビーム / キーボード / HUD / BGM
// ===============================

import { audio } from "./audio.js";
import { ui } from "./ui.js";
import { gameState } from "./gameState.js";
import { typing } from "./typing.js";
import { effects } from "./effects.js";
import { supa } from "./supabase.js";

// 社員名簿
let employeeList = {}; // { normalizedName: gender }

// 名前正規化（スペース全部削除）
function normalizeName(name) {
  return name.trim().replace(/\s+/g, "");
}

// 社員名簿読み込み
async function loadEmployeeList() {
  try {
    const res = await fetch("csv/employee_list.csv");
    const text = await res.text();
    const lines = text.trim().split("\n").slice(1);

    employeeList = {};

    for (const line of lines) {
      const [name, gender] = line.split(",");
      const key = normalizeName(name);
      employeeList[key] = (gender || "male").trim();
    }
  } catch (e) {
    console.error("社員名簿読み込み失敗:", e);
  }
}

function isRealEmployee(name) {
  return employeeList.hasOwnProperty(normalizeName(name));
}

function getGender(name) {
  return employeeList[normalizeName(name)] || "male";
}

// ===============================
// 初期化
// ===============================
function init() {
  audio.init();
  setupAutoplayUnlock();
  setupVolumeSliders();
  setupNameInput();
  setupCourseButtons();
  setupGlobalKeyHandlers();

  loadEmployeeList(); // 社員名簿読み込み

  // タイトル画面表示
  document.getElementById("title-screen").style.display = "block";
  document.getElementById("game-screen").style.display = "none";
}

// ===============================
// BGM 自動再生解除
// ===============================
function setupAutoplayUnlock() {
  audio.playBGM().catch(() => {
    const once = () => {
      audio.playBGM().catch(() => {});
      document.removeEventListener("click", once);
      document.removeEventListener("keydown", once);
    };
    document.addEventListener("click", once);
    document.addEventListener("keydown", once);
  });
}

// ===============================
// 音量スライダー
// ===============================
function setupVolumeSliders() {
  const titleSlider = document.getElementById("volume-slider");
  const gameSlider = document.getElementById("volume-slider-game");

  const sync = v => {
    audio.setVolume(v);
    titleSlider.value = v;
    gameSlider.value = v;
  };

  titleSlider.addEventListener("input", () => sync(titleSlider.value));
  gameSlider.addEventListener("input", () => sync(gameSlider.value));
}

// ===============================
// 名前入力
// ===============================
function setupNameInput() {
  const input = document.getElementById("name-input");
  const error = document.getElementById("name-error");
  const submit = document.getElementById("name-submit");

  submit.addEventListener("click", () => {
    const name = input.value.trim();

    if (name.length === 0) {
      error.textContent = "※ 名前を入力してください";
      input.classList.add("error");
      audio.beep();
      return;
    }

    input.classList.remove("error");
    error.textContent = "";

    localStorage.setItem("playerName", name);

    // 社員名簿で性別取得 → ゲーム画面のUI切替
    const gender = getGender(name);
    document.body.classList.remove("male-ui", "female-ui");
    document.body.classList.add(gender === "female" ? "female-ui" : "male-ui");

    // 名前入力を隠してコース選択を表示
    document.getElementById("name-area").style.display = "none";
    document.getElementById("course-buttons").style.display = "block";
  });
}

// ===============================
// コース選択
// ===============================
function setupCourseButtons() {
  document.querySelectorAll(".course-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      gameState.selectedCourse = btn.dataset.course;
      startGame();
    });
  });
}

// ===============================
// ESCキーでタイトルへ戻る
// ===============================
function setupGlobalKeyHandlers() {
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      returnToTitle();
      return;
    }
    typing.handleKey(e);
  });
}

// ===============================
// ゲーム開始
// ===============================
function startGame() {
  gameState.reset();

  document.getElementById("title-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  ui.updateHUD(gameState);

  effects.kiPower = 0;
  effects.updateKiBall();
  effects.updateKiColor(0);

  startTimer();
  loadCSV(gameState.selectedCourse);
}

// ===============================
// タイマー
// ===============================
let timerInterval = null;

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    gameState.timeLeft--;
    ui.updateHUD(gameState);

    if (gameState.timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// ===============================
// CSV 読み込み
// ===============================
function loadCSV(course) {
  fetch(`csv/words_${course}.csv`)
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split("\n");
      gameState.words = lines.slice(1).map(line => line.trim());
      typing.nextWord();
      gameState.state = "playing";
    })
    .catch(err => console.error("CSV読み込み失敗:", err));
}

// ===============================
// ゲーム終了
// ===============================
function endGame() {
  gameState.state = "end";

  effects.kiPower = 100;
  effects.updateKiBall();
  effects.flash();
  effects.fireBeam();

  setTimeout(() => {
    alert(`修行終了！\nスコア：${gameState.score}\n最大コンボ：${gameState.maxCombo}`);
    saveAndGoResult();
  }, 700);
}

// ===============================
// Supabase 保存 → 結果画面へ
// ===============================
async function saveAndGoResult() {
  const name = localStorage.getItem("playerName") || "ゲスト";
  const accuracy =
    gameState.totalCount === 0
      ? 100
      : ((gameState.totalCount - gameState.missCount) / gameState.totalCount) * 100;

  const realEmployee = isRealEmployee(name);

  if (realEmployee) {
    await supa.saveScore(
      name,
      gameState.score,
      gameState.totalCount,
      gameState.missCount,
      accuracy
    );
  } else {
    console.log("社員名簿に存在しないためランキング非掲載");
  }

  localStorage.setItem("missData", JSON.stringify(gameState.missData));

  const params = new URLSearchParams({
    name,
    score: gameState.score,
    miss: gameState.missCount,
    accuracy: accuracy.toFixed(1),
    employee: realEmployee ? "1" : "0"
  });

  window.location.href = "results.html?" + params.toString();
}

// ===============================
// タイトルへ戻る
// ===============================
function returnToTitle() {
  if (timerInterval) clearInterval(timerInterval);

  document.getElementById("title-screen").style.display = "block";
  document.getElementById("game-screen").style.display = "none";

  gameState.reset();
  ui.updateHUD(gameState);

  document.getElementById("name-area").style.display = "block";
  document.getElementById("course-buttons").style.display = "none";
}

// ===============================
// DOM読み込み後に開始
// ===============================
document.addEventListener("DOMContentLoaded", init);
