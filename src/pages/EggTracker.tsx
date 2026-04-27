export default function EggTracker({
  chickens,
  eggs,
  addEgg,
}: any) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        🥚 Egg Tracker
      </h1>

      {chickens.length === 0 && (
        <p className="text-gray-500">No chickens yet.</p>
      )}

      <div className="grid gap-4">
        {chickens.map((chicken: any) => {
          const count = eggs.filter(
            (e: any) => e.chickenId === chicken.id
          ).length;

          return (
            <div
              key={chicken.id}
              className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-farm-brown">
                  {chicken.name}
                </h3>
                <p className="text-gray-500 text-sm">
                  Eggs: {count}
                </p>
              </div>

              <button
                onClick={() => addEgg(chicken.id)}
                className="bg-farm-yellow text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
              >
                + Add Egg
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}