import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm opacity-80">Your flock at a glance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Today's Refills" value="0" color="text-green-600" />
        <StatCard title="Active Chickens" value="4" color="text-gray-800" />
        <StatCard title="Spend This Month" value="R0.00" color="text-red-500" />
        <StatCard title="Wish List" value="1" color="text-yellow-500" />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Alerts */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
        <h3 className="font-semibold mb-2">Auto Insights</h3>
        <p className="text-sm text-gray-600">
          ⚠️ Low eggs-per-bird this month. Check feed quality or hen health.
        </p>
      </div>

      {/* Placeholder Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border">
          Egg Production (Chart coming)
        </div>
        <div className="bg-white p-4 rounded-xl shadow border">
          Feed Spending (Chart coming)
        </div>
      </div>
    </div>
  );
}