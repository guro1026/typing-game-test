// supabase.js
export const supa = {
  async saveScore(name, score, total, miss, accuracy) {
    try {
      await fetch(`https://bznzxcllyocfairwjzzk.supabase.co/rest/v1/score_logs`, {
        method: "POST",
        headers: {
          "apikey": "sb_publishable_vEVMPFsuyISRzeX8helsHA_xO4y1m8e",
          "Authorization": `Bearer sb_publishable_vEVMPFsuyISRzeX8helsHA_xO4y1m8e`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({ name, score, total, miss, accuracy })
      });
    } catch (err) {
      console.warn("Supabase 保存失敗:", err);
    }
  }
};
