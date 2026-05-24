// main.js
import { audio } from "./audio.js";
import { ui } from "./ui.js";
import { gameState } from "./gameState.js";
import { typing } from "./typing.js";
import { effects } from "./effects.js";
import { supa } from "./supabase.js";

const FULL_NAME_REGEX =
  /^[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+　[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+$/;

let timerInterval = null;

function init() {
  audio.init();
  setupAutoplayUnlock();
  setupVolumeSliders();
  setupNameInput();
  setupCourseButtons();
  setupGlobalKeyHandlers();

  ui.showTitle();
  ui.updateHUD(gameState);
}

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

function setupNameInput() {
  const submitBtn = document.getElementById("name-submit");
  const input = document.getElementById("name-input");
  const error = document.getElementById("name-error");

  submitBtn.addEventListener("click", () => {
    const name = input.value.trim();

    if (!FULL_NAME_REGEX.test(name)) {
      error.textContent = "※ フルネーム（姓　名）を全角スペースで入力してください";
      input.classList.add("error");
      audio.beep();
      return;
    }

    input.classList.remove("error");
    error.textContent = "";
    localStorage.setItem("playerName", name);

    document.getElementById("name-area").classList.add("hidden");
    document.getElementById("course-buttons").classList.remove("hidden");
  });
}

function setupCourseButtons() {
  document.querySelectorAll(".course-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      gameState.selectedCourse = btn.dataset.course;
      startGame();
    });
  });
}

function setupGlobalKeyHandlers() {
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      returnToTitle();
      return;
    }
    typing.handleKey(e);
  });
}

function startGame() {
  gameState.reset();
  ui.showGame();
  ui.updateHUD(gameState);

  effects.kiPower = 0;
  effects.updateKiBall();
  effects.updateKiColor(0);

  startTimer();
  loadCSV(gameState.selectedCourse);
}

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

function loadCSV(course) {
  fetch(`csv/words_${course}.csv`)
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split("\n");
      gameState.words = lines.slice(1).map(line => line.trim());
      typing.nextWord();
      gameState.state = "playing";
    })
    .catch(err => {
      console.error("CSV 読み込み失敗:", err);
    });
}


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

async function saveAndGoResult() {
  const name = localStorage.getItem("playerName") || "ゲスト";
  const accuracy =
    gameState.totalCount === 0
      ? 100
      : ((gameState.totalCount - gameState.missCount) / gameState.totalCount) * 100;

  await supa.saveScore(
    name,
    gameState.score,
    gameState.totalCount,
    gameState.missCount,
    accuracy
  );

  localStorage.setItem("missData", JSON.stringify(gameState.missData));

  const params = new URLSearchParams({
    name,
    score: gameState.score,
    miss: gameState.missCount,
    accuracy: accuracy.toFixed(1)
  });

  window.location.href = "results.html?" + params.toString();
}

function returnToTitle() {
  if (timerInterval) clearInterval(timerInterval);
  gameState.state = "title";
  ui.showTitle();
  gameState.reset();
  ui.updateHUD(gameState);
}

document.addEventListener("DOMContentLoaded", init);
