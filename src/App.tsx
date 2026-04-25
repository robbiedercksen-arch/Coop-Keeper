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
    const { data, error } = await supabase
      .from("profiles")
      .select("is_paid")
      .eq("id", userId)
      .single();

    console.log("ACCESS CHECK:", data, error);

    if (!data || data.is_paid !== true) {
      setHasAccess(false);
      return;
    }

    setHasAccess(true);
  };

  // 🛑 LOAD CHICKENS ONCE
  useEffect(() => {
    if (!user || hasAccess !== true || hasLoaded.current) return;

    hasLoaded.current = true;

    loadChickens();
  }, [user, hasAccess]);

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

    const { data, error } = await supabase
      .from("chickens")
      .insert([
        {
          name: newChicken,
          user_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      alert("Error adding chicken");
      return;
    }

    if (data) {
      setChickens((prev) => [...prev, data[0]]);
      setNewChicken("");
    }
  };

  // 🥚 ADD EGG
  const addEgg = async (chickenId: string) => {
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("eggs").insert([
      {
        chicken_id: chickenId,
        date: today,
        count: 1,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error adding egg");
    } else {
      alert("Egg added 🥚");
    }
  };

  // 🌾 ADD FEED
  const addFeed = async (chickenId: string) => {
    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("feed").insert([
      {
        chicken_id: chickenId,
        date: today,
        amount: 10,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error(error);
      alert("Error adding feed");
    } else {
      alert("Feed added 🌾");
    }
  };

  // ⏳ LOADING
  if (loading) return <div>Loading...</div>;

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

  // 🚫 BLOCK
  if (user && hasAccess !== true) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🚫 Subscription Required</h2>
        <p>Your account is not active.</p>
        <p>Contact Robbie to activate your account.</p>

        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  // ✅ APP
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

          <br />

          <button onClick={() => addEgg(c.id)}>🥚 Add Egg</button>
          <button onClick={() => addFeed(c.id)} style={{ marginLeft: 10 }}>
            🌾 Add Feed
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}