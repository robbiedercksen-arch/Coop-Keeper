export default function Sidebar() {
  return (
    <div className="h-full p-4">
      
      <h1 className="text-xl font-bold mb-8">🐔 Coop Keeper</h1>

      <nav className="flex flex-col gap-2 text-sm">
        {[
          "Dashboard",
          "Feeding & Water",
          "Chicken Registry",
          "Egg Tracker",
          "Breeding",
          "Expenses",
          "Profit",
        ].map((item) => (
          <div
            key={item}
            className="p-2 rounded-lg hover:bg-white/20 cursor-pointer"
          >
            {item}
          </div>
        ))}
      </nav>

    </div>
  );
}