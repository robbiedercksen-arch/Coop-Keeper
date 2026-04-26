export default function EggHistory({
  selectedChicken,
  eggs,
  addEgg,
}: any) {
  if (!selectedChicken) {
    return <p>No chicken selected.</p>;
  }

  const chickenEggs = eggs.filter(
    (e: any) => e.chickenId === selectedChicken.id
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-farm-brown">
        {selectedChicken.name} Egg History
      </h2>

      <button
        onClick={() => addEgg(selectedChicken.id)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        + Add Egg
      </button>

      {chickenEggs.map((egg: any) => (
        <div key={egg.id} className="bg-white p-3 mb-2 rounded shadow">
          {new Date(egg.date).toLocaleString()}
        </div>
      ))}
    </div>
  );
}