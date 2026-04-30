import { useMemo } from "react";

export default function Dashboard({ chickens }: any) {

  const stats = useMemo(() => {
    const total = chickens.length;

    const healthy = chickens.filter((c: any) =>
      (c.healthLogs || []).some((l: any) => l.status === "Healthy" && !l.resolved)
    ).length;

    const sick = chickens.filter((c: any) =>
      (c.healthLogs || []).some((l: any) => l.status === "Sick" && !l.resolved)
    ).length;

    const recovering = chickens.filter((c: any) =>
      (c.healthLogs || []).some((l: any) => l.status === "Recovering" && !l.resolved)
    ).length;

    return { total, healthy, sick, recovering };
  }, [chickens]);

  const card = {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column" as const,
    gap: 8
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>🐔 Dashboard</h1>

      {/* STAT CARDS */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>

        <div style={card}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Total Chickens</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.total}</div>
        </div>

        <div style={card}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Healthy</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#22c55e" }}>
            {stats.healthy}
          </div>
        </div>

        <div style={card}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Sick</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#ef4444" }}>
            {stats.sick}
          </div>
        </div>

        <div style={card}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Recovering</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#eab308" }}>
            {stats.recovering}
          </div>
        </div>

      </div>
    </div>
  );
}