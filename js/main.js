/* ============================================================
   main.js
   - 性別選択（男性 / 女性）
   - テーマの保存（localStorage）
   - 初期ロード時にテーマ反映
   ============================================================ */

import { applyUIByGender } from "./ui.js";

/* ------------------------------------------------------------
   DOM 要素取得
   ------------------------------------------------------------ */
const genderButtons = document.querySelectorAll(".gender-btn");



/* ============================================================
   初期ロード時：保存された性別テーマを適用
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  // 保存された性別を取得（なければ male）
  const savedGender = localStorage.getItem("gender") || "male";

  // body にテーマクラスを適用
  applyUIByGender(savedGender);
});



/* ============================================================
   性別選択ボタン（男性 / 女性）
   ============================================================ */
genderButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    // ボタンの data-gender 属性から性別を取得
    const gender = btn.dataset.gender;

    // localStorage に保存
    localStorage.setItem("gender", gender);

    // UI テーマを反映
    applyUIByGender(gender);
  });
});
