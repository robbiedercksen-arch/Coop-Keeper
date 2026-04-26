import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "registry":
        return <ChickenRegistry />;
      default:
        return <Dashboard />;
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