import { supabase } from "../supabase";
import { useState, useEffect, useRef } from "react";
import ProfileSection from "../components/ProfileSection";
import PhotoSection from "../components/PhotoSection";
import NotesSection from "../components/NotesSection";
import HealthSection from "../components/HealthSection";

const inputClass =
  "border rounded px-2 py-2 text-base w-full max-w-full min-w-0 box-border";

const smallInputClass =
  "border rounded px-2 py-2 text-base w-28 max-w-full min-w-0 box-border";

const weightDateClass =
  "border rounded-xl p-3 flex-1 min-w-0 text-base appearance-none";

const weightInputClass =
  "border rounded-xl p-3 w-24 text-base max-w-full min-w-0 box-border";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
  saveChickenToDB,
}: any) {
  const healthRef = useRef<HTMLDivElement | null>(null);

  const [chicken, setChicken] = useState(selectedChicken);
  const [editing, setEditing] = useState(false);
  const [newWeight, setNewWeight] = useState("");

  const [editingWeightIndex, setEditingWeightIndex] = useState<number | null>(
    null
  );
  const [editWeightDate, setEditWeightDate] = useState("");
  const [editWeightValue, setEditWeightValue] = useState("");

  const [newWeightDate, setNewWeightDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [eggStats, setEggStats] = useState({
    week: 0,
    month: 0,
    lifetime: 0,
    lastDate: "None",
  });

  useEffect(() => {
    setChicken(selectedChicken);
  }, [selectedChicken]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    loadEggStats();
  }, [selectedChicken]);

  const getValue = (camelKey: string, snakeKey: string) =>
    chicken?.[camelKey] ?? chicken?.[snakeKey] ?? "";

  const getWeightHistory = () =>
    chicken?.weightHistory || chicken?.weight_history || [];

  const getLatestWeight = (history: any[]) => {
    if (!history || history.length === 0) return "";

    const sorted = [...history].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const latest = sorted[sorted.length - 1];

    return latest?.weightKg || latest?.weight_kg || "";
  };

  const loadEggStats = async () => {
    if (!selectedChicken) return;

    const { data, error } = await supabase
      .from("egg_logs")
      .select("*")
      .eq("henid", selectedChicken.id);

    if (error || !data) return;

    const now = new Date();

    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

    const weekEggs = data
      .filter((log) => new Date(log.date) >= weekAgo)
      .reduce((sum, log) => sum + log.eggs, 0);

    const monthEggs = data
      .filter((log) => new Date(log.date) >= monthAgo)
      .reduce((sum, log) => sum + log.eggs, 0);

    const lifetimeEggs = data.reduce((sum, log) => sum + log.eggs, 0);

    const lastDate = data.length > 0 ? data[data.length - 1].date : "None";

    setEggStats({
      week: weekEggs,
      month: monthEggs,
      lifetime: lifetimeEggs,
      lastDate,
    });
  };

  if (!chicken) {
    return <div className="p-4">Loading...</div>;
  }

  const idTagColor = getValue("idTagColor", "id_tag_color");
  const idTag = getValue("idTag", "id_tag");
  const ageGroup = getValue("ageGroup", "age_group");
  const hatchDate = getValue("hatchDate", "hatch_date");
  const weightKg = getValue("weightKg", "weight_kg");
  const weightHistory = getWeightHistory();

  const profileImage =
    chicken.image ||
    chicken.image_url ||
    chicken.photos?.[0] ||
    "https://via.placeholder.com/160";

  const hasHealthIssue = (chicken.healthLogs || chicken.health_logs || []).some(
    (log: any) => log.status === "Ongoing" || log.status === "Monitoring"
  );

  const updateChicken = async (updated: any) => {
    setChicken(updated);

    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );

    setSelectedChicken(updated);

    await saveChickenToDB(updated);
  };

  const saveEdits = async () => {
    await updateChicken(chicken);
    setEditing(false);
  };

  const addWeightEntry = async () => {
    if (!newWeight) return;

    const updatedHistory = [
      ...weightHistory,
      {
        date: newWeightDate,
        weightKg: newWeight,
        weight_kg: newWeight,
      },
    ];

    const latestWeight = getLatestWeight(updatedHistory);

    const updated = {
      ...chicken,
      weightKg: latestWeight,
      weight_kg: latestWeight,
      weightHistory: updatedHistory,
      weight_history: updatedHistory,
    };

    await updateChicken(updated);
    setNewWeight("");
    setNewWeightDate(new Date().toISOString().split("T")[0]);
  };

  const startEditWeight = (entry: any, originalIndex: number) => {
    setEditingWeightIndex(originalIndex);
    setEditWeightDate(entry.date || "");
    setEditWeightValue(entry.weightKg || entry.weight_kg || "");
  };

  const cancelEditWeight = () => {
    setEditingWeightIndex(null);
    setEditWeightDate("");
    setEditWeightValue("");
  };

  const saveWeightEdit = async () => {
    if (editingWeightIndex === null) return;
    if (!editWeightValue) return;

    const updatedHistory = weightHistory.map((entry: any, index: number) =>
      index === editingWeightIndex
        ? {
            ...entry,
            date: editWeightDate,
            weightKg: editWeightValue,
            weight_kg: editWeightValue,
          }
        : entry
    );

    const latestWeight = getLatestWeight(updatedHistory);

    const updated = {
      ...chicken,
      weightKg: latestWeight,
      weight_kg: latestWeight,
      weightHistory: updatedHistory,
      weight_history: updatedHistory,
    };

    await updateChicken(updated);
    cancelEditWeight();
  };

  const deleteWeightEntry = async (originalIndex: number) => {
    const confirmed = confirm("Delete this weight record?");
    if (!confirmed) return;

    const updatedHistory = weightHistory.filter(
      (_entry: any, index: number) => index !== originalIndex
    );

    const latestWeight = getLatestWeight(updatedHistory);

    const updated = {
      ...chicken,
      weightKg: latestWeight,
      weight_kg: latestWeight,
      weightHistory: updatedHistory,
      weight_history: updatedHistory,
    };

    await updateChicken(updated);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">🐔 Chicken Profile</h2>

        <div className="relative">
          <img
            src={profileImage}
            className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-xl"
          />

          <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" />

          {hasHealthIssue && (
            <button
              onClick={() =>
                healthRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="absolute top-0 right-0 bg-red-500 text-white w-10 h-10 rounded-full border-4 border-white shadow-lg animate-pulse flex items-center justify-center text-lg"
              title="Health attention needed"
            >
              ⚠️
            </button>
          )}
        </div>

        <div className="text-center">
          <div className="text-xl font-semibold">{chicken.name}</div>
          <div className="text-gray-500 text-sm">{chicken.breed}</div>
        </div>

        <div className="flex gap-2">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl text-base"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={saveEdits}
              className="bg-green-500 text-white px-4 py-2 rounded-xl text-base"
            >
              Save
            </button>
          )}

          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-xl text-base"
            onClick={() => navigate("registry")}
          >
            ← Back
          </button>
        </div>
      </div>

      <ProfileSection title="Info">
        <div className="flex flex-col gap-3 text-base">
          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Name</span>

            {editing ? (
              <input
                value={chicken.name || ""}
                onChange={(e) =>
                  setChicken({
                    ...chicken,
                    name: e.target.value,
                  })
                }
                className={inputClass}
              />
            ) : (
              <span className="font-medium text-right">{chicken.name}</span>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-500">ID</span>
            <span className="text-right">{idTag || "-"}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-500">ID Tag Color</span>

            {editing ? (
              <select
                value={idTagColor || ""}
                onChange={(e) =>
                  setChicken({
                    ...chicken,
                    idTagColor: e.target.value,
                    id_tag_color: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="">Select Color</option>
                <option>Green</option>
                <option>Red</option>
                <option>Blue</option>
                <option>Yellow</option>
                <option>White</option>
                <option>Black</option>
              </select>
            ) : (
              <span className="text-right">{idTagColor || "-"}</span>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Breed</span>

            {editing ? (
              <input
                value={chicken.breed || ""}
                onChange={(e) =>
                  setChicken({
                    ...chicken,
                    breed: e.target.value,
                  })
                }
                className={inputClass}
              />
            ) : (
              <span className="text-right">{chicken.breed}</span>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Sex</span>

            {editing ? (
              <select
                value={chicken.sex || ""}
                onChange={(e) =>
                  setChicken({
                    ...chicken,
                    sex: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="Hen">Hen</option>
                <option value="Rooster">Rooster</option>
                <option value="Unknown">Unknown</option>
              </select>
            ) : (
              <span className="text-right">{chicken.sex}</span>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Age</span>
            <span className="text-right">{ageGroup || "-"}</span>
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Chicken Status</span>

            {editing ? (
              <select
                value={chicken.status || ""}
                onChange={(e) =>
                  setChicken({
                    ...chicken,
                    status: e.target.value,
                    archived:
                      e.target.value === "Inactive Chicken" ||
                      e.target.value === "Sold",
                  })
                }
                className={inputClass}
              >
                <option>Active Chicken</option>
                <option>Inactive Chicken</option>
                <option>Sold</option>
              </select>
            ) : (
              <span className="text-right">
                {chicken.status ||
                  (chicken.archived ? "Inactive Chicken" : "Active Chicken")}
              </span>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Hatch Date</span>

            {editing ? (
              <input
                type="date"
                value={hatchDate || ""}
                onChange={(e) =>
                  setChicken({
                    ...chicken,
                    hatchDate: e.target.value,
                    hatch_date: e.target.value,
                  })
                }
                className={`${inputClass} appearance-none`}
              />
            ) : (
              <span className="text-right">{hatchDate || "Not Recorded"}</span>
            )}
          </div>

          <div className="flex justify-between gap-3">
            <span className="text-gray-500">Weight (KG)</span>

            {editing ? (
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                value={weightKg || ""}
                onChange={(e) =>
                  setChicken({
                    ...chicken,
                    weightKg: e.target.value,
                    weight_kg: e.target.value,
                  })
                }
                className={smallInputClass}
              />
            ) : (
              <span className="text-right">
                {weightKg ? `${weightKg} kg` : "Not Recorded"}
              </span>
            )}
          </div>
        </div>
      </ProfileSection>

      <ProfileSection title="⚖️ Weight History">
        <div className="flex flex-col gap-3 text-base">
          <div className="flex gap-2">
            <input
              type="date"
              value={newWeightDate}
              onChange={(e) => setNewWeightDate(e.target.value)}
              className={weightDateClass}
            />

            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder="KG"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className={weightInputClass}
            />
          </div>

          <button
            onClick={addWeightEntry}
            className="bg-green-600 text-white rounded-xl p-3 font-semibold text-base"
          >
            + Add Weight
          </button>

          {weightHistory.length === 0 && (
            <div className="text-gray-400">No weight records yet.</div>
          )}

          {weightHistory
            .map((entry: any, originalIndex: number) => ({
              ...entry,
              originalIndex,
            }))
            .slice()
            .reverse()
            .map((entry: any) => (
              <div
                key={entry.originalIndex}
                className="bg-gray-50 rounded-xl p-3 flex flex-col gap-3"
              >
                {editingWeightIndex === entry.originalIndex ? (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={editWeightDate}
                        onChange={(e) => setEditWeightDate(e.target.value)}
                        className={weightDateClass}
                      />

                      <input
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        value={editWeightValue}
                        onChange={(e) => setEditWeightValue(e.target.value)}
                        className={weightInputClass}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={saveWeightEdit}
                        className="bg-green-600 text-white px-3 py-2 rounded-xl font-bold text-sm flex-1"
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEditWeight}
                        className="bg-gray-500 text-white px-3 py-2 rounded-xl font-bold text-sm flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between gap-3">
                      <span>{entry.date}</span>

                      <span className="font-semibold">
                        {entry.weightKg || entry.weight_kg} kg
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          startEditWeight(entry, entry.originalIndex)
                        }
                        className="bg-blue-500 text-white px-3 py-2 rounded-xl font-bold text-sm flex-1"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => deleteWeightEntry(entry.originalIndex)}
                        className="bg-red-600 text-white px-3 py-2 rounded-xl font-bold text-sm flex-1"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      </ProfileSection>

      <ProfileSection title="Photos">
        <PhotoSection chicken={chicken} updateChicken={updateChicken} />
      </ProfileSection>

      {chicken.sex?.toLowerCase() === "hen" && (
        <ProfileSection title="🥚 Egg Production">
          <div className="flex flex-col gap-3 text-base">
            <div className="flex justify-between">
              <span className="text-gray-500">Eggs This Week</span>
              <span className="font-medium">{eggStats.week}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Eggs This Month</span>
              <span className="font-medium">{eggStats.month}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Lifetime Eggs</span>
              <span className="font-medium">{eggStats.lifetime}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Last Egg Logged</span>
              <span className="font-medium">{eggStats.lastDate}</span>
            </div>
          </div>
        </ProfileSection>
      )}

      <ProfileSection title="Notes">
        <NotesSection chicken={chicken} updateChicken={updateChicken} />
      </ProfileSection>

      <ProfileSection title="Health">
        <ProfileSection title="Activity">
          <div className="flex flex-col gap-2 text-base">
            {(chicken.activity || []).length === 0 && (
              <div className="text-gray-400">No activity yet</div>
            )}

            {(chicken.activity || [])
              .slice()
              .reverse()
              .map((item: any, i: number) => (
                <div
                  key={i}
                  className="bg-gray-50 p-2 rounded-md flex justify-between gap-3"
                >
                  <span>{item.text}</span>
                  <span className="text-gray-400">
                    {new Date(item.time).toLocaleDateString()}
                  </span>
                </div>
              ))}
          </div>
        </ProfileSection>

        <div ref={healthRef}>
          <HealthSection chicken={chicken} updateChicken={updateChicken} />
        </div>
      </ProfileSection>
    </div>
  );
}