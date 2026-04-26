import React, { useState } from "react";

export default function ChickenRegistry({
  chickens,
  deleteChicken,
  updateChicken,
}) {
  const [editing, setEditing] = useState(null);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const startEdit = (chicken) => {
    setEditing(chicken);
    setName(chicken.name);
    setBreed(chicken.breed);
    setAge(chicken.age);
  };

  const handleUpdate = () => {
    updateChicken({
      ...editing,
      name,
      breed,
      age,
    });

    setEditing(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        Chicken Registry
      </h1>

      {chickens.length === 0 ? (
        <p>No chickens added yet.</p>
      ) : (
        <div className="grid gap-4">
          {chickens.map((chicken) => (
            <div
              key={chicken.id}
              className="bg-white rounded-xl shadow-md p-4 border-l-4 border-farm-green flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-farm-brown">
                  {chicken.name}
                </h2>
                <p>Breed: {chicken.breed}</p>
                <p>Age: {chicken.age}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(chicken)}
                  className="px-3 py-1 bg-farm-yellow text-white rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteChicken(chicken.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit Chicken</h2>

            <input
              className="w-full mb-2 p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full mb-2 p-2 border rounded"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />

            <input
              className="w-full mb-4 p-2 border rounded"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
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