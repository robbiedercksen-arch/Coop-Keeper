import { useNavigate } from "react-router-dom";

export default function ChickenRegistry() {
  const navigate = useNavigate();

  // ✅ TEMP DATA (ensures page always renders)
  const chickens = [
    { id: 1, name: "Caramel", status: "Active" },
    { id: 2, name: "Snow", status: "Healthy" },
  ];

  const cardStyle = {
    padding: 20,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    cursor: "pointer",
    width: 220,
    transition: "0.2s",
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Chicken Registry</h1>

      {/* 🐔 Chicken Cards */}
      <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
        {chickens.length === 0 ? (
          <p>No chickens found.</p>
        ) : (
          chickens.map((chicken) => (
            <div
              key={chicken.id}
              onClick={() => navigate(`/chicken/${chicken.id}`)}
              style={cardStyle}
            >
              <h3>{chicken.name}</h3>
              <p>ID: {chicken.id}</p>
              <p>Status: {chicken.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}