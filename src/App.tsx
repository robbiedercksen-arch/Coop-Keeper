import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [chickens, setChickens] = useState([]);
  const [selectedChicken, setSelectedChicken] = useState(null);

  // ✅ Load from storage
  useEffect(() => {
    const stored = localStorage.getItem("chickens");
    if (stored) setChickens(JSON.parse(stored));
  }, []);

  // ✅ Save to storage
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  // ✅ Add chicken
  const addChicken = (chicken) => {
    setChickens((prev) => [...prev, chicken]);
  };

  // ✅ Delete
  const deleteChicken = (id) => {
    setChickens((prev) => prev.filter((c) => c.id !== id));
  };

  // ✅ Update
  const updateChicken = (updated) => {
    setChickens((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  // ✅ Open profile
  const openProfile = (chicken) => {
    setSelectedChicken(chicken);
    setActivePage("profile");
  };

  // ✅ Back from profile
  const goBack = () => {
    setSelectedChicken(null);
    setActivePage("registry");
  };

  // ✅ Page switch
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