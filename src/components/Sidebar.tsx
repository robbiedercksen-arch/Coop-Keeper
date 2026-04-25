export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">🐔 Coop Keeper</h2>

      <nav className="flex flex-col gap-2">
        <button className="text-left p-2 hover:bg-gray-100 rounded">Dashboard</button>
        <button className="text-left p-2 hover:bg-gray-100 rounded">Feeding & Water</button>
        <button className="text-left p-2 hover:bg-gray-100 rounded">Chicken Registry</button>
        <button className="text-left p-2 hover:bg-gray-100 rounded">Egg Tracker</button>
        <button className="text-left p-2 hover:bg-gray-100 rounded">Breeding</button>
        <button className="text-left p-2 hover:bg-gray-100 rounded">Farm Planner</button>
        <button className="text-left p-2 hover:bg-gray-100 rounded">Wish List</button>
        <button className="text-left p-2 hover:bg-gray-100 rounded">Expenses</button>
        <button className="text-left p-2 hover:bg-gray-100 rounded">Profit</button>
      </nav>
    </div>
  );
}