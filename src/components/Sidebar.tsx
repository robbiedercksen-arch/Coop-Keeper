type SidebarProps = {
  activePage: string;
  setActivePage: (page: string) => void;
};

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
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
      <div className="mb-10 flex items-center gap-3">
        <span className="text-2xl">🐔</span>
        <h1 className="text-2xl font-bold tracking-wide">Coop Keeper</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 text-sm">

        {menuItems.map((item) => (
          <div
            key={item}
            onClick={() => setActivePage(item)}
            className={`relative px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
              activePage === item
                ? "bg-white text-farm-brown font-semibold shadow-md border-l-4 border-farm-yellow"
                : "text-white/90 hover:bg-white/10 hover:pl-5"
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