import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);
  const [chickens, setChickens] = useState<any[]>([]);
  const [eggs, setEggs] = useState<any[]>([]);
  const [newChicken, setNewChicken] = useState("");
  const [isOffline, setIsOffline] = useState(false);

  // ✅ LOAD USER (WITH TIMEOUT + OFFLINE FALLBACK)
  useEffect(() => {
    const loadUser = async () => {
      let resolved = false;

      // ⏱ Force fallback after 2 seconds
      const timeout = setTimeout(() => {
        if (!resolved) {
          console.log("User load timeout → offline fallback");

          const savedUser = localStorage.getItem("user");

          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsOffline(true);
          } else {
            setUser(null);
          }
        }
      }, 2000);

      try {
        const { data } = await supabase.auth.getUser();

        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);

          if (data?.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);

          console.log("Offline user fallback");

          const savedUser = localStorage.getItem("user");

          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsOffline(true);
          } else {
            setUser(null);
          }
        }
      }
    };

    loadUser();
  }, []);

  // ✅ LOAD DATA (OFFLINE SAFE)
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: chickensData, error: chickensError } = await supabase
          .from("chickens")
          .select("*");

        const { data: eggsData, error: eggsError } = await supabase
          .from("eggs")
          .select("*");

        if (chickensError || eggsError) throw new Error();

        setChickens(chickensData || []);
        setEggs(eggsData || []);

        localStorage.setItem("chickens", JSON.stringify(chickensData));
        localStorage.setItem("eggs", JSON.stringify(eggsData));
      } catch (err) {
        console.log("Offline data fallback");

        setIsOffline(true);

        const savedChickens = localStorage.getItem("chickens");
        const savedEggs = localStorage.getItem("eggs");

        setChickens(savedChickens ? JSON.parse(savedChickens) : []);
        setEggs(savedEggs ? JSON.parse(savedEggs) : []);
      }
    };

    loadData();
  }, []);

  // ✅ ADD CHICKEN (OFFLINE SAFE)
  const addChicken = async () => {
    if (!newChicken) return;

    if (isOffline) {
      const updated = [...chickens, { id: Date.now(), name: newChicken }];
      setChickens(updated);
      localStorage.setItem("chickens", JSON.stringify(updated));
      setNewChicken("");
      return;
    }

    const { data } = await supabase
      .from("chickens")
      .insert([{ name: newChicken, user_id: user.id }])
      .select();

    if (data) {
      const updated = [...chickens, ...data];
      setChickens(updated);
      localStorage.setItem("chickens", JSON.stringify(updated));
    }

    setNewChicken("");
  };

  // ✅ CALCULATIONS
  const totalEggs = eggs.reduce((sum, e) => sum + (e.count || 0), 0);
  const revenue = eggs.reduce((sum, e) => sum + (e.price || 0), 0);
  const feedCost = eggs.reduce((sum, e) => sum + (e.feed_cost || 0), 0);

  // ❗ NEVER BLOCK UI AGAIN
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        ⚠️ Please login once while online
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper</h1>

      {isOffline && (
        <div style={{ background: "#ffcc00", padding: 10, marginBottom: 10 }}>
          ⚠️ Offline Mode
        </div>
      )}

      <button onClick={() => supabase.auth.signOut()}>Logout</button>

      <h2>📊 Dashboard</h2>
      <p>Total Eggs: {totalEggs}</p>
      <p>Revenue: {revenue.toFixed(2)}</p>
      <p>Feed Cost: {feedCost.toFixed(2)}</p>
      <p>Profit: {(revenue - feedCost).toFixed(2)}</p>

      <hr />

      <h2>🐔 Chickens</h2>
      <input
        value={newChicken}
        onChange={(e) => setNewChicken(e.target.value)}
        placeholder="Chicken name"
      />
      <button onClick={addChicken}>Add</button>

      <ul>
        {chickens.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>

      <hr />

      <h2>🥚 Eggs History</h2>
      <ul>
        {eggs.map((e) => (
          <li key={e.id}>
            {e.date} - {e.count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;