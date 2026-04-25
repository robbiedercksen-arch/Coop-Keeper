import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabaseClient";

type Chicken = {
  id: string;
  name: string;
  user_id: string;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [newChicken, setNewChicken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [eggs, setEggs] = useState<any[]>([]);
  const [feed, setFeed] = useState<any[]>([]);

  const hasLoaded = useRef(false);
  const userIdRef = useRef<string | null>(null);

  // 🔐 AUTH
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;

      setUser(currentUser);
      userIdRef.current = currentUser?.id ?? null;

      if (currentUser) await checkAccess(currentUser.id);

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        const newUser = session?.user ?? null;

        if (userIdRef.current === newUser?.id) return;

        userIdRef.current = newUser?.id ?? null;
        setUser(newUser);

        if (newUser) await checkAccess(newUser.id);
        else setHasAccess(false);

        hasLoaded.current = false;
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const checkAccess = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("is_paid")
      .eq("id", userId)
      .single();

    setHasAccess(data?.is_paid === true);
  };

  // LOAD DATA
  useEffect(() => {
    if (!user || !hasAccess || hasLoaded.current) return;

    hasLoaded.current = true;

    loadChickens();
    loadEggs();
    loadFeed();
  }, [user, hasAccess]);

  const loadChickens = async () => {
    const { data } = await supabase
      .from("chickens")
      .select("*")
      .eq("user_id", user.id);

    if (data) setChickens(data);
  };

  const loadEggs = async () => {
    const { data } = await supabase
      .from("eggs")
      .select("*")
      .eq("user_id", user.id);

    if (data) setEggs(data);
  };

  const loadFeed = async () => {
    const { data } = await supabase
      .from("feed")
      .select("*")
      .eq("user_id", user.id);

    if (data) setFeed(data);
  };

  // ACTIONS
  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
  };

  const register = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Account created. Awaiting activation.");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHasAccess(false);
    hasLoaded.current = false;
  };

  const addChicken = async () => {
    if (!newChicken) return;

    const { data } = await supabase
      .from("chickens")
      .insert([{ name: newChicken, user_id: user.id }])
      .select();

    if (data) {
      setChickens([...chickens, data[0]]);
      setNewChicken("");
    }
  };

  const addEgg = async (id: string) => {
    const today = new Date().toISOString().split("T")[0];

    await supabase.from("eggs").insert([
      { chicken_id: id, date: today, count: 1, user_id: user.id },
    ]);

    loadEggs();
  };

  const addFeed = async (id: string) => {
    const today = new Date().toISOString().split("T")[0];

    await supabase.from("feed").insert([
      { chicken_id: id, date: today, amount: 10, user_id: user.id },
    ]);

    loadFeed();
  };

  // CALCULATIONS
  const today = new Date().toISOString().split("T")[0];

  const eggsToday = eggs
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.count, 0);

  const feedToday = feed
    .filter((f) => f.date === today)
    .reduce((sum, f) => sum + f.amount, 0);

  const revenue = eggsToday * 0.5;
  const profit = revenue - feedToday;

  // UI STATES
  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  if (!user)
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>🐔 Coop Keeper</h2>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
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

  if (!hasAccess)
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h2>🚫 Subscription Required</h2>
          <p>Contact Robbie to activate your account</p>
          <button style={styles.button} onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    );

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
        <div style={styles.card}>🥚 Eggs<br />{eggsToday}</div>
        <div style={styles.card}>🌾 Feed<br />{feedToday}</div>
        <div style={styles.card}>💰 R{revenue.toFixed(2)}</div>
        <div style={styles.card}>
          📈{" "}
          <span style={{ color: profit >= 0 ? "green" : "red" }}>
            {profit.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ADD */}
      <div style={styles.card}>
        <input
          placeholder="Chicken name"
          value={newChicken}
          onChange={(e) => setNewChicken(e.target.value)}
          style={styles.input}
        />
        <button style={styles.button} onClick={addChicken}>
          Add Chicken
        </button>
      </div>

      {/* LIST */}
      {chickens.map((c) => (
        <div key={c.id} style={styles.card}>
          <strong>{c.name}</strong>
          <div>
            <button style={styles.smallBtn} onClick={() => addEgg(c.id)}>
              🥚
            </button>
            <button style={styles.smallBtn} onClick={() => addFeed(c.id)}>
              🌾
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// 🎨 STYLES
const styles: any = {
  container: { maxWidth: 500, margin: "auto", padding: 15 },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
  },
  buttonAlt: {
    width: "100%",
    padding: 12,
    marginTop: 8,
    background: "#ddd",
    border: "none",
    borderRadius: 8,
  },
  logout: {
    background: "red",
    color: "white",
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