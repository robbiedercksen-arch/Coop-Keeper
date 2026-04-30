import { useState } from "react";

export default function ChickenRegistry({
  chickens,
  setChickens,
  setSelectedChicken,
  navigate,
}: any) {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    idTag: "",
    name: "",
    breed: "",
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
    if (!form.name) return alert("Name required");

    const newChicken = {
      id: Date.now(),
      ...form,
      healthLogs: [],
      notes: [],
      album: [],
    };

    setChickens((prev: any[]) => [...prev, newChicken]);
    setShowForm(false);
  };

  // ================= STYLES =================
  const container = {
    padding: 20,
    maxWidth: 1000,
  };

  const header = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  };

  const card = {
    background: "#fff",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #eee",
    marginBottom: 12,
    cursor: "pointer",
    transition: "0.2s",
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
            Manage your chickens
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

      {chickens.map((c: any) => (
        <div
          key={c.id}
          style={card}
          onClick={() => {
            setSelectedChicken({ ...c });
            navigate("profile");
          }}
        >
          <h3 style={{ margin: 0 }}>{c.name}</h3>
          <p style={{ margin: 0, fontSize: 13 }}>
            ID Tag: {c.idTag}
          </p>
        </div>
      ))}
    </div>
  );
}