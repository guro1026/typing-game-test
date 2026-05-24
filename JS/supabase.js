// js/supabase.js
export const supa = {
  url: "https://bznzxcllyocfairwjzzk.supabase.co",
  key: "sb_publishable_vEVMPFsuyISRzeX8helsHA_xO4y1m8e",

  async saveScore(name, score, total, miss, accuracy) {
    try {
      await fetch(`${this.url}/rest/v1/score_logs`, {
        method: "POST",
        headers: {
          "apikey": this.key,
          "Authorization": `Bearer ${this.key}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name,
          score,
          total,
          miss,
          accuracy
        })
      });
    } catch (err) {
      console.warn("Supabase 保存失敗:", err);
    }
  }
};
