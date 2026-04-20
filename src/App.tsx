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

  // 📊 CALCULATIONS
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

  const eggsPerChicken = chickens.map((chicken) => {
    const total = eggs
      .filter((e) => e.chicken_id === chicken.id)
      .reduce((sum, e) => sum + e.count, 0);

    return {
      name: chicken.name,
      total,
    };
  });

  if (!session) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <br />
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <br />
        <button onClick={signIn}>Login</button>
        <button onClick={signUp}>Sign Up</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🐔 Coop Keeper</h2>
      <button onClick={signOut}>Logout</button>

      <hr />

      <h3>📊 Dashboard</h3>
      <p>Total Eggs: {totalEggs}</p>
      <p>Revenue: {totalRevenue.toFixed(2)}</p>
      <p>Feed Cost: {totalFeed.toFixed(2)}</p>
      <p>Profit: {profit.toFixed(2)}</p>

      <hr />

      <h3>Add Entry</h3>

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

      <input
        type="number"
        placeholder="Egg price"
        onChange={(e) => setEggPrice(Number(e.target.value))}
      />

      <input
        type="number"
        placeholder="Feed cost"
        onChange={(e) => setFeedCost(Number(e.target.value))}
      />

      <button onClick={addEggs}>Add</button>
    </div>
  );
}