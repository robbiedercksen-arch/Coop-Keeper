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
  const [date, setDate] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) fetchEggs();
  }, [session]);

  async function fetchEggs() {
    const { data } = await supabase
      .from("eggs")
      .select("*")
      .order("date", { ascending: false });

    setEggs(data || []);
  }

  async function addEggs() {
    if (!date || !count) return alert("Fill all fields");

    const { error } = await supabase.from("eggs").insert([
      {
        date,
        count,
        user_id: session.user.id,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      fetchEggs();
    }
  }

  async function signUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) alert(error.message);
    else alert("Check your email to confirm!");
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

  // 🔐 NOT LOGGED IN
  if (!session) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login / Signup</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button onClick={signIn}>Login</button>
        <button onClick={signUp}>Sign Up</button>
      </div>
    );
  }

  // ✅ LOGGED IN
  return (
    <div style={{ padding: 20 }}>
      <h2>Egg Tracker</h2>

      <button onClick={signOut}>Logout</button>

      <br />
      <br />

      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <input
        type="number"
        placeholder="Egg count"
        onChange={(e) => setCount(Number(e.target.value))}
      />

      <button onClick={addEggs}>Add Eggs</button>

      <ul>
        {eggs.map((e, i) => (
          <li key={i}>
            {e.date} - {e.count}
          </li>
        ))}
      </ul>
    </div>
  );
}