// ============================
// game.js（ゲームロジック）
// ============================

// ----------------------------
// 他ファイルの読み込み
// ----------------------------
import { audio } from "./audio.js";                     // タイプ音・ミス音・ビーム音
import { state, timerInterval, endGame } from "./main.js"; // ゲーム状態管理
import { highlightKey } from "./keyboard.js";           // キー光アニメ
import { supa } from "./supabase.js";                   // Supabase 保存
import { applyCharacterImage, applyKiColorTheme } from "./ui.js"; // UIテーマ反映

// ----------------------------
// ゲーム用変数
// ----------------------------
let words = [];         // CSVから読み込んだ単語リスト
let currentJP = "";     // 現在の日本語
let currentRomaji = ""; // 現在のローマ字（残り）
let originalRomaji = ""; // 最初のローマ字（表示用）

let score = 0;          // スコア
let combo = 0;          // 現在のコンボ
let maxCombo = 0;       // 最大コンボ
let timeLeft = 60;      // 残り時間（秒）

let kiPower = 0;        // 気弾の成長率（0〜100）

// ★ タイプ数カウント
let total = 0;          // 総タイプ数
let miss = 0;           // ミス数
let accuracy = 0;       // 正確率（%）

// ----------------------------
// ゲーム開始（main.js から呼ばれる）
// ----------------------------
export function startGameLogic(course) {

  // ★ UIテーマ（男/女）をゲーム画面に反映
  const gender = localStorage.getItem("playerGender") || "male";
  applyCharacterImage(gender);
  applyKiColorTheme(gender);

  // スコア系初期化
  score = 0;
  combo = 0;
  maxCombo = 0;
  timeLeft = 60;

  // タイプ数初期化
  total = 0;
  miss = 0;
  accuracy = 0;

  updateHUD();   // HUD更新
  initKiBall();  // 気弾初期化
  startTimer();  // タイマー開始
  loadCSV(course); // CSV読み込み
}

// ----------------------------
// タイマー処理（1秒ごと）
// ----------------------------
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);

  window.timerInterval = setInterval(() => {
    timeLeft--;
    updateHUD();

    // 時間切れ
    if (timeLeft <= 0) {
      clearInterval(window.timerInterval);
      endGame(); // main.js の endGame()
    }
  }, 1000);
}

// ----------------------------
// CSV読み込み
// ----------------------------
function loadCSV(course) {
  fetch(`csv/words_${course}.csv`)
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split("\n");
      words = lines.slice(1).map(line => line.trim()); // 1行目はヘッダー
      nextWord();
    });
}

// ----------------------------
// 次の単語へ
// ----------------------------
function nextWord() {
  if (timeLeft <= 0) return;

  // ランダムに1行取得
  const line = words[Math.floor(Math.random() * words.length)];
  const cols = line.split(",").map(c => c.trim());

  currentJP = cols[0] || "";
  currentRomaji = cols[2] || "";
  originalRomaji = currentRomaji;

  updateDisplay();
}

// ----------------------------
// 単語表示更新
// ----------------------------
function updateDisplay() {
  document.getElementById("word-jp").textContent = currentJP;
  document.getElementById("word-romaji").textContent = currentRomaji;
}

// ----------------------------
// HUD更新（スコア・コンボ・時間）
// ----------------------------
function updateHUD() {
  document.getElementById("hud-score").textContent = score;
  document.getElementById("hud-combo").textContent = combo;
  document.getElementById("hud-time").textContent = timeLeft;
}

