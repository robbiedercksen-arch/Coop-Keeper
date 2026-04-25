export default function QuickActions() {
  return (
    <div className="flex gap-4">
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow">
        + Add Chicken
      </button>
      <button className="border border-green-600 text-green-700 px-4 py-2 rounded-lg">
        Log Eggs
      </button>
      <button className="border border-green-600 text-green-700 px-4 py-2 rounded-lg">
        Breeding
      </button>
    </div>
  );
}