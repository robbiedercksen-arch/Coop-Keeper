<div className="w-64 min-h-screen bg-farm-brown text-white p-5 shadow-lg">
  <h1 className="text-2xl font-bold mb-8">🐔 Coop Keeper</h1>

  <div className="space-y-2">
    {[
      ["Dashboard", "dashboard"],
      ["Chicken Registry", "registry"],
      ["Egg Tracker", "eggs"],
    ].map(([label, key]) => (
      <button
        key={key}
        onClick={() => setPage(key)}
        className={`w-full text-left px-4 py-3 rounded-xl transition ${
          page === key
            ? "bg-white text-farm-brown font-semibold shadow-md"
            : "hover:bg-white/20"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
</div>