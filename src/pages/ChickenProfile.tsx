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
  const profilePhotoInputRef = useRef<HTMLInputElement | null>(null);

  const [chicken, setChicken] = useState(selectedChicken);
  const [editing, setEditing] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [loadingFullProfile, setLoadingFullProfile] = useState(false);

  const [showPhotoEditor, setShowPhotoEditor] = useState(false);
  const [newProfilePhoto, setNewProfilePhoto] = useState("");
  const [profilePhotoZoom, setProfilePhotoZoom] = useState(1);

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
    if (selectedChicken) {
      setChicken(selectedChicken);
    }
  }, [selectedChicken?.id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    loadFullChicken();
    loadEggStats();
  }, [selectedChicken?.id]);

  const parseChickenData = (value: any) => {
    if (!value) return {};

    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }

    return value;
  };

  const loadFullChicken = async () => {
    if (!selectedChicken?.id) return;

    setLoadingFullProfile(true);

    const { data, error } = await supabase
      .from("chickens")
      .select("*")
      .eq("id", selectedChicken.id)
      .single();

    if (error) {
      console.error("Full chicken load error:", error);
      setLoadingFullProfile(false);
      return;
    }

    const chickenData = parseChickenData(data?.data);

    const fullChicken = {
      ...data,
      ...chickenData,
      id: chickenData.id || data.id,
      name: chickenData.name || data.name || "",
      idTag: chickenData.idTag || data.idTag || "",
      breed: chickenData.breed || data.breed || "",
      sex: chickenData.sex || data.sex || "",
      ageGroup: chickenData.ageGroup || data.ageGroup || "",
      image: chickenData.image || data.image || "",
      profileImageZoom: chickenData.profileImageZoom || 1,
      photos: chickenData.photos || data.photos || [],
      notes: chickenData.notes || data.notes || [],
      healthLogs: chickenData.healthLogs || data.healthLogs || [],
      album: chickenData.album || data.album || [],
      weightHistory:
        chickenData.weightHistory || chickenData.weight_history || [],
      weight_history:
        chickenData.weight_history || chickenData.weightHistory || [],
      activity: chickenData.activity || [],
    };

    setChicken(fullChicken);
    setSelectedChicken(fullChicken);
    setLoadingFullProfile(false);
  };

  const getValue = (camelKey: string, snakeKey: string) =>
    chicken?.[camelKey] ?? chicken?.[snakeKey] ?? "";

  const cleanWeightValue = (value: string) => value.trim().replace(",", ".");

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
    if (!selectedChicken?.id) return;

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
      .reduce((sum, log) => sum + Number(log.eggs || 0), 0);

    const monthEggs = data
      .filter((log) => new Date(log.date) >= monthAgo)
      .reduce((sum, log) => sum + Number(log.eggs || 0), 0);

    const lifetimeEggs = data.reduce(
      (sum, log) => sum + Number(log.eggs || 0),
      0
    );

    const sortedLogs = [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const lastDate = sortedLogs.length > 0 ? sortedLogs[0].date : "None";

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

  const currentProfileZoom = Number(chicken.profileImageZoom || 1);

  const hasHealthIssue = (chicken.healthLogs || chicken.health_logs || []).some(
    (log: any) => log.status === "Ongoing" || log.status === "Monitoring"
  );

  const updateChicken = async (updated: any) => {
    const mergedChicken = {
      ...chicken,
      ...updated,
      notes: updated.notes ?? chicken.notes ?? [],
      photos: updated.photos ?? chicken.photos ?? [],
      album: updated.album ?? chicken.album ?? [],
      healthLogs: updated.healthLogs ?? chicken.healthLogs ?? [],
      activity: updated.activity ?? chicken.activity ?? [],
      weightHistory:
        updated.weightHistory ??
        updated.weight_history ??
        chicken.weightHistory ??
        chicken.weight_history ??
        [],
      weight_history:
        updated.weight_history ??
        updated.weightHistory ??
        chicken.weight_history ??
        chicken.weightHistory ??
        [],
    };

    const profileThumbnail =
      mergedChicken.image ||
      mergedChicken.image_url ||
      mergedChicken.photos?.[0] ||
      "";

    const updatedWithThumbnail = {
      ...mergedChicken,
      image: profileThumbnail,
      data: {
        ...mergedChicken,
        image: profileThumbnail,
      },
    };

    setChicken(updatedWithThumbnail);
    setSelectedChicken(updatedWithThumbnail);

    setChickens((prev: any[]) =>
      prev.map((c) =>
        c.id === updatedWithThumbnail.id
          ? {
              ...c,
              name: updatedWithThumbnail.name || "",
              idTag: updatedWithThumbnail.idTag || "",
              breed: updatedWithThumbnail.breed || "",
              sex: updatedWithThumbnail.sex || "",
              ageGroup: updatedWithThumbnail.ageGroup || "",
              image: updatedWithThumbnail.image || "",
            }
          : c
      )
    );

    await saveChickenToDB(updatedWithThumbnail);
  };

  const saveEdits = async () => {
    await updateChicken(chicken);
    setEditing(false);
  };

  const handleProfilePhotoSelect = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setNewProfilePhoto(reader.result as string);
      setProfilePhotoZoom(1);
      setShowPhotoEditor(true);
    };

    reader.readAsDataURL(file);
  };

  const saveProfilePhoto = async () => {
    if (!newProfilePhoto) return;

    const updatedPhotos = chicken.photos?.includes(newProfilePhoto)
      ? chicken.photos || []
      : [newProfilePhoto, ...(chicken.photos || [])];

    const updated = {
      ...chicken,
      image: newProfilePhoto,
      profileImageZoom: profilePhotoZoom,
      photos: updatedPhotos,
    };

    await updateChicken(updated);

    setShowPhotoEditor(false);
    setNewProfilePhoto("");
    setProfilePhotoZoom(1);
  };

  const cancelProfilePhotoEdit = () => {
    setShowPhotoEditor(false);
    setNewProfilePhoto("");
    setProfilePhotoZoom(1);
  };

  const deleteChicken = async () => {
    const confirmed = confirm(
      `Are you sure you want to permanently delete ${chicken.name}? This cannot be undone.`
    );

    if (!confirmed) return;

    const secondConfirm = confirm(
      "Final confirmation: This will permanently delete this chicken profile."
    );

    if (!secondConfirm) return;

    const { error } = await supabase
      .from("chickens")
      .delete()
      .eq("id", chicken.id);

    if (error) {
      console.error("Delete chicken error:", error);
      alert("Could not delete chicken profile.");
      return;
    }

    setChickens((prev: any[]) => prev.filter((c) => c.id !== chicken.id));
    setSelectedChicken(null);
    navigate("registry");
  };

  const addWeightEntry = async () => {
    const cleanWeight = cleanWeightValue(newWeight);

    if (!cleanWeight) return;

    const updatedHistory = [
      ...weightHistory,
      {
        date: newWeightDate,
        weightKg: cleanWeight,
        weight_kg: cleanWeight,
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

    const cleanEditWeight = cleanWeightValue(editWeightValue);

    if (!cleanEditWeight) return;

    const updatedHistory = weightHistory.map((entry: any, index: number) =>
      index === editingWeightIndex
        ? {
            ...entry,
            date: editWeightDate,
            weightKg: cleanEditWeight,
            weight_kg: cleanEditWeight,
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

        {loadingFullProfile && (
          <div className="flex items-center gap-2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-full font-bold text-sm shadow-md animate-pulse">
            <span className="text-xl animate-spin">⏳</span>
            <span>Loading chicken profile...</span>
          </div>
        )}

        <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200">
          <img
            src={profileImage}
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${currentProfileZoom})`,
              transformOrigin: "center",
            }}
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

        <input
          ref={profilePhotoInputRef}
          type="file"
          accept="image/*"
          onChange={handleProfilePhotoSelect}
          className="hidden"
        />

        <button
          onClick={() => profilePhotoInputRef.current?.click()}
          className="bg-[#022312] text-[#f7d37b] px-4 py-2 rounded-xl text-base font-bold"
        >
          📷 Change Profile Photo
        </button>

        {showPhotoEditor && (
          <div className="w-full bg-white border border-[#d9a441] rounded-2xl p-4 shadow-md flex flex-col items-center gap-4">
            <div className="text-[#3d2a10] font-extrabold">
              Adjust Profile Picture
            </div>

            <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-[#d9a441] bg-gray-200">
              <img
                src={newProfilePhoto}
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${profilePhotoZoom})`,
                  transformOrigin: "center",
                }}
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-bold text-[#4b3a1d] mb-1">
                Zoom
              </label>

              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={profilePhotoZoom}
                onChange={(e) => setProfilePhotoZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={saveProfilePhoto}
                className="bg-green-600 text-white px-3 py-3 rounded-xl font-bold flex-1"
              >
                Save Photo
              </button>

              <button
                onClick={cancelProfilePhotoEdit}
                className="bg-gray-500 text-white px-3 py-3 rounded-xl font-bold flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="text-xl font-semibold">{chicken.name}</div>
          <div className="text-gray-500 text-sm">{chicken.breed}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
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

          <button
            onClick={deleteChicken}
            className="bg-red-600 text-white px-4 py-2 rounded-xl text-base font-bold"
          >
            🗑 Delete Chicken
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
                type="text"
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
              type="text"
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
                        type="text"
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

      <ProfileSection title="Health">
        <div ref={healthRef}>
          <HealthSection chicken={chicken} updateChicken={updateChicken} />
        </div>
      </ProfileSection>
    </div>
  );
}