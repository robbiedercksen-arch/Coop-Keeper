import { useEffect, useState, useRef } from "react";
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

  const hasLoaded = useRef(false);
  const userIdRef = useRef<string | null>(null); // 🔒 track user

  // 🔐 AUTH INIT
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;

      setUser(currentUser);
      userIdRef.current = currentUser?.id ?? null;
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user ?? null;

        // 🔥 IGNORE TOKEN REFRESH + SAME USER
        if (
          event === "TOKEN_REFRESHED" ||
          userIdRef.current === newUser?.id
        ) {
          return;
        }

        console.log("AUTH EVENT:", event);

        userIdRef.current = newUser?.id ?? null;
        setUser(newUser);
        hasLoaded.current = false; // allow reload once for new user
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 🛑 LOAD ONCE PER USER
  useEffect(() => {
    if (!user || hasLoaded.current) return;

    hasLoaded.current = true;

    console.log("🔥 LOAD ONCE");

    loadChickens();
  }, [user]);

  const loadChickens = async () => {
    const { data } = await supabase
      .from("chickens")
      .select("*")
      .eq("user_id", user.id);

    if (data) setChickens(data);
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
    setUser(null);
    userIdRef.current = null;
    hasLoaded.current = false;
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

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <br /><br />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <br /><br />

        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper ({user.email})</h1>

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
        </div>
      ))}
    </div>
  );
}