import { useState } from "react";

export default function ChickenProfile({ selectedChicken, setChickens, navigate }: any) {
  const [form, setForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  if (!selectedChicken) {
    return <div style={{ padding: 20 }}>No chicken selected.</div>;
  }

  const updateChicken = (updatedChicken: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updatedChicken : c))
    );
  };

  const addHealthLog = () => {
    if (!form.date) {
      alert("Please select a date");
      return;
    }

    const newLog = {
      id: Date.now(),
      ...form,
    };

    const updatedChicken = {
      ...selectedChicken,
      healthLogs: [...(selectedChicken.healthLogs || []), newLog],
    };

    updateChicken(updatedChicken);

    setForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });
  };

  const deleteChicken = () => {
    setChickens((prev: any[]) =>
      prev.filter((c) => c.id !== selectedChicken.id)
    );
    navigate("registry");
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate("registry")}>← Back</button>

      <h2 style={{ marginTop: 10 }}>{selectedChicken.name}</h2>

      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 12,
          marginBottom: 30,
        }}
      >
        <img
          src={selectedChicken.image}
          style={{ width: 120, borderRadius: 10 }}
        />

        <p><b>ID Tag:</b> {selectedChicken.idTag}</p>
        <p><b>Breed:</b> {selectedChicken.breed}</p>
        <p><b>Sex:</b> {selectedChicken.sex}</p>
        <p><b>Age:</b> {selectedChicken.ageGroup}</p>
        <p><b>Status:</b> {selectedChicken.status}</p>

        <button
          onClick={deleteChicken}
          style={{
            background: "red",
            color: "#fff",
            padding: 10,
            borderRadius: 6,
            marginTop: 10,
          }}
        >
          Delete
        </button>
      </div>

      {/* HEALTH LOG FORM */}
      <h3>🩺 Add Health Log</h3>

      <div style={{ display: "grid", gap: 10, maxWidth: 400 }}>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>Healthy</option>
          <option>Sick</option>
          <option>Recovering</option>
        </select>

        <input
          placeholder="Symptoms (optional)"
          value={form.symptoms}
          onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
        />

        <input
          placeholder="Treatment (optional)"
          value={form.treatment}
          onChange={(e) => setForm({ ...form, treatment: e.target.value })}
        />

        <textarea
          placeholder="Health Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button
          onClick={addHealthLog}
          style={{
            background: "#16a34a",
            color: "#fff",
            padding: 10,
            borderRadius: 6,
          }}
        >
          Save Health Log
        </button>
      </div>

      {/* HEALTH HISTORY */}
      <h3 style={{ marginTop: 30 }}>📋 Health History</h3>

      {(selectedChicken.healthLogs || []).length === 0 && (
        <p>No health records yet.</p>
      )}

      {(selectedChicken.healthLogs || []).map((log: any) => (
        <div
          key={log.id}
          style={{
            background: "#fff",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <b>{log.date}</b> — {log.status}

          {log.symptoms && <p>Symptoms: {log.symptoms}</p>}
          {log.treatment && <p>Treatment: {log.treatment}</p>}
          {log.notes && <p>Notes: {log.notes}</p>}
        </div>
      ))}
    </div>
  );
}