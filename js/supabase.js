// ============================
// supabase.js（スコア保存・ランキング取得）
// ============================
// このファイルは Supabase との通信を一元管理する。
// ・スコア保存（INSERT）
// ・ランキング取得（SELECT）
// ============================

// supabase.js

const SUPABASE_URL = "https://bznzxcllyocfairwjzzk.supabase.co";
const SUPABASE_KEY = "sb_publishable_vEVMPFsuyISRzeX8helsHA_xO4y1m8e";

// Supabase クライアント作成
export const supa = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// ------------------------------------------------------------
// スコア保存（INSERT）
// ------------------------------------------------------------
// data = {
//   name: "山田 太郎",
//   score: 123,
//   total: 150,
//   miss: 12,
//   accuracy: 92
// }
// ------------------------------------------------------------
export async function saveScore(data) {
  try {
    // Supabase の score_logs テーブルに INSERT
    const { error } = await supa
      .from("score_logs")
      .insert({
        name: data.name,
        score: data.score,
        total: data.total,
        miss: data.miss,
        accuracy: data.accuracy,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error("Supabase 保存エラー:", error);
    }

  } catch (e) {
    console.error("通信エラー:", e);
  }
}


// ------------------------------------------------------------
// ランキング取得（上位10件）
// ------------------------------------------------------------
// return: [{ name, score, accuracy, created_at }, ... ]
// ------------------------------------------------------------
export async function loadRanking() {
  try {
    const { data, error } = await supa
      .from("score_logs")
      .select("*")
      .order("score", { ascending: false }) // スコア降順
      .limit(10);                           // 上位10件

    if (error) {
      console.error("ランキング取得エラー:", error);
      return [];
    }

    return data;

  } catch (e) {
    console.error("通信エラー:", e);
    return [];
  }
}


// ------------------------------------------------------------
// 外部から使えるように export
// ------------------------------------------------------------
export const supabaseAPI = {
  saveScore,
  loadRanking
};