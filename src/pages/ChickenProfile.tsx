import { useState } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  navigate,
}: any) {
  const [form, setForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const [editingLogId, setEditingLogId] = useState<number | null>(null);

  if (!selectedChicken) {
    return <div>No chicken selected</div>;
  }

  const updateChicken = (updated: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updated : c))
    );
  };

  const saveLog = () => {
    if (!form.date) {
      alert("Date required");
      return;
    }

    let updatedLogs;

    if (editingLogId) {
      updatedLogs = selectedChicken.healthLogs.map((log: any) =>
        log.id === editingLogId ? { ...log, ...form } : log
      );
    } else {
      updatedLogs = [
        ...(selectedChicken.healthLogs || []),
        { id: Date.now(), ...form, resolved: false },
      ];
    }

    updateChicken({
      ...selectedChicken,
      healthLogs: updatedLogs,
    });

    setForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });

    setEditingLogId(null);
  };

  const editLog = (log: any) => {
    setForm(log);
    setEditingLogId(log.id);
  };

  const toggleResolved = (logId: number) => {
    const updatedLogs = selectedChicken.healthLogs.map((log: any) =>
      log.id === logId ? { ...log, resolved: !log.resolved } : log
    );

    updateChicken({
      ...selectedChicken,
      healthLogs: updatedLogs,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate("registry")}>← Back</button>

      <h2>{selectedChicken.name}</h2>

      {/* FORM */}
      <h3>🩺 Health Log</h3>

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
          placeholder="Symptoms"
          value={form.symptoms}
          onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
        />

        <input
          placeholder="Treatment"
          value={form.treatment}
          onChange={(e) => setForm({ ...form, treatment: e.target.value })}
        />

        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button
          onClick={saveLog}
          style={{ background: "green", color: "#fff", padding: 10 }}
        >
          {editingLogId ? "Update Log" : "Add Log"}
        </button>
      </div>

      {/* LOG LIST */}
      <h3 style={{ marginTop: 30 }}>📋 Health History</h3>

      {(selectedChicken.healthLogs || []).map((log: any) => (
        <div
          key={log.id}
          style={{
            background: "#fff",
            padding: 15,
            marginTop: 10,
            borderRadius: 10,
          }}
        >
          <b>{log.date}</b> — {log.status}

          {log.symptoms && <p>Symptoms: {log.symptoms}</p>}
          {log.treatment && <p>Treatment: {log.treatment}</p>}
          {log.notes && <p>Notes: {log.notes}</p>}

          {/* RESOLVED TOGGLE */}
          <label style={{ display: "block", marginTop: 10 }}>
            <input
              type="checkbox"
              checked={log.resolved || false}
              onChange={() => toggleResolved(log.id)}
            />{" "}
            Resolved / Healthy
          </label>

          <button
            onClick={() => editLog(log)}
            style={{ marginTop: 10, background: "orange" }}
          >
            Edit
          </button>
        </div>
      ))}
    </div>
  );
}