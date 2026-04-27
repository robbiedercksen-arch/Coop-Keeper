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
  const [form, setForm] = useState({
    name: "",
    breed: "",
    sex: "Unknown",
    ageGroup: "Adult",
    status: "Active",
    hatchDate: "",
    image: "",
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
    if (!form.name || !form.image) {
      alert("Name and Photo are required!");
      return;
    }

    const newChicken = {
      id: Date.now(),
      idTag: "CHK-" + Date.now(),
      eggs: [],
      ...form,
    };

    setChickens([...chickens, newChicken]);

    // reset form
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
      <div
        style={{
          display: "grid",
          gap: 10,
          maxWidth: 500,
          marginBottom: 30,
        }}
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <select value={form.breed} onChange={(e) => handleChange("breed", e.target.value)}>
          <option value="">Select Breed</option>
          {breeds.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        <select value={form.sex} onChange={(e) => handleChange("sex", e.target.value)}>
          <option>Hen</option>
          <option>Rooster</option>
          <option>Unknown</option>
        </select>

        <select value={form.ageGroup} onChange={(e) => handleChange("ageGroup", e.target.value)}>
          <option>Chick (0-6 Weeks)</option>
          <option>Grower (6-20 Weeks)</option>
          <option>Point of Lay</option>
          <option>Adult</option>
        </select>

        <select value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
          <option>Active</option>
          <option>Sold</option>
          <option>Culled</option>
        </select>

        <input
          type="date"
          value={form.hatchDate}
          onChange={(e) => handleChange("hatchDate", e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImage} />

        <button
          onClick={addChicken}
          style={{
            background: "#16a34a",
            color: "#fff",
            padding: 10,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Add Chicken
        </button>
      </div>

      {/* CHICKEN CARDS */}
      {chickens.map((c: any) => (
        <div
          key={c.id}
          onClick={() => navigate("profile", c)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
            padding: 15,
            marginBottom: 12,
            borderRadius: 12,
            background: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={c.image}
            style={{
              width: 60,
              height: 60,
              borderRadius: 10,
              objectFit: "cover",
            }}
          />

          <div style={{ flex: 1 }}>
            <strong>{c.name}</strong>
            <div>{c.idTag}</div>
          </div>

          <div style={{ fontSize: 20 }}>
            {c.sex === "Hen" ? "♀️" : c.sex === "Rooster" ? "♂️" : "❓"}
          </div>

          <div>{c.status}</div>
        </div>
      ))}
    </div>
  );
}