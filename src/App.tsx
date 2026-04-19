import { useState } from "react";

export default function App() {
  const [chickens, setChickens] = useState<string[]>([]);
  const [newChicken, setNewChicken] = useState("");

  const addChicken = () => {
    if (newChicken.trim() === "") return;
    setChickens([...chickens, newChicken]);
    setNewChicken("");
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

        {/* Input */}
        <input
          value={newChicken}
          onChange={(e) => setNewChicken(e.target.value)}
          placeholder="Enter chicken name"
          style={{
            padding: "10px",
            marginRight: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        />

        {/* Button */}
        <button
          onClick={addChicken}
          style={{
            padding: "10px 15px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Add Chicken
        </button>

        {/* List */}
        <ul style={{ marginTop: "20px" }}>
          {chickens.map((chicken, index) => (
            <li key={index}>{chicken}</li>
          ))}
        </ul>

      </div>

    </div>
  );
}