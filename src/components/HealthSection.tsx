import { useState } from "react";

export default function HealthSection({ chicken, updateChicken }: any) {
  const [symptom, setSymptom] = useState("");
  const [treatment, setTreatment] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const logs = chicken.healthLogs || [];

// ✅ FIRST define this
const statusPriority: any = {
  Ongoing: 1,
  Monitoring: 2,
  Resolved: 3,
};

// ✅ THEN use it
const filteredLogs = (showActiveOnly
  ? logs.filter(
      (log: any) =>
        log.status === "Ongoing" || log.status === "Monitoring"
    )
  : logs
).sort((a: any, b: any) => {
  if (statusPriority[a.status] !== statusPriority[b.status]) {
    return statusPriority[a.status] - statusPriority[b.status];
  }
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});



  const handleAdd = () => {
    if (!symptom.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      symptom,
      treatment,
      status,
    };
    

    updateChicken({
      ...chicken,
      healthLogs: [...logs, newEntry],
    });

    setSymptom("");
    setTreatment("");
    setStatus("Ongoing");
  };

  const toggleStatus = (id: number) => {
  const updatedLogs = logs.map((log: any) =>
    log.id === id
      ? {
          ...log,
          status:
            log.status === "Ongoing"
              ? "Monitoring"
              : log.status === "Monitoring"
              ? "Resolved"
              : "Ongoing",
        }
      : log
  );

  updateChicken({
    ...chicken,
    healthLogs: updatedLogs,
  });
};
const getAlert = (log: any) => {
  if (!log.date) return null;

  const daysOld =
    (new Date().getTime() - new Date(log.date).getTime()) /
    (1000 * 60 * 60 * 24);

  if (log.status === "Ongoing" && daysOld > 2) {
    return "⚠️ Needs attention";
  }

  if (log.status === "Monitoring" && daysOld > 5) {
    return "⏳ Still monitoring";
  }

  return null;
};

  return (
    <div className="flex flex-col gap-3">

      <input
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
        placeholder="Symptom..."
        className="border rounded-lg px-3 py-2 text-sm"
      />

      <input
        value={treatment}
        onChange={(e) => setTreatment(e.target.value)}
        placeholder="Treatment..."
        className="border rounded-lg px-3 py-2 text-sm"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option>Ongoing</option>
<option>Monitoring</option>
<option>Resolved</option>
      </select>

      <button
        onClick={handleAdd}
        className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm"
      >
        + Add Health Log
      </button>
      <button
  onClick={() => setShowActiveOnly(!showActiveOnly)}
  className={`px-3 py-2 rounded-lg text-sm ${
    showActiveOnly ? "bg-blue-500 text-white" : "bg-gray-200"
  }`}
>
  {showActiveOnly ? "Showing Active (Tap for All)" : "Show Active Only"}
</button>

      <div className="flex flex-col gap-2">
        {filteredLogs.map((log: any) => {
          const alert = getAlert(log);
          const isCritical =
  log.status === "Ongoing" &&
  log.date &&
  (new Date().getTime() - new Date(log.date).getTime()) /
    (1000 * 60 * 60 * 24) >
    2;

          return (
            <div
              className={`p-3 rounded-lg cursor-pointer border ${
  isCritical
    ? "bg-red-100 border-red-400 shadow-md animate-pulse"
    : log.status === "Ongoing"
    ? "bg-red-50"
    : log.status === "Monitoring"
    ? "bg-yellow-50"
    : "bg-green-50"
}`}
              onClick={() => toggleStatus(log.id)}
            >

    {/* 👇 ADD THIS RIGHT HERE */}
    {isCritical && (
      <div className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full w-fit mb-1">
        URGENT
      </div>
    )}

    <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
                <span>
                  {log.status === "Ongoing"
                    ? "🔴"
                    : log.status === "Monitoring"
                    ? "🟡"
                    : "🟢"}
                </span>
                <span>
                  {new Date(log.date).toLocaleDateString()} • {log.status}
                </span>
              </div>

              <div className="text-sm font-semibold">
                {log.symptom}
              </div>

              <div className="text-sm text-gray-700">
                {log.treatment}
              </div>
              {alert && (
                <div className="text-xs text-orange-600 mt-1">
                  {alert}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}