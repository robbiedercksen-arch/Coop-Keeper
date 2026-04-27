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
  // 🔥 GROUP EGGS BY DATE
  const grouped: any = {};

  eggs.forEach((egg: any) => {
    const date = new Date(egg.date).toLocaleDateString();

    if (!grouped[date]) {
      grouped[date] = 0;
    }

    grouped[date]++;
  });

  // 🔥 CONVERT TO ARRAY FOR CHART
  const chartData = Object.keys(grouped).map((date) => ({
    date,
    eggs: grouped[date],
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-farm-brown mb-6">
        🐔 Coop Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Chickens" value={chickens.length} icon="🐔" />
        <Card title="Eggs Today" value={eggsToday} icon="🥚" />
        <Card title="Total Eggs" value={totalEggs} icon="📦" />
        <Card title="Top Layer" value={topLayer} icon="🏆" />
      </div>

      {/* 📊 CHART */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4 text-farm-brown">
          📊 Egg Production (Daily)
        </h2>

        {chartData.length === 0 ? (
          <p className="text-gray-500">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
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

function Card({ title, value, icon }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-farm-green">
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-500 text-sm">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>

      <h2 className="text-2xl font-bold text-farm-brown">{value}</h2>
    </div>
  );
}