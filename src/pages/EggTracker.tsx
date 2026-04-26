import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import EggTracker from "./pages/EggTracker";

export default function App() {
  const [page, setPage] = useState("dashboard");

  // 🐔 CHICKENS
  const [chickens, setChickens] = useState(() => {
    const saved = localStorage.getItem("chickens");
    return saved ? JSON.parse(saved) : [];
  });

  // 🥚 EGGS
  const [eggs, setEggs] = useState(() => {
    const saved = localStorage.getItem("eggs");
    return saved ? JSON.parse(saved) : [];
  });

  // 💾 SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  useEffect(() => {
    localStorage.setItem("eggs", JSON.stringify(eggs));
  }, [eggs]);

  // ➕ ADD CHICKEN
  const addChicken = (chicken) => {
    const newChicken = {
      id: Date.now(),
      ...chicken,
    };
    setChickens((prev) => [...prev, newChicken]);
  };

  // ✏️ UPDATE CHICKEN
  const updateChicken = (id, updatedData) => {
    setChickens((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
    );
  };

  // ❌ DELETE CHICKEN
  const deleteChicken = (id) => {
    setChickens((prev) => prev.filter((c) => c.id !== id));

    // also remove related eggs
    setEggs((prev) => prev.filter((e) => e.chickenId !== id));
  };

  // 🥚 ADD EGG
  const addEgg = (chickenId) => {
    const newEgg = {
      id: Date.now(),
      chickenId,
      date: new Date().toISOString(),
    };

    setEggs((prev) => [...prev, newEgg]);
  };

  // 📊 DASHBOARD CALCULATIONS
  const eggsToday = eggs.filter((egg) => {
    const today = new Date().toDateString();
    return new Date(egg.date).toDateString() === today;
  }).length;

  const totalEggs = eggs.length;

  const topLayer = (() => {
    const counts = {};

    eggs.forEach((egg) => {
      counts[egg.chickenId] = (counts[egg.chickenId] || 0) + 1;
    });

    let max = 0;
    let topId = null;

    for (let id in counts) {
      if (counts[id] > max) {
        max = counts[id];
        topId = id;
      }
    }

    const chicken = chickens.find((c) => c.id == topId);

    return chicken ? `${chicken.name} (${max})` : "None";
  })();

  // 📄 PAGE RENDERING
  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return (
          <Dashboard
            chickens={chickens}
            eggsToday={eggsToday}
            totalEggs={totalEggs}
            topLayer={topLayer}
            setPage={setPage}
          />
        );

      case "registry":
        return (
          <ChickenRegistry
            chickens={chickens}
            addChicken={addChicken}
            updateChicken={updateChicken}
            deleteChicken={deleteChicken}
          />
        );

      case "eggs":
        return (
          <EggTracker
            chickens={chickens}
            eggs={eggs}
            addEgg={addEgg}
          />
        );

      default:
        return <Dashboard chickens={chickens} />;
    }
  };

  return (
    <div className="flex">
      <Sidebar currentPage={page} setPage={setPage} />

      <div className="flex-1 bg-farm-bg min-h-screen">
        {renderPage()}
      </div>
    </div>
  );
}