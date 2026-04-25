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

  const [chickens, setChickens] = useState<any[]>([]);
  const [newChicken, setNewChicken] = useState("");

  const [eggs, setEggs] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);

  const [isPaid, setIsPaid] = useState<boolean | null>(null);

  // ================= AUTH =================
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ================= LOAD DATA =================
  useEffect(() => {
    if (!session) return;

    const userId = session.user.id;

    loadProfile(userId);
    loadChickens(userId);
    loadEggs(userId);
    loadFeed(userId);
  }, [session]);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    setIsPaid(data?.is_paid || false);
  };

  const loadChickens = async (userId: string) => {
    const { data } = await supabase
      .from("chickens")
      .select("*")
      .eq("user_id", userId);

    setChickens(data || []);
  };

  const loadEggs = async (userId: string) => {
    const { data } = await supabase
      .from("eggs")
      .select("*")
      .eq("user_id", userId);

    setEggs(data || []);
  };

  const loadFeed = async (userId: string) => {
    const { data } = await supabase
      .from("feed")
      .select("*")
      .eq("user_id", userId);

    setFeed(data || []);
  };

  // ================= AUTH ACTIONS =================
  const register = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: email,
        is_paid: false,
      });
    }

    alert("Registered! You can now login.");
  };

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  // ================= ACTIONS =================
  const addChicken = async () => {
    if (!newChicken) return;

    await supabase.from("chickens").insert({
      name: newChicken,
      user_id: session.user.id,
    });

    setNewChicken("");
    loadChickens(session.user.id);
  };

  const addEgg = async (chickenId: string) => {
    await supabase.from("eggs").insert({
      chicken_id: chickenId,
      count: 1,
      date: new Date(),
      user_id: session.user.id,
      price: 0.5,
    });

    loadEggs(session.user.id);
  };

  const addFeed = async (chickenId: string) => {
    await supabase.from("feed").insert({
      date: new Date(),
      amount: 10,
      chicken_id: chickenId,
      user_id: session.user.id,
    });

    loadFeed(session.user.id);
  };

  // ================= CALCULATIONS =================
  const totalEggs = eggs.reduce((sum, e) => sum + (e.count || 0), 0);
  const totalFeed = feed.reduce((sum, f) => sum + (f.amount || 0), 0);
  const revenue = eggs.reduce((sum, e) => sum + (e.price || 0), 0);
  const profit = revenue - totalFeed;

  // ================= LOGIN SCREEN =================
  if (!session) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>🐔 Coop Keeper</h2>

          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={login}>
            Login
          </button>

          <button style={styles.buttonAlt} onClick={register}>
            Register
          </button>
        </div>
      </div>
    );
  }

  // ================= SUBSCRIPTION BLOCK =================
  if (isPaid === false) {
    return (
      <div style={styles.container}>
        <h2>🚫 Subscription Required</h2>
        <p>Your account is not active.</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  // ================= MAIN APP =================
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🐔 Coop Keeper</h2>
        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>

      {/* DASHBOARD */}
      <div style={styles.grid}>
        <div style={styles.card}>🥚 Eggs: {totalEggs}</div>
        <div style={styles.card}>🌾 Feed: {totalFeed}</div>
        <div style={styles.card}>💰 R{revenue.toFixed(2)}</div>
        <div style={styles.card}>
          📉{" "}
          <span style={{ color: profit < 0 ? "red" : "green" }}>
            {profit.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ADD CHICKEN */}
      <div style={styles.card}>
        <input
          style={styles.input}
          placeholder="Chicken name"
          value={newChicken}
          onChange={(e) => setNewChicken(e.target.value)}
        />

        <button style={styles.button} onClick={addChicken}>
          Add Chicken
        </button>
      </div>

      {/* CHICKENS LIST */}
      {chickens.map((c) => (
        <div key={c.id} style={styles.card}>
          <strong>{c.name}</strong>

          <div>
            <button
              style={styles.smallBtn}
              onClick={() => addEgg(c.id)}
            >
              🥚
            </button>

            <button
              style={styles.smallBtn}
              onClick={() => addFeed(c.id)}
            >
              🌾
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ================= FARM STYLE =================
const styles: any = {
  container: {
    maxWidth: 500,
    margin: "auto",
    padding: 15,
    background: "#f4ecd8",
    minHeight: "100vh",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f4ecd8",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#3b2f1c",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    margin: "15px 0",
  },

  card: {
    background: "#fff",
    padding: 15,
    borderRadius: 12,
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    marginBottom: 10,
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
    padding: 10,
    background: "#2f6f3e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
  },

  buttonAlt: {
    width: "100%",
    padding: 10,
    marginTop: 5,
    background: "#ddd",
    border: "none",
    borderRadius: 8,
  },

  logout: {
    background: "#8b2e2e",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
  },

  smallBtn: {
    marginTop: 10,
    marginRight: 5,
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    background: "#eee",
  },
};