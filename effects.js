// effects.js
export const effects = {
  kiPower: 0,

  updateKiBall() {
    const ball = document.getElementById("ki-ball");
    const scale = 0.1 + (this.kiPower / 100) * 0.5;
    ball.style.transform = `translate(-50%, -50%) scale(${scale})`;
  },

  updateKiColor(combo) {
    const ball = document.getElementById("ki-ball");
    ball.classList.remove("blue", "white", "gold");

    if (combo >= 20) ball.classList.add("gold");
    else if (combo >= 10) ball.classList.add("white");
    else ball.classList.add("blue");
  },

  growKi() {
    this.kiPower += 0.5;
    if (this.kiPower > 100) this.kiPower = 100;
    this.updateKiBall();
  },

  fireBeam() {
    const beam = document.getElementById("beam");
    beam.classList.add("beam-fire");
    setTimeout(() => beam.classList.remove("beam-fire"), 500);
  },

  flash() {
    document.body.classList.add("flash");
    setTimeout(() => document.body.classList.remove("flash"), 300);
  }
};
