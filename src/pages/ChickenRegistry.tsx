import { useState } from "react";

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
    setForm({ ...form, [key]: value });
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

  const addChicken = () => {
    console.log("CLICKED ADD", form);

    if (!form.name || !form.image) {
      alert("Name + Image required");
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
    <div>
      <h2>Chicken Registry</h2>

      <input placeholder="Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
      <input placeholder="Breed" value={form.breed} onChange={(e) => handleChange("breed", e.target.value)} />

      <select onChange={(e) => handleChange("sex", e.target.value)}>
        <option>Hen</option>
        <option>Rooster</option>
        <option>Unknown</option>
      </select>

      <input type="file" onChange={handleImage} />

      <button onClick={addChicken}>Add Chicken</button>

      <hr />

      {chickens.map((c: any) => (
        <div
          key={c.id}
          onClick={() => navigate("profile", c)}
          style={{
            padding: 10,
            border: "1px solid #ccc",
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          <img src={c.image} width={50} />
          <strong>{c.name}</strong> ({c.idTag})
        </div>
      ))}
    </div>
  );
}