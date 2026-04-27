{chickens.map((chicken: any) => (
  <div
    key={chicken.id}
    onClick={() => {
      setSelectedChicken(chicken);
      navigate("profile");
    }}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#fff",
      padding: 15,
      borderRadius: 12,
      marginTop: 10,
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    {/* LEFT SIDE */}
    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
      <img
        src={chicken.image}
        style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }}
      />

      <div>
        <b>{chicken.name}</b>
        <div style={{ fontSize: 13, color: "#666" }}>
          {chicken.idTag}
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
      
      {/* SEX ICON */}
      <span style={{ fontSize: 20 }}>
        {chicken.sex === "Hen" && "♀️"}
        {chicken.sex === "Rooster" && "♂️"}
        {chicken.sex === "Unknown" && "❓"}
      </span>

      {/* HEALTH ICON (ONLY IF LOGS EXIST) */}
      {(chicken.healthLogs && chicken.healthLogs.length > 0) && (
        <span title="Health records available" style={{ fontSize: 18 }}>
          ⚠️
        </span>
      )}

      {/* STATUS */}
      <span
        style={{
          fontSize: 12,
          background: "#eee",
          padding: "5px 10px",
          borderRadius: 6,
        }}
      >
        {chicken.status}
      </span>
    </div>
  </div>
))}