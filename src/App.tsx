import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => setOffline(!navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    async function loadUser() {
      try {
        // 🔥 FIRST: check localStorage (fast)
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          console.log("Loaded user from localStorage");
          setUser(JSON.parse(savedUser));
        }

        // 🔥 SECOND: check Supabase (authoritative)
        const { data } = await supabase.auth.getUser();

        if (data?.user) {
          console.log("User from Supabase:", data.user);

          setUser(data.user);

          // ✅ SAVE USER HERE (CRITICAL FIX)
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("User load error:", err);
      }

      setLoading(false);
    }

    loadUser();

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // 🔥 ALSO SAVE USER WHEN SESSION CHANGES (LOGIN FIX)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          console.log("Auth changed - saving user");

          setUser(session.user);
          localStorage.setItem("user", JSON.stringify(session.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <div>⚠️ Please login once while online</div>;
  }

  return (
    <div>
      {offline && (
        <p style={{ color: "orange" }}>⚠️ Offline Mode</p>
      )}

      <h1>🐔 Coop Keeper</h1>
      <p>Welcome back!</p>
    </div>
  );
}

export default App;