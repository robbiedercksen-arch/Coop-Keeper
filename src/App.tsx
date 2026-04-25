import Sidebar from "./components/Sidebar"
import QuickActions from "./components/QuickActions"
import StatCard from "./components/StatCard"

function App() {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Coop Keeper Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard title="Total Chickens" value="24" />
          <StatCard title="Eggs Today" value="18" />
          <StatCard title="Health Alerts" value="2" />
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-xl shadow">
          <QuickActions />
        </div>

      </div>
    </div>
  )
}

export default App