/* ============================================================
   audio.js
   ゲーム全体の音管理
   - BGM（タイトル / ゲーム / リザルト）
   - SE（タイプ音 / ヒット音 / ビーム音）
   - 音量管理
   - 再生・停止
   ============================================================ */


/* ------------------------------------------------------------
   BGM 用 <audio> 要素を生成
   ------------------------------------------------------------ */
const bgmTitle = new Audio("audio/bgm_title.mp3");
const bgmGame  = new Audio("audio/bgm_game.mp3");
const bgmResult = new Audio("audio/bgm_result.mp3");

// ループ設定
bgmTitle.loop = true;
bgmGame.loop = true;
bgmResult.loop = true;


/* ------------------------------------------------------------
   SE（効果音）を読み込み
   ------------------------------------------------------------ */
const seType = new Audio("audio/se_type.mp3");       // タイプ音
const seHit = new Audio("audio/se_hit.mp3");         // ヒット音
const seBeam = new Audio("audio/se_beam.mp3");       // ビーム発射
const seDamage = new Audio("audio/se_damage.mp3");   // ダメージ音


/* ------------------------------------------------------------
   音量設定（必要に応じて調整）
   ------------------------------------------------------------ */
bgmTitle.volume = 0.6;
bgmGame.volume = 0.6;
bgmResult.volume = 0.6;

seType.volume = 0.8;
seHit.volume = 1.0;
seBeam.volume = 1.0;
seDamage.volume = 1.0;


/* ============================================================
   BGM 再生関数
   ============================================================ */
export function playBGM(scene) {
  stopAllBGM();

  switch (scene) {
    case "title":
      bgmTitle.play();
      break;

    case "game":
      bgmGame.play();
      break;

    case "result":
      bgmResult.play();
      break;
  }
}


/* ------------------------------------------------------------
   全 BGM 停止
   ------------------------------------------------------------ */
export function stopAllBGM() {
  bgmTitle.pause();
  bgmGame.pause();
  bgmResult.pause();

  // 停止後に再生位置を先頭に戻す
  bgmTitle.currentTime = 0;
  bgmGame.currentTime = 0;
  bgmResult.currentTime = 0;
}


/* ============================================================
   SE 再生関数
   ============================================================ */
export function playSE(name) {
  switch (name) {
    case "type":
      seType.currentTime = 0;
      seType.play();
      break;

    case "hit":
      seHit.currentTime = 0;
      seHit.play();
      break;

    case "beam":
      seBeam.currentTime = 0;
      seBeam.play();
      break;

    case "damage":
      seDamage.currentTime = 0;
      seDamage.play();
      break;
  }
}


/* ============================================================
   音量調整（必要なら UI から呼ぶ）
   ============================================================ */
export function setBGMVolume(v) {
  bgmTitle.volume = v;
  bgmGame.volume = v;
  bgmResult.volume = v;
}

export function setSEVolume(v) {
  seType.volume = v;
  seHit.volume = v;
  seBeam.volume = v;
  seDamage.volume = v;
}
