import { useState } from "react";

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
      setForm({ ...form, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const addChicken = () => {
    if (!form.idTag || !form.name || !form.image) {
      alert("Required fields missing");
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

  const filtered = showActiveOnly
    ? chickens.filter((c: any) => c.status === "Active")
    : chickens;

  return (
    <div style={{ padding: 20 }}>
      <h2>Chicken Registry</h2>

      <label>
        <input
          type="checkbox"
          checked={showActiveOnly}
          onChange={(e) => setShowActiveOnly(e.target.checked)}
        />
        Show only Active
      </label>

      <input
        placeholder="ID Tag"
        value={form.idTag}
        onChange={(e) =>
          setForm({ ...form, idTag: e.target.value })
        }
      />

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input type="file" onChange={handleImage} />

      <button onClick={addChicken}>Add Chicken</button>

      {filtered.map((c: any) => (
        <div
          key={c.id}
          onClick={() => {
            setSelectedChicken(c);
            navigate("profile");
          }}
          style={{ marginTop: 10, cursor: "pointer" }}
        >
          {c.name} ({c.idTag})
        </div>
      ))}
    </div>
  );
}