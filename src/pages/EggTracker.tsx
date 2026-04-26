export default function EggTracker({
  chickens,
  eggs,
  setSelectedChicken,
  setPage,
}: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-farm-brown">
        Egg Tracker
      </h2>

      {chickens.length === 0 && <p>No chickens yet.</p>}

      {chickens.map((chicken: any) => {
        const count = eggs.filter(
          (e: any) => e.chickenId === chicken.id
        ).length;

        return (
          <div
            key={chicken.id}
            className="bg-white p-4 rounded-xl shadow mb-3 flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{chicken.name}</h3>
              <p className="text-sm text-gray-500">Eggs: {count}</p>
            </div>

            <button
              onClick={() => {
                setSelectedChicken(chicken); // 🔥 FIX
                setPage("egg-history");
              }}
              className="bg-farm-yellow text-white px-4 py-2 rounded-lg"
            >
              + Add Egg
            </button>
          </div>
        );
      })}
    </div>
  );
}