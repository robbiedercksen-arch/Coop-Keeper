export default function QuickActions({ setShowForm, setFilter }: any) {
  return (
    <div className="flex gap-2 mb-4">

      <button
        onClick={() => setShowForm(true)}
        className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm"
      >
        ➕ Add Chicken
      </button>

      <button
        onClick={() => setFilter("issues")}
        className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm"
      >
        ⚠️ View Issues
      </button>

      <button
        onClick={() => setFilter("all")}
        className="flex-1 bg-gray-300 py-2 rounded-lg text-sm"
      >
        📋 View All
      </button>

    </div>
  );
}