/* ============================================================
   results.js
   リザルト画面処理
   - localStorage から結果を取得
   - Supabase にスコア保存
   - ランキング取得
   - 勝利/敗北画像切り替え
   ============================================================ */

import { supabase } from "./supabase.js";
import { playBGM, stopAllBGM } from "./audio.js";

/* ------------------------------------------------------------
   DOM 要素
   ------------------------------------------------------------ */
const resultName = document.getElementById("result-name");
const resultScore = document.getElementById("result-score");
const resultAccuracy = document.getElementById("result-accuracy");
const resultImage = document.getElementById("result-image");
const rankingTable = document.getElementById("ranking-table");

/* ============================================================
   ページ読み込み時
   ============================================================ */
window.addEventListener("DOMContentLoaded", () => {
  stopAllBGM();
  playBGM("result");

  loadLocalResult();
  saveScoreToSupabase();
  loadRanking();
});


/* ============================================================
   localStorage から結果を読み込む
   ============================================================ */
function loadLocalResult() {
  const name = localStorage.getItem("result-name") || "No Name";
  const score = localStorage.getItem("result-score") || 0;
  const accuracy = localStorage.getItem("result-accuracy") || 0;
  const status = localStorage.getItem("result-status") || "lose";

  resultName.textContent = name;
  resultScore.textContent = score;
  resultAccuracy.textContent = accuracy + "%";

  // 勝利 / 敗北画像切り替え
  if (status === "win") {
    resultImage.src = "images/results/win.png";
  } else {
    resultImage.src = "images/results/lose.png";
  }
}


/* ============================================================
   Supabase にスコア保存
   ============================================================ */
async function saveScoreToSupabase() {
  const name = localStorage.getItem("result-name");
  const score = Number(localStorage.getItem("result-score"));
  const accuracy = Number(localStorage.getItem("result-accuracy"));

  const { error } = await supabase
    .from("scores")
    .insert([
      {
        name: name,
        score: score,
        accuracy: accuracy,
        created_at: new Date()
      }
    ]);

  if (error) {
    console.error("スコア保存エラー:", error);
  }
}


/* ============================================================
   ランキング取得
   ============================================================ */
async function loadRanking() {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    console.error("ランキング取得エラー:", error);
    return;
  }

  renderRanking(data);
}


/* ============================================================
   ランキング表を描画
   ============================================================ */
function renderRanking(rows) {
  const tbody = rankingTable.querySelector("tbody");
  tbody.innerHTML = "";

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.name}</td>
      <td>${row.score}</td>
      <td>${row.accuracy}%</td>
    `;

    tbody.appendChild(tr);
  });
}
