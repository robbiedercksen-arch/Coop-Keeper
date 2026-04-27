export default function ChickenProfile({ selectedChicken, chickens, setChickens, navigate }: any) {
  if (!selectedChicken) return <p>No chicken selected</p>;

  const deleteChicken = () => {
    setChickens(chickens.filter((c: any) => c.id !== selectedChicken.id));
    navigate("registry");
  };

  return (
    <div>
      <button onClick={() => navigate("registry")}>Back</button>

      <h2>{selectedChicken.name}</h2>
      <img src={selectedChicken.image} width={150} />

      <p>{selectedChicken.breed}</p>
      <p>{selectedChicken.sex}</p>

      <button onClick={deleteChicken}>Delete</button>
    </div>
  );
}