export default function Layout({ children, navigate }: any) {
  const menuItem = {
    marginBottom: 15,
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: 8,
    transition: "0.2s",
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 🔹 Sidebar */}
      <div
        style={{
          width: 220,
          background: "#8B5E3C",
          color: "#fff",
          padding: 20,
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: 30 }}>🐔 Coop Keeper</h2>

        {/* Dashboard */}
        <div
          style={menuItem}
          onClick={() => navigate("dashboard")}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          📊 Dashboard
        </div>

        {/* Chicken Registry */}
        <div
          style={menuItem}
          onClick={() => navigate("registry")}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          🐔 Chicken Registry
        </div>
      </div>

      {/* 🔹 Main Content */}
      <div
        style={{
          flex: 1,
          background: "#f5f6fa",
          overflow: "auto",
          padding: 20,
        }}
      >
        {children}
      </div>
    </div>
  );
}