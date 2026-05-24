// ============================
// results.js（結果画面）
// ============================

import { supa } from "./supabase.js";
import { applyUITheme, initUITheme } from "./ui.js";

// ----------------------------
// 初期化
// ----------------------------
window.addEventListener("DOMContentLoaded", () => {
  initUITheme();     // UIテーマ適用
  loadLocalResults(); // ローカル結果表示
  loadRanking();      // ランキング取得
});

// ----------------------------
// ローカル結果を表示
// ----------------------------
function loadLocalResults() {
  const score = localStorage.getItem("last_score") || 0;
  const maxCombo = localStorage.getItem("last_maxcombo") || 0;
  const total = localStorage.getItem("last_total") || 0;
  const miss = localStorage.getItem("last_miss") || 0;
  const accuracy = localStorage.getItem("last_accuracy") || 0;

  document.getElementById("result-score").textContent = score;
  document.getElementById("result-maxcombo").textContent = maxCombo;
  document.getElementById("result-total").textContent = total;
  document.getElementById("result-miss").textContent = miss;
  document.getElementById("result-accuracy").textContent = accuracy;
}

// ----------------------------
// Supabase からランキング取得
// ----------------------------
async function loadRanking() {
  const list = document.getElementById("ranking-list");
  list.textContent = "読み込み中…";

  try {
    const res = await fetch(
      "https://bznzxcllyocfairwjzzk.supabase.co/rest/v1/score_logs?select=*&order=score.desc&limit=20",
      {
        headers: {
          apikey: "sb_publishable_vEVMPFsuyISRzeX8helsHA_xO4y1m8e",
          Authorization: `Bearer sb_publishable_vEVMPFsuyISRzeX8helsHA_xO4y1m8e`
        }
      }
    );

    if (!res.ok) {
      list.textContent = "ランキング取得失敗";
      return;
    }

    const data = await res.json();

    if (data.length === 0) {
      list.textContent = "まだ記録がありません";
      return;
    }

    list.innerHTML = data
      .map(
        (row, i) => `
        <div class="rank-row">
          <span class="rank-num">${i + 1}位</span>
          <span class="rank-name">${row.name}</span>
          <span class="rank-score">${row.score}</span>
        </div>
      `
      )
      .join("");

  } catch (e) {
    console.error("ランキング取得エラー:", e);
    list.textContent = "通信エラー";
  }
}

// ----------------------------
// タイトルへ戻る
// ----------------------------
document.getElementById("back-title").addEventListener("click", () => {
  window.location.href = "index.html";
});
