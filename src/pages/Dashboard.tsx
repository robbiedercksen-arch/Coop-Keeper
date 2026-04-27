export default function Dashboard({
  chickens,
  eggsToday,
  totalEggs,
  topLayer,
}: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-farm-brown">
        Coop Keeper Dashboard
      </h2>

      <div className="grid grid-cols-4 gap-4">
        <Card title="Total Chickens" value={chickens.length} />
        <Card title="Eggs Today" value={eggsToday} />
        <Card title="Total Eggs" value={totalEggs} />
        <Card title="Top Layer" value={topLayer} />
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  );
}