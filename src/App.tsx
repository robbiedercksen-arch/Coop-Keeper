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

  // 🔐 AUTH INIT
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;

      setUser(currentUser);
      userIdRef.current = currentUser?.id ?? null;

      if (currentUser) {
        await checkAccess(currentUser.id);
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const newUser = session?.user ?? null;

        if (
          event === "TOKEN_REFRESHED" ||
          userIdRef.current === newUser?.id
        ) {
          return;
        }

        userIdRef.current = newUser?.id ?? null;
        setUser(newUser);

        if (newUser) {
          await checkAccess(newUser.id);
        } else {
          setHasAccess(false);
        }

        hasLoaded.current = false;
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🔒 ACCESS CHECK
  const checkAccess = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("is_paid")
      .eq("id", userId)
      .single();

    if (!data || data.is_paid !== true) {
      setHasAccess(false);
      return;
    }

    setHasAccess(true);
  };

  // 🛑 LOAD ALL DATA
  useEffect(() => {
    if (!user || hasAccess !== true || hasLoaded.current) return;

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

  // 🔐 LOGIN
  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  };

  // 🆕 REGISTER
  const register = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) alert(error.message);
    else alert("Account created. Waiting for approval.");
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setChickens([]);
    setHasAccess(false);
    hasLoaded.current = false;
    userIdRef.current = null;
  };

  // ➕ ADD CHICKEN
  const addChicken = async () => {
    if (!newChicken || !user) return;

    const { data } = await supabase
      .from("chickens")
      .insert([{ name: newChicken, user_id: user.id }])
      .select();

    if (data) {
      setChickens((prev) => [...prev, data[0]]);
      setNewChicken("");
    }
  };

  // 🥚 ADD EGG
  const addEgg = async (chickenId: string) => {
    const today = new Date().toISOString().split("T")[0];

    await supabase.from("eggs").insert([
      {
        chicken_id: chickenId,
        date: today,
        count: 1,
        user_id: user.id,
      },
    ]);

    loadEggs();
  };

  // 🌾 ADD FEED
  const addFeed = async (chickenId: string) => {
    const today = new Date().toISOString().split("T")[0];

    await supabase.from("feed").insert([
      {
        chicken_id: chickenId,
        date: today,
        amount: 10,
        user_id: user.id,
      },
    ]);

    loadFeed();
  };

  // 📊 DASHBOARD CALCULATIONS
  const today = new Date().toISOString().split("T")[0];

  const eggsToday = eggs
    .filter((e) => e.date === today)
    .reduce((sum, e) => sum + e.count, 0);

  const feedToday = feed
    .filter((f) => f.date === today)
    .reduce((sum, f) => sum + f.amount, 0);

  const revenue = eggsToday * 0.5;
  const profit = revenue - feedToday;

  // ⏳ LOADING
  if (loading) return <div>Loading...</div>;

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🔐 Login</h2>

        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <br /><br />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    );
  }

  // 🚫 BLOCK
  if (hasAccess !== true) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🚫 Subscription Required</h2>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  // ✅ APP
  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper ({user.email})</h1>

      <button onClick={logout}>Logout</button>

      <hr />

      {/* 📊 DASHBOARD */}
      <h2>📅 Today ({today})</h2>
      <p>🥚 Eggs: {eggsToday}</p>
      <p>🌾 Feed: {feedToday}</p>
      <p>💰 Revenue: {revenue.toFixed(2)}</p>
      <p>
        📈 Profit:{" "}
        <strong style={{ color: profit >= 0 ? "green" : "red" }}>
          {profit.toFixed(2)}
        </strong>
      </p>

      <hr />

      {/* ➕ ADD CHICKEN */}
      <input
        placeholder="Chicken name"
        value={newChicken}
        onChange={(e) => setNewChicken(e.target.value)}
      />
      <button onClick={addChicken}>Add Chicken</button>

      <hr />

      {/* 🐔 LIST */}
      {chickens.map((c) => (
        <div key={c.id}>
          <strong>{c.name}</strong>
          <br />
          <button onClick={() => addEgg(c.id)}>🥚 Add Egg</button>
          <button onClick={() => addFeed(c.id)}>🌾 Add Feed</button>
          <hr />
        </div>
      ))}
    </div>
  );
}