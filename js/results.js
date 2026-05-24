// ============================
// results.js（結果画面処理）
// ============================
// このファイルは結果画面の表示とランキング取得を担当する。
// ・localStorage から前回スコアを読み込む
// ・Supabase からランキングを取得
// ・UIテーマ（男/女）を反映
// ============================


// ------------------------------------------------------------
// 他ファイルの読み込み
// ------------------------------------------------------------
import { loadRanking } from "./supabase.js"; 
import { applyUITheme, applyCharacterImage, applyKiColorTheme } from "./ui.js";


// ------------------------------------------------------------
// ページ読み込み時の初期化
// ------------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {

  // ★ UIテーマ（男/女）を復元
  const gender = localStorage.getItem("playerGender") || "male";
  applyUITheme(gender);
  applyCharacterImage(gender);
  applyKiColorTheme(gender);

  // ★ 前回スコアを表示
  loadLastResult();

  // ★ ランキングを読み込んで表示
  loadRankingList();
});


// ------------------------------------------------------------
// 前回スコアを localStorage から読み込んで表示
// ------------------------------------------------------------
function loadLastResult() {
  const score     = localStorage.getItem("last_score")     || 0;
  const maxCombo  = localStorage.getItem("last_maxcombo")  || 0;
  const total     = localStorage.getItem("last_total")     || 0;
  const miss      = localStorage.getItem("last_miss")      || 0;
  const accuracy  = localStorage.getItem("last_accuracy")  || 0;

  document.getElementById("result-score").textContent    = score;
  document.getElementById("result-maxcombo").textContent = maxCombo;
  document.getElementById("result-total").textContent    = total;
  document.getElementById("result-miss").textContent     = miss;
  document.getElementById("result-accuracy").textContent = accuracy + "%";
}


// ------------------------------------------------------------
// ランキングを Supabase から取得して表示
// ------------------------------------------------------------
async function loadRankingList() {
  const list = await loadRanking(); // 上位10件

  const tbody = document.getElementById("ranking-body");
  tbody.innerHTML = ""; // 初期化

  list.forEach((row, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${row.name}</td>
      <td>${row.score}</td>
      <td>${row.accuracy}%</td>
      <td>${formatDate(row.created_at)}</td>
    `;

    tbody.appendChild(tr);
  });
}


// ------------------------------------------------------------
// 日付フォーマット（YYYY/MM/DD）
// ------------------------------------------------------------
function formatDate(str) {
  const d = new Date(str);
  const y = d.getFullYear();
  const m = ("0" + (d.getMonth() + 1)).slice(-2);
  const day = ("0" + d.getDate()).slice(-2);
  return `${y}/${m}/${day}`;
}
