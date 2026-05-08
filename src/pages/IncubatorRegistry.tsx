import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function IncubatorRegistry() {
  const [batches, setBatches] = useState<any[]>([]);

  const [batchName, setBatchName] = useState("");
  const [breed, setBreed] = useState("");
  const [eggCount, setEggCount] = useState("");
  const [startDate, setStartDate] = useState("");
  const calculateHatchDate = (start: string) => {
  const date = new Date(start);

  date.setDate(date.getDate() + 21);

  return date.toISOString().split("T")[0];
};
  const [status, setStatus] = useState("Incubating");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // LOAD BATCHES
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

  // SAVE BATCH
const saveBatch = async () => {
  if (!batchName || !eggCount || !startDate) {
    alert("Please complete all required fields.");
    return;
  }

  let error;

  if (editingId) {
    // UPDATE
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
    // INSERT
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
    // RESET FORM
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

  // COUNTDOWN
const getDaysRemaining = (date: string) => {
  const today = new Date();
  const hatch = new Date(date);

  const diff = hatch.getTime() - today.getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// FORMAT DATE
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

  // STATUS COLORS
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
        {batches.map((batch) => (
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
                background: "#eff6ff",
                padding: 12,
                borderRadius: 12,
                fontWeight: 700,
              }}
            >
              ⏳ {getDaysRemaining(batch.hatchdate)} Days Remaining
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