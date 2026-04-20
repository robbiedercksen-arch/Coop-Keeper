import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);

  // Track online/offline
  useEffect(() => {
    const updateOnlineStatus = () => setOffline(!navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Load user (FIXED)
  useEffect(() => {
    async function loadUser() {
      try {
        // 1. Load from localStorage first (offline support)
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // 2. Sync with Supabase (online)
        const { data } = await supabase.auth.getUser();

        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (err) {
        console.error("User load error:", err);
      }

      setLoading(false);
    }

    loadUser();
  }, []);

  // Listen for login/logout (IMPORTANT)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
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

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <div>⚠️ Please login once while online</div>;
  }

  // MAIN APP UI (you can expand this again)
  return (
    <div style={{ padding: "20px" }}>
      <h1>🐔 Coop Keeper</h1>

      {offline && (
        <p style={{ color: "orange" }}>
          ⚠️ Offline Mode
        </p>
      )}

      <p>Welcome back!</p>
    </div>
  );
}

export default App;