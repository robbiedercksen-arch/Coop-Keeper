import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import EggTracker from "./pages/EggTracker";

export default function App() {
  const [page, setPage] = useState("dashboard");

  // ✅ LOAD FROM LOCAL STORAGE ON START
  const [chickens, setChickens] = useState(() => {
    const saved = localStorage.getItem("chickens");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ SAVE TO LOCAL STORAGE EVERY CHANGE
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  // ✅ ADD CHICKEN
  const addChicken = (chicken) => {
    const newChicken = {
      id: Date.now(),
      eggs: [],
      ...chicken,
    };

    setChickens((prev) => [...prev, newChicken]);
  };

  // ✅ DELETE CHICKEN
  const deleteChicken = (id) => {
    setChickens((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex">
      <Sidebar currentPage={page} setPage={setPage} />

      <div className="flex-1">
        {page === "dashboard" && (
          <Dashboard chickens={chickens} addChicken={addChicken} />
        )}

        {page === "registry" && (
          <ChickenRegistry
            chickens={chickens}
            deleteChicken={deleteChicken}
          />
        )}

        {page === "eggs" && (
          <EggTracker chickens={chickens} setChickens={setChickens} />
        )}
      </div>
    </div>
  );
}