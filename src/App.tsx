import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
      .order("date", { ascending: true });

    setEggs(data || []);
  }

  async function fetchChickens() {
    const { data } = await supabase
      .from("chickens")
      .select("*")
      .eq("user_id", session.user.id);

    setChickens(data || []);
  }

  async function addEggs() {
    if (!date || !count) return alert("Fill all fields");

    const { error } = await supabase.from("eggs").insert([
      {
        date,
        count,
        user_id: session.user.id,
        chicken_id: selectedChicken || null,
        price: eggPrice,
        feed_cost: feedCost,
      },
    ]);

    if (error) alert(error.message);
    else fetchEggs();
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
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

  const chartData = eggs.map((e) => ({
    date: e.date,
    eggs: e.count,
  }));

  if (!session) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>🐔 Coop Keeper</h2>
          <input
            style={styles.input}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button style={styles.button} onClick={signIn}>
            Login
          </button>
          <button style={styles.buttonSecondary} onClick={signUp}>
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🐔 Coop Keeper</h2>
        <button style={styles.logout} onClick={signOut}>
          Logout
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Total Eggs</h3>
          <h1>{totalEggs}</h1>
        </div>

        <div style={styles.card}>
          <h3>Revenue</h3>
          <h1>{totalRevenue.toFixed(2)}</h1>
        </div>

        <div style={styles.card}>
          <h3>Feed Cost</h3>
          <h1>{totalFeed.toFixed(2)}</h1>
        </div>

        <div style={styles.card}>
          <h3>Profit</h3>
          <h1>{profit.toFixed(2)}</h1>
        </div>
      </div>

      <div style={styles.card}>
        <h3>Production Trend</h3>
        <LineChart width={600} height={250} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="eggs" stroke="#4f46e5" />
        </LineChart>
      </div>

      <div style={styles.card}>
        <h3>Add Entry</h3>

        <select
          style={styles.input}
          onChange={(e) => setSelectedChicken(e.target.value)}
        >
          <option value="">Select Chicken</option>
          {chickens.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          style={styles.input}
          type="date"
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Egg count"
          onChange={(e) => setCount(Number(e.target.value))}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Egg price"
          onChange={(e) => setEggPrice(Number(e.target.value))}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Feed cost"
          onChange={(e) => setFeedCost(Number(e.target.value))}
        />

        <button style={styles.button} onClick={addEggs}>
          Add Entry
        </button>
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles: any = {
  container: {
    padding: 20,
    fontFamily: "Arial",
    background: "#f3f4f6",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 15,
  },
  card: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  buttonSecondary: {
    width: "100%",
    padding: 12,
    background: "#e5e7eb",
    border: "none",
    borderRadius: 8,
    marginTop: 10,
  },
  logout: {
    padding: 10,
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 8,
  },
};