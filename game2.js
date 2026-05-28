// ======================================================
// 🔊 グローバル変数（どの関数からも使えるようにする）
// ======================================================
let bgm, seHit, seBeep, volumeSlider;


// ======================================================
// 📌 DOM が読み込まれてから実行（HTML が先に必要なため）
// ======================================================
document.addEventListener("DOMContentLoaded", async () => {

  // ============================
  // 🎵 BGM / SE / スライダー初期化
  // ============================

  // ▼ 音声ファイル読み込み
  bgm = new Audio("sounds/bgm.mp3");
  seHit = new Audio("sounds/hit.mp3");
  seBeep = new Audio("sounds/beep.mp3");

  // ▼ スライダー取得
  volumeSlider = document.getElementById("volume-slider");

  // ▼ BGM 設定
  bgm.loop = true;
  bgm.volume = 0; // 初期は無音

  // ▼ 自動再生ブロック対策
  bgm.play().catch(() => {
    const once = () => {
      bgm.play().catch(() => {});
      document.removeEventListener("click", once);
      document.removeEventListener("keydown", once);
    };
    document.addEventListener("click", once);
    document.addEventListener("keydown", once);
  });

  // ▼ スライダーで BGM & SE の音量を統一
  volumeSlider.addEventListener("input", () => {
    const vol = volumeSlider.value / 100;
    bgm.volume = vol;
    seHit.volume = vol;
    seBeep.volume = vol;
  });



  // ======================================================
  // 🔰 Supabase 初期化
  // ======================================================
  let SUPABASE_URL = "";
  let SUPABASE_KEY = "";
  let client = null;

  async function loadConfig() {
    try {
      const res = await fetch("config.json");
      const config = await res.json();
      const env = config.env;

      SUPABASE_URL = config.supabase[env].url;
      SUPABASE_KEY = config.supabase[env].key;

      client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

      console.log(`Supabase 初期化完了！環境 → ${env}`);
    } catch (e) {
      console.error("config.json の読み込みに失敗:", e);
    }
  }

  // ▼ Supabase を使える状態にする
  await loadConfig();



  // ======================================================
  // 🎮 ゲーム状態管理
  // ======================================================
  let state = "title";
  let selectedCourse = null;

  let words = [];
  let currentJP = "";
  let currentRomaji = "";
  let originalRomaji = "";

  let score = 0;
  let combo = 0;
  let maxCombo = 0;
  let timeLeft = 60;
  let timerInterval = null;

  // 弱点分析用
  let totalTyped = 0;
  let missCount = 0;
  let missVowel = 0;
  let missConsonant = 0;
  let missYouon = 0;



  // ======================================================
  // ⌨ ESC でタイトルへ戻る
  // ======================================================
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      returnToTitle();
    }
  });


  // ======================================================
  // 🏠 タイトルへ戻る処理
  // ======================================================
  function returnToTitle() {
    if (timerInterval) clearInterval(timerInterval);

    state = "title";
    score = 0;
    combo = 0;
    maxCombo = 0;
    timeLeft = 60;

    // ▼ 音量を 0 に戻す（タイトルは無音スタート）
    volumeSlider.value = 0;
    bgm.volume = 0;
    seHit.volume = 0;
    seBeep.volume = 0;

    document.getElementById("game-screen").style.display = "none";
    document.getElementById("title-screen").style.display = "block";
    document.getElementById("volume-area").style.display = "block";

    updateHUD();
  }



  // ======================================================
  // 📝 名前入力
  // ======================================================
  document.getElementById("name-submit").addEventListener("click", validateName);

  function validateName() {
    const input = document.getElementById("name-input");
    const error = document.getElementById("name-error");
    const name = input.value.trim();

    if (name === "") {
      error.textContent = "※ 名前を入力してください";
      input.classList.add("error");
      seBeep.currentTime = 0;
      seBeep.play();
      return;
    }

    input.classList.remove("error");
    error.textContent = "";

    localStorage.setItem("playerName", name);

    document.getElementById("name-area").style.display = "none";
    document.getElementById("course-buttons").style.display = "block";
  }



  // ======================================================
  // 📚 コース選択
  // ======================================================
document.querySelectorAll(".course-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedCourse = btn.dataset.course;
    localStorage.setItem("selectedCourse", selectedCourse);
    location.href = "play.html";
  });
});



