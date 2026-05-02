import { useMemo } from "react";

export default function Dashboard({ chickens }: any) {

  // 🔥 STATS CALCULATIONS
  const stats = useMemo(() => {
    const total = chickens.length;
    let sick = 0;
    let recovering = 0;
    let healthy = 0;

    const recentLogs: any[] = [];

    chickens.forEach((c: any) => {
      (c.healthLogs || []).forEach((log: any) => {
        recentLogs.push({ ...log, chickenName: c.name });

        if (!log.resolved) {
          if (log.status === "Sick") sick++;
          else if (log.status === "Recovering") recovering++;
          else healthy++;
        }
      });
    });

    // newest first
    recentLogs.sort((a, b) => b.id - a.id);

    return {
      total,
      sick,
      recovering,
      healthy,
      recentLogs: recentLogs.slice(0, 5)
    };
  }, [chickens]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* 🔥 STAT CARDS */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <StatCard title="Total Chickens" value={stats.total} color="#3b82f6" />
        <StatCard title="Sick" value={stats.sick} color="#ef4444" />
        <StatCard title="Recovering" value={stats.recovering} color="#eab308" />
        <StatCard title="Healthy Logs" value={stats.healthy} color="#22c55e" />
      </div>

      {/* 🔥 ALERT PANEL */}
      <div style={card}>
        <h3 style={{ marginBottom: 12 }}>⚠ Health Alerts</h3>

        {stats.sick === 0 ? (
          <div style={{ color: "#22c55e", fontWeight: 600 }}>
            All chickens are healthy 👍
          </div>
        ) : (
          <div style={{ color: "#ef4444", fontWeight: 600 }}>
            {stats.sick} chicken(s) currently sick
          </div>
        )}
      </div>

      {/* 🔥 RECENT ACTIVITY */}
      <div style={card}>
        <h3 style={{ marginBottom: 12 }}>📋 Recent Health Activity</h3>

        {stats.recentLogs.length === 0 && (
          <div style={{ color: "#6b7280" }}>No activity yet</div>
        )}

        {stats.recentLogs.map((log: any) => (
          <div key={log.id} style={activityItem}>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

              <div style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background:
                  log.status === "Healthy" ? "#22c55e" :
                  log.status === "Sick" ? "#ef4444" :
                  "#eab308"
              }} />

              <div>
                <div style={{ fontWeight: 600 }}>
                  {log.chickenName}
                </div>

                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {log.status} — {log.symptoms || "No symptoms"}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: "#9ca3af" }}>
              {log.date}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}


// 🔥 COMPONENTS

function StatCard({ title, value, color }: any) {
  return (
    <div style={{
      flex: 1,
      minWidth: 180,
      background: "#fff",
      padding: 20,
      borderRadius: 16,
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      borderLeft: `6px solid ${color}`
    }}>
      <div style={{ fontSize: 13, color: "#6b7280" }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 700 }}>{value}</div>
    </div>
  );
}


// 🔥 STYLES

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
};

const activityItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #f1f5f9",
};