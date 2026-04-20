import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://gzoxsnsbzjbmatdxwyhh.supabase.co",
  "sb_publishable_EYpEiEJ_Q4ElsyvyI1ZDtw_q9lOgU_A"
);

export default function App() {
  const [session, setSession] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [eggs, setEggs] = useState<any[]>([]);
  const [chickens, setChickens] = useState<any[]>([]);
  const [newChicken, setNewChicken] = useState("");

  const [date, setDate] = useState("");
  const [count, setCount] = useState(0);
  const [selectedChicken, setSelectedChicken] = useState("");

  const [eggPrice, setEggPrice] = useState(0);
  const [feedCost, setFeedCost] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) {
      fetchEggs();
      fetchChickens();
    }
  }, [session]);

  async function fetchEggs() {
    const { data } = await supabase
      .from("eggs")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date", { ascending: false });

    setEggs(data || []);
  }

  async function fetchChickens() {
    const { data } = await supabase
      .from("chickens")
      .select("*")
      .eq("user_id", session.user.id);

    setChickens(data || []);
  }

  async function addChicken() {
    if (!newChicken) return;

    await supabase.from("chickens").insert([
      { name: newChicken, user_id: session.user.id },
    ]);

    setNewChicken("");
    fetchChickens();
  }

  async function deleteChicken(id: string) {
    await supabase.from("chickens").delete().eq("id", id);
    fetchChickens();
  }

  async function addEggs() {
    if (!date || !count) return alert("Fill all fields");

    await supabase.from("eggs").insert([
      {
        date,
        count,
        user_id: session.user.id,
        chicken_id: selectedChicken || null,
        price: eggPrice,
        feed_cost: feedCost,
      },
    ]);

    fetchEggs();
  }

  async function signUp() {
    await supabase.auth.signUp({ email, password });
  }

  async function signIn() {
    await supabase.auth.signInWithPassword({ email, password });
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const totalEggs = eggs.reduce((sum, e) => sum + e.count, 0);
  const totalRevenue = eggs.reduce(
    (sum, e) => sum + e.count * (e.price || 0),
    0
  );
  const totalFeed = eggs.reduce(
    (sum, e) => sum + (e.feed_cost || 0),
    0
  );
  const profit = totalRevenue - totalFeed;

  if (!session) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>🐔 Coop Keeper</h2>
          <input style={styles.input} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button style={styles.button} onClick={signIn}>Login</button>
          <button style={styles.buttonSecondary} onClick={signUp}>Sign Up</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🐔 Coop Keeper</h2>
        <button style={styles.logout} onClick={signOut}>Logout</button>
      </div>

      {/* Dashboard */}
      <div style={styles.card}>
        <h3>📊 Dashboard</h3>
        <p>Total Eggs: {totalEggs}</p>
        <p>Revenue: {totalRevenue.toFixed(2)}</p>
        <p>Feed Cost: {totalFeed.toFixed(2)}</p>
        <p><b>Profit: {profit.toFixed(2)}</b></p>
      </div>

      {/* Chickens */}
      <div style={styles.card}>
        <h3>🐔 Chickens</h3>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Chicken name"
            value={newChicken}
            onChange={(e) => setNewChicken(e.target.value)}
          />
          <button style={styles.buttonSmall} onClick={addChicken}>Add</button>
        </div>

        {chickens.map((c) => (
          <div key={c.id} style={styles.listItem}>
            {c.name}
            <button style={styles.delete} onClick={() => deleteChicken(c.id)}>❌</button>
          </div>
        ))}
      </div>

      {/* Add Eggs */}
      <div style={styles.card}>
        <h3>🥚 Add Eggs</h3>

        <select style={styles.input} onChange={(e) => setSelectedChicken(e.target.value)}>
          <option value="">Select Chicken</option>
          {chickens.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input style={styles.input} type="date" onChange={(e) => setDate(e.target.value)} />
        <input style={styles.input} type="number" placeholder="Egg count" onChange={(e) => setCount(Number(e.target.value))} />
        <input style={styles.input} type="number" placeholder="Egg price" onChange={(e) => setEggPrice(Number(e.target.value))} />
        <input style={styles.input} type="number" placeholder="Feed cost" onChange={(e) => setFeedCost(Number(e.target.value))} />

        <button style={styles.button} onClick={addEggs}>Add Entry</button>
      </div>

      {/* History */}
      <div style={styles.card}>
        <h3>📜 History</h3>
        {eggs.map((e, i) => {
          const chicken = chickens.find((c) => c.id === e.chicken_id);
          return (
            <div key={i} style={styles.listItem}>
              {e.date} - {chicken?.name || "Unknown"} - {e.count}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    maxWidth: 500,
    margin: "auto",
    padding: 15,
    fontFamily: "Arial",
    background: "#f3f4f6",
    minHeight: "100vh",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f3f4f6",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    background: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: 6,
  },
  buttonSmall: {
    padding: 10,
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: 6,
    marginLeft: 10,
  },
  buttonSecondary: {
    width: "100%",
    padding: 12,
    background: "#ddd",
    border: "none",
    borderRadius: 6,
    marginTop: 10,
  },
  logout: {
    padding: 8,
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 6,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 8,
    borderBottom: "1px solid #eee",
  },
  delete: {
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  row: {
    display: "flex",
  },
};