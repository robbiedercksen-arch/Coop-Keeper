export default function EggTracker({
  chickens,
  eggs,
  addEgg,
}: any) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        🥚 Egg Tracker
      </h1>

      {chickens.map((chicken: any) => {
        const count = eggs.filter(
          (e: any) => e.chickenId === chicken.id
        ).length;

        return (
          <div
            key={chicken.id}
            className="bg-white p-4 rounded-xl shadow mb-3 flex justify-between"
          >
            <div>
              <h3 className="font-bold">{chicken.name}</h3>
              <p>Eggs: {count}</p>
            </div>

            <button
              onClick={() => addEgg(chicken.id)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              + Add Egg
            </button>
          </div>
        );
      })}
    </div>
  );
}