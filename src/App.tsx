import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);

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
      }
    };

    loadUser();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper</h1>

      {user ? (
        <p>Welcome back!</p>
      ) : (
        <p style={{ color: "orange" }}>
          ⚠️ Not logged in (app still usable)
        </p>
      )}

      {/* TEMP CONTENT SO YOU CAN SEE APP WORKING */}
      <div style={{ marginTop: 20 }}>
        <p>App is now loading correctly ✅</p>
      </div>
    </div>
  );
}

export default App;