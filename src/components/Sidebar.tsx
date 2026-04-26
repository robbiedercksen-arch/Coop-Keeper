export default function Sidebar() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-6">🐔 Coop Keeper</h1>

      <nav className="flex flex-col gap-3">
        <a className="hover:bg-gray-100 p-2 rounded">Dashboard</a>
        <a className="hover:bg-gray-100 p-2 rounded">Feeding & Water</a>
        <a className="hover:bg-gray-100 p-2 rounded">Chicken Registry</a>
        <a className="hover:bg-gray-100 p-2 rounded">Egg Tracker</a>
        <a className="hover:bg-gray-100 p-2 rounded">Breeding</a>
        <a className="hover:bg-gray-100 p-2 rounded">Expenses</a>
        <a className="hover:bg-gray-100 p-2 rounded">Profit</a>
      </nav>
    </div>
  );
}