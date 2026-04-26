import React, { useState } from "react";

export default function ChickenProfile({ chicken, goBack, updateChicken }) {
  const [eggCount, setEggCount] = useState("");

  // ✅ SAFETY GUARD (prevents blank screen)
  if (!chicken) {
    return <div className="p-6">No chicken selected</div>;
  }

  // ✅ ADD EGGS
  const addEggs = () => {
    if (!eggCount) return;

    const today = new Date().toISOString().split("T")[0];

    const updated = {
      ...chicken,
      eggs: [
        ...(chicken.eggs || []),
        {
          date: today,
          count: Number(eggCount),
        },
      ],
    };

    updateChicken(updated);
    setEggCount("");
  };

  return (
    <div className="p-6">
      <button
        onClick={goBack}
        className="mb-4 px-3 py-1 bg-gray-300 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-farm-brown mb-4">
        {chicken.name}
      </h1>

      {/* INFO */}
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-farm-green mb-6">
        <p><strong>Breed:</strong> {chicken.breed}</p>
        <p><strong>Age:</strong> {chicken.age}</p>
      </div>

      {/* LOG EGGS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-bold mb-3">🥚 Log Eggs</h2>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="How many eggs?"
            value={eggCount}
            onChange={(e) => setEggCount(e.target.value)}
            className="border p-2 rounded w-40"
          />

          <button
            onClick={addEggs}
            className="bg-farm-yellow px-4 py-2 rounded text-white"
          >
            Save
          </button>
        </div>
      </div>

      {/* HISTORY */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">📊 Egg History</h2>

        {(chicken.eggs || []).length === 0 ? (
          <p className="text-gray-500">No eggs logged yet</p>
        ) : (
          <ul className="space-y-2">
            {(chicken.eggs || []).map((entry, i) => (
              <li key={i} className="flex justify-between border-b pb-1">
                <span>{entry.date}</span>
                <span className="font-semibold">
                  {entry.count} eggs
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}