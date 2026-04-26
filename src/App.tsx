import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [chickens, setChickens] = useState([]);
  const [selectedChicken, setSelectedChicken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("chickens");
    if (stored) setChickens(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  const addChicken = (chicken) => {
    setChickens((prev) => [...prev, chicken]);
  };

  const deleteChicken = (id) => {
    setChickens((prev) => prev.filter((c) => c.id !== id));
  };

  const updateChicken = (updatedChicken) => {
    setChickens((prev) =>
      prev.map((c) => (c.id === updatedChicken.id ? updatedChicken : c))
    );
  };

  const openProfile = (chicken) => {
    setSelectedChicken(chicken);
    setActivePage("profile");
  };

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
            goBack={() => setActivePage("registry")}
          />
        );

      default:
        return <Dashboard addChicken={addChicken} />;
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