// ============================
// effects.js（演出）
// ============================

// 画面フラッシュ
export function flashScreen() {
  document.body.classList.add("flash");
  setTimeout(() => {
    document.body.classList.remove("flash");
  }, 300);
}

// ビーム発射（CSSアニメを付け外し）
export function triggerBeam() {
  const beam = document.getElementById("beam");
  beam.classList.add("beam-fire");

  setTimeout(() => {
    beam.classList.remove("beam-fire");
  }, 500);
}
