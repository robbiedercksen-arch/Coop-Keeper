export default function Sidebar() {
  return (
    <div className="h-full p-6 flex flex-col">
      
      <h1 className="text-2xl font-bold mb-10">🐔 Coop Keeper</h1>

      <nav className="flex flex-col gap-3 text-sm">
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
            className="p-3 rounded-xl hover:bg-white/20 transition cursor-pointer"
          >
            {item}
          </div>
        ))}
      </nav>

      {/* Bottom spacing */}
      <div className="mt-auto text-xs text-white/60">
        Coop Keeper v1
      </div>

    </div>
  );
}