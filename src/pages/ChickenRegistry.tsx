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
    image: "",
  });

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };

    if (file) reader.readAsDataURL(file);
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

    setChickens([...chickens, newChicken]);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Chicken Registry</h1>

      <button onClick={() => setShowForm(!showForm)}>
        + Add Chicken
      </button>

      {showForm && (
        <div>
          <input
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          style={{ padding: 10, border: "1px solid #ddd", marginTop: 10 }}
          onClick={() => {
            setSelectedChicken(c);
            navigate("profile");
          }}
        >
          {c.name}
        </div>
      ))}
    </div>
  );
}