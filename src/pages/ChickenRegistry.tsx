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

  // IMAGE UPLOAD
  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // ADD CHICKEN
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

  // ✅ SAFE FILTER
  const filtered = showActiveOnly
    ? chickens.filter((c: any) => c.status === "Active")
    : chickens;

  // HEALTH STATUS
  const getHealthStatus = (c: any) => {
    if (!c.healthLogs || c.healthLogs.length === 0) return "🟢 Healthy";

    if (c.healthLogs.some((l: any) => l.status === "Sick" && !l.resolved))
      return "🔴 Sick";

    if (c.healthLogs.some((l: any) => l.status === "Recovering" && !l.resolved))
      return "🟡 Recovering";

    return "🟢 Healthy";
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🐔 Chicken Registry</h2>

      {/* FILTER */}
      <label style={{ marginBottom: 10, display: "block" }}>
        <input
          type="checkbox"
          checked={showActiveOnly}
          onChange={(e) => setShowActiveOnly(e.target.checked)}
        />
        {" "}Show only Active Chickens
      </label>

      {/* FORM */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          maxWidth: 800,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="ID Tag (Required)"
          value={form.idTag}
          onChange={(e) => setForm({ ...form, idTag: e.target.value })}
        />

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          value={form.breed}
          onChange={(e) => setForm({ ...form, breed: e.target.value })}
        >
          <option value="">Select Breed</option>
          <option>Orpington</option>
          <option>Wyandotte</option>
          <option>Leghorn</option>
          <option>Rhode Island Red</option>
          <option>Plymouth Rock</option>
        </select>

        <select
          value={form.sex}
          onChange={(e) => setForm({ ...form, sex: e.target.value })}
        >
          <option>Hen</option>
          <option>Rooster</option>
          <option>Unknown</option>
        </select>

        <select
          value={form.ageGroup}
          onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}
        >
          <option>Chick (0-6 Weeks)</option>
          <option>Grower (6-20 Weeks)</option>
          <option>Point of Lay</option>
          <option>Adult</option>
        </select>

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>Active</option>
          <option>Sold</option>
          <option>Culled</option>
        </select>

        <input
          type="date"
          value={form.hatchDate}
          onChange={(e) => setForm({ ...form, hatchDate: e.target.value })}
        />

        <input type="file" onChange={handleImage} />

        <button
          onClick={addChicken}
          style={{
            gridColumn: "span 3",
            background: "green",
            color: "white",
            padding: 10,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Add Chicken
        </button>
      </div>

      {/* 🐔 CARDS */}
      {filtered.length === 0 ? (
        <p>No chickens yet.</p>
      ) : (
        filtered.map((c: any) => (
          <div
            key={c.id}
            onClick={() => {
              setSelectedChicken(c);
              navigate("profile");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              padding: 10,
              border: "1px solid #ddd",
              borderRadius: 10,
              marginBottom: 10,
              cursor: "pointer",
            }}
          >
            <img
              src={c.image}
              style={{ width: 60, height: 60, borderRadius: 10 }}
            />

            <div>
              <b>{c.name}</b>
              <div>{c.idTag}</div>
            </div>

            <div style={{ marginLeft: "auto" }}>
              {c.sex === "Hen"
                ? "♀ Hen"
                : c.sex === "Rooster"
                ? "♂ Rooster"
                : "?"}
              <br />
              {getHealthStatus(c)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}