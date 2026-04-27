import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";
import EggTracker from "./pages/EggTracker";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [selectedChicken, setSelectedChicken] = useState(null);

  const [chickens, setChickens] = useState(() => {
    const saved = localStorage.getItem("chickens");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  const navigate = (p: string, chicken: any = null) => {
    setPage(p);
    setSelectedChicken(chicken);
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard chickens={chickens} />;
      case "registry":
        return (
          <ChickenRegistry
            chickens={chickens}
            setChickens={setChickens}
            navigate={navigate}
          />
        );
      case "profile":
        return (
          <ChickenProfile
            selectedChicken={selectedChicken}
            chickens={chickens}
            setChickens={setChickens}
            navigate={navigate}
          />
        );
      case "egg":
        return <EggTracker chickens={chickens} setChickens={setChickens} />;
      default:
        return <Dashboard chickens={chickens} />;
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />
      <div style={{ flex: 1, padding: 20 }}>{renderPage()}</div>
    </div>
  );
}