import { useState } from "react";

const breeds = [
  "Orpington",
  "Wyandotte",
  "Leghorn",
  "Rhode Island Red",
  "Plymouth Rock",
  "Australorp",
  "Brahma",
  "Sussex",
  "Cochin",
  "ISA Brown",
];

export default function ChickenRegistry({
  chickens,
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

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const addChicken = () => {
    if (!form.idTag || !form.name || !form.breed || !form.image) {
      alert("Please fill all required fields");
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

  // 🧠 HEALTH STATUS
  const getHealthStatus = (chicken: any) => {
    if (!chicken.healthLogs || chicken.healthLogs.length === 0) {
      return { icon: "🟢", label: "Healthy" };
    }

    if (chicken.healthLogs.some((l: any) => !l.resolved && l.status === "Sick")) {
      return { icon: "🔴", label: "Sick" };
    }

    if (chicken.healthLogs.some((l: any) => !l.resolved && l.status === "Recovering")) {
      return { icon: "🟡", label: "Recovering" };
    }

    return { icon: "🟢", label: "Healthy" };
  };

  // 🔥 FILTER LOGIC
  const filteredChickens = showActiveOnly
    ? chickens.filter((c: any) => c.status === "Active")
    : chickens;

  return (
    <div style={{ padding: 20 }}>
      <h2>🐔 Chicken Registry</h2>

      {/* FILTER */}
      <label style={{ display: "block", marginBottom: 15 }}>
        <input
          type="checkbox"
          checked={showActiveOnly}
          onChange={(e) => setShowActiveOnly(e.target.checked)}
        />{" "}
        Show only Active Chickens
      </label>

      {/* FORM */}
      <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
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
          {breeds.map((b) => (
            <option key={b}>{b}</option>
          ))}
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

        <input type="file" accept="image/*" onChange={handleImage} />

        <button
          onClick={addChicken}
          style={{
            background: "#16a34a",
            color: "#fff",
            padding: 10,
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Chicken
        </button>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 30 }}>
        {filteredChickens.map((chicken: any) => {
          const health = getHealthStatus(chicken);

          return (
            <div
              key={chicken.id}
              onClick={() => {
                setSelectedChicken(chicken);
                navigate("profile");
              }}
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
                  }}
                />

                <div>
                  <b>{chicken.name}</b>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    {chicken.idTag}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div style={{ display: "flex", alignItems: "center", gap: 25 }}>
                
                {/* SEX WITH LABEL */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20 }}>
                    {chicken.sex === "Hen" && "♀️"}
                    {chicken.sex === "Rooster" && "♂️"}
                    {chicken.sex === "Unknown" && "❓"}
                  </div>
                  <div style={{ fontSize: 11 }}>
                    {chicken.sex}
                  </div>
                </div>

                {/* HEALTH */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18 }}>{health.icon}</div>
                  <div style={{ fontSize: 11 }}>{health.label}</div>
                </div>

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
          );
        })}
      </div>
    </div>
  );
}