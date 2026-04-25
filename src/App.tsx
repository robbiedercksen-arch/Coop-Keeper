import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Chicken = {
  id: string;
  name: string;
  history: any[];
  user_id: string;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [newChicken, setNewChicken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // 🔐 AUTH INIT (runs once)
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🛑 CRITICAL FIX — LOAD ONLY ONCE
  useEffect(() => {
    if (!user) return;

    loadChickens();

    // ❗ ONLY DEPEND ON user.id
  }, [user?.id]);

  const loadChickens = async () => {
    console.log("🔥 Loading chickens ONCE");

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
    else alert("Account created");
  };

  // 🚪 LOGOUT
  const logout = async () => {
    await supabase.auth.signOut();
    setChickens([]);
  };

  // ➕ ADD CHICKEN
  const addChicken = async () => {
    if (!newChicken || !user) return;

    const { data } = await supabase
      .from("chickens")
      .insert([
        {
          name: newChicken,
          history: [],
          user_id: user.id,
        },
      ])
      .select();

    if (data) {
      setChickens((prev) => [...prev, data[0]]);
      setNewChicken("");
    }
  };

  // 🥚 ADD EGG
  const addEgg = (c: Chicken) => {
    const updated = {
      ...c,
      history: [
        ...(c.history || []),
        { date: today, eggs: 1, feed: 0 },
      ],
    };

    updateChicken(updated);
  };

  // 🌽 ADD FEED
  const addFeed = (c: Chicken) => {
    const updated = {
      ...c,
      history: [
        ...(c.history || []),
        { date: today, eggs: 0, feed: 10 },
      ],
    };

    updateChicken(updated);
  };

  const updateChicken = async (updated: Chicken) => {
    await supabase
      .from("chickens")
      .update({ history: updated.history })
      .eq("id", updated.id);

    setChickens((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>

        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <br /><br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br /><br />

        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Coop Keeper ({user.email})</h1>

      <button onClick={logout}>Logout</button>

      <br /><br />

      <input
        placeholder="Chicken name"
        value={newChicken}
        onChange={(e) => setNewChicken(e.target.value)}
      />
      <button onClick={addChicken}>Add Chicken</button>

      <hr />

      {chickens.map((c) => (
        <div key={c.id}>
          <strong>{c.name}</strong>
          <br />
          <button onClick={() => addEgg(c)}>Add Egg</button>
          <button onClick={() => addFeed(c)}>Add Feed</button>
        </div>
      ))}
    </div>
  );
}