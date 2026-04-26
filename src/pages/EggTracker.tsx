export default function EggTracker({
  chickens,
  eggs,
  addEgg,
  setSelectedChicken,
  setPage,
}) {
  const getEggCount = (chickenId) => {
    return eggs.filter((egg) => egg.chickenId === chickenId).length;
  };

  if (chickens.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-farm-brown mb-4">
          Egg Tracker
        </h1>
        <p>No chickens yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-farm-brown mb-4">
        Egg Tracker
      </h1>

      {chickens.map((chicken) => (
        <div
          key={chicken.id}
          className="bg-white p-4 rounded-lg shadow mb-3 flex justify-between items-center"
        >
          {/* CLICKABLE CHICKEN */}
          <div
            onClick={() => {
              setSelectedChicken(chicken);
              setPage("egg-history");
            }}
            className="cursor-pointer"
          >
            <h2 className="font-semibold">{chicken.name}</h2>
            <p>Eggs: {getEggCount(chicken.id)}</p>
          </div>

          <button
            onClick={() => addEgg(chicken.id)}
            className="bg-farm-yellow text-white px-4 py-2 rounded"
          >
            + Add Egg
          </button>
        </div>
      ))}
    </div>
  );
}