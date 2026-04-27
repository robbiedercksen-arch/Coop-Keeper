import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  navigate,
}: any) {
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({ ...selectedChicken });

  if (!selectedChicken) return <div>No chicken selected</div>;

  const updateChicken = () => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? form : c))
    );

    setEditing(false);
  };

  const deleteChicken = () => {
    setChickens((prev: any[]) =>
      prev.filter((c) => c.id !== selectedChicken.id)
    );
    navigate("registry");
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate("registry")}>← Back</button>

      <h2>{editing ? "Edit Chicken" : selectedChicken.name}</h2>

      {/* IMAGE */}
      <img
        src={form.image}
        style={{ width: 150, borderRadius: 10, marginBottom: 20 }}
      />

      {editing ? (
        <>
          {/* EDIT FORM */}
          <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
            <input
              value={form.idTag}
              onChange={(e) =>
                setForm({ ...form, idTag: e.target.value })
              }
              placeholder="ID Tag"
            />

            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Name"
            />

            <input
              value={form.breed}
              onChange={(e) =>
                setForm({ ...form, breed: e.target.value })
              }
              placeholder="Breed"
            />

            <select
              value={form.sex}
              onChange={(e) =>
                setForm({ ...form, sex: e.target.value })
              }
            >
              <option>Hen</option>
              <option>Rooster</option>
              <option>Unknown</option>
            </select>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option>Active</option>
              <option>Sold</option>
              <option>Culled</option>
            </select>

            <select
              value={form.ageGroup}
              onChange={(e) =>
                setForm({ ...form, ageGroup: e.target.value })
              }
            >
              <option>Chick (0-6 Weeks)</option>
              <option>Grower (6-20 Weeks)</option>
              <option>Point of Lay</option>
              <option>Adult</option>
            </select>

            <input
              type="date"
              value={form.hatchDate || ""}
              onChange={(e) =>
                setForm({ ...form, hatchDate: e.target.value })
              }
            />

            <input
              type="file"
              onChange={(e: any) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onloadend = () => {
                  setForm((prev: any) => ({
                    ...prev,
                    image: reader.result,
                  }));
                };
                reader.readAsDataURL(file);
              }}
            />

            <button
              onClick={updateChicken}
              style={{ background: "green", color: "#fff", padding: 10 }}
            >
              Save Changes
            </button>
          </div>
        </>
      ) : (
        <>
          {/* VIEW MODE */}
          <p><b>ID:</b> {selectedChicken.idTag}</p>
          <p><b>Breed:</b> {selectedChicken.breed}</p>
          <p><b>Sex:</b> {selectedChicken.sex}</p>
          <p><b>Age:</b> {selectedChicken.ageGroup}</p>
          <p><b>Status:</b> {selectedChicken.status}</p>
          <p><b>Hatch Date:</b> {selectedChicken.hatchDate || "N/A"}</p>

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