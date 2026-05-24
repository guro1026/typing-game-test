/* ============================================================
   screens.js
   画面遷移コントローラー
   - 名前入力チェック
   - 性別選択
   - コース選択
   - ゲーム画面へ遷移
   ============================================================ */

import { playBGM, stopAllBGM } from "./audio.js";

/* ------------------------------------------------------------
   DOM 要素
   ------------------------------------------------------------ */
const nameInput = document.getElementById("player-name");
const nameError = document.getElementById("name-error");

const courseButtons = document.querySelectorAll(".course-btn");
const startButton = document.getElementById("start-btn");



/* ============================================================
   初期ロード：タイトルBGM
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  stopAllBGM();
  playBGM("title");
});



/* ============================================================
   名前チェック
   ============================================================ */
function validateName() {
  const name = nameInput.value.trim();

  if (name.length === 0) {
    nameError.textContent = "名前を入力してください";
    return false;
  }

  if (name.length > 12) {
    nameError.textContent = "名前は12文字以内です";
    return false;
  }

  nameError.textContent = "";
  return true;
}



/* ============================================================
   コース選択（easy / normal / hard）
   ============================================================ */
courseButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const course = btn.dataset.course;

    // localStorage に保存
    localStorage.setItem("course", course);

    // 見た目の選択状態
    courseButtons.forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
  });
});



/* ============================================================
   ゲーム開始ボタン
   ============================================================ */
startButton.addEventListener("click", () => {
  if (!validateName()) return;

  // 名前保存
  localStorage.setItem("playerName", nameInput.value.trim());

  // コース未選択なら easy
  if (!localStorage.getItem("course")) {
    localStorage.setItem("course", "easy");
  }

  // ゲーム画面へ
  window.location.href = "game.html";
});
