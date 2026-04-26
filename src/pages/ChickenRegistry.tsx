import React from "react";

export default function ChickenRegistry({ chickens }) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        Chicken Registry
      </h1>

      {chickens.length === 0 ? (
        <p className="text-gray-500">No chickens added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chickens.map((chicken) => (
            <div
              key={chicken.id}
              className="bg-white rounded-xl shadow-md p-4 border-l-4 border-farm-green"
            >
              <h2 className="text-xl font-semibold text-farm-brown">
                {chicken.name}
              </h2>

              <p className="text-sm text-gray-600">
                Breed: {chicken.breed}
              </p>

              <p className="text-sm text-gray-600">
                Age: {chicken.age}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}