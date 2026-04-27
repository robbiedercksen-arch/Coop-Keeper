export default function Dashboard({
  chickens,
  eggsToday,
  totalEggs,
  topLayer,
}: any) {
  return (
    <div className="p-6">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        🐔 Coop Keeper Dashboard
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Chickens"
          value={chickens.length}
          icon="🐔"
          color="border-green-500"
        />

        <Card
          title="Eggs Today"
          value={eggsToday}
          icon="🥚"
          color="border-yellow-500"
        />

        <Card
          title="Total Eggs"
          value={totalEggs}
          icon="📦"
          color="border-farm-brown"
        />

        <Card
          title="Top Layer"
          value={topLayer}
          icon="🏆"
          color="border-purple-500"
        />
      </div>
    </div>
  );
}

function Card({ title, value, icon, color }: any) {
  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 text-sm">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>

      <h2 className="text-2xl font-bold text-farm-brown">
        {value}
      </h2>
    </div>
  );
}