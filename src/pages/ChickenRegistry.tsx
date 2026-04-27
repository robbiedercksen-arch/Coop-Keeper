<span style={{ fontSize: 18 }}>
  {(!chicken.healthLogs || chicken.healthLogs.length === 0)
    ? "🟢"
    : chicken.healthLogs.some((l: any) => !l.resolved && l.status === "Sick")
    ? "🔴"
    : chicken.healthLogs.some((l: any) => !l.resolved && l.status === "Recovering")
    ? "🟡"
    : "🟢"}
</span>