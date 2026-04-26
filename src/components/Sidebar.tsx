export default function Sidebar() {
  const menuItems = [
    "Dashboard",
    "Feeding & Water",
    "Chicken Registry",
    "Egg Tracker",
    "Breeding",
    "Expenses",
    "Profit",
  ];

  return (
    <div className="h-full p-6 flex flex-col">
      
      {/* Logo / Title */}
      <div className="mb-10 flex items-center gap-2">
        <span className="text-2xl">🐔</span>
        <h1 className="text-2xl font-bold">Coop Keeper</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-sm">
        {menuItems.map((item, index) => (
          <div
            key={item}
            className={`p-3 rounded-xl transition cursor-pointer ${
              index === 0
                ? "bg-white text-farm-brown font-semibold shadow"
                : "hover:bg-white/10 text-white/90"
            }`}
          >
            {item}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-6 border-t border-white/20">
        <p className="text-xs text-white/60">
          Coop Keeper v1
        </p>
      </div>

    </div>
  );
}