import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard({
  chickens,
  eggsToday,
  totalEggs,
  topLayer,
  eggs,
}: any) {
  const grouped: any = {};

  eggs.forEach((egg: any) => {
    const date = new Date(egg.date).toLocaleDateString();
    grouped[date] = (grouped[date] || 0) + 1;
  });

  const chartData = Object.keys(grouped).map((date) => ({
    date,
    eggs: grouped[date],
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        🐔 Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Chickens" value={chickens.length} />
        <Card title="Eggs Today" value={eggsToday} />
        <Card title="Total Eggs" value={totalEggs} />
        <Card title="Top Layer" value={topLayer} />
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-bold mb-4">📊 Egg Production</h2>

        {chartData.length === 0 ? (
          <p>No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="eggs"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}