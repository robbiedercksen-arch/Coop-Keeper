import { useState } from "react";

const breeds = [
  "Orpington",
  "Wyandotte",
  "Leghorn",
  "Rhode Island Red",
  "Plymouth Rock",
  "Sussex",
  "Australorp",
  "Brahma",
  "Silkie",
  "Cochin",
];

export default function ChickenRegistry({ chickens, setChickens, navigate }: any) {
  const [form, setForm] = useState<any>({
    name: "",
    breed: "",
    sex: "Unknown",
    ageGroup: "Adult",
    status: "Active",
    hatchDate: "",
    image: "",
  });

  const handleChange = (key: string, value: any) => {
    setForm({ ...form, [key]: value });
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addChicken = () => {
    if (!form.name || !form.image) {
      alert("Name and Photo required!");
      return;
    }

    const newChicken = {
      id: Date.now(),
      idTag: "CHK-" + Date.now(),
      eggs: [],
      ...form,
    };

    setChickens([...chickens, newChicken]);

    setForm({
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
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <select onChange={(e) => handleChange("breed", e.target.value)} value={form.breed}>
          <option value="">Select Breed</option>
          {breeds.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <select onChange={(e) => handleChange("sex", e.target.value)} value={form.sex}>
          <option>Hen</option>
          <option>Rooster</option>
          <option>Unknown</option>
        </select>

        <select onChange={(e) => handleChange("ageGroup", e.target.value)} value={form.ageGroup}>
          <option>Chick (0-6 Weeks)</option>
          <option>Grower (6-20 Weeks)</option>
          <option>Point of Lay</option>
          <option>Adult</option>
        </select>

        <select onChange={(e) => handleChange("status", e.target.value)} value={form.status}>
          <option>Active</option>
          <option>Sold</option>
          <option>Culled</option>
        </select>

        <input
          type="date"
          onChange={(e) => handleChange("hatchDate", e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImage} />

        <button onClick={addChicken} style={{ background: "green", color: "#fff" }}>
          Add Chicken
        </button>
      </div>

      {/* CARDS */}
      <div style={{ marginTop: 30 }}>
        {chickens.map((c: any) => (
          <div
            key={c.id}
            onClick={() => navigate("profile", c)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 15,
              padding: 15,
              marginBottom: 10,
              borderRadius: 12,
              background: "#fff",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={c.image}
              style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover" }}
            />

            <div style={{ flex: 1 }}>
              <strong>{c.name}</strong>
              <div>{c.idTag}</div>
            </div>

            <div>
              {c.sex === "Hen" ? "♀️" : c.sex === "Rooster" ? "♂️" : "❓"}
            </div>

            <div>{c.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}