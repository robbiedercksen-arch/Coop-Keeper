export default function Dashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-farm-brown">
        Coop Keeper Dashboard
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-farm-green">
          <p className="text-sm text-gray-500">Total Chickens</p>
          <p className="text-3xl font-bold mt-2 text-farm-green">24</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-farm-yellow">
          <p className="text-sm text-gray-500">Eggs Today</p>
          <p className="text-3xl font-bold mt-2 text-farm-yellow">18</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-400">
          <p className="text-sm text-gray-500">Health Alerts</p>
          <p className="text-3xl font-bold mt-2 text-red-500">2</p>
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">
        <button className="bg-farm-green text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition">
          + Add Chicken
        </button>

        <button className="bg-farm-yellow text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition">
          Log Eggs
        </button>

        <button className="bg-farm-brown text-white px-6 py-3 rounded-xl shadow hover:scale-105 transition">
          Breeding
        </button>
      </div>
    </div>
  );
}