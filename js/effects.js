/* ============================================================
   effects.js
   攻撃エフェクト制御（JS）
   - 気弾
   - ビーム（かめはめ波）
   - ダメージ点滅
   - 画面揺れ
   - 爆発エフェクト
   ============================================================ */

import { playSE } from "./audio.js";

/* ------------------------------------------------------------
   DOM 要素取得
   ------------------------------------------------------------ */
const kiBall = document.getElementById("ki-ball");
const beam = document.getElementById("beam");
const hitEffect = document.getElementById("hit-effect");
const gameScreen = document.getElementById("game-screen");
const enemy = document.getElementById("enemy");
const player = document.getElementById("player");



/* ============================================================
   気弾発射（プレイヤー → 敵）
   ============================================================ */
export function shootKiBall() {
  // 効果音
  playSE("beam");

  // 初期位置（プレイヤーの前）
  kiBall.style.left = "200px";
  kiBall.style.top = "300px";
  kiBall.style.display = "block";

  // アニメーション開始
  kiBall.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(800px)" }
    ],
    {
      duration: 300,
      easing: "linear"
    }
  );

  // 終了後に非表示
  setTimeout(() => {
    kiBall.style.display = "none";
  }, 300);
}



/* ============================================================
   ビーム（かめはめ波）
   ============================================================ */
export function fireBeam() {
  playSE("beam");

  beam.style.display = "block";

  // チャージ演出（CSS の .charge を付与）
  beam.classList.add("charge");

  // 発射 → 敵にヒット
  setTimeout(() => {
    beam.classList.remove("charge");

    beam.animate(
      [
        { transform: "scaleX(0.2)", opacity: 0.5 },
        { transform: "scaleX(1.0)", opacity: 1 }
      ],
      {
        duration: 200,
        easing: "ease-out"
      }
    );

    // 発射後に非表示
    setTimeout(() => {
      beam.style.display = "none";
    }, 200);

  }, 300);
}



/* ============================================================
   敵のダメージ点滅
   ============================================================ */
export function enemyDamageFlash() {
  enemy.classList.add("damage-flash");

  // 効果音
  playSE("hit");

  // 点滅終了後にクラス削除
  setTimeout(() => {
    enemy.classList.remove("damage-flash");
  }, 300);
}



/* ============================================================
   プレイヤーのダメージ点滅
   ============================================================ */
export function playerDamageFlash() {
  player.classList.add("damage-flash");

  playSE("damage");

  setTimeout(() => {
    player.classList.remove("damage-flash");
  }, 300);
}



/* ============================================================
   画面揺れ（攻撃ヒット時）
   ============================================================ */
export function screenShake() {
  gameScreen.classList.add("screen-shake");

  setTimeout(() => {
    gameScreen.classList.remove("screen-shake");
  }, 400);
}



/* ============================================================
   爆発エフェクト（敵にヒット）
   ============================================================ */
export function showHitEffect() {
  // 敵の位置を取得
  const rect = enemy.getBoundingClientRect();

  // 敵の中央に配置
  hitEffect.style.left = rect.left + rect.width / 2 - 60 + "px";
  hitEffect.style.top = rect.top + rect.height / 2 - 60 + "px";

  hitEffect.style.display = "block";

  // アニメーション終了後に非表示
  setTimeout(() => {
    hitEffect.style.display = "none";
  }, 300);
}
