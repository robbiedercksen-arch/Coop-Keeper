import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);
  const [chickens, setChickens] = useState<any[]>([]);
  const [eggs, setEggs] = useState<any[]>([]);
  const [newChicken, setNewChicken] = useState("");
  const [isOffline, setIsOffline] = useState(false);

  // ✅ Load user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // ✅ Load data (SAFE for offline)
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

        // ✅ Save to localStorage (for offline)
        localStorage.setItem("chickens", JSON.stringify(chickensData));
        localStorage.setItem("eggs", JSON.stringify(eggsData));
      } catch (err) {
        console.log("Offline mode");

        setIsOffline(true);

        // ✅ Load from localStorage instead
        const savedChickens = localStorage.getItem("chickens");
        const savedEggs = localStorage.getItem("eggs");

        setChickens(savedChickens ? JSON.parse(savedChickens) : []);
        setEggs(savedEggs ? JSON.parse(savedEggs) : []);
      }
    };

    loadData();
  }, []);

  // ✅ Add chicken
  const addChicken = async () => {
    if (!newChicken) return;

    if (isOffline) {
      // Save locally if offline
      const updated = [...chickens, { id: Date.now(), name: newChicken }];
      setChickens(updated);
      localStorage.setItem("chickens", JSON.stringify(updated));
      setNewChicken("");
      return;
    }

    const { data } = await supabase
      .from("chickens")
      .insert([{ name: newChicken }])
      .select();

    if (data) {
      const updated = [...chickens, ...data];
      setChickens(updated);
      localStorage.setItem("chickens", JSON.stringify(updated));
    }

    setNewChicken("");
  };

  // ✅ Totals
  const totalEggs = (eggs || []).reduce((sum, e) => sum + (e.count || 0), 0);
  const revenue = (eggs || []).reduce((sum, e) => sum + (e.price || 0), 0);
  const feedCost = (eggs || []).reduce(
    (sum, e) => sum + (e.feed_cost || 0),
    0
  );

  // ✅ NEVER return null (prevents white screen)
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        {isOffline ? "Offline mode - login unavailable" : "Loading user..."}
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
        {(chickens || []).map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>

      <hr />

      <h2>🥚 Eggs History</h2>
      <ul>
        {(eggs || []).map((e) => (
          <li key={e.id}>
            {e.date} - {e.count}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;