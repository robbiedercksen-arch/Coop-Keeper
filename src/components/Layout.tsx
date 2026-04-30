import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* 🔹 Sidebar */}
      <div
        style={{
          width: 220,
          background: "#8B5E3C",
          color: "#fff",
          padding: 20,
        }}
      >
        <h2 style={{ marginBottom: 30 }}>🐔 Coop Keeper</h2>

        <div
          style={{ marginBottom: 15, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </div>

        <div
          style={{ marginBottom: 15, cursor: "pointer" }}
          onClick={() => navigate("/registry")}
        >
          Chicken Registry
        </div>
      </div>

      {/* 🔹 Page Content */}
      <div style={{ flex: 1, background: "#f5f6fa", overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
}