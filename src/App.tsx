import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user session
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("User fetch error:", error);
          setUser(null);
        } else {
          setUser(data?.user || null);

          // Save user locally (helps offline)
          if (data?.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        }
      } catch (err) {
        console.log("Offline or error, loading from localStorage");

        const localUser = localStorage.getItem("user");
        if (localUser) {
          setUser(JSON.parse(localUser));
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Loading state
  if (loading) {
    return <div style={{ padding: 20 }}>Loading user...</div>;
  }

  // Not logged in
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        ⚠️ Please login once while online
      </div>
    );
  }

  // Main App UI
  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper</h1>
      <p>Welcome back!</p>

      {/* Your app content will go here */}
    </div>
  );
}

export default App;