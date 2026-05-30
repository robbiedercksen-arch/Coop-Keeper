import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function IncubatorRegistry() {
  const [batches, setBatches] = useState<any[]>([]);
  const [incubatorFilter, setIncubatorFilter] =
    useState("active");

  const [batchName, setBatchName] = useState("");
  const [breed, setBreed] = useState("");
  const [eggCount, setEggCount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [status, setStatus] = useState("Incubating");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const activeBatches = batches.filter(
    (batch: any) =>
      batch.status === "Incubating" ||
      batch.status === "Locked Down"
  );

  const completedBatches = batches.filter(
    (batch: any) =>
      batch.status === "Hatched" ||
      batch.status === "Failed"
  );

  const filteredBatches =
  incubatorFilter === "active"
    ? activeBatches
    : completedBatches;

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

  const saveBatch = async () => {
    if (!batchName || !eggCount || !startDate) {
      alert("Please complete all required fields.");
      return;
    }

    let error;

    if (editingId) {
      const response = await supabase
        .from("incubator_batches")
        .update({
          batchname: batchName,
          breed,
          eggcount: Number(eggCount),
          startdate: startDate,
          hatchdate: calculateHatchDate(startDate),
          status,
          notes,
        })
        .eq("id", editingId);

      error = response.error;
    } else {
      const response = await supabase
        .from("incubator_batches")
        .insert({
          batchname: batchName,
          breed,
          eggcount: Number(eggCount),
          startdate: startDate,
          hatchdate: calculateHatchDate(startDate),
          status,
          notes,
        });

      error = response.error;
    }

    if (error) {
      console.error("Save error:", error);
      alert("Failed to save batch.");
    } else {
      setBatchName("");
      setBreed("");
      setEggCount("");
      setStartDate("");
      setStatus("Incubating");
      setNotes("");
      setEditingId(null);
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
    setBatchName(batch.batchname || "");
    setBreed(batch.breed || "");
    setEggCount(batch.eggcount?.toString() || "");
    setStartDate(batch.startdate || "");
    setStatus(batch.status || "Incubating");
    setNotes(batch.notes || "");
    setEditingId(batch.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
          getDaysRemaining(a.hatchdate) -
          getDaysRemaining(b.hatchdate)
      )[0] || null;

  const nextHatchDays = nextHatchBatch
    ? getDaysRemaining(nextHatchBatch.hatchdate)
    : "-";

  const isLockdown = (date: string) => {
    return getDaysRemaining(date) <= 3;
  };

  const formatDate = (date: string) => {
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* CUSTOM BANNER */}
      <div
        className="
          bg-gradient-to-r
          from-green-700
          to-green-400
          rounded-3xl
          p-8
          text-white
          shadow-lg
          flex
          justify-between
          items-center
          gap-6
        "
      >
        <div>
          <div className="text-xs tracking-[0.3em] font-bold mb-3">
            HATCHERY
          </div>

          <h1 className="text-4xl font-bold mb-2">
            Incubator Registry
          </h1>

          <div className="text-white/90">
            Track incubators, hatching cycles and fertility.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">

          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[110px]">
            <div className="text-3xl font-bold">
              {activeBatches.length}
            </div>

            <div className="text-[10px] tracking-widest">
              ACTIVE
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[110px]">
            <div className="text-3xl font-bold">
              {completedBatches.length}
            </div>

            <div className="text-[10px] tracking-widest">
              COMPLETED
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[110px]">
            <div className="text-3xl font-bold">
              {nextHatchDays}
            </div>

            <div className="text-[10px] tracking-widest">
              DAYS LEFT
            </div>
          </div>

        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setIncubatorFilter("active")}
          className={`
            flex-1
            p-3
            rounded-xl
            font-semibold
            ${
              incubatorFilter === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700"
            }
          `}
        >
          Active Incubations
        </button>

        <button
          onClick={() => setIncubatorFilter("history")}
          className={`
            flex-1
            p-3
            rounded-xl
            font-semibold
            ${
              incubatorFilter === "history"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }
          `}
        >
          Completed Incubations
        </button>
      </div>

      {/* FORM */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 16,
        }}
      >
        <h2 style={{ marginBottom: 20 }}>
          🐣 New Incubator Batch
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <input
            placeholder="Batch Name"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Egg Count"
            value={eggCount}
            onChange={(e) => setEggCount(e.target.value)}
            style={inputStyle}
          />

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={inputStyle}
          >
            <option>Incubating</option>
            <option>Locked Down</option>
            <option>Hatched</option>
            <option>Failed</option>
          </select>

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            style={inputStyle}
          />

          <button
            onClick={saveBatch}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "14px",
              borderRadius: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {editingId ? "Update Batch" : "Save Batch"}
          </button>
        </div>
      </div>

      {/* BATCHES */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {filteredBatches.map((batch) => (
          <div
            key={batch.id}
            style={{
              background: "#fff",
              padding: 18,
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>
                🐣 {batch.batchname}
              </h3>

              <div
                style={{
                  background: getStatusColor(batch.status),
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {batch.status}
              </div>
            </div>

            <div>
              <strong>Breed:</strong> {batch.breed || "-"}
            </div>

            <div>
              <strong>Egg Count:</strong> {batch.eggcount}
            </div>

            <div>
              <strong>Started:</strong> {formatDate(batch.startdate)}
            </div>

            <div>
              <strong>Hatch Date:</strong> {formatDate(batch.hatchdate)}
            </div>

            <div
              style={{
                background: isLockdown(batch.hatchdate)
                  ? "#fff7ed"
                  : "#eff6ff",
                border: isLockdown(batch.hatchdate)
                  ? "2px solid #f59e0b"
                  : "none",
                padding: 12,
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              {isLockdown(batch.hatchdate) ? (
                <>
                  ⚠ LOCKDOWN ACTIVE —{" "}
                  {getDaysRemaining(batch.hatchdate)} Days Remaining
                </>
              ) : (
                <>
                  ⏳ {getDaysRemaining(batch.hatchdate)} Days Remaining
                </>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 10,
              }}
            >
              <button
                onClick={() => editBatch(batch)}
                style={{
                  background: "#f59e0b",
                  color: "#fff",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                ✏ Edit
              </button>

              <button
                onClick={() => deleteBatch(batch.id)}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                🗑 Delete
              </button>
            </div>

            {batch.status !== "Hatched" && (
              <button
                onClick={() => completeHatch(batch)}
                style={{
                  background: "#16a34a",
                  color: "#fff",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 700,
                  marginTop: 10,
                  alignSelf: "flex-start",
                }}
              >
                🐣 Complete Hatch
              </button>
            )}

            {batch.chicks_hatched && (
              <div>
                <strong>Chicks Hatched:</strong> {batch.chicks_hatched}
              </div>
            )}

            {batch.chicks_survived && (
              <div>
                <strong>Chicks Survived:</strong> {batch.chicks_survived}
              </div>
            )}

            {batch.notes && (
              <div>
                <strong>Notes:</strong> {batch.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 14,
  width: "100%",
  boxSizing: "border-box" as const,
};