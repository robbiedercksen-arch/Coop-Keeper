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

  const [date, setDate] = useState("");
  const [count, setCount] = useState(0);
  const [selectedChicken, setSelectedChicken] = useState("");

  // 🔐 AUTH
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // 📊 LOAD DATA
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
      .eq("user_id", session.user.id);

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
      },
    ]);

    if (error) alert(error.message);
    else fetchEggs();
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Signup successful!");
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

  // 📊 CALCULATIONS
  const eggsPerChicken = chickens.map((chicken) => {
    const total = eggs
      .filter((e) => e.chicken_id === chicken.id)
      .reduce((sum, e) => sum + e.count, 0);

    return {
      name: chicken.name,
      total,
    };
  });

  const totalEggs = eggs.reduce((sum, e) => sum + e.count, 0);

  const bestChicken =
    eggsPerChicken.length > 0
      ? [...eggsPerChicken].sort((a, b) => b.total - a.total)[0]
      : null;

  // 🔐 LOGIN SCREEN
  if (!session) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🐔 Coop Keeper Login</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button onClick={signIn}>Login</button>
        <button onClick={signUp}>Sign Up</button>
      </div>
    );
  }

  // 🐔 DASHBOARD
  return (
    <div style={{ padding: 20 }}>
      <h2>🐔 Coop Keeper Dashboard</h2>

      <button onClick={signOut}>Logout</button>

      <hr />

      {/* 📊 OVERVIEW */}
      <h3>📊 Overview</h3>
      <p>Total Eggs: {totalEggs}</p>
      <p>
        Best Chicken:{" "}
        {bestChicken
          ? `${bestChicken.name} (${bestChicken.total})`
          : "No data"}
      </p>

      <h4>Eggs per Chicken</h4>
      <ul>
        {eggsPerChicken.map((c, i) => (
          <li key={i}>
            {c.name}: {c.total}
          </li>
        ))}
      </ul>

      <hr />

      {/* 🥚 ADD EGGS */}
      <h3>Add Eggs</h3>

      <select onChange={(e) => setSelectedChicken(e.target.value)}>
        <option value="">Select Chicken</option>
        {chickens.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <br />

      <input type="date" onChange={(e) => setDate(e.target.value)} />

      <input
        type="number"
        placeholder="Egg count"
        onChange={(e) => setCount(Number(e.target.value))}
      />

      <button onClick={addEggs}>Add Eggs</button>

      <hr />

      {/* 🧾 LIST */}
      <h3>Egg History</h3>
      <ul>
        {eggs.map((e, i) => {
          const chicken = chickens.find((c) => c.id === e.chicken_id);
          return (
            <li key={i}>
              {e.date} - {chicken ? chicken.name : "Unknown"} - {e.count}
            </li>
          );
        })}
      </ul>
    </div>
  );
}