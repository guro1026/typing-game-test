const supabaseUrl = "https://xxxxx.supabase.co";
const supabaseKey = "YOUR_API_KEY";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 今月の範囲
const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

async function loadRanking() {
  const { data, error } = await supabase
    .from("scores")
    .select("*")
    .gte("created_at", startOfMonth)
    .lt("created_at", endOfMonth)
    .order("score", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  // 月間ベスト
  document.getElementById("bestScore").textContent = data.length > 0 ? data[0].score : "--";

  // ランキング表示
  const list = document.getElementById("rankingList");
  list.innerHTML = "";

  data.slice(0, 10).forEach((row, i) => {
    const div = document.createElement("div");
    div.className = "rank-row";
    div.innerHTML = `
      <span>${i + 1}</span>
      <span>${row.name}</span>
      <span>${row.score}</span>
    `;
    list.appendChild(div);
  });
}

loadRanking();
