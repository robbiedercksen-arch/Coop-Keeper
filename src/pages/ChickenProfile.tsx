export default function ChickenProfile({ selectedChicken, setChickens, chickens, navigate }: any) {
  if (!selectedChicken) return <p>No chicken selected</p>;

  const deleteChicken = () => {
    setChickens(chickens.filter((c: any) => c.id !== selectedChicken.id));
    navigate("registry");
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate("registry")}>← Back</button>

      <h2>{selectedChicken.name}</h2>

      <img
        src={selectedChicken.image}
        style={{ width: 200, borderRadius: 10 }}
      />

      <p><strong>ID:</strong> {selectedChicken.idTag}</p>
      <p><strong>Breed:</strong> {selectedChicken.breed}</p>
      <p><strong>Sex:</strong> {selectedChicken.sex}</p>
      <p><strong>Age:</strong> {selectedChicken.ageGroup}</p>
      <p><strong>Status:</strong> {selectedChicken.status}</p>
      <p><strong>Hatch Date:</strong> {selectedChicken.hatchDate || "N/A"}</p>

      <div style={{ marginTop: 20 }}>
        <button style={{ background: "orange" }}>Edit (next step)</button>
        <button
          onClick={deleteChicken}
          style={{ background: "red", color: "#fff", marginLeft: 10 }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}