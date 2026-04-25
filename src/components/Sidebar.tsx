export default function Sidebar({ activePage, setActivePage }: any) {
  const menu = [
    { id: "dashboard", label: "Dashboard" },
    { id: "feeding", label: "Feeding & Water" },
    { id: "chickens", label: "Chicken Registry" },
    { id: "eggs", label: "Egg Tracker" },
    { id: "breeding", label: "Breeding" },
    { id: "planner", label: "Farm Planner" },
    { id: "wishlist", label: "Wish List" },
    { id: "expenses", label: "Expenses" },
    { id: "profit", label: "Profit" },
  ];

  return (
    <div className="w-64 bg-[#1F3D2B] text-white flex flex-col p-4">
      <div className="text-xl font-bold mb-6">🐔 Coop Keeper</div>

      <div className="flex flex-col gap-2">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`text-left px-3 py-2 rounded-lg transition ${
              activePage === item.id
                ? "bg-green-600"
                : "hover:bg-green-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-auto text-sm opacity-70">
        <p>Robbie Dercksen</p>
        <button className="mt-2 text-red-300">Sign out</button>
      </div>
    </div>
  );
}