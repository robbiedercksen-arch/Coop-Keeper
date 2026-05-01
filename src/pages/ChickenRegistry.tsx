import { useState } from "react";

export default function ChickenRegistry({
  chickens,
  setChickens,
  setSelectedChicken,
  navigate,
  saveChickenToDB, // 🔥 ADD THIS LINE
}: any) {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    idTag: "",
    name: "",
    breed: "",
    sex: "Hen",
    ageGroup: "Adult",
    image: "",
  });

  // ================= IMAGE =================
  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // ================= ADD =================
  const addChicken = () => {
    if (!form.name) return alert("Name required");

    const newChicken = {
      id: Date.now(),
      ...form,
      healthLogs: [],
      notes: [],
      album: [],
    };

    setChickens((prev: any[]) => [...prev, newChicken]);
    saveChickenToDB(newChicken);
    setShowForm(false);
  };

  // ================= HEALTH STATUS =================
  const getHealthStatus = (c: any) => {
    const unresolved = c.healthLogs?.filter((l: any) => !l.resolved) || [];

    if (unresolved.some((l: any) => l.status === "Sick"))
      return { color: "#ef4444", label: "Sick" };

    if (unresolved.some((l: any) => l.status === "Recovering"))
      return { color: "#eab308", label: "Recovering" };

    return { color: "#22c55e", label: "Healthy" };
  };

  // ================= STYLES =================
  const container = {
    padding: 20,
    maxWidth: 1100,
  };

  const header = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  };

  const card = {
    background: "#fff",
    padding: 16,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    gap: 16,
    alignItems: "center",
    marginBottom: 12,
    cursor: "pointer",
  };

  const button = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    background: "#22c55e",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div style={container}>

      {/* HEADER */}
      <div style={header}>
        <div>
          <h2 style={{ margin: 0 }}>🐔 Chicken Registry</h2>
          <p style={{ margin: 0, fontSize: 13, color: "#666" }}>
            Manage and track your chickens
          </p>
        </div>

        <button onClick={() => setShowForm(!showForm)} style={button}>
          {showForm ? "Cancel" : "+ Add Chicken"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div style={header}>
          <input
            placeholder="ID Tag"
            value={form.idTag}
            onChange={(e) => setForm({ ...form, idTag: e.target.value })}
          />

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            placeholder="Breed"
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
          />

          <input type="file" onChange={handleImage} />

          <button onClick={addChicken}>Save</button>
        </div>
      )}

      {/* LIST */}
      {chickens.length === 0 && <p>No chickens yet</p>}

      {chickens.map((c: any) => {
        const status = getHealthStatus(c);

        return (
          <div
            key={c.id}
            style={card}
            onClick={() => {
              setSelectedChicken({ ...c });
              navigate("profile");
            }}
          >
            {/* IMAGE */}
            <img
              src={c.image || ""}
              style={{
                width: 80,
                height: 80,
                borderRadius: 10,
                objectFit: "cover",
                background: "#eee",
              }}
            />

            {/* INFO */}
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>{c.name}</h3>

              <div style={{ fontSize: 13, color: "#555" }}>
                ID Tag: {c.idTag}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: status.color,
                  }}
                />
                <span style={{ fontSize: 12 }}>{status.label}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}