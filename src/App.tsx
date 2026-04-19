import { useState } from "react";

export default function App() {
  const [chickens, setChickens] = useState<string[]>([]);

  const addChicken = () => {
    const name = prompt("Enter chicken name:");
    if (name) {
      setChickens([...chickens, name]);
    }
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

        {/* Chicken List */}
        <ul>
          {chickens.map((chicken, index) => (
            <li key={index}>{chicken}</li>
          ))}
        </ul>

      </div>

    </div>
  );
}