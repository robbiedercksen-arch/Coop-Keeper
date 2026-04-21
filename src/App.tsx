import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type Chicken = {
  name: string;
  eggs: number;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [offline, setOffline] = useState(!navigator.onLine);

  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [newChicken, setNewChicken] = useState("");
  const [loaded, setLoaded] = useState(false);

  // 🔥 LOAD
  useEffect(() => {
    const saved = localStorage.getItem("coopChickens");

    if (saved) {
      setChickens(JSON.parse(saved));
    }

    setLoaded(true);
  }, []);

  // 🔥 SAVE
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("coopChickens", JSON.stringify(chickens));
  }, [chickens, loaded]);

  // 🌐 STATUS
  useEffect(() => {
    const updateStatus = () => setOffline(!navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        setUser(data?.user ?? null);
      });
    }

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  // ➕ ADD CHICKEN
  const addChicken = () => {
    if (!newChicken.trim()) return;

    setChickens([
      ...chickens,
      { name: newChicken.trim(), eggs: 0 }
    ]);

    setNewChicken("");
  };

  // 🥚 ADD EGG
  const addEgg = (index: number) => {
    const updated = [...chickens];
    updated[index].eggs += 1;
    setChickens(updated);
  };

  // 🔁 RESET
  const reset = () => {
    setChickens([]);
    localStorage.removeItem("coopChickens");
  };

  const totalEggs = chickens.reduce((sum, c) => sum + c.eggs, 0);

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Coop Keeper</h1>

      {offline && <p style={{ color: "orange" }}>⚠️ Offline Mode</p>}
      {!user && !offline && (
        <p style={{ color: "orange" }}>
          ⚠️ Not logged in (app still usable)
        </p>
      )}
      {user && <p>Welcome back 👋</p>}

      {/* ADD CHICKEN */}
      <div style={{ marginTop: 20 }}>
        <input
          value={newChicken}
          onChange={(e) => setNewChicken(e.target.value)}
          placeholder="Chicken name"
        />
        <button onClick={addChicken}>Add Chicken</button>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        <h2>🐔 Chickens</h2>

        {chickens.map((chicken, index) => (
          <div key={index} style={{ marginBottom: 10 }}>
            <b>{chicken.name}</b> — Eggs: {chicken.eggs}
            <button onClick={() => addEgg(index)} style={{ marginLeft: 10 }}>
              ➕ Egg
            </button>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div style={{ marginTop: 20 }}>
        <h2>📊 Total Eggs: {totalEggs}</h2>
      </div>

      {/* RESET */}
      <div style={{ marginTop: 20 }}>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}