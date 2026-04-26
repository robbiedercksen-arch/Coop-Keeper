import React, { useState } from "react";

export default function Dashboard({ chickens, addChicken }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // ✅ TOTAL EGGS TODAY
  const eggsToday = chickens.reduce((total, chicken) => {
    return (
      total +
      (chicken.eggs || []).reduce((sum, entry) => {
        return entry.date === today ? sum + entry.count : sum;
      }, 0)
    );
  }, 0);

  // ✅ TOTAL EGGS ALL TIME
  const totalEggs = chickens.reduce((total, chicken) => {
    return (
      total +
      (chicken.eggs || []).reduce((sum, entry) => {
        return sum + entry.count;
      }, 0)
    );
  }, 0);

  // ✅ BEST LAYER
  const bestChicken = chickens.reduce(
    (best, chicken) => {
      const total = (chicken.eggs || []).reduce(
        (sum, entry) => sum + entry.count,
        0
      );

      if (total > best.count) {
        return { name: chicken.name, count: total };
      }

      return best;
    },
    { name: "None", count: 0 }
  );

  // ✅ ADD CHICKEN
  const handleSave = () => {
    const newChicken = {
      id: Date.now(),
      name,
      breed,
      age,
      eggs: [],
    };

    addChicken(newChicken);

    setName("");
    setBreed("");
    setAge("");
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        Coop Keeper Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-farm-green">
          <p>Total Chickens</p>
          <h2 className="text-2xl font-bold">{chickens.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-farm-yellow">
          <p>Eggs Today</p>
          <h2 className="text-2xl font-bold">{eggsToday}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-farm-brown">
          <p>Total Eggs</p>
          <h2 className="text-2xl font-bold">{totalEggs}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-400">
          <p>Top Layer</p>
          <h2 className="text-lg font-bold">
            {bestChicken.name} ({bestChicken.count})
          </h2>
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-farm-green text-white rounded shadow"
      >
        + Add Chicken
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Add Chicken</h2>

            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full mb-2 p-2 border rounded"
              placeholder="Breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />

            <input
              className="w-full mb-4 p-2 border rounded"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-farm-green text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}