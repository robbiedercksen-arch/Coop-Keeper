export default function StatCard({ title, value, color }: any) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}