import React from "react";

export default function Sidebar({ activePage, setActivePage }) {
  const navItem = (label, key) => {
    const isActive = activePage === key;

    return (
      <button
        onClick={() => setActivePage(key)}
        className={`w-full text-left px-4 py-2 rounded-lg transition
        ${
          isActive
            ? "bg-white text-farm-brown font-semibold shadow-md border-l-4 border-farm-yellow"
            : "text-white hover:bg-white/10"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="w-64 min-h-screen bg-farm-brown text-white p-4 space-y-4">
      <h1 className="text-2xl font-bold">🐔 Coop Keeper</h1>

      {navItem("Dashboard", "dashboard")}
      {navItem("Feeding & Water", "feeding")}
      {navItem("Chicken Registry", "registry")}
      {navItem("Egg Tracker", "eggs")}
      {navItem("Breeding", "breeding")}
      {navItem("Expenses", "expenses")}
      {navItem("Profit", "profit")}
    </div>
  );
}