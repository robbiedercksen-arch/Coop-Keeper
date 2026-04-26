import React from "react";

export default function ChickenProfile({ chicken, goBack }) {
  if (!chicken) return null;

  return (
    <div className="p-6">
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2 bg-gray-300 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        {chicken.name}
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-farm-green space-y-2">
        <p><strong>Breed:</strong> {chicken.breed}</p>
        <p><strong>Age:</strong> {chicken.age}</p>

        {/* Future fields */}
        <p className="text-gray-500 mt-4">
          Egg history, health notes, breeding info coming soon...
        </p>
      </div>
    </div>
  );
}