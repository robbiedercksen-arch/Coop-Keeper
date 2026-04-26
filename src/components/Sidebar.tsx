import React from "react";

export default function Sidebar({ currentPage, setPage }) {
  const menu = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Feeding & Water", key: "feeding" },
    { name: "Chicken Registry", key: "registry" },
    { name: "Egg Tracker", key: "eggs" },
    { name: "Breeding", key: "breeding" },
    { name: "Expenses", key: "expenses" },
    { name: "Profit", key: "profit" },
  ];

  return (
    <div className="w-64 h-screen bg-farm-brown text-white p-4">
      <h1 className="text-xl font-bold mb-6">🐔 Coop Keeper</h1>

      <ul className="space-y-2">
        {menu.map((item) => (
          <li
            key={item.key}
            onClick={() => setPage(item.key)} // ✅ THIS IS THE IMPORTANT PART
            className={`p-2 rounded cursor-pointer transition ${
              currentPage === item.key
                ? "bg-white text-farm-brown font-semibold shadow-md border-l-4 border-farm-yellow"
                : "hover:bg-farm-brown/80"
            }`}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}