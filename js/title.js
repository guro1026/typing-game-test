/* ============================================================
   title.js
   タイトル画面 UI 演出
   - フェードイン
   - 名前入力欄フォーカス
   - 性別ボタンの選択演出
   - コースボタンのホバー演出
   ============================================================ */


/* ------------------------------------------------------------
   DOM 要素
   ------------------------------------------------------------ */
const titleScreen = document.getElementById("title-screen");
const nameInput = document.getElementById("player-name");
const genderButtons = document.querySelectorAll(".gender-btn");
const courseButtons = document.querySelectorAll(".course-btn");



/* ============================================================
   タイトル画面フェードイン
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  // 最初は透明 → CSSで opacity:0 にしておく
  titleScreen.style.opacity = 0;

  // 少し遅れてフェードイン
  setTimeout(() => {
    titleScreen.style.transition = "opacity 0.8s ease";
    titleScreen.style.opacity = 1;
  }, 100);

  // 名前入力欄に自動フォーカス
  setTimeout(() => {
    nameInput.focus();
  }, 400);
});



/* ============================================================
   性別ボタンの選択演出
   ============================================================ */
genderButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // 全ボタンの選択解除
    genderButtons.forEach(b => b.classList.remove("selected"));

    // 押したボタンだけ選択
    btn.classList.add("selected");
  });
});



/* ============================================================
   コースボタンのホバー演出
   ============================================================ */
courseButtons.forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    btn.style.transform = "scale(1.08)";
    btn.style.transition = "transform 0.15s ease";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "scale(1)";
  });
});
