import Sidebar from "./components/Sidebar"
import QuickActions from "./components/QuickActions"
import StatCard from "./components/StatCard"

function App() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        
        {/* Header */}
        <h1 className="text-2xl font-bold mb-6">
          Coop Keeper Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Chickens" value="24" />
          <StatCard title="Eggs Today" value="18" />
          <StatCard title="Health Alerts" value="2" />
        </div>

        {/* Quick Actions */}
        <QuickActions />

      </div>
    </div>
  )
}

export default App