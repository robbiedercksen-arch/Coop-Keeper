import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  // Load user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();

        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          const localUser = localStorage.getItem("user");
          if (localUser) {
            setUser(JSON.parse(localUser));
          }
        }
      } catch {
        const localUser = localStorage.getItem("user");
        if (localUser) {
          setUser(JSON.parse(localUser));
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const handleLogin = async () => {
    if (!email) return alert("Enter email");

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert("Login failed");
    } else {
      alert("Check your email for login link");
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  // LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>🐔 Coop Keeper Login</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, marginRight: 10 }}
        />

        <button onClick={handleLogin}>Login</button>

        <p style={{ marginTop: 20 }}>
          ⚠️ You must login once while online
        </p>
      </div>
    );
  }

  // MAIN APP
  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper</h1>
      <p>Welcome back!</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default App;