import { useState } from "react";

export default function ChickenRegistry({
  chickens,
  addChicken,
  deleteChicken,
  updateChicken,
}: any) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const [editing, setEditing] = useState<any>(null);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-farm-brown">
        Chicken Registry
      </h2>

      {/* ADD */}
      <div className="mb-4">
        <input
          placeholder="Name"
          className="border p-2 mr-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Breed"
          className="border p-2 mr-2"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />
        <input
          placeholder="Age"
          className="border p-2 mr-2"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button
          onClick={() => {
            if (!name) return;
            addChicken({ name, breed, age });
            setName("");
            setBreed("");
            setAge("");
          }}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* LIST */}
      {chickens.map((c: any) => (
        <div
          key={c.id}
          className="bg-white p-4 rounded shadow mb-2 flex justify-between"
        >
          <div>
            <h3 className="font-bold">{c.name}</h3>
            <p>{c.breed}</p>
            <p>{c.age}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(c)}
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => deleteChicken(c.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* 🔥 EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Edit Chicken</h3>

            <input
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />

            <input
              value={editing.breed}
              onChange={(e) =>
                setEditing({ ...editing, breed: e.target.value })
              }
              className="border p-2 w-full mb-2"
            />

            <input
              value={editing.age}
              onChange={(e) =>
                setEditing({ ...editing, age: e.target.value })
              }
              className="border p-2 w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  updateChicken(editing);
                  setEditing(null);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded"
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