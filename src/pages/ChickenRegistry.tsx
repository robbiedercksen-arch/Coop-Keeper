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
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addChicken = () => {
    if (!form.idTag || !form.name || !form.breed || !form.image) {
      alert("Please fill all required fields");
      return;
    }

    const exists = chickens.some((c: any) => c.idTag === form.idTag);
    if (exists) {
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

  return (
    <div style={{ padding: 20 }}>
      <h2>🐔 Chicken Registry</h2>

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

        <input type="file" onChange={handleImage} />

        <button
          onClick={addChicken}
          style={{
            background: "#16a34a",
            color: "#fff",
            padding: 10,
            borderRadius: 8,
            border: "none",
          }}
        >
          Add Chicken
        </button>
      </div>

      {/* LIST */}
      <div style={{ marginTop: 30 }}>
        {chickens.map((chicken: any) => (
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
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
              {/* SEX */}
              <span style={{ fontSize: 20 }}>
                {chicken.sex === "Hen" && "♀️"}
                {chicken.sex === "Rooster" && "♂️"}
                {chicken.sex === "Unknown" && "❓"}
              </span>

              {/* SMART HEALTH STATUS */}
              {(chicken.healthLogs && chicken.healthLogs.length > 0) && (
                <span title="Health status" style={{ fontSize: 18 }}>
                  {chicken.healthLogs.some(
                    (log: any) => log.status === "Sick"
                  )
                    ? "🔴"
                    : chicken.healthLogs.some(
                        (log: any) => log.status === "Recovering"
                      )
                    ? "🟡"
                    : "🟢"}
                </span>
              )}

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
        ))}
      </div>
    </div>
  );
}