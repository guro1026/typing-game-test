// effects.js
import { audio } from "./audio.js";

const kiBall = document.getElementById("ki-ball");
const beamEl = document.getElementById("beam");

export const effects = {
  kiPower: 0, // 0〜100

  addKi(amount = 5) {
    this.kiPower = Math.min(100, this.kiPower + amount);
    this.updateKiBall();
    this.updateKiColor(this.kiPower);
  },

  resetKi() {
    this.kiPower = 0;
    this.updateKiBall();
    this.updateKiColor(0);
  },

  updateKiBall() {
    const scale = 0.4 + (this.kiPower / 100) * 0.6;
    kiBall.style.transform = `translate(-50%, -50%) scale(${scale})`;
  },

  updateKiColor(power) {
    kiBall.classList.remove("blue", "white", "gold");
    if (power < 40) {
      kiBall.classList.add("blue");
    } else if (power < 80) {
      kiBall.classList.add("white");
    } else {
      kiBall.classList.add("gold");
    }
  },

  flash() {
    const game = document.getElementById("game-screen");
    game.classList.add("flash");
    setTimeout(() => game.classList.remove("flash"), 200);
  },

  fireBeam() {
    beamEl.classList.remove("beam-fire");
    void beamEl.offsetWidth;
    beamEl.classList.add("beam-fire");
    audio.beam();
  }
};
