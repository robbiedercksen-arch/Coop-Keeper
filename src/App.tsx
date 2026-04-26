import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import EggTracker from "./pages/EggTracker";

export default function App() {
  const [page, setPage] = useState("dashboard");

  // ✅ LOAD FROM LOCAL STORAGE
  const [chickens, setChickens] = useState(() => {
    const saved = localStorage.getItem("chickens");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  // ✅ ADD CHICKEN (SAFE)
  const addChicken = (chicken) => {
    if (!chicken || !chicken.name) return; // prevent crashes

    const newChicken = {
      id: Date.now(),
      name: chicken.name,
      breed: chicken.breed || "",
      age: chicken.age || "",
      eggs: [], // VERY IMPORTANT
    };

    setChickens((prev) => [...prev, newChicken]);
  };

  // ✅ DELETE CHICKEN
  const deleteChicken = (id) => {
    setChickens((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <Sidebar currentPage={page} setPage={setPage} />

      {/* MAIN CONTENT */}
      <div className="flex-1">
        {page === "dashboard" && (
          <Dashboard chickens={chickens} />
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
            setChickens={setChickens}
          />
        )}
      </div>
    </div>
  );
}