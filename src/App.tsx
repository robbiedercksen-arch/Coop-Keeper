import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [chickens, setChickens] = useState([]);

  // Load from localStorage once
  useEffect(() => {
    const stored = localStorage.getItem("chickens");
    if (stored) {
      setChickens(JSON.parse(stored));
    }
  }, []);

  // Save whenever chickens change
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  const addChicken = (chicken) => {
    setChickens((prev) => [...prev, chicken]);
  };

  const renderPage = () => {
    switch (activePage) {
      case "registry":
        return <ChickenRegistry chickens={chickens} />;
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