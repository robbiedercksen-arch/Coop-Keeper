import { useState } from "react";

export default function ChickenRegistry({
  chickens = [],
  setChickens,
  setSelectedChicken,
  navigate,
}: any) {

  const [showForm, setShowForm] = useState(false);

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

    setShowForm(false); // 🔥 hide form after save
  };

  // ================= HEALTH STATUS =================
  const getHealthStatus = (c: any) => {
    const unresolved = c.healthLogs?.filter((l: any) => !l.resolved) || [];

    if (unresolved.some((l: any) => l.status === "Sick"))
      return "🔴 Sick";

    if (unresolved.some((l: any) => l.status === "Recovering"))
      return "🟡 Recovering";

    return "🟢 Healthy";
  };

  // ================= STYLES =================
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const input = {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
  };

  const btn = {
    padding: "10px 16px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🐔 Chicken Registry</h1>

      {/* ================= ADD BUTTON ================= */}
      <div style={{ marginBottom: 15 }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            ...btn,
            background: "#22c55e",
            color: "#fff",
          }}
        >
          {showForm ? "Cancel" : "+ Add Chicken"}
        </button>
      </div>

      {/* ================= FORM ================= */}
      {showForm && (
        <div style={card}>
          <h3>Add New Chicken</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 10,
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
            style={{
              ...btn,
              background: "#16a34a",
              color: "#fff",
              marginTop: 15,
            }}
          >
            Save Chicken
          </button>
        </div>
      )}

      {/* ================= CHICKEN CARDS ================= */}
      <div style={{ display: "grid", gap: 12 }}>
        {chickens.map((c: any) => (
          <div
            key={c.id}
            onClick={() => {
              setSelectedChicken(c);
              navigate("profile");
            }}
            style={{
              ...card,
              display: "flex",
              alignItems: "center",
              gap: 15,
              cursor: "pointer",
            }}
          >
            <img
              src={c.image}
              style={{
                width: 70,
                height: 70,
                borderRadius: 10,
                objectFit: "cover",
              }}
            />

            <div>
              <b>{c.name}</b>
              <div style={{ fontSize: 12 }}>{c.idTag}</div>
            </div>

            <div style={{ marginLeft: "auto" }}>
              {getHealthStatus(c)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}