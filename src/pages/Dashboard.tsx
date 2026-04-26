export default function Dashboard() {
  return (
    <div>
      {/* Header */}
      <h1 className="text-4xl font-bold mb-10 text-farm-brown">
        Coop Keeper Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Total Chickens */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition border-l-4 border-farm-green">
          <p className="text-sm text-gray-500">Total Chickens</p>
          <p className="text-4xl font-bold mt-3 text-farm-green">24</p>
        </div>

        {/* Eggs */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition border-l-4 border-farm-yellow">
          <p className="text-sm text-gray-500">Eggs Today</p>
          <p className="text-4xl font-bold mt-3 text-farm-yellow">18</p>
        </div>

        {/* Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition border-l-4 border-red-400">
          <p className="text-sm text-gray-500">Health Alerts</p>
          <p className="text-4xl font-bold mt-3 text-red-500">2</p>
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-10 flex gap-4">
        
        <button className="bg-farm-green text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition">
          + Add Chicken
        </button>

        <button className="bg-farm-yellow text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition">
          Log Eggs
        </button>

        <button className="bg-farm-brown text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition">
          Breeding
        </button>

      </div>
    </div>
  );
}