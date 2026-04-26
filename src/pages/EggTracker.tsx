export default function EggTracker({ chickens, eggs, addEgg }) {
  const getEggCount = (chickenId) => {
    return eggs.filter((egg) => egg.chickenId === chickenId).length;
  };

  // 🐔 NO CHICKENS STATE
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

  // 🥚 MAIN VIEW
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
          <div>
            <h2 className="font-semibold">{chicken.name}</h2>
            <p>Eggs: {getEggCount(chicken.id)}</p>
          </div>

          {/* ✅ WORKING BUTTON */}
          <button
            onClick={() => addEgg(chicken.id)}
            className="bg-farm-yellow text-white px-4 py-2 rounded shadow"
          >
            + Add Egg
          </button>
        </div>
      ))}
    </div>
  );
}