export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Coop Keeper Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded shadow">
          <p>Total Chickens</p>
          <h2 className="text-2xl font-bold">24</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Eggs Today</p>
          <h2 className="text-2xl font-bold">18</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Health Alerts</p>
          <h2 className="text-2xl font-bold">2</h2>
        </div>

      </div>
    </div>
  );
}