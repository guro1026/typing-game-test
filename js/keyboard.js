/* ============================================================
   keyboard.js
   タイピングキーボードUI制御
   - キーボード生成（A〜Z）
   - 押下時のハイライト
   - 入力欄と連動して光る
   ============================================================ */


/* ------------------------------------------------------------
   DOM 要素
   ------------------------------------------------------------ */
const keyboard = document.getElementById("keyboard");



/* ============================================================
   キーボード生成（A〜Z）
   ============================================================ */
export function createKeyboard() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  letters.split("").forEach(char => {
    const key = document.createElement("div");
    key.classList.add("key");
    key.dataset.key = char;
    key.textContent = char;

    keyboard.appendChild(key);
  });

  // スペースキー
  const spaceKey = document.createElement("div");
  spaceKey.classList.add("key", "space");
  spaceKey.dataset.key = " ";
  spaceKey.textContent = "SPACE";
  keyboard.appendChild(spaceKey);
}



/* ============================================================
   キーを光らせる（押下）
   ============================================================ */
export function highlightKey(keyChar) {
  const key = document.querySelector(`.key[data-key="${keyChar.toUpperCase()}"]`);
  if (!key) return;

  key.classList.add("active");

  // 少し後に戻す
  setTimeout(() => {
    key.classList.remove("active");
  }, 120);
}



/* ============================================================
   キーボード入力イベント（物理キーボード）
   ============================================================ */
document.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();

  // A〜Z or Space のみ反応
  if ((key >= "A" && key <= "Z") || e.key === " ") {
    highlightKey(e.key);
  }
});
