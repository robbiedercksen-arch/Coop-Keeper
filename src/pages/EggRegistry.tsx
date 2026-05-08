import { useState } from "react";

export default function EggRegistry({ chickens }: any) {

  const [eggLogs, setEggLogs] = useState<any[]>([]);

const [date, setDate] = useState("");
const [selectedHen, setSelectedHen] = useState("");
const [eggCount, setEggCount] = useState("");
const [purpose, setPurpose] = useState("");
const [notes, setNotes] = useState("");
const hens = chickens.filter((c: any) => {
const sex = c.sex?.toLowerCase();

  return sex === "hen" || sex === "female";
});

const handleLogEggs = () => {
  if (!eggCount) return;

  const selectedChicken = chickens.find(
    (c: any) => c.id === selectedHen
  );

  const newLog = {
    id: Date.now(),
    date,
    henId: selectedHen,
    henName: selectedChicken?.name || "Unknown Hen",
    eggs: Number(eggCount),
    purpose,
    notes,
  };

  setEggLogs((prev) => [newLog, ...prev]);

  // RESET FORM
  setDate("");
  setSelectedHen("");
  setEggCount("");
  setPurpose("");
  setNotes("");
};

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          🥚 Egg Registry
        </h1>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-3">

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Total Eggs</div>
          <div className="text-2xl font-bold">0</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Days Logged</div>
          <div className="text-2xl font-bold">0</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Avg / Day</div>
          <div className="text-2xl font-bold">0</div>
        </div>

      </div>

      {/* LOG FORM */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3">

        <h2 className="text-lg font-semibold">
          + Log Egg Collection
        </h2>

        <input
  type="date"
  value={date}
  onChange={(e) => setDate(e.target.value)}
  className="border rounded-lg p-2"
/>

<select
  value={selectedHen}
  onChange={(e) => setSelectedHen(e.target.value)}
  className="border rounded-lg p-2"
>
  <option>Unknown Hen</option>

  {hens.map((hen: any) => (
    <option key={hen.id} value={hen.id}>
      {hen.name}
    </option>
  ))}
</select>

        <input
  type="number"
  placeholder="Number of Eggs"
  value={eggCount}
  onChange={(e) => setEggCount(e.target.value)}
  className="border rounded-lg p-2"
/>

        <select
  value={purpose}
  onChange={(e) => setPurpose(e.target.value)}
  className="border rounded-lg p-2"
>
  <option>Purpose</option>
  <option>Personal Use</option>
  <option>Sell (Eating)</option>
  <option>Sell (Fertilized)</option>
  <option>Incubator</option>
  <option>Natural Hatch</option>
</select>

        <textarea
  placeholder="Optional Notes"
  value={notes}
  onChange={(e) => setNotes(e.target.value)}
  className="border rounded-lg p-2"
  rows={3}
/>

        <button
  onClick={handleLogEggs}
  className="bg-blue-500 text-white rounded-lg py-2 font-medium"
>
          + Log Eggs
        </button>

      </div>

      {/* HISTORY */}
      <div className="bg-white rounded-xl p-4 shadow-sm">

        <h2 className="text-lg font-semibold mb-3">
          📜 Collection History
        </h2>

        {eggLogs.length === 0 ? (
          <div className="text-gray-400 text-sm">
            No egg collections logged yet
          </div>
        ) : (
          <div>
            History Here
          </div>
        )}

      </div>

    </div>
  );
}