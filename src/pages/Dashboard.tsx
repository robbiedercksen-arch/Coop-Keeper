import { useState, useEffect } from "react";
import AddChickenModal from "../components/AddChickenModal";

export default function Dashboard() {
  const [chickens, setChickens] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chickens");
    if (saved) {
      setChickens(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  const saveChickens = (data: any[]) => {
    setChickens(data);
    localStorage.setItem("chickens", JSON.stringify(data));
  };

  // Add chicken
  const handleAddChicken = (chicken: any) => {
    const updated = [...chickens, chicken];
    saveChickens(updated);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-farm-brown">
        Coop Keeper Dashboard
      </h1>

      <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-inner">

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-farm-green">
            <p className="text-sm text-gray-500">Total Chickens</p>
            <p className="text-4xl font-bold mt-3 text-farm-green">
              {chickens.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-farm-yellow">
            <p className="text-sm text-gray-500">Eggs Today</p>
            <p className="text-4xl font-bold mt-3 text-farm-yellow">18</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-red-400">
            <p className="text-sm text-gray-500">Health Alerts</p>
            <p className="text-4xl font-bold mt-3 text-red-500">2</p>
          </div>

        </div>

        <div className="my-8 border-t border-gray-200"></div>

        {/* Buttons */}
        <div className="flex gap-4">
          
          <button
            className="bg-farm-green text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition"
            onClick={() => setShowModal(true)}
          >
            + Add Chicken
          </button>

          <button className="bg-farm-yellow text-white px-6 py-3 rounded-xl shadow">
            Log Eggs
          </button>

          <button className="bg-farm-brown text-white px-6 py-3 rounded-xl shadow">
            Breeding
          </button>

        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <AddChickenModal
          onClose={() => setShowModal(false)}
          onSave={handleAddChicken}
        />
      )}
    </div>
  );
}