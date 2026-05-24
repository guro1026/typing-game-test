// ============================
// title.js（タイトル画面の処理）
// ============================

// ----------------------------
// 他ファイルの機能を読み込む
// ----------------------------
import { startGame } from "./main.js";  // ゲーム開始
import { applyUITheme, detectGenderFromName, applyCharacterImage, applyKiColorTheme } from "./ui.js"; // UIテーマ関連
import { audio } from "./audio.js";     // 音量スライダー同期用

// ----------------------------
// DOM 要素の取得
// ----------------------------
const nameInput = document.getElementById("name-input");       // 名前入力欄
const nameError = document.getElementById("name-error");       // エラー表示
const nameSubmit = document.getElementById("name-submit");     // 決定ボタン
const courseButtons = document.getElementById("course-buttons"); // コース選択ボタン
const volumeSlider = document.getElementById("volume-slider"); // タイトル画面の音量スライダー

// ----------------------------
// 名前入力 → 決定ボタン押下
// ----------------------------
nameSubmit.addEventListener("click", () => {
  validateName();
});

// Enterキーでも決定できるようにする
nameInput.addEventListener("keydown", e => {
  if (e.key === "Enter") validateName();
});

// ----------------------------
// 名前チェック & UIテーマ適用
// ----------------------------
function validateName() {
  const name = nameInput.value.trim();

  // 空欄チェック
  if (name === "") {
    nameError.textContent = "名前を入力してください";
    return;
  }

  // 全角スペース区切りチェック（姓　名）
  if (!name.includes("　")) {
    nameError.textContent = "姓と名の間に全角スペースを入れてください";
    return;
  }

  // エラー消す
  nameError.textContent = "";

  // ★ 名前から性別を推測（UIテーマ切り替えのため）
  const gender = detectGenderFromName(name);

  // ★ UIテーマ（背景・色など）を適用
  applyUITheme(gender);

  // ★ キャラ画像を男女で切り替え
  applyCharacterImage(gender);

  // ★ 気弾の色も男女で切り替え
  applyKiColorTheme(gender);

  // ★ 名前と性別を保存（ゲーム画面でも使う）
  localStorage.setItem("playerName", name);
  localStorage.setItem("playerGender", gender);

  // ★ コース選択ボタンを表示
  courseButtons.style.display = "block";

  // ★ 名前入力欄を非表示にする
  document.getElementById("name-area").style.display = "none";
}

// ----------------------------
// コース選択（初級 / 中級 / 上級）
// ----------------------------
document.querySelectorAll(".course-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const course = btn.dataset.course; // easy / normal / hard

    // ★ ゲーム開始（main.js の startGame を呼ぶ）
    startGame(course);
  });
});

// ----------------------------
// 音量スライダー（タイトル画面）
// ----------------------------
volumeSlider.addEventListener("input", () => {
  const vol = volumeSlider.value / 100;

  // ★ audio.js の BGM 音量を変更
  audio.setVolume(vol);

  // ゲーム画面のスライダーと同期（存在する場合）
  const gameSlider = document.getElementById("volume-slider-game");
  if (gameSlider) gameSlider.value = volumeSlider.value;
});
