import { useState, useEffect } from "react";

type Chicken = {
  name: string;
  breed: string;
  age: string;
};

export default function App() {
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Load saved chickens
  useEffect(() => {
    const saved = localStorage.getItem("chickens");
    if (saved) {
      setChickens(JSON.parse(saved));
    }
  }, []);

  // Save chickens
  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  const handleSubmit = () => {
    if (!name || !breed || !age) return;

    if (editIndex !== null) {
      // Update existing
      const updated = [...chickens];
      updated[editIndex] = { name, breed, age };
      setChickens(updated);
      setEditIndex(null);
    } else {
      // Add new
      setChickens([...chickens, { name, breed, age }]);
    }

    setName("");
    setBreed("");
    setAge("");
  };

  const deleteChicken = (index: number) => {
    const updated = chickens.filter((_, i) => i !== index);
    setChickens(updated);
  };

  const startEdit = (index: number) => {
    const chicken = chickens[index];
    setName(chicken.name);
    setBreed(chicken.breed);
    setAge(chicken.age);
    setEditIndex(index);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial"
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#111827",
          color: "white",
          padding: "20px"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>🐔 Coop Keeper</h2>
        <p style={{ marginBottom: "10px" }}>Dashboard</p>
        <p style={{ marginBottom: "10px" }}>Chickens</p>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "30px", background: "#f9fafb" }}>
        <h1 style={{ marginBottom: "20px" }}>Chickens</h1>

        {/* Form */}
        <div style={{ marginBottom: "20px" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            style={{ padding: "10px", marginRight: "10px" }}
          />
          <input
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="Breed"
            style={{ padding: "10px", marginRight: "10px" }}
          />
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
            style={{ padding: "10px", marginRight: "10px" }}
          />

          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 15px",
              background: editIndex !== null ? "#f59e0b" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {editIndex !== null ? "Update Chicken" : "Add Chicken"}
          </button>
        </div>

        {/* List */}
        <div>
          {chickens.map((chicken, index) => (
            <div
              key={index}
              style={{
                background: "white",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >
              <strong>{chicken.name}</strong>
              <br />
              Breed: {chicken.breed}
              <br />
              Age: {chicken.age}

              <br />
              <br />

              <button
                onClick={() => startEdit(index)}
                style={{
                  padding: "5px 10px",
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px"
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteChicken(index)}
                style={{
                  padding: "5px 10px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}