function Chart({ data, color }: any) {
  const max = Math.max(...data.map((d: any) => d.value), 1);

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      alignItems: "flex-end",
      height: "180px",
      marginTop: "10px",
      padding: "10px",
      background: "white",
      borderRadius: "10px"
    }}>
      {data.map((d: any, i: number) => {
        let height = (d.value / max) * 100;

        // ✅ make small values visible
        if (d.value > 0 && height < 8) height = 8;

        return (
          <div key={i} style={{ flex: 1, textAlign: "center" }}>
            
            {/* VALUE */}
            <div style={{ fontSize: "12px", marginBottom: "5px" }}>
              {d.value}
            </div>

            {/* BAR */}
            <div
              style={{
                height: `${height}%`,
                background: d.value === 0 ? "#e5e7eb" : color,
                borderRadius: "6px",
                transition: "0.3s"
              }}
            />

            {/* DATE */}
            <div style={{ fontSize: "10px", marginTop: "5px" }}>
              {d.date.slice(5)}
            </div>

          </div>
        );
      })}
    </div>
  );
}