export default function EggHistory({
  selectedChicken,
  eggs,
  setPage,
  deleteEgg,
}) {
  if (!selectedChicken) {
    return (
      <div className="p-6">
        <p>No chicken selected.</p>
      </div>
    );
  }

  const chickenEggs = eggs.filter(
    (e) => e.chickenId === selectedChicken.id
  );

  return (
    <div className="p-6">
      <button
        onClick={() => setPage("eggs")}
        className="mb-4 bg-gray-300 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-farm-brown mb-4">
        {selectedChicken.name} - Egg History
      </h1>

      {chickenEggs.length === 0 ? (
        <p>No eggs recorded.</p>
      ) : (
        chickenEggs.map((egg) => (
          <div
            key={egg.id}
            className="bg-white p-3 rounded shadow mb-2 flex justify-between"
          >
            <span>
              {new Date(egg.date).toLocaleString()}
            </span>

            <button
              onClick={() => deleteEgg(egg.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}