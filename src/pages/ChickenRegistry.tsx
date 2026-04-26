import { useState } from "react";

export default function ChickenRegistry({
  chickens,
  addChicken,
  deleteChicken,
  updateChicken,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingChicken, setEditingChicken] = useState(null);

  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
  });

  const openAddModal = () => {
    setEditingChicken(null);
    setForm({ name: "", breed: "", age: "" });
    setShowModal(true);
  };

  const openEditModal = (chicken) => {
    setEditingChicken(chicken);
    setForm({
      name: chicken.name,
      breed: chicken.breed,
      age: chicken.age,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return;

    if (editingChicken) {
      updateChicken(editingChicken.id, form);
    } else {
      addChicken(form);
    }

    setShowModal(false);
    setEditingChicken(null);
    setForm({ name: "", breed: "", age: "" });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-farm-brown mb-4">
        Chicken Registry
      </h1>

      {/* ADD BUTTON */}
      <button
        onClick={openAddModal}
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
            className="bg-white p-4 rounded-lg shadow mb-3 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{chicken.name}</h2>
              <p>Breed: {chicken.breed}</p>
              <p>Age: {chicken.age}</p>
            </div>

            <div className="flex gap-2">
              {/* EDIT BUTTON */}
              <button
                onClick={() => openEditModal(chicken)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteChicken(chicken.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[300px]">
            <h2 className="text-lg font-bold mb-3">
              {editingChicken ? "Edit Chicken" : "Add Chicken"}
            </h2>

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