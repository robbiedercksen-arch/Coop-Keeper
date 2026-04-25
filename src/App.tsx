const styles: any = {
  container: {
    maxWidth: 500,
    margin: "auto",
    padding: 15,
    background: "#f5f1e6", // 🌾 farm beige
    minHeight: "100vh",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f1e6",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    margin: "15px 0",
  },

  card: {
    background: "#ffffff",
    padding: 15,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: 10,
  },

  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
  },

  button: {
    width: "100%",
    padding: 12,
    background: "#2f855a", // 🌿 farm green
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: "bold",
  },

  buttonAlt: {
    width: "100%",
    padding: 12,
    marginTop: 8,
    background: "#e2e8f0",
    border: "none",
    borderRadius: 10,
  },

  logout: {
    background: "#c53030",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
  },

  smallBtn: {
    marginTop: 10,
    marginRight: 5,
    padding: "6px 10px",
    borderRadius: 8,
    border: "none",
    background: "#edf2f7",
  },
};