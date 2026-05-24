// ============================
// ui.js（UIテーマ切り替え・キャラ画像・気弾色）
// ============================
// このファイルは「男/女 UIテーマ」「キャラ画像」「気弾色」を
// すべて一元管理するためのモジュール。
// ============================


// ------------------------------------------------------------
// UIテーマ（男 / 女）を body に適用する
// ------------------------------------------------------------
export function applyUITheme(theme) {
  // まず既存のテーマクラスを全部外す
  document.body.classList.remove("male-ui", "female-ui");

  // 男 or 女 のテーマを付ける
  if (theme === "female") {
    document.body.classList.add("female-ui");
  } else {
    document.body.classList.add("male-ui");
  }

  // 次回ページ読み込み時も同じテーマにするため保存
  localStorage.setItem("uiTheme", theme);
}


// ------------------------------------------------------------
// 名前から性別を推測する（簡易ロジック）
// ------------------------------------------------------------
// 例：
//  - 「花子」→ female
//  - 「太郎」→ male
//  - 「美咲」→ female
//  - 「翔太」→ male
// ------------------------------------------------------------
export function detectGenderFromName(name) {
  // 姓 名 の「名」だけ取り出す（姓と名の間は全角スペース）
  const firstName = name.split("　")[1];

  // 女の子っぽい名前の特徴（語尾や漢字）
  const femalePatterns = [
    /子$/, /美/, /愛/, /香/, /奈/, /菜/, /彩/,
    /み$/, /り$/, /な$/, /あ$/
  ];

  // どれか1つでも当てはまれば female
  if (femalePatterns.some(p => p.test(firstName))) {
    return "female";
  }

  // 男の子っぽい名前の特徴
  const malePatterns = [
    /太$/, /郎$/, /也$/, /介$/, /樹$/, /人$/,
    /大/, /翔/, /健/, /真/, /亮/
  ];

  if (malePatterns.some(p => p.test(firstName))) {
    return "male";
  }

  // どちらでもなければ男扱い（無難）
  return "male";
}


// ------------------------------------------------------------
// キャラ画像を男女で切り替える
// ------------------------------------------------------------
// images/character_male.png
// images/character_female.png
// を使う前提
// ------------------------------------------------------------
export function applyCharacterImage(theme) {
  const char = document.getElementById("character");
  if (!char) return; // ゲーム画面以外では存在しない

  // 女の子 → 女キャラ画像
  // 男の子 → 男キャラ画像
  char.src = theme === "female"
    ? "images/character_female.png"
    : "images/character_male.png";
}


// ------------------------------------------------------------
// 気弾の色を男女で切り替える
// ------------------------------------------------------------
// 男 → 青（blue）
// 女 → ピンク（pink）
// ------------------------------------------------------------
export function applyKiColorTheme(theme) {
  const ball = document.getElementById("ki-ball");
  if (!ball) return;

  // 既存の色クラスを外す
  ball.classList.remove("blue", "pink");

  // 女の子 → ピンク
  // 男の子 → 青
  if (theme === "female") {
    ball.classList.add("pink");
  } else {
    ball.classList.add("blue");
  }
}


// ------------------------------------------------------------
// ページ読み込み時に UIテーマを復元する
// ------------------------------------------------------------
// main.js の DOMContentLoaded で呼ばれる
// ------------------------------------------------------------
export function initUITheme() {
  const saved = localStorage.getItem("uiTheme") || "male";

  // UIテーマ適用
  applyUITheme(saved);

  // キャラ画像も復元
  applyCharacterImage(saved);

  // 気弾色も復元
  applyKiColorTheme(saved);
}
