import { useState } from "react";

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

  const addChicken = () => {
    if (!name || !breed || !age) return;

    const newChicken = { name, breed, age };
    setChickens([...chickens, newChicken]);

    setName("");
    setBreed("");
    setAge("");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#111827",
        color: "white",
        padding: "20px"
      }}>
        <h2 style={{ marginBottom: "20px" }}>🐔 Coop Keeper</h2>

        <p style={{ marginBottom: "10px", cursor: "pointer" }}>Dashboard</p>
        <p style={{ marginBottom: "10px", cursor: "pointer" }}>Chickens</p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px", background: "#f9fafb" }}>
        
        <h1 style={{ marginBottom: "20px" }}>Chickens</h1>

        {/* Inputs */}
        <div style={{ marginBottom: "15px" }}>
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
        </div>

        {/* Button */}
        <button
          onClick={addChicken}
          style={{
            padding: "10px 15px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          Add Chicken
        </button>

        {/* List */}
        <div>
  {chickens.map((chicken, index) => (
    <div key={index} style={{
      background: "white",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <strong>{chicken.name}</strong><br />
      Breed: {chicken.breed} <br />
      Age: {chicken.age}

      <br /><br />

      <button
        onClick={() => {
          const updated = chickens.filter((_, i) => i !== index);
          setChickens(updated);
        }}
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
</div>   {/* closes Main Content */}
</div>   {/* closes Root container */}
);
}