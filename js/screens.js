// ============================
// screens.js（画面切り替え）
// ============================

export function showTitle() {
  document.getElementById("title-screen").style.display = "block";
  document.getElementById("game-screen").style.display = "none";
  const result = document.getElementById("results-screen");
  if (result) result.style.display = "none";
}

export function showGame() {
  document.getElementById("title-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  const result = document.getElementById("results-screen");
  if (result) result.style.display = "none";
}

export function showResult() {
  document.getElementById("title-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "none";
  document.getElementById("results-screen").style.display = "block";
}
