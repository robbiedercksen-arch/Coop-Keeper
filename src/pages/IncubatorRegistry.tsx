import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import CoopPageBanner from "../components/CoopPageBanner";

const cardClass =
  "rounded-3xl p-4 sm:p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] overflow-hidden";

const statClass =
  "rounded-2xl p-4 text-center bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)]";

const fieldClass =
  "border border-[#d9a441] rounded-2xl p-3 bg-white w-full max-w-full min-w-0 box-border text-base leading-normal h-[52px]";

const textAreaClass =
  "border border-[#d9a441] rounded-2xl p-3 bg-white w-full max-w-full min-w-0 box-border text-base leading-normal min-h-[120px]";

const chickenBreeds = [
  "Australorp",
  "Boschveld",
  "Brahma",
  "Buff Orpington",
  "Cochin",
  "Dorking",
  "Faverolles",
  "Frizzle",
  "Koekoek",
  "Leghorn",
  "Light Sussex",
  "Lohmann Brown",
  "New Hampshire",
  "Orpington",
  "Plymouth Rock",
  "Potchefstroom Koekoek",
  "Rhode Island Red",
  "Silkie",
  "Sussex",
  "Venda",
  "Wyandotte",
  "Mixed Breed",
  "Custom Mix Breed",
];

export default function IncubatorRegistry() {
  const [batches, setBatches] = useState<any[]>([]);
  const [incubatorFilter, setIncubatorFilter] = useState("active");
  const [showForm, setShowForm] = useState(false);

  const [batchName, setBatchName] = useState("");
  const [breed, setBreed] = useState("");
  const [customBreed, setCustomBreed] = useState("");
  const [eggCount, setEggCount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("Incubating");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const activeBatches = batches.filter(
    (batch: any) =>
      batch.status === "Incubating" || batch.status === "Locked Down"
  );

  const completedBatches = batches.filter(
    (batch: any) => batch.status === "Hatched" || batch.status === "Failed"
  );

  const filteredBatches =
    incubatorFilter === "active" ? activeBatches : completedBatches;

  const calculateHatchDate = (start: string) => {
    const date = new Date(start);
    date.setDate(date.getDate() + 21);
    return date.toISOString().split("T")[0];
  };

  const fetchBatches = async () => {
    const { data, error } = await supabase
      .from("incubator_batches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Load error:", error);
    } else {
      setBatches(data || []);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const resetForm = () => {
    setBatchName("");
    setBreed("");
    setCustomBreed("");
    setEggCount("");
    setStartDate("");
    setStatus("Incubating");
    setNotes("");
    setEditingId(null);
    setShowForm(false);
  };

  const saveBatch = async () => {
    if (!batchName || !eggCount || !startDate) {
      alert("Please complete all required fields.");
      return;
    }

    const finalBreed = breed === "Custom Mix Breed" ? customBreed : breed;

    const payload = {
      batchname: batchName,
      breed: finalBreed,
      eggcount: Number(eggCount),
      startdate: startDate,
      hatchdate: calculateHatchDate(startDate),
      status,
      notes,
    };

    let error;

    if (editingId) {
      const response = await supabase
        .from("incubator_batches")
        .update(payload)
        .eq("id", editingId);

      error = response.error;
    } else {
      const response = await supabase.from("incubator_batches").insert(payload);
      error = response.error;
    }

    if (error) {
      console.error("Save error:", error);
      alert("Failed to save batch.");
    } else {
      resetForm();
      fetchBatches();
    }
  };

  const deleteBatch = async (id: number) => {
    const confirmed = confirm("Delete this incubator batch?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("incubator_batches")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete batch.");
    } else {
      fetchBatches();
    }
  };

  const editBatch = (batch: any) => {
    const savedBreed = batch.breed || "";
    const isKnownBreed = chickenBreeds.includes(savedBreed);

    setBatchName(batch.batchname || "");
    setBreed(isKnownBreed ? savedBreed : "Custom Mix Breed");
    setCustomBreed(isKnownBreed ? "" : savedBreed);
    setEggCount(batch.eggcount?.toString() || "");
    setStartDate(batch.startdate || "");
    setStatus(batch.status || "Incubating");
    setNotes(batch.notes || "");
    setEditingId(batch.id);
    setShowForm(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeHatch = async (batch: any) => {
    const hatched = prompt("How many chicks hatched?");
    if (hatched === null) return;

    const survived = prompt("How many chicks survived?");
    if (survived === null) return;

    const { error } = await supabase
      .from("incubator_batches")
      .update({
        status: "Hatched",
        chicks_hatched: Number(hatched),
        chicks_survived: Number(survived),
      })
      .eq("id", batch.id);

    if (error) {
      console.error("Hatch completion error:", error);
      alert("Failed to complete hatch.");
    } else {
      fetchBatches();
    }
  };

  const getDaysRemaining = (date: string) => {
    const today = new Date();
    const hatch = new Date(date);
    const diff = hatch.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const nextHatchBatch =
    activeBatches
      .filter((batch: any) => batch.hatchdate)
      .sort(
        (a: any, b: any) =>
          getDaysRemaining(a.hatchdate) - getDaysRemaining(b.hatchdate)
      )[0] || null;

  const nextHatchDays = nextHatchBatch
    ? Math.max(getDaysRemaining(nextHatchBatch.hatchdate), 0)
    : "-";

  const isLockdown = (date: string) => getDaysRemaining(date) <= 3;

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Incubating":
        return "#2563eb";
      case "Locked Down":
        return "#f59e0b";
      case "Hatched":
        return "#16a34a";
      case "Failed":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 px-3 sm:px-4 overflow-hidden">
      <CoopPageBanner
        eyebrow="HATCHERY"
        title="Incubator Registry"
        subtitle="Track incubators, hatching cycles and fertility."
        stats={[
          { label: "Active", value: activeBatches.length },
          { label: "Completed", value: completedBatches.length },
          { label: "Days Left", value: nextHatchDays },
        ]}
      />

      <div className={cardClass}>
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="w-full bg-[#022312] text-[#f7d37b] rounded-2xl px-5 py-4 font-extrabold shadow-md"
        >
          ➕ Add Incubation Batch
        </button>
      </div>

      <div className={cardClass}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <button
            onClick={() => setIncubatorFilter("active")}
            className={`w-full px-4 py-3 rounded-full text-sm font-bold border transition text-center ${
              incubatorFilter === "active"
                ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md"
                : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"
            }`}
          >
            Active Incubations
          </button>

          <button
            onClick={() => setIncubatorFilter("history")}
            className={`w-full px-4 py-3 rounded-full text-sm font-bold border transition text-center ${
              incubatorFilter === "history"
                ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md"
                : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"
            }`}
          >
            Completed Incubations
          </button>
        </div>
      </div>

      {showForm && (
        <div className={cardClass}>
          <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
            🐣 {editingId ? "Edit Incubator Batch" : "New Incubator Batch"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-full">
            <label className="flex flex-col gap-2 w-full min-w-0 max-w-full">
              <span className="font-extrabold text-[#3d2a10]">Batch Name</span>
              <input
                placeholder="Batch Name"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="flex flex-col gap-2 w-full min-w-0 max-w-full">
              <span className="font-extrabold text-[#3d2a10]">Select Breed</span>
              <select
                value={breed}
                onChange={(e) => {
                  setBreed(e.target.value);
                  if (e.target.value !== "Custom Mix Breed") {
                    setCustomBreed("");
                  }
                }}
                className={fieldClass}
              >
                <option value="">Select Breed</option>
                {chickenBreeds.map((breedName) => (
                  <option key={breedName} value={breedName}>
                    {breedName}
                  </option>
                ))}
              </select>
            </label>

            {breed === "Custom Mix Breed" && (
              <label className="flex flex-col gap-2 md:col-span-2 w-full min-w-0 max-w-full">
                <span className="font-extrabold text-[#3d2a10]">
                  Custom Mix Breed
                </span>
                <input
                  placeholder="Example: Orpington x Wyandotte"
                  value={customBreed}
                  onChange={(e) => setCustomBreed(e.target.value)}
                  className={fieldClass}
                />
              </label>
            )}

            <label className="flex flex-col gap-2 w-full min-w-0 max-w-full">
              <span className="font-extrabold text-[#3d2a10]">Egg Quantity</span>
              <input
                type="number"
                placeholder="Egg Count"
                value={eggCount}
                onChange={(e) => setEggCount(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="flex flex-col gap-2 w-full min-w-0 max-w-full">
              <span className="font-extrabold text-[#3d2a10]">
                Choose Incubation Start Date
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`${fieldClass} appearance-none`}
              />
            </label>

            <label className="flex flex-col gap-2 w-full min-w-0 max-w-full">
              <span className="font-extrabold text-[#3d2a10]">
                Incubation Process
              </span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={fieldClass}
              >
                <option>Incubating</option>
                <option>Locked Down</option>
                <option>Hatched</option>
                <option>Failed</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 md:col-span-2 w-full min-w-0 max-w-full">
              <span className="font-extrabold text-[#3d2a10]">
                Additional Notes
              </span>
              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className={textAreaClass}
              />
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button
              onClick={saveBatch}
              className="bg-[#022312] text-[#f7d37b] px-5 py-3 rounded-xl font-bold"
            >
              {editingId ? "Update Batch" : "Save Batch"}
            </button>

            <button
              onClick={resetForm}
              className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {filteredBatches.length === 0 && (
        <div className={cardClass}>
          <p className="text-[#6b5a3a] font-semibold">
            No incubator batches found.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filteredBatches.map((batch) => (
          <div key={batch.id} className={cardClass}>
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="min-w-0">
                <h3 className="text-xl font-extrabold text-[#3d2a10] break-words">
                  🐣 {batch.batchname}
                </h3>
                <div className="text-sm text-[#6b5a3a] break-words">
                  {batch.breed || "No breed added"}
                </div>
              </div>

              <div
                style={{ background: getStatusColor(batch.status) }}
                className="text-white px-3 py-1 rounded-full text-xs font-bold shrink-0"
              >
                {batch.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <div className={statClass}>
                <div className="text-2xl font-bold">{batch.eggcount}</div>
                <div className="text-sm text-[#4b3a1d]">Egg Count</div>
              </div>

              <div className={statClass}>
                <div className="text-lg font-bold">
                  {formatDate(batch.startdate)}
                </div>
                <div className="text-sm text-[#4b3a1d]">Started</div>
              </div>

              <div className={statClass}>
                <div className="text-lg font-bold">
                  {formatDate(batch.hatchdate)}
                </div>
                <div className="text-sm text-[#4b3a1d]">Hatch Date</div>
              </div>

              <div className={statClass}>
                <div className="text-2xl font-bold">
                  {batch.hatchdate
                    ? Math.max(getDaysRemaining(batch.hatchdate), 0)
                    : "-"}
                </div>
                <div className="text-sm text-[#4b3a1d]">Days Left</div>
              </div>
            </div>

            
            {batch.notes && (
              <div className="text-[#4b3a1d] mb-4 break-words">
                <strong>Notes:</strong> {batch.notes}
              </div>
            )}

            {(batch.chicks_hatched || batch.chicks_survived) && (
              <div className="text-[#4b3a1d] mb-4">
                <strong>Chicks Hatched:</strong> {batch.chicks_hatched || 0} |{" "}
                <strong>Survived:</strong> {batch.chicks_survived || 0}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => editBatch(batch)}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl font-bold"
              >
                ✏ Edit
              </button>

              <button
                onClick={() => deleteBatch(batch.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold"
              >
                🗑 Delete
              </button>

              {batch.status !== "Hatched" && (
                <button
                  onClick={() => completeHatch(batch)}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold"
                >
                  🐣 Complete Hatch
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}