// results.js

function getParams() {
  const p = new URLSearchParams(location.search);
  return {
    name: p.get("name") || "ゲスト",
    score: Number(p.get("score") || 0),
    miss: Number(p.get("miss") || 0),
    accuracy: p.get("accuracy") || "0.0",
    employee: p.get("employee") === "1"
  };
}

function loadMissData() {
  try {
    const raw = localStorage.getItem("missData");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function init() {
  const params = getParams();

  document.getElementById("res-name").textContent = params.name;
  document.getElementById("res-score").textContent = params.score;
  document.getElementById("res-miss").textContent = params.miss;
  document.getElementById("res-accuracy").textContent = params.accuracy;
  document.getElementById("res-employee").textContent = params.employee ? "社員（ランキング対象）" : "非社員（ランキング非対象）";

  const missData = loadMissData();
  const tbody = document.querySelector("#miss-table tbody");
  tbody.innerHTML = "";

  missData.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.word}</td>
      <td>${row.input}</td>
      <td>${row.correct}</td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("btn-retry").addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", init);
