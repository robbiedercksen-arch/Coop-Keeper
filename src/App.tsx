export default function App() {
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

        <button style={{
          padding: "10px 15px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          Add Chicken
        </button>

      </div>

    </div>
  );
}