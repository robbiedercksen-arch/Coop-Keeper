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
    sex: "Hen",
    ageGroup: "Adult",
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

    // reset form
    setForm({
      idTag: "",
      name: "",
      breed: "",
      sex: "Hen",
      ageGroup: "Adult",
      image: "",
    });
  };

  return (
    <div>
      <h1>🐔 Chicken Registry</h1>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "+ Add Chicken"}
      </button>

      {/* FORM */}
      {showForm && (
        <div style={{ marginTop: 10 }}>
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
          style={{
            padding: 12,
            border: "1px solid #ddd",
            marginTop: 10,
            cursor: "pointer",
          }}
          onClick={() => {
            setSelectedChicken({ ...c }); // 🔥 CRITICAL FIX
            navigate("profile");
          }}
        >
          <b>{c.name}</b>
          <div style={{ fontSize: 12 }}>ID Tag: {c.idTag}</div>
        </div>
      ))}
    </div>
  );
}