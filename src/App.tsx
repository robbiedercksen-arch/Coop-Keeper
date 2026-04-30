import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [chickens, setChickens] = useState<any[]>([]);
  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  const navigate = (p: string) => setPage(p);

  return (
    <Layout navigate={navigate}>
      {page === "dashboard" && <Dashboard />}

      {page === "registry" && (
        <ChickenRegistry
          chickens={chickens}
          setChickens={setChickens}
          setSelectedChicken={setSelectedChicken}
          navigate={navigate}
        />
      )}

      {page === "profile" && (
        <ChickenProfile
          selectedChicken={selectedChicken}
          setChickens={setChickens}
          navigate={navigate}
        />
      )}
    </Layout>
  );
}