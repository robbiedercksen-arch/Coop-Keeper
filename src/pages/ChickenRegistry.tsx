import { useState } from "react";

export default function ChickenRegistry({
  chickens,
  addChicken,
  deleteChicken,
}) {
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
  });

  const handleSave = () => {
    if (!form.name) return;

    addChicken(form);

    setForm({ name: "", breed: "", age: "" });
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-farm-brown mb-4">
        Chicken Registry
      </h1>

      {/* ADD BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="mb-4 px-4 py-2 bg-farm-green text-white rounded-lg shadow"
      >
        + Add Chicken
      </button>

      {/* LIST */}
      {chickens.length === 0 ? (
        <p>No chickens added yet.</p>
      ) : (
        chickens.map((chicken) => (
          <div
            key={chicken.id}
            className="bg-white p-4 rounded-lg shadow mb-3 flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{chicken.name}</h2>
              <p>Breed: {chicken.breed}</p>
              <p>Age: {chicken.age}</p>
            </div>

            <button
              onClick={() => deleteChicken(chicken.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[300px]">
            <h2 className="text-lg font-bold mb-3">Add Chicken</h2>

            <input
              placeholder="Name"
              className="w-full border p-2 mb-2 rounded"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Breed"
              className="w-full border p-2 mb-2 rounded"
              value={form.breed}
              onChange={(e) =>
                setForm({ ...form, breed: e.target.value })
              }
            />

            <input
              placeholder="Age"
              className="w-full border p-2 mb-4 rounded"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white rounded"
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