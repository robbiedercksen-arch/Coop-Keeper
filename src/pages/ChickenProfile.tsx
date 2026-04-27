import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  chickens,
  setChickens,
  navigate,
}: any) {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({ ...selectedChicken });

  if (!selectedChicken) return <p>No chicken selected</p>;

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const saveEdit = () => {
    const updated = chickens.map((c: any) =>
      c.id === selectedChicken.id ? form : c
    );

    setChickens(updated);
    setEditing(false);
  };

  const deleteChicken = () => {
    setChickens(chickens.filter((c: any) => c.id !== selectedChicken.id));
    navigate("registry");
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate("registry")}>← Back</button>

      <h2>🐔 {editing ? "Edit Chicken" : selectedChicken.name}</h2>

      {/* IMAGE */}
      <img
        src={editing ? form.image : selectedChicken.image}
        style={{ width: 200, borderRadius: 10, marginBottom: 20 }}
      />

      {editing ? (
        <>
          {/* EDIT FORM */}
          <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <input
              value={form.breed}
              onChange={(e) => handleChange("breed", e.target.value)}
            />

            <select
              value={form.sex}
              onChange={(e) => handleChange("sex", e.target.value)}
            >
              <option>Hen</option>
              <option>Rooster</option>
              <option>Unknown</option>
            </select>

            <select
              value={form.ageGroup}
              onChange={(e) => handleChange("ageGroup", e.target.value)}
            >
              <option>Chick (0-6 Weeks)</option>
              <option>Grower (6-20 Weeks)</option>
              <option>Point of Lay</option>
              <option>Adult</option>
            </select>

            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option>Active</option>
              <option>Sold</option>
              <option>Culled</option>
            </select>

            <input
              type="date"
              value={form.hatchDate || ""}
              onChange={(e) => handleChange("hatchDate", e.target.value)}
            />

            <input type="file" accept="image/*" onChange={handleImage} />

            <button
              onClick={saveEdit}
              style={{ background: "green", color: "#fff" }}
            >
              Save Changes
            </button>
          </div>
        </>
      ) : (
        <>
          {/* VIEW MODE */}
          <p><strong>ID:</strong> {selectedChicken.idTag}</p>
          <p><strong>Breed:</strong> {selectedChicken.breed}</p>
          <p><strong>Sex:</strong> {selectedChicken.sex}</p>
          <p><strong>Age:</strong> {selectedChicken.ageGroup}</p>
          <p><strong>Status:</strong> {selectedChicken.status}</p>
          <p><strong>Hatch Date:</strong> {selectedChicken.hatchDate || "N/A"}</p>

          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setEditing(true)}
              style={{
                background: "#facc15",
                padding: "8px 12px",
                borderRadius: 6,
                marginRight: 10,
              }}
            >
              Edit
            </button>

            <button
              onClick={deleteChicken}
              style={{
                background: "#ef4444",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 6,
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}