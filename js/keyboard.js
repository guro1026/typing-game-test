// ============================
// keyboard.js（キーボード光）
// ============================

// キーを光らせる（ゲームロジックから呼ばれる）
export function highlightKey(key) {
  const upper = key.toUpperCase();

  const keyEl = [...document.querySelectorAll(".key")]
    .find(k => k.textContent.toUpperCase() === upper);

  if (!keyEl) return;

  keyEl.classList.add("active");
  setTimeout(() => {
    keyEl.classList.remove("active");
  }, 150);
}
