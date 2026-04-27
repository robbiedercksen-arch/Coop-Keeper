{chickens.map((chicken: any) => (
  <div
    key={chicken.id}
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
    onClick={() => {
      console.log("CLICKED:", chicken); // debug
      setSelectedChicken(chicken);
      navigate("profile");
    }}
  >
    {/* LEFT */}
    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
      <img
        src={chicken.image}
        style={{
          width: 60,
          height: 60,
          borderRadius: 10,
          objectFit: "cover",
          pointerEvents: "none", // 👈 IMPORTANT FIX
        }}
      />

      <div style={{ pointerEvents: "none" }}>
        <b>{chicken.name}</b>
        <div style={{ fontSize: 13, color: "#666" }}>
          {chicken.idTag}
        </div>
      </div>
    </div>

    {/* RIGHT */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 15,
        pointerEvents: "none", // 👈 THIS FIXES CLICK BLOCKING
      }}
    >
      {/* SEX */}
      <span style={{ fontSize: 20 }}>
        {chicken.sex === "Hen" && "♀️"}
        {chicken.sex === "Rooster" && "♂️"}
        {chicken.sex === "Unknown" && "❓"}
      </span>

      {/* HEALTH */}
      {(chicken.healthLogs && chicken.healthLogs.length > 0) && (
        <span style={{ fontSize: 18 }}>
          {chicken.healthLogs.some((log: any) => log.status === "Sick")
            ? "🔴"
            : chicken.healthLogs.some((log: any) => log.status === "Recovering")
            ? "🟡"
            : "🟢"}
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