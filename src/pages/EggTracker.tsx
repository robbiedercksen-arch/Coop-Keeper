import React from "react";

export default function EggTracker({ chickens, setChickens }) {
  const addEgg = (id) => {
    setChickens((prev) =>
      prev.map((chicken) =>
        chicken.id === id
          ? {
              ...chicken,
              eggs: [...(chicken.eggs || []), new Date().toISOString()],
            }
          : chicken
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        Egg Tracker
      </h1>

      {chickens.length === 0 ? (
        <p>No chickens yet.</p>
      ) : (
        chickens.map((chicken) => (
          <div
            key={chicken.id}
            className="bg-white p-4 rounded-xl shadow-md mb-4 flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold">{chicken.name}</h2>
              <p className="text-sm text-gray-500">
                Eggs: {chicken.eggs?.length || 0}
              </p>
            </div>

            <button
              onClick={() => addEgg(chicken.id)}
              className="bg-farm-yellow px-4 py-2 rounded text-white font-semibold"
            >
              + Add Egg
            </button>
          </div>
        ))
      )}
    </div>
  );
}