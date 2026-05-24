// supabase.js

const SUPABASE_URL = "https://bznzxcllyocfairwjzzk.supabase.co";
const SUPABASE_KEY = "sb_publishable_vEVMPFsuyISRzeX8helsHA_xO4y1m8e";

export const supa = {
  async saveScore(name, score, total, miss, accuracy) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/score_logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          name,
          score,
          total,
          miss,
          accuracy,
          created_at: new Date().toISOString()
        })
      });

      if (!res.ok) {
        console.error("Supabase 保存失敗:", await res.text());
      }
    } catch (e) {
      console.error("Supabase 通信エラー:", e);
    }
  }
};
