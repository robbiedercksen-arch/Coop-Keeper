import React from "react";

export default function Dashboard({ chickens }) {
  const today = new Date().toISOString().split("T")[0];

  const totalChickens = chickens.length;

  const eggsToday = chickens.reduce((total, chicken) => {
    const eggs = chicken.eggs || [];
    const todayEggs = eggs.filter((egg) => egg.startsWith(today)).length;
    return total + todayEggs;
  }, 0);

  const totalEggs = chickens.reduce((total, chicken) => {
    return total + (chicken.eggs?.length || 0);
  }, 0);

  let topChicken = null;
  let maxEggs = 0;

  chickens.forEach((chicken) => {
    const count = chicken.eggs?.length || 0;

    if (count > maxEggs) {
      maxEggs = count;
      topChicken = chicken.name;
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        Coop Keeper Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Chickens</p>
          <h2 className="text-2xl font-bold">{totalChickens}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Eggs Today</p>
          <h2 className="text-2xl font-bold">{eggsToday}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-farm-brown">
          <p className="text-sm text-gray-500">Total Eggs</p>
          <h2 className="text-2xl font-bold">{totalEggs}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Top Layer</p>
          <h2 className="text-lg font-bold">
            {topChicken ? `${topChicken} (${maxEggs})` : "None"}
          </h2>
        </div>
      </div>

      {/* ✅ FIX: navigate instead of breaking */}
      <p className="text-gray-500">
        Use "Chicken Registry" to add chickens.
      </p>
    </div>
  );
}