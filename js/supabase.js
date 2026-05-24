/* ============================================================
   supabase.js（修正版）
   Supabase との接続だけを担当するファイル
   - INSERT / SELECT は results.js で行う
   ============================================================ */

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

/* ------------------------------------------------------------
   Supabase プロジェクトの URL と API KEY
   ※ あなたのプロジェクトの値をそのまま使用
   ------------------------------------------------------------ */
const SUPABASE_URL = "https://bznzxcllyocfairwjzzk.supabase.co";
const SUPABASE_KEY = "sb_publishable_vEVMPFsuyISRzeX8helsHA_xO4y1m8e";

/* ------------------------------------------------------------
   Supabase クライアントを作成
   ------------------------------------------------------------ */
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
