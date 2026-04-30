import { useState } from "react";

export default function ChickenRegistry({
  chickens = [],
  setChickens,
  setSelectedChicken,
  navigate,
}: any) {
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const [form, setForm] = useState({
    idTag: "",
    name: "",
    breed: "",
    sex: "Unknown",
    ageGroup: "Adult",
    status: "Active",
    hatchDate: "",
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
    if (!form.idTag || !form.name || !form.image) {
      alert("ID Tag, Name and Photo are required");
      return;
    }

    if (chickens.some((c: any) => c.idTag === form.idTag)) {
      alert("ID Tag must be unique!");
      return;
    }

    const newChicken = {
      id: Date.now(),
      ...form,
      healthLogs: [],
      notes: [],
      eggs: [],
    };

    setChickens([...chickens, newChicken]);

    setForm({
      idTag: "",
      name: "",
      breed: "",
      sex: "Unknown",
      ageGroup: "Adult",
      status: "Active",
      hatchDate: "",
      image: "",
    });
  };

  // ================= FILTER =================
  const filtered = showActiveOnly
    ? chickens.filter((c: any) => c.status === "Active")
    : chickens;

  const getHealthStatus = (c: any) => {
    if (!c.healthLogs || c.healthLogs.length === 0) return "🟢 Healthy";
    if (c.healthLogs.some((l: any) => l.status === "Sick" && !l.resolved))
      return "🔴 Sick";
    if (c.healthLogs.some((l: any) => l.status === "Recovering" && !l.resolved))
      return "🟡 Recovering";
    return "🟢 Healthy";
  };

  // ================= STYLES =================
  const card = {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  const input = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
  };

  const btnPrimary = {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "12px",
    fontWeight: 600,
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 20 }}>🐔 Chicken Registry</h1>

      {/* ================= FORM CARD ================= */}
      <div style={{ ...card, marginBottom: 25 }}>
        <h3 style={{ marginBottom: 15 }}>Add New Chicken</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          <input
            style={input}
            placeholder="ID Tag"
            value={form.idTag}
            onChange={(e) => setForm({ ...form, idTag: e.target.value })}
          />

          <input
            style={input}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <select
            style={input}
            value={form.breed}
            onChange={(e) => setForm({ ...form, breed: e.target.value })}
          >
            <option value="">Breed</option>
            <option>Orpington</option>
            <option>Wyandotte</option>
            <option>Leghorn</option>
            <option>Rhode Island Red</option>
            <option>Plymouth Rock</option>
          </select>

          <select
            style={input}
            value={form.sex}
            onChange={(e) => setForm({ ...form, sex: e.target.value })}
          >
            <option>Hen</option>
            <option>Rooster</option>
            <option>Unknown</option>
          </select>

          <select
            style={input}
            value={form.ageGroup}
            onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
          >
            <option>Chick</option>
            <option>Grower</option>
            <option>Point of Lay</option>
            <option>Adult</option>
          </select>

          <select
            style={input}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Active</option>
            <option>Sold</option>
            <option>Culled</option>
          </select>

          <input
            type="date"
            style={input}
            value={form.hatchDate}
            onChange={(e) => setForm({ ...form, hatchDate: e.target.value })}
          />

          <input type="file" onChange={handleImage} />
        </div>

        <button
          onClick={addChicken}
          style={{ ...btnPrimary, marginTop: 15, width: "100%" }}
        >
          + Add Chicken
        </button>
      </div>

      {/* ================= FILTER ================= */}
      <div style={{ marginBottom: 15 }}>
        <label>
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
          />{" "}
          Show only Active Chickens
        </label>
      </div>

      {/* ================= CARDS ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 15,
        }}
      >
        {filtered.map((c: any) => (
          <div
            key={c.id}
            onClick={() => {
              setSelectedChicken(c);
              navigate("profile");
            }}
            style={{
              ...card,
              display: "flex",
              gap: 15,
              alignItems: "center",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "translateY(-3px)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <img
              src={c.image}
              style={{
                width: 70,
                height: 70,
                borderRadius: 12,
                objectFit: "cover",
              }}
            />

            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 16 }}>{c.name}</b>
              <div style={{ color: "#666" }}>{c.idTag}</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>
                {c.sex} • {c.ageGroup}
              </div>
            </div>

            <div style={{ textAlign: "right", fontSize: 13 }}>
              {getHealthStatus(c)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}