import { useState } from "react";

type Props = {
  onClose: () => void;
  onSave: (chicken: any) => void;
};

export default function AddChickenModal({ onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const handleSave = () => {
    if (!name) return alert("Name is required");

    const newChicken = {
      id: Date.now(),
      name,
      breed,
      age,
    };

    onSave(newChicken);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
        
        <h2 className="text-2xl font-bold mb-4">Add Chicken</h2>

        <div className="flex flex-col gap-3">
          
          <input
            placeholder="Name"
            className="border p-3 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Breed"
            className="border p-3 rounded-lg"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />

          <input
            placeholder="Age"
            className="border p-3 rounded-lg"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-farm-green text-white rounded-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}