export default function Dashboard({ chickens }: any) {
  const total = chickens.length;

  let ongoing = 0;
  let monitoring = 0;
  let healthy = 0;

  chickens.forEach((chicken: any) => {
    const logs = chicken.healthLogs || [];

    const hasOngoing = logs.some((log: any) => log.status === "Ongoing");
    const hasMonitoring = logs.some((log: any) => log.status === "Monitoring");

    if (hasOngoing) ongoing++;
    else if (hasMonitoring) monitoring++;
    else healthy++;
  });

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">

      <div className="bg-white p-3 rounded-xl shadow text-center">
        <div className="text-xs text-gray-500">Chickens</div>
        <div className="text-xl font-bold">🐔 {total}</div>
      </div>

      <div className="bg-red-100 p-3 rounded-xl text-center">
        <div className="text-xs text-gray-500">Ongoing</div>
        <div className="text-xl font-bold">🔴 {ongoing}</div>
      </div>

      <div className="bg-yellow-100 p-3 rounded-xl text-center">
        <div className="text-xs text-gray-500">Monitoring</div>
        <div className="text-xl font-bold">🟡 {monitoring}</div>
      </div>

      <div className="bg-green-100 p-3 rounded-xl text-center">
        <div className="text-xs text-gray-500">Healthy</div>
        <div className="text-xl font-bold">🟢 {healthy}</div>
      </div>

    </div>
  );
}