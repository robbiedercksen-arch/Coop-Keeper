import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [chickens, setChickens] = useState<any[]>([]);
  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  // ✅ Central navigation function
  const navigate = (p: string) => {
    setPage(p);
  };

  return (
    <Layout navigate={navigate}>
      
      {/* 🔥 SAFETY FALLBACK */}
      {page === "dashboard" && <Dashboard />}

      {page === "registry" && (
        <ChickenRegistry
          chickens={chickens}
          setChickens={setChickens}
          setSelectedChicken={setSelectedChicken}
          navigate={navigate}
        />
      )}

      {page === "profile" && selectedChicken && (
        <ChickenProfile
          selectedChicken={selectedChicken}
          setChickens={setChickens}
          navigate={navigate}
        />
      )}

      {/* 🚨 CRITICAL FALLBACK (prevents blank screen) */}
      {!page && <Dashboard />}
    </Layout>
  );
}