// ======================================================
// ▶ ゲーム開始
// ======================================================
function startGame() {
  state = "loading";

  // ★ 遊び方ページで選んだ BGM ON/OFF を反映
  const bgmEnabled = localStorage.getItem("bgmEnabled") === "1";
  if (!bgmEnabled) {
    bgm.volume = 0;
    volumeSlider.value = 0;
  }

  document.getElementById("title-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";
  document.getElementById("volume-area").style.display = "none";

  // ▼ 名前から性別判定 → キャラ・背景・気弾切替
  const playerName = localStorage.getItem("playerName") || "";
  const character = document.getElementById("character");
  const kiBall = document.getElementById("ki-ball");
  const bgLayer = document.getElementById("bg-layer-game");

  fetch("employee_list.csv")
    .then(res => res.text())
    .then(text => {
      const lines = text.trim().split("\n").slice(1);
      let gender = "male";

      for (const line of lines) {
        const [name, g] = line.split(",").map(s => s.trim());
        if (name === playerName) {
          gender = g;
          break;
        }
      }

      localStorage.setItem("gender", gender);

      // ▼ キャラ画像
      if (gender === "female") {
        character.src = "images/character/women/kiball_woman.png";
        document.body.classList.add("pink-theme");
      } else {
        character.src = "images/character/men/kiball_man.png";
        document.body.classList.remove("pink-theme");
      }

      // ▼ 背景
      bgLayer.style.backgroundImage =
        gender === "female"
          ? 'url("images/bg/game_bg_woman.png")'
          : 'url("images/bg/game_bg_man.png")';

      // ▼ 気弾
      kiBall.style.backgroundImage =
        gender === "female"
          ? 'url("images/kiball/pink.png")'
          : 'url("images/kiball/blue.png")';
    });

  // ▼ ステータス初期化
  score = 0;
  combo = 0;
  maxCombo = 0;
  timeLeft = 60;

  totalTyped = 0;
  missCount = 0;
  missVowel = 0;
  missConsonant = 0;
  missYouon = 0;

  updateHUD();

  // ▼ 気弾初期化
  kiPower = 0;
  const ball = document.getElementById("ki-ball");
  ball.classList.remove("white", "gold", "pulse");
  ball.classList.add("blue");
  ball.style.transform = "translate(-50%, -50%) scale(0.02)";

  // ▼ タイマー開始 & CSV 読み込み
  startTimer();
  loadCSV(selectedCourse);
}

  // ======================================================
  // ⏱ タイマー
  // ======================================================
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      timeLeft--;
      updateHUD();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame();
      }
    }, 1000);
  }



  // ======================================================
  // HUD 更新
  // ======================================================
  function updateHUD() {
    document.getElementById("hud-score").textContent = score;
    document.getElementById("hud-combo").textContent = combo;
    document.getElementById("hud-time").textContent = timeLeft;
  }



  // ======================================================
  // 📄 CSV 読み込み
  // ======================================================
  function loadCSV(course) {
    fetch(`words_${course}.csv`)
      .then(res => res.text())
      .then(text => {
        const lines = text.trim().split("\n");
        words = lines.slice(1).map(line => line.trim());
        nextWord();
      });
  }



  // ======================================================
  // 次のお題へ
  // ======================================================
  function nextWord() {
    if (timeLeft <= 0) return;

    const line = words[Math.floor(Math.random() * words.length)].trim();
    const cols = line.split(",").map(c => c.trim());

    currentJP = cols[0] || "";
    currentRomaji = cols[2] || "";
    originalRomaji = currentRomaji;

    document.getElementById("word-jp").textContent = currentJP;
    document.getElementById("word-romaji").textContent = currentRomaji;

    state = "playing";
  }



  // ======================================================
  // ⌨ キー入力処理
  // ======================================================
  document.addEventListener("keydown", e => {
    if (state !== "playing") return;
    if (timeLeft <= 0) return;

    const key = e.key.toLowerCase();
    if (!/^[a-z]$/.test(key)) return;

    const target = currentRomaji[0]?.toLowerCase();
    totalTyped++;

    highlightKey(e.key);

    if (!target) return;

    // ▼ 正解
    if (key === target) {
      seHit.currentTime = 0;
      seHit.play();

      currentRomaji = currentRomaji.slice(1);
      document.getElementById("word-romaji").textContent = currentRomaji;

      let add = 1;
      if (combo >= 5) add = 5;
      else if (combo >= 3) add = 3;

      const willClear = currentRomaji.length === 0;
      const nextCombo = combo + 1;

      if (willClear) {
        if (nextCombo === 10) add *= 10;
        if (nextCombo === 15) add *= 15;
        if (nextCombo === 20) add *= 20;
      }

      score += add;
      updateHUD();

      if (currentRomaji.length === 0) {
        combo++;
        if (combo > maxCombo) maxCombo = combo;

        growKi();

        updateHUD();
        setTimeout(nextWord, 200);
      }

    } else {
      // ▼ ミス
      seBeep.currentTime = 0;
      seBeep.play();

      missCount++;

      if ("aiueo".includes(target)) missVowel++;
      else if (target === "y") missYouon++;
      else missConsonant++;

      combo = 0;
      updateHUD();
    }
  });



  // ======================================================
  // ⌨ キーボード光演出
  // ======================================================
  function highlightKey(key) {
    const upper = key.toUpperCase();
    const keyEl = [...document.querySelectorAll(".key")]
      .find(k => k.textContent.toUpperCase() === upper);

    if (!keyEl) return;

    keyEl.classList.add("active");
    setTimeout(() => keyEl.classList.remove("active"), 150);
  }



  // ======================================================
  // 🔵 気弾成長
  // ======================================================
  let kiPower = 0;

  function updateKiBall() {
    const ball = document.getElementById("ki-ball");
    const scale = 0.1 + (kiPower / 100) * 0.5;
    ball.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }

  function growKi() {
    if (combo === 1) kiPower += 6;
    else kiPower += 0.5;

    if (kiPower > 100) kiPower = 100;
    updateKiBall();
  }



  // ======================================================
  // 🔥 ビーム演出
  // ======================================================
  function fireBeam() {
    const beam = document.getElementById("beam");
    beam.classList.add("beam-fire");
    setTimeout(() => beam.classList.remove("beam-fire"), 500);
  }



  // ======================================================
  // 👾 敵撃破ロジック
  // ======================================================
  function getDefeatedEnemy(score) {
    if (score <= 10000) return "サイバイマン";
    if (score <= 20000) return "ラディッツ";
    if (score <= 30000) return "ナッパ";
    if (score <= 40000) return "ベジータ（初期）";
    if (score <= 50000) return "フリーザ（第1形態）";
    if (score <= 60000) return "フリーザ（最終形態）";
    if (score <= 70000) return "セル（完全体）";
    if (score <= 80000) return "魔人ブウ（善）";
    if (score <= 90000) return "魔人ブウ（純粋）";
    if (score <= 100000) return "ビルス";
    return "破壊神クラス撃破";
  }



  // ======================================================
  // 🧠 弱点分析コメント
  // ======================================================
  function getWeaknessComment(accuracy, v, c, y) {
    if (accuracy >= 95) return "お前…強くなったな。もう上級者の領域だぞ。";

    const maxMiss = Math.max(v, c, y);

    if (maxMiss === 0) return "まだまだ伸びしろだらけだな…修行を続けろ！";
    if (maxMiss === y) return "拗音がまだ甘えな…“kyo”や“sha”を鍛えりゃもっと強くなれるぞ！";
    if (maxMiss === v) return "基本の母音でつまずいてるぞ…落ち着いて指を動かせ！";
    return "子音の切り替えが遅いな…もっとリズムを意識しろ！";
  }



  // ======================================================
  // 💾 Supabase 保存
  // ======================================================
  async function saveScoreToSupabase(data) {
    try {
      const { error } = await client.from("score_logs").insert(data);
      if (error) console.error("Supabase 保存エラー:", error);
    } catch (e) {
      console.error("Supabase 通信エラー:", e);
    }
  }



  // ======================================================
  // 🏁 ゲーム終了処理
  // ======================================================
  function endGame() {
    state = "end";

    kiPower = 100;
    updateKiBall();

    document.body.classList.add("flash");
    setTimeout(() => document.body.classList.remove("flash"), 300);

    fireBeam();

    const accuracy =
      totalTyped > 0
        ? Math.floor(((totalTyped - missCount) / totalTyped) * 100)
        : 0;

    const defeatedEnemy = getDefeatedEnemy(score);
    const weaknessComment = getWeaknessComment(
      accuracy,
      missVowel,
      missConsonant,
      missYouon
    );

    const playerName = localStorage.getItem("playerName") || "名無し";

    localStorage.setItem("score", score);
    localStorage.setItem("maxCombo", maxCombo);
    localStorage.setItem("accuracy", accuracy);
    localStorage.setItem("totalTyped", totalTyped);
    localStorage.setItem("missCount", missCount);
    localStorage.setItem("defeatedEnemy", defeatedEnemy);
    localStorage.setItem("weaknessComment", weaknessComment);

    saveScoreToSupabase({
      name: playerName,
      score: score,
      max_combo: maxCombo,
      accuracy: accuracy,
      total_typed: totalTyped,
      miss_count: missCount,
      defeated_enemy: defeatedEnemy,
      created_at: new Date().toISOString()
    });

    setTimeout(() => {
      location.href = "results.html";
    }, 800);
  }

});
