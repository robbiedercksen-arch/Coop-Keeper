import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [chickens, setChickens] = useState([]);
  const [selectedChicken, setSelectedChicken] = useState(null);

  // ✅ Load chickens from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("chickens");
    if (stored) {
      setChickens(JSON.parse(stored));
    }
  }, []);

  // ✅ Save chickens to localStorage
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  // ✅ Add new chicken
  const addChicken = (chicken) => {
    setChickens((prev) => [...prev, chicken]);
  };

  // ✅ Delete chicken
  const deleteChicken = (id) => {
    setChickens((prev) => prev.filter((c) => c.id !== id));
  };

  // ✅ Update chicken (used for eggs, edits later)
  const updateChicken = (updatedChicken) => {
    setChickens((prev) =>
      prev.map((c) =>
        c.id === updatedChicken.id ? updatedChicken : c
      )
    );
  };

  // ✅ Open chicken profile
  const openProfile = (chicken) => {
    setSelectedChicken(chicken);
    setActivePage("profile");
  };

  // ✅ Go back from profile
  const goBack = () => {
    setSelectedChicken(null);
    setActivePage("registry");
  };

  // ✅ Page router
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
            updateChicken={updateChicken} // ✅ important for egg tracking
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
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {/* Main Content */}
      <div className="flex-1 bg-[#f5f1ea] min-h-screen">
        {renderPage()}
      </div>
    </div>
  );
}