export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Coop Keeper Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Total Chickens</p>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Eggs Today</p>
          <p className="text-3xl font-bold mt-2">18</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <p className="text-sm text-gray-500">Health Alerts</p>
          <p className="text-3xl font-bold mt-2 text-red-500">2</p>
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-3">
        <button className="bg-black text-white px-5 py-2 rounded-xl shadow hover:opacity-90">
          + Add Chicken
        </button>

        <button className="bg-gray-100 px-5 py-2 rounded-xl hover:bg-gray-200">
          Log Eggs
        </button>

        <button className="bg-gray-100 px-5 py-2 rounded-xl hover:bg-gray-200">
          Breeding
        </button>
      </div>
    </div>
  );
}