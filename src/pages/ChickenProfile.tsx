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
  const [newProfilePhotoPreview, setNewProfilePhotoPreview] = useState("");
  const [newProfilePhotoBlob, setNewProfilePhotoBlob] = useState<Blob | null>(
    null
  );

  const [profilePhotoZoom, setProfilePhotoZoom] = useState(1);
  const [profilePhotoX, setProfilePhotoX] = useState(0);
  const [profilePhotoY, setProfilePhotoY] = useState(0);
  const [savingProfilePhoto, setSavingProfilePhoto] = useState(false);

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

  const isBase64Image = (value: any) =>
    typeof value === "string" && value.startsWith("data:image");

  const isUsableImageUrl = (value: any) =>
    typeof value === "string" && value.trim() !== "" && !isBase64Image(value);

  const cleanPhotoList = (photos: any[]) =>
    (photos || []).filter((photo) => isUsableImageUrl(photo));

  const resizeImageToBlob = (
    file: File,
    maxSize = 900,
    quality = 0.8
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = () => {
        img.src = reader.result as string;
      };

      reader.onerror = () => reject("Could not read image file.");

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not resize image.");
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject("Could not compress image.");
              return;
            }

            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject("Could not load image.");

      reader.readAsDataURL(file);
    });
  };

  const uploadProfilePhotoToStorage = async (blob: Blob) => {
    const chickenId = String(chicken?.id || selectedChicken?.id || "unknown");

    const fileName = `${chickenId}/profile-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("chicken-photos")
      .upload(fileName, blob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Profile photo upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("chicken-photos")
      .getPublicUrl(fileName);

    return data.publicUrl;
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
      profileImageX: chickenData.profileImageX || 0,
      profileImageY: chickenData.profileImageY || 0,
      photos: chickenData.photos || data.photos || [],
      notes: chickenData.notes || data.notes || [],
      healthLogs: chickenData.healthLogs || data.healthLogs || [],
      album: chickenData.album || data.album || [],
      weightHistory:
        chickenData.weightHistory || chickenData.weight_history || [],
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

  const profileImage = isUsableImageUrl(chicken.image)
    ? chicken.image
    : isUsableImageUrl(chicken.image_url)
    ? chicken.image_url
    : chicken.photos?.[0] ||
      chicken.album?.[0] ||
      "https://via.placeholder.com/160";

  const currentProfileZoom = Number(chicken.profileImageZoom || 1);
  const currentProfileX = Number(chicken.profileImageX || 0);
  const currentProfileY = Number(chicken.profileImageY || 0);

  const hasHealthIssue = (chicken.healthLogs || chicken.health_logs || []).some(
    (log: any) => log.status === "Ongoing" || log.status === "Monitoring"
  );

  const updateChicken = async (updated: any) => {
    const updatedPhotos = cleanPhotoList(
      updated.photos?.length > 0
        ? updated.photos
        : updated.album?.length > 0
        ? updated.album
        : chicken.photos?.length > 0
        ? chicken.photos
        : chicken.album || []
    );

    const updatedAlbum = cleanPhotoList(
      updated.album?.length > 0
        ? updated.album
        : updated.photos?.length > 0
        ? updated.photos
        : chicken.album?.length > 0
        ? chicken.album
        : chicken.photos || []
    );

    const mergedChicken = {
      ...chicken,
      ...updated,
      notes: updated.notes ?? chicken.notes ?? [],
      photos: updatedPhotos,
      album: updatedAlbum,
      healthLogs: updated.healthLogs ?? chicken.healthLogs ?? [],
      activity: updated.activity ?? chicken.activity ?? [],
      profileImageZoom:
        updated.profileImageZoom ?? chicken.profileImageZoom ?? 1,
      profileImageX: updated.profileImageX ?? chicken.profileImageX ?? 0,
      profileImageY: updated.profileImageY ?? chicken.profileImageY ?? 0,
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

    const profileThumbnail = isUsableImageUrl(mergedChicken.image)
      ? mergedChicken.image
      : isUsableImageUrl(mergedChicken.image_url)
      ? mergedChicken.image_url
      : mergedChicken.photos?.[0] || mergedChicken.album?.[0] || "";

    const updatedWithThumbnail = {
      ...mergedChicken,
      image: profileThumbnail,
      image_url: profileThumbnail,
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

  const handleProfilePhotoSelect = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedBlob = await resizeImageToBlob(file, 900, 0.8);
      const previewUrl = URL.createObjectURL(compressedBlob);

      setNewProfilePhotoBlob(compressedBlob);
      setNewProfilePhotoPreview(previewUrl);
      setProfilePhotoZoom(1);
      setProfilePhotoX(0);
      setProfilePhotoY(0);
      setShowPhotoEditor(true);

      if (profilePhotoInputRef.current) {
        profilePhotoInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Profile photo resize error:", error);
      alert("Could not process profile photo. Please try a different image.");
    }
  };

  const saveProfilePhoto = async () => {
    if (!newProfilePhotoBlob) return;

    try {
      setSavingProfilePhoto(true);

      const publicUrl = await uploadProfilePhotoToStorage(newProfilePhotoBlob);

      const currentPhotos =
        chicken.photos?.length > 0 ? chicken.photos : chicken.album || [];

      const cleanedCurrentPhotos = cleanPhotoList(currentPhotos);

      const updatedPhotos = cleanedCurrentPhotos.includes(publicUrl)
        ? cleanedCurrentPhotos
        : [publicUrl, ...cleanedCurrentPhotos];

      const updated = {
        ...chicken,
        image: publicUrl,
        image_url: publicUrl,
        profileImageZoom: profilePhotoZoom,
        profileImageX: profilePhotoX,
        profileImageY: profilePhotoY,
        photos: updatedPhotos,
        album: updatedPhotos,
      };

      await updateChicken(updated);

      setShowPhotoEditor(false);
      setNewProfilePhotoPreview("");
      setNewProfilePhotoBlob(null);
      setProfilePhotoZoom(1);
      setProfilePhotoX(0);
      setProfilePhotoY(0);
    } catch (error) {
      console.error("Profile photo save error:", error);
      alert(
        "Could not upload profile photo. Please check that the Supabase bucket 'chicken-photos' exists and is public."
      );
    } finally {
      setSavingProfilePhoto(false);
    }
  };

  const cancelProfilePhotoEdit = () => {
    setShowPhotoEditor(false);
    setNewProfilePhotoPreview("");
    setNewProfilePhotoBlob(null);
    setProfilePhotoZoom(1);
    setProfilePhotoX(0);
    setProfilePhotoY(0);
  };

  const resetProfilePhotoPosition = () => {
    setProfilePhotoZoom(1);
    setProfilePhotoX(0);
    setProfilePhotoY(0);
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
              transform: `translate(${currentProfileX}%, ${currentProfileY}%) scale(${currentProfileZoom})`,
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
                src={newProfilePhotoPreview}
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${profilePhotoX}%, ${profilePhotoY}%) scale(${profilePhotoZoom})`,
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

            <div className="w-full">
              <label className="block text-sm font-bold text-[#4b3a1d] mb-1">
                Move Left / Right
              </label>

              <input
                type="range"
                min="-40"
                max="40"
                step="1"
                value={profilePhotoX}
                onChange={(e) => setProfilePhotoX(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-bold text-[#4b3a1d] mb-1">
                Move Up / Down
              </label>

              <input
                type="range"
                min="-40"
                max="40"
                step="1"
                value={profilePhotoY}
                onChange={(e) => setProfilePhotoY(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={resetProfilePhotoPosition}
              disabled={savingProfilePhoto}
              className="bg-orange-500 text-white px-3 py-3 rounded-xl font-bold w-full disabled:bg-gray-400"
            >
              Reset Position
            </button>

            <div className="flex gap-2 w-full">
              <button
                onClick={saveProfilePhoto}
                disabled={savingProfilePhoto}
                className="bg-green-600 text-white px-3 py-3 rounded-xl font-bold flex-1 disabled:bg-gray-400"
              >
                {savingProfilePhoto ? "Uploading..." : "Save Photo"}
              </button>

              <button
                onClick={cancelProfilePhotoEdit}
                disabled={savingProfilePhoto}
                className="bg-gray-500 text-white px-3 py-3 rounded-xl font-bold flex-1 disabled:bg-gray-400"
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