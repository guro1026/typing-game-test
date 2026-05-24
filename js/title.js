// ============================
// title.js（タイトル画面）
// ============================

import { startGame } from "./main.js";
import { audio } from "./audio.js";

export function startTitle() {
  document.getElementById("name-area").style.display = "block";
  document.getElementById("course-buttons").style.display = "none";

  const input = document.getElementById("name-input");
  const error = document.getElementById("name-error");

  input.classList.remove("error");
  error.textContent = "";
}

// ----------------------------
// 名前入力
// ----------------------------
document.getElementById("name-submit").addEventListener("click", validateName);

function validateName() {
  const input = document.getElementById("name-input");
  const error = document.getElementById("name-error");
  const name = input.value.trim();

  const fullNameRegex =
    /^[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+　[\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+$/;

  if (!fullNameRegex.test(name)) {
    error.textContent = "※ フルネーム（姓　名）を全角スペースで入力してください";
    input.classList.add("error");
    audio.beep();
    return;
  }

  input.classList.remove("error");
  error.textContent = "";

  localStorage.setItem("playerName", name);

  document.getElementById("name-area").style.display = "none";
  document.getElementById("course-buttons").style.display = "block";
}

// ----------------------------
// コース選択
// ----------------------------
document.querySelectorAll(".course-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const course = btn.dataset.course;
    startGame(course);
  });
});
