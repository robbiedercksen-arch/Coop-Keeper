import { useState, useEffect } from "react";
import ChickenRegistry from "./pages/ChickenRegistry";
import ChickenProfile from "./pages/ChickenProfile";

export default function App() {
  const [page, setPage] = useState("registry");

  // 🔥 LOAD FROM LOCAL STORAGE
  const [chickens, setChickens] = useState<any[]>(() => {
    const saved = localStorage.getItem("chickens");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedChicken, setSelectedChicken] = useState<any>(null);

  // 💾 AUTO SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  // 🔄 KEEP SELECTED CHICKEN IN SYNC
  useEffect(() => {
    if (selectedChicken) {
      const updated = chickens.find((c) => c.id === selectedChicken.id);
      if (updated) {
        setSelectedChicken(updated);
      }
    }
  }, [chickens]);

  const navigate = (pageName: string) => {
    setPage(pageName);
  };

  return (
    <div>
      {page === "registry" && (
        <ChickenRegistry
          chickens={chickens}
          setChickens={setChickens}
          setSelectedChicken={(chicken: any) => {
            setSelectedChicken(chicken);
            setPage("profile");
          }}
        />
      )}

      {page === "profile" && (
        <ChickenProfile
          selectedChicken={selectedChicken}
          setChickens={setChickens}
          setSelectedChicken={setSelectedChicken}
          navigate={navigate}
        />
      )}
    </div>
  );
}