import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type DayData = {
  date: string;
  eggs: number;
  feed: number;
};

type Chicken = {
  id: string;
  name: string;
  history: DayData[];
  user_id: string;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [newChicken, setNewChicken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // ✅ SAFE AUTH INIT (NO LOOP)
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setUser(data.session?.user ?? null);
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // ✅ LOAD CHICKENS ONLY ONCE PER LOGIN
  useEffect(() => {
    if (!user) return;

    loadChickens();
  }, [user?.id]);

  const loadChickens = async () => {
    const { data, error } = await supabase
      .from("chickens")
      .select("*")
      .eq("user_id", user.id);

    if (!error && data) {
      setChickens(data);
    }
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
    else alert("Account created ✅");
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setChickens([]);
  };

  // ➕ ADD CHICKEN
  const addChicken = async () => {
    if (!newChicken || !user) return;

    const { data, error } = await supabase
      .from("chickens")
      .insert([
        {
          name: newChicken,
          history: [],
          user_id: user.id,
        },
      ])
      .select();

    if (!error && data) {
      setChickens((prev) => [...prev, data[0]]);
      setNewChicken("");
    }
  };

  // 🔄 UPDATE
  const updateChicken = async (updated: Chicken) => {
    await supabase
      .from("chickens")
      .update({ history: updated.history })
      .eq("id", updated.id);

    setChickens((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  // 🥚 ADD EGG
  const addEgg = (c: Chicken) => {
    const existing = c.history?.find((h) => h.date === today);

    let updated: Chicken;

    if (existing) {
      updated = {
        ...c,
        history: c.history.map((h) =>
          h.date === today ? { ...h, eggs: h.eggs + 1 } : h
        ),
      };
    } else {
      updated = {
        ...c,
        history: [...(c.history || []), { date: today, eggs: 1, feed: 0 }],
      };
    }

    updateChicken(updated);
  };

  // 🌽 ADD FEED
  const addFeed = (c: Chicken) => {
    const existing = c.history?.find((h) => h.date === today);

    let updated: Chicken;

    if (existing) {
      updated = {
        ...c,
        history: c.history.map((h) =>
          h.date === today ? { ...h, feed: h.feed + 10 } : h
        ),
      };
    } else {
      updated = {
        ...c,
        history: [...(c.history || []), { date: today, eggs: 0, feed: 10 }],
      };
    }

    updateChicken(updated);
  };

  // 📊 TOTALS
  const totalEggs = chickens.reduce((sum, c) => {
    const t = c.history?.find((h) => h.date === today);
    return sum + (t?.eggs || 0);
  }, 0);

  const totalFeed = chickens.reduce((sum, c) => {
    const t = c.history?.find((h) => h.date === today);
    return sum + (t?.feed || 0);
  }, 0);

  const revenue = totalEggs * 0.5;
  const profit = revenue - totalFeed;

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🔐 Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={login}>Login</button>
        <button onClick={register} style={{ marginLeft: 10 }}>
          Register
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper ({user.email})</h1>

      <button onClick={logout}>Logout</button>

      <div>
        <input
          placeholder="Chicken name"
          value={newChicken}
          onChange={(e) => setNewChicken(e.target.value)}
        />
        <button onClick={addChicken}>Add Chicken</button>
      </div>

      <hr />

      <h2>📅 Today ({today})</h2>
      <p>Eggs: {totalEggs}</p>
      <p>Feed: {totalFeed}</p>
      <p>Revenue: {revenue.toFixed(2)}</p>
      <p><b>Profit: {profit.toFixed(2)}</b></p>

      <hr />

      {chickens.map((c) => (
        <div key={c.id}>
          <strong>{c.name}</strong>

          <div>
            <button onClick={() => addEgg(c)}>🥚 Add Egg</button>
            <button onClick={() => addFeed(c)}>🌽 Add Feed</button>
          </div>

          {c.history?.map((h) => (
            <div key={h.date}>
              {h.date} → Eggs: {h.eggs}, Feed: {h.feed}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}