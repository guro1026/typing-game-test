// ============================
// ui.js（UIテーマ切り替え）
// ============================

// ----------------------------
// UIテーマ適用
// ----------------------------
export function applyUITheme(theme) {
  document.body.classList.remove("male-ui", "female-ui");

  if (theme === "female") {
    document.body.classList.add("female-ui");
  } else {
    document.body.classList.add("male-ui");
  }

  localStorage.setItem("uiTheme", theme);
}

// ----------------------------
// 名前から性別推定（必要なら）
// ----------------------------
export function detectGenderFromName(name) {
  // 必要なら後でロジック追加
  // 今はデフォルトで male にする
  return "male";
}

// ----------------------------
// 初期ロード時にテーマ適用
// ----------------------------
export function initUITheme() {
  const saved = localStorage.getItem("uiTheme");

  if (saved) {
    applyUITheme(saved);
  } else {
    applyUITheme("male");
  }
}
