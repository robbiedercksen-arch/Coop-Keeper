export default function EggTracker({
  chickens,
  eggs,
  addEgg,
}: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-farm-brown">
        Egg Tracker
      </h2>

      {chickens.length === 0 && (
        <p className="text-gray-500">No chickens yet.</p>
      )}

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
              <h3 className="font-bold text-lg">{chicken.name}</h3>
              <p className="text-sm text-gray-500">
                Eggs: {count}
              </p>
            </div>

            <button
              onClick={() => addEgg(chicken.id)}
              className="bg-farm-yellow text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              + Add Egg
            </button>
          </div>
        );
      })}
    </div>
  );
}