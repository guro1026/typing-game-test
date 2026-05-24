/* ============================================================
   ui.js
   UIテーマ切り替え（男性 / 女性）
   - body にテーマクラスを付与
   - HPバー色変更
   - ボタン色変更
   - キャラ画像切り替え
   ============================================================ */


/* ------------------------------------------------------------
   DOM 要素
   ------------------------------------------------------------ */
const body = document.body;

const player = document.getElementById("player");
const enemy = document.getElementById("enemy");

const playerHPBar = document.querySelector("#player-hp div");
const enemyHPBar = document.querySelector("#enemy-hp div");

const allButtons = document.querySelectorAll("button");



/* ============================================================
   性別テーマを適用
   ============================================================ */
export function applyUIByGender(gender) {

  /* --------------------------------------------
     body のテーマクラスを切り替え
     -------------------------------------------- */
  body.classList.remove("male-theme", "female-theme");

  if (gender === "male") {
    body.classList.add("male-theme");
  } else {
    body.classList.add("female-theme");
  }


  /* --------------------------------------------
     プレイヤーキャラ画像切り替え
     -------------------------------------------- */
  if (player) {
    if (gender === "male") {
      player.src = "images/characters/player_male.png";
    } else {
      player.src = "images/characters/player_female.png";
    }
  }


  /* --------------------------------------------
     HPバー色切り替え
     -------------------------------------------- */
  if (gender === "male") {
    playerHPBar.style.background = "#4da3ff";  // 青
    enemyHPBar.style.background = "#ff4d4d";   // 赤
  } else {
    playerHPBar.style.background = "#ff66cc";  // ピンク
    enemyHPBar.style.background = "#ff4d4d";   // 赤（共通）
  }


  /* --------------------------------------------
     ボタン色切り替え
     -------------------------------------------- */
  allButtons.forEach(btn => {
    if (gender === "male") {
      btn.style.background = "rgba(0, 120, 255, 0.8)";
      btn.style.borderColor = "rgba(0, 120, 255, 1)";
    } else {
      btn.style.background = "rgba(255, 80, 160, 0.8)";
      btn.style.borderColor = "rgba(255, 80, 160, 1)";
    }
  });
}
