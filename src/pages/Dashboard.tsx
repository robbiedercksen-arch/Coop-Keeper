import React, { useState } from "react";

export default function Dashboard({ addChicken }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const handleSave = () => {
    if (!name || !breed || !age) return;

    const newChicken = {
      id: Date.now().toString(),
      name,
      breed,
      age,
    };

    addChicken(newChicken); // 🔥 THIS is the fix

    // reset
    setName("");
    setBreed("");
    setAge("");
    setOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        Coop Keeper Dashboard
      </h1>

      <button
        onClick={() => setOpen(true)}
        className="bg-farm-green text-white px-4 py-2 rounded-lg"
      >
        + Add Chicken
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Chicken</h2>

            <input
              placeholder="Name"
              className="w-full mb-2 p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              placeholder="Breed"
              className="w-full mb-2 p-2 border rounded"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />

            <input
              placeholder="Age"
              className="w-full mb-4 p-2 border rounded"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
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