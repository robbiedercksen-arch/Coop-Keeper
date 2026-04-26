import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Feeding & Water":
        return <div className="text-2xl">Feeding & Water Page</div>;
      case "Chicken Registry":
        return <div className="text-2xl">Chicken Registry Page</div>;
      case "Egg Tracker":
        return <div className="text-2xl">Egg Tracker Page</div>;
      case "Breeding":
        return <div className="text-2xl">Breeding Page</div>;
      case "Expenses":
        return <div className="text-2xl">Expenses Page</div>;
      case "Profit":
        return <div className="text-2xl">Profit Page</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f5f3ef] to-[#eae6df]">
      
      {/* Sidebar */}
      <div className="w-64 bg-farm-brown text-white shadow-xl">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </div>

    </div>
  );
}

export default App;