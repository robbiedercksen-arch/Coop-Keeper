import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import EggTracker from "./pages/EggTracker";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [chickens, setChickens] = useState<any[]>([]);
  const [eggs, setEggs] = useState<any[]>([]);

  // LOAD DATA
  useEffect(() => {
    const savedChickens = localStorage.getItem("chickens");
    const savedEggs = localStorage.getItem("eggs");

    if (savedChickens) setChickens(JSON.parse(savedChickens));
    if (savedEggs) setEggs(JSON.parse(savedEggs));
  }, []);

  // SAVE DATA
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  useEffect(() => {
    localStorage.setItem("eggs", JSON.stringify(eggs));
  }, [eggs]);

  // ADD CHICKEN
  const addChicken = (chicken: any) => {
    setChickens([...chickens, { ...chicken, id: Date.now() }]);
  };

  // DELETE CHICKEN
  const deleteChicken = (id: number) => {
    setChickens(chickens.filter((c) => c.id !== id));
    setEggs(eggs.filter((e) => e.chickenId !== id));
  };

  // ADD EGG
  const addEgg = (chickenId: number) => {
    setEggs([
      ...eggs,
      {
        id: Date.now(),
        chickenId,
        date: new Date().toISOString(),
      },
    ]);
  };

  // DASHBOARD STATS
  const eggsToday = eggs.filter(
    (e) => new Date(e.date).toDateString() === new Date().toDateString()
  ).length;

  const totalEggs = eggs.length;

  const topLayer = (() => {
    const counts: any = {};
    eggs.forEach((e) => {
      counts[e.chickenId] = (counts[e.chickenId] || 0) + 1;
    });

    let topId = null;
    let max = 0;

    for (let id in counts) {
      if (counts[id] > max) {
        max = counts[id];
        topId = id;
      }
    }

    const chicken = chickens.find((c) => c.id == topId);
    return chicken ? `${chicken.name} (${max})` : "None";
  })();

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <div className="w-64 min-h-screen bg-farm-brown text-white p-5 shadow-lg">
        <h1 className="text-2xl font-bold mb-8">🐔 Coop Keeper</h1>

        {[
          ["Dashboard", "dashboard"],
          ["Chicken Registry", "registry"],
          ["Egg Tracker", "eggs"],
        ].map(([label, key]) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`w-full text-left px-4 py-3 mb-2 rounded-xl ${
              page === key
                ? "bg-white text-farm-brown font-semibold"
                : "hover:bg-white/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-6 bg-[#f5f1ea] min-h-screen">
        {page === "dashboard" && (
          <Dashboard
            chickens={chickens}
            eggsToday={eggsToday}
            totalEggs={totalEggs}
            topLayer={topLayer}
            eggs={eggs}
          />
        )}

        {page === "registry" && (
          <ChickenRegistry
            chickens={chickens}
            addChicken={addChicken}
            deleteChicken={deleteChicken}
          />
        )}

        {page === "eggs" && (
          <EggTracker
            chickens={chickens}
            eggs={eggs}
            addEgg={addEgg}
          />
        )}
      </div>
    </div>
  );
}