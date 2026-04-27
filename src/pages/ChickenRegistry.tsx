import { useState } from "react";

export default function ChickenRegistry({
  chickens,
  addChicken,
  deleteChicken,
}: any) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-farm-brown">
        Chicken Registry
      </h2>

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

          <button
            onClick={() => deleteChicken(c.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}