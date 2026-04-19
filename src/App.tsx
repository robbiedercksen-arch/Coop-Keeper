export default function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "200px",
        background: "#1f2937",
        color: "white",
        padding: "20px"
      }}>
        <h2>Menu</h2>
        <p>Dashboard</p>
        <p>Chickens</p>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Coop Keeper</h1>
        <h2>Chickens</h2>
        <button>Add Chicken</button>
      </div>

    </div>
  );
}