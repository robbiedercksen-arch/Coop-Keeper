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

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCount, setEditCount] = useState(0);

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

  async function deleteEgg(id: string) {
    await supabase.from("eggs").delete().eq("id", id);
    fetchEggs();
  }

  async function updateEgg(id: string) {
    await supabase
      .from("eggs")
      .update({ count: editCount })
      .eq("id", id);

    setEditingId(null);
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

  if (!session) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input onChange={(e) => setEmail(e.target.value)} />
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={signIn}>Login</button>
        <button onClick={signUp}>Sign Up</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🐔 Coop Keeper</h2>
      <button onClick={signOut}>Logout</button>

      <h3>📊 Total Eggs: {totalEggs}</h3>

      <hr />

      <h3>🐔 Chickens</h3>
      <input
        placeholder="Chicken name"
        value={newChicken}
        onChange={(e) => setNewChicken(e.target.value)}
      />
      <button onClick={addChicken}>Add Chicken</button>

      <ul>
        {chickens.map((c) => (
          <li key={c.id}>
            {c.name}
            <button onClick={() => deleteChicken(c.id)}>❌</button>
          </li>
        ))}
      </ul>

      <hr />

      <h3>Add Eggs</h3>

      <select onChange={(e) => setSelectedChicken(e.target.value)}>
        <option value="">Select Chicken</option>
        {chickens.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <input
        type="number"
        placeholder="Egg count"
        onChange={(e) => setCount(Number(e.target.value))}
      />

      <button onClick={addEggs}>Add Entry</button>

      <hr />

      <h3>📜 History</h3>

      {eggs.map((e) => {
        const chicken = chickens.find((c) => c.id === e.chicken_id);

        return (
          <div key={e.id} style={{ marginBottom: 10 }}>
            {editingId === e.id ? (
              <>
                <input
                  type="number"
                  value={editCount}
                  onChange={(ev) => setEditCount(Number(ev.target.value))}
                />
                <button onClick={() => updateEgg(e.id)}>Save</button>
              </>
            ) : (
              <>
                {e.date} - {chicken?.name || "Unknown"} - {e.count}
                <button
                  onClick={() => {
                    setEditingId(e.id);
                    setEditCount(e.count);
                  }}
                >
                  ✏️
                </button>
                <button onClick={() => deleteEgg(e.id)}>❌</button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}