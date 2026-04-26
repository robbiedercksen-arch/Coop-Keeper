import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [chickens, setChickens] = useState([]);
  const [selectedChicken, setSelectedChicken] = useState(null);

  // ✅ SAFE LOAD (fixes blank screen issue)
  useEffect(() => {
    const stored = localStorage.getItem("chickens");

    if (stored) {
      const parsed = JSON.parse(stored);

      // Ensure eggs always exists
      const fixed = parsed.map((c) => ({
        ...c,
        eggs: c.eggs || [],
      }));

      setChickens(fixed);
    }
  }, []);

  // ✅ SAVE
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  // ✅ ADD
  const addChicken = (chicken) => {
    setChickens((prev) => [...prev, chicken]);
  };

  // ✅ DELETE
  const deleteChicken = (id) => {
    setChickens((prev) => prev.filter((c) => c.id !== id));
  };

  // ✅ UPDATE
  const updateChicken = (updatedChicken) => {
    setChickens((prev) =>
      prev.map((c) =>
        c.id === updatedChicken.id ? updatedChicken : c
      )
    );
  };

  // ✅ OPEN PROFILE
  const openProfile = (chicken) => {
    setSelectedChicken(chicken);
    setActivePage("profile");
  };

  // ✅ BACK
  const goBack = () => {
    setSelectedChicken(null);
    setActivePage("registry");
  };

  // ✅ ROUTER
  const renderPage = () => {
    switch (activePage) {
      case "registry":
        return (
          <ChickenRegistry
            chickens={chickens}
            deleteChicken={deleteChicken}
            updateChicken={updateChicken}
            openProfile={openProfile}
          />
        );

      case "profile":
        return (
          <ChickenProfile
            chicken={selectedChicken}
            goBack={goBack}
            updateChicken={updateChicken}
          />
        );

      default:
        return (
          <Dashboard
            chickens={chickens}
            addChicken={addChicken}
          />
        );
    }
  };

  return (
    <div className="flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 bg-[#f5f1ea] min-h-screen">
        {renderPage()}
      </div>
    </div>
  );
}