import { useState } from "react";

export default function HealthSection({ chicken, updateChicken }: any) {
  const [symptom, setSymptom] = useState("");
  const [treatment, setTreatment] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const logs = chicken.healthLogs || [];

  const fieldClass =
    "border rounded-lg px-3 py-3 text-base w-full max-w-full min-w-0 box-border";

  const buttonClass =
    "px-3 py-3 rounded-lg text-base font-semibold w-full";

  const statusPriority: any = {
    Ongoing: 1,
    Monitoring: 2,
    Resolved: 3,
  };

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
      symptom: symptom.trim(),
      treatment: treatment.trim(),
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
      <textarea
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
        placeholder="Symptom..."
        className={`${fieldClass} min-h-[85px] resize-none`}
      />

      <textarea
        value={treatment}
        onChange={(e) => setTreatment(e.target.value)}
        placeholder="Treatment..."
        className={`${fieldClass} min-h-[85px] resize-none`}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className={fieldClass}
      >
        <option>Ongoing</option>
        <option>Monitoring</option>
        <option>Resolved</option>
      </select>

      <button
        onClick={handleAdd}
        className={`${buttonClass} bg-red-500 text-white`}
      >
        + Add Health Log
      </button>

      <button
        onClick={() => setShowActiveOnly(!showActiveOnly)}
        className={`${buttonClass} ${
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
              key={log.id}
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
              {isCritical && (
                <div className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full w-fit mb-1">
                  URGENT
                </div>
              )}

              <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
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

              <div className="text-base font-semibold break-words">
                {log.symptom}
              </div>

              <div className="text-base text-gray-700 break-words">
                {log.treatment}
              </div>

              {alert && (
                <div className="text-sm text-orange-600 mt-1 font-semibold">
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