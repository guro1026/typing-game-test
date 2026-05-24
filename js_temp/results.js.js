// results.js
import { supa } from "./supabase.js";

/* ============================================================
   URLパラメータ取得
============================================================ */
function getParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    name: p.get("name") || "ゲスト",
    score: Number(p.get("score") || 0),
    miss: Number(p.get("miss") || 0),
    accuracy: Number(p.get("accuracy") || 0)
  };
}

/* ============================================================
   弱点分析
============================================================ */
function analyzeWeakKey(missData) {
  const entries = Object.entries(missData || {});
  if (entries.length === 0) return null;

  entries.sort((a, b) => b[1] - a[1]);
  const [key, count] = entries[0];

  if (count < 3) return null; // 3回未満は弱点扱いしない
  return { key, count };
}

const adviceDict = {
  "A": "左手小指が弱い可能性があります。ゆっくり正確に押す練習を。",
  "S": "左手薬指の位置がズレている可能性があります。手首を安定させましょう。",
  "D": "左手中指の独立性が弱いかも。指を立てて押す意識を。",
  "F": "左手人差し指のホームポジションを確認しましょう。",
  "J": "右手人差し指の位置がズレている可能性があります。",
  "K": "右手中指の独立性が弱いかも。力を抜いて押しましょう。",
  "L": "右手薬指が不安定かも。ゆっくり練習すると改善します。"
};

function getAdvice(key) {
  return adviceDict[key] || "ホームポジションを意識すると安定します。";
}

/* ============================================================
   ランキング取得
============================================================ */
async function loadRanking() {
  try {
    const res = await fetch(
      `${supa.url}/rest/v1/score_logs?select=*&order=score.desc&limit=10`,
      {
        headers: {
          "apikey": supa.key,
          "Authorization": `Bearer ${supa.key}`
        }
      }
    );
    return await res.json();
  } catch (err) {
    console.error("ランキング取得失敗:", err);
    return [];
  }
}

/* ============================================================
   今月のベストスコア
============================================================ */
async function loadMyMonthlyTopScore(name) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const url =
    `${supa.url}/rest/v1/score_logs?select=*` +
    `&name=eq.${encodeURIComponent(name)}` +
    `&created_at=gte.${monthStart}` +
    `&order=score.desc&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "apikey": supa.key,
        "Authorization": `Bearer ${supa.key}`
      }
    });
    const data = await res.json();
    return data[0] || null;
  } catch (err) {
    console.error("月間ベスト取得失敗:", err);
    return null;
  }
}

/* ============================================================
   今月の順位
============================================================ */
async function loadMyMonthlyRank(score) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const url =
    `${supa.url}/rest/v1/score_logs?select=score` +
    `&created_at=gte.${monthStart}` +
    `&order=score.desc`;

  try {
    const res = await fetch(url, {
      headers: {
        "apikey": supa.key,
        "Authorization": `Bearer ${supa.key}`
      }
    });
    const data = await res.json();

    let higher = 0;
    for (const row of data) {
      if (row.score > score) higher++;
    }

    return { rank: higher + 1, total: data.length };
  } catch (err) {
    console.error("月間順位取得失敗:", err);
    return { rank: 1, total: 1 };
  }
}

/* ============================================================
   結果画面 初期化
============================================================ */
async function initResults() {
  const { name, score, miss, accuracy } = getParams();

  // 基本情報
  document.getElementById("res-name").textContent = name;
  document.getElementById("res-score").textContent = score;
  document.getElementById("res-miss").textContent = miss;
  document.getElementById("res-accuracy").textContent = accuracy;

  /* ------------------------------
     弱点分析
  ------------------------------ */
  const missDataStr = localStorage.getItem("missData");
  let missData = {};
  if (missDataStr) {
    try {
      missData = JSON.parse(missDataStr);
    } catch {}
  }

  const weak = analyzeWeakKey(missData);

  if (weak) {
    document.getElementById("res-weak-key").textContent =
      `弱点キー：${weak.key}（ミス ${weak.count} 回）`;
    document.getElementById("res-weak-advice").textContent =
      getAdvice(weak.key);
  } else {
    document.getElementById("res-weak-key").textContent =
      "今回のプレイでは特定の弱点は見られませんでした。";
    document.getElementById("res-weak-advice").textContent =
      "この調子で正確さを維持しつつ、スピードアップを目指しましょう。";
  }

  /* ------------------------------
     今月のベスト
  ------------------------------ */
  const best = await loadMyMonthlyTopScore(name);
  const bestBox = document.getElementById("res-best-score");
  const bestMsg = document.getElementById("res-best-update");

  if (best) {
    bestBox.textContent = `${best.score} 点`;

    if (score > best.score) {
      bestMsg.textContent = "今回のプレイで自己ベストを更新しました！";
    } else if (score === best.score) {
      bestMsg.textContent = "自己ベストと同じスコアです。安定してきています。";
    } else {
      bestMsg.textContent = `自己ベストまであと ${best.score - score} 点です。`;
    }
  } else {
    bestBox.textContent = `${score} 点`;
    bestMsg.textContent = "今月の最初の記録です。ここから伸ばしていきましょう。";
  }

  /* ------------------------------
     今月の順位
  ------------------------------ */
  const rankInfo = await loadMyMonthlyRank(score);
  document.getElementById("res-rank").textContent =
    `${rankInfo.rank} 位 / ${rankInfo.total} 人中`;

  /* ------------------------------
     ランキングTOP10
  ------------------------------ */
  const ranking = await loadRanking();
  const container = document.getElementById("ranking");
  container.innerHTML = "";

  ranking.forEach((row, i) => {
    const div = document.createElement("div");
    div.className = "rank-row";
    div.innerHTML = `
      <span>${i + 1}位</span>
      <span>${row.name}</span>
      <span>${row.score} 点</span>
      <span>${row.accuracy.toFixed(1)}%</span>
    `;
    container.appendChild(div);
  });
}

/* ============================================================
   実行
============================================================ */
document.addEventListener("DOMContentLoaded", initResults);
