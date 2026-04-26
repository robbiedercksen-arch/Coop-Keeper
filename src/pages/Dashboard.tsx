export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Coop Keeper Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Chickens</h2>
          <p className="text-2xl font-bold">24</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Eggs Today</h2>
          <p className="text-2xl font-bold">18</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Health Alerts</h2>
          <p className="text-2xl font-bold text-red-500">2</p>
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button className="bg-black text-white px-4 py-2 rounded-lg">
          + Add Chicken
        </button>

        <button className="bg-gray-200 px-4 py-2 rounded-lg">
          Log Eggs
        </button>

        <button className="bg-gray-200 px-4 py-2 rounded-lg">
          Breeding
        </button>
      </div>
    </div>
  );
}