// ----------------------------
// タイピング判定（キー押下）
// ----------------------------
document.addEventListener("keydown", e => {
  // ゲーム中以外は無視
  if (state !== "playing") return;
  if (timeLeft <= 0) return;

  const key = e.key.toLowerCase();                // 押したキー
  const target = currentRomaji[0]?.toLowerCase(); // 正解の1文字目

  highlightKey(e.key); // キーボード光

  if (!target) return;

  // ★ 総タイプ数カウント
  total++;

  // ----------------------------
  // 正解
  // ----------------------------
  if (key === target) {
    audio.typeGood(); // 正解音

    // 1文字削る
    currentRomaji = currentRomaji.slice(1);
    updateDisplay();

    // スコア加算（コンボで倍率）
    let add = 1;
    if (combo >= 5) add = 5;
    else if (combo >= 3) add = 3;

    score += add;
    updateHUD();

    updateKiColor(combo); // 気弾色（コンボで変化）

    // 単語をすべて打ち切った
    if (currentRomaji.length === 0) {
      growKi(); // 気弾成長

      combo++;
      if (combo > maxCombo) maxCombo = combo;
      updateHUD();

      setTimeout(nextWord, 200);
    }

  // ----------------------------
  // ミス
  // ----------------------------
  } else {
    miss++; // ★ ミスカウント

    audio.typeMiss(); // ミス音
    combo = 0;        // コンボリセット
    updateHUD();
    updateKiColor(combo);
  }

  // ★ 正確率更新
  accuracy = total > 0 ? Math.floor((total - miss) / total * 100) : 0;
});

// ----------------------------
// 気弾初期化
// ----------------------------
function initKiBall() {
  kiPower = 0;
  const ball = document.getElementById("ki-ball");

  // 色クラスをリセット
  ball.classList.remove("white", "gold");
  ball.classList.add("blue"); // 初期は青（UIテーマで上書きされる）

  ball.classList.remove("pulse");
  ball.style.transform = "translate(-50%, -50%) scale(0.02)";
}

// ----------------------------
// 気弾の大きさ更新
// ----------------------------
function updateKiBall() {
  const ball = document.getElementById("ki-ball");

  // 気弾の大きさ（0.1〜0.6）
  const scale = 0.1 + (kiPower / 100) * 0.5;
  ball.style.transform = `translate(-50%, -50%) scale(${scale})`;

  // 100%で脈動アニメ
  if (kiPower >= 100) {
    ball.classList.add("pulse");
  }
}

// ----------------------------
// コンボによる気弾色変化
// ----------------------------
function updateKiColor(combo) {
  const ball = document.getElementById("ki-ball");
  ball.classList.remove("blue", "white", "gold");

  if (combo >= 20) ball.classList.add("gold");
  else if (combo >= 10) ball.classList.add("white");
  else ball.classList.add("blue");
}

// ----------------------------
// 気弾成長
// ----------------------------
function growKi() {
  kiPower += 0.5;
  if (kiPower > 100) kiPower = 100;
  updateKiBall();
}

// ----------------------------
// ビーム発射
// ----------------------------
function fireBeam() {
  const beam = document.getElementById("beam");
  beam.classList.add("beam-fire");
  audio.beam(); // ビーム音

  setTimeout(() => {
    beam.classList.remove("beam-fire");
  }, 500);
}

// ----------------------------
// ゲーム終了処理（結果画面へ）
// ----------------------------
export function endGameLogic() {
  // 気弾 MAX にして演出
  kiPower = 100;
  updateKiBall();

  // 画面フラッシュ
  document.body.classList.add("flash");
  setTimeout(() => {
    document.body.classList.remove("flash");
  }, 300);

  // ビーム発射
  fireBeam();

  // ★ Supabase 保存
  supa.saveScore({
    name: localStorage.getItem("playerName"),
    score,
    total,
    miss,
    accuracy
  });

  // ★ 結果を localStorage に保存（results.html で使う）
  localStorage.setItem("last_score", score);
  localStorage.setItem("last_maxcombo", maxCombo);
  localStorage.setItem("last_total", total);
  localStorage.setItem("last_miss", miss);
  localStorage.setItem("last_accuracy", accuracy);

  // ★ 結果画面へ遷移
  setTimeout(() => {
    window.location.href = "results.html";
  }, 700);
}
