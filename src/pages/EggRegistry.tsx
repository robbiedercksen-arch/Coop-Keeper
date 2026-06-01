import CoopPageBanner from "../components/CoopPageBanner";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const cardClass =
  "rounded-3xl p-4 sm:p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden";

const statClass =
  "rounded-2xl p-4 text-center bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)]";

const fieldClass =
  "border border-[#d9a441] rounded-2xl p-3 bg-white w-full max-w-full min-w-0 box-border text-base leading-normal h-[52px]";

const textAreaClass =
  "border border-[#d9a441] rounded-2xl p-3 bg-white w-full max-w-full min-w-0 box-border text-base leading-normal";

export default function EggRegistry({ chickens }: any) {
  const [eggLogs, setEggLogs] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [date, setDate] = useState("");
  const [selectedHen, setSelectedHen] = useState("");
  const [eggCount, setEggCount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");

  const [selectedEggView, setSelectedEggView] = useState("");

  useEffect(() => {
    loadEggLogs();
  }, []);

  const loadEggLogs = async () => {
    const { data, error } = await supabase
      .from("egg_logs")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setEggLogs(data || []);
    }
  };

  const hens = chickens.filter((c: any) => {
    const sex = c.sex?.toLowerCase();
    return sex === "hen" || sex === "female";
  });

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(today.getDate() - 7);

  const totalEggs = eggLogs.reduce(
    (sum, log) => sum + Number(log.eggs || 0),
    0
  );

  const weekEggs = eggLogs
    .filter((log) => new Date(log.date) >= oneWeekAgo)
    .reduce((sum, log) => sum + Number(log.eggs || 0), 0);

  const monthEggs = eggLogs
    .filter((log) => {
      const logDate = new Date(log.date);
      return (
        logDate.getMonth() === currentMonth &&
        logDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, log) => sum + Number(log.eggs || 0), 0);

  const daysLogged = new Set(eggLogs.map((log) => log.date)).size;

  const avgPerDay = daysLogged === 0 ? 0 : Math.round(totalEggs / daysLogged);

  const eggMonths = Array.from(
    new Set(
      eggLogs
        .filter((log: any) => new Date(log.date).getFullYear() === currentYear)
        .map((log: any) => {
          const logDate = new Date(log.date);

          return `${logDate.getFullYear()}-${String(
            logDate.getMonth() + 1
          ).padStart(2, "0")}`;
        })
    )
  )
    .sort()
    .reverse();

  const eggYears = Array.from(
    new Set(
      eggLogs
        .filter((log: any) => new Date(log.date).getFullYear() < currentYear)
        .map((log: any) => new Date(log.date).getFullYear())
    )
  ).sort((a: any, b: any) => b - a);

  const activeEggView = selectedEggView || eggMonths[0] || `${currentYear}`;

  const filteredEggLogs = eggLogs.filter((log: any) => {
    const logDate = new Date(log.date);

    const monthKey = `${logDate.getFullYear()}-${String(
      logDate.getMonth() + 1
    ).padStart(2, "0")}`;

    if (activeEggView.includes("-")) {
      return monthKey === activeEggView;
    }

    return logDate.getFullYear().toString() === activeEggView;
  });

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split("-");

    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const handleLogEggs = async () => {
    if (!eggCount) return alert("Please enter egg count.");

    const selectedChicken = chickens.find(
      (c: any) => String(c.id) === String(selectedHen)
    );

    const newLog = {
      date: date || new Date().toISOString().split("T")[0],
      henid: selectedHen,
      henname: selectedChicken?.name || "Unknown Hen",
      eggs: Number(eggCount),
      purpose,
      notes,
    };

    const { error } = await supabase.from("egg_logs").insert([newLog]);

    if (error) {
      console.error(error);
      alert("Could not log egg production.");
      return;
    }

    await loadEggLogs();

    setDate("");
    setSelectedHen("");
    setEggCount("");
    setPurpose("");
    setNotes("");
    setShowForm(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 px-3 sm:px-4 overflow-hidden">
      <CoopPageBanner
        eyebrow="PRODUCTION"
        title="Egg Registry"
        subtitle="Track egg production, laying performance and flock output."
        stats={[
          { label: "Week Eggs", value: weekEggs },
          { label: "Month Eggs", value: monthEggs },
          { label: "Total Eggs", value: totalEggs },
          { label: "Avg / Day", value: avgPerDay },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className={statClass}>
          <div className="text-3xl font-bold">{weekEggs}</div>
          <div className="text-sm text-[#4b3a1d]">Week Egg Count</div>
        </div>

        <div className={statClass}>
          <div className="text-3xl font-bold">{monthEggs}</div>
          <div className="text-sm text-[#4b3a1d]">Month Egg Count</div>
        </div>

        <div className={statClass}>
          <div className="text-3xl font-bold">{totalEggs}</div>
          <div className="text-sm text-[#4b3a1d]">Total Eggs</div>
        </div>

        <div className={statClass}>
          <div className="text-3xl font-bold">{daysLogged}</div>
          <div className="text-sm text-[#4b3a1d]">Days Logged</div>
        </div>
      </div>

      <div className={cardClass}>
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-[#022312] text-[#f7d37b] rounded-2xl px-5 py-4 font-extrabold shadow-md"
        >
          ➕ Add Egg Production
        </button>
      </div>

      {showForm && (
        <div className={cardClass}>
          <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
            🥚 Log Egg Production
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-full">
            <div className="w-full min-w-0 max-w-full">
              <label className="block text-[#4b3a1d] font-bold mb-1">
                Production Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`${fieldClass} appearance-none`}
              />
            </div>

            <div className="w-full min-w-0 max-w-full">
              <label className="block text-[#4b3a1d] font-bold mb-1">
                Select Hen Provider
              </label>

              <select
                value={selectedHen}
                onChange={(e) => setSelectedHen(e.target.value)}
                className={fieldClass}
              >
                <option value="">Unknown Hen</option>

                {hens.map((hen: any) => (
                  <option key={hen.id} value={hen.id}>
                    {hen.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full min-w-0 max-w-full">
              <label className="block text-[#4b3a1d] font-bold mb-1">
                Number of Eggs
              </label>

              <input
                type="number"
                placeholder="Number of Eggs"
                value={eggCount}
                onChange={(e) => setEggCount(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div className="w-full min-w-0 max-w-full">
              <label className="block text-[#4b3a1d] font-bold mb-1">
                Select Purpose for Eggs
              </label>

              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className={fieldClass}
              >
                <option value="">Purpose</option>
                <option>Personal Use</option>
                <option>Sell (Eating)</option>
                <option>Sell (Fertilized)</option>
                <option>Incubator</option>
                <option>Natural Hatch</option>
              </select>
            </div>

            <div className="md:col-span-2 w-full min-w-0 max-w-full">
              <label className="block text-[#4b3a1d] font-bold mb-1">
                Optional Notes
              </label>

              <textarea
                placeholder="Optional Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={textAreaClass}
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              onClick={handleLogEggs}
              className="bg-[#022312] text-[#f7d37b] px-5 py-3 rounded-xl font-bold"
            >
              + Log Eggs
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={cardClass}>
        <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
          🥚 Egg Production History
        </h2>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
          {eggMonths.map((monthKey) => (
            <button
              key={monthKey}
              onClick={() => setSelectedEggView(monthKey)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-bold border transition ${
                activeEggView === monthKey
                  ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md"
                  : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"
              }`}
            >
              {formatMonthLabel(monthKey)}
            </button>
          ))}

          {eggYears.map((year: any) => (
            <button
              key={year}
              onClick={() => setSelectedEggView(String(year))}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-bold border transition ${
                activeEggView === String(year)
                  ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md"
                  : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"
              }`}
            >
              {year} History
            </button>
          ))}
        </div>

        {filteredEggLogs.length === 0 ? (
          <div className="text-[#6b5a3a] text-sm">
            No egg production logged for this period.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredEggLogs.map((log: any) => (
              <div
                key={log.id}
                className="rounded-2xl p-4 bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.12)] flex justify-between items-center gap-3"
              >
                <div className="min-w-0">
                  <div className="font-extrabold text-[#3d2a10]">
                    {log.henname}
                  </div>

                  <div className="text-sm text-[#6b5a3a]">{log.date}</div>

                  <div className="text-sm text-[#4b3a1d]">
                    {log.purpose || "No purpose added"}
                  </div>

                  {log.notes && (
                    <div className="text-xs text-[#6b5a3a] mt-1 break-words">
                      {log.notes}
                    </div>
                  )}
                </div>

                <div className="text-3xl font-extrabold text-[#3d2a10] shrink-0">
                  🥚 {log.eggs}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}