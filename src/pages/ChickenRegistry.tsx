import { useState } from "react";

export default function ChickenRegistry({ chickens, setChickens }: any) {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const addChicken = () => {
    if (!name) return;

    const newChicken = {
      id: Date.now(),
      name,
      breed,
      age,
      eggs: [],
    };

    setChickens([...chickens, newChicken]);

    setName("");
    setBreed("");
    setAge("");
  };

  const deleteChicken = (id: number) => {
    setChickens(chickens.filter((c: any) => c.id !== id));
  };

  const startEdit = (chicken: any) => {
    setEditingId(chicken.id);
    setName(chicken.name);
    setBreed(chicken.breed);
    setAge(chicken.age);
  };

  const saveEdit = () => {
    setChickens(
      chickens.map((c: any) =>
        c.id === editingId ? { ...c, name, breed, age } : c
      )
    );

    setEditingId(null);
    setName("");
    setBreed("");
    setAge("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🐔 Chicken Registry</h2>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />
        <input
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        {editingId ? (
          <button onClick={saveEdit} style={{ background: "orange" }}>
            Save
          </button>
        ) : (
          <button onClick={addChicken} style={{ background: "green", color: "#fff" }}>
            Add
          </button>
        )}
      </div>

      {/* LIST */}
      {chickens.map((c: any) => (
        <div
          key={c.id}
          style={{
            background: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>{c.name}</strong>
            <div>{c.breed}</div>
            <div>{c.age}</div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => startEdit(c)}
              style={{
                background: "#facc15",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Edit
            </button>

            <button
              onClick={() => deleteChicken(c.id)}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}