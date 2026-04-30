import { useState, useEffect } from "react";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
}: any) {
  if (!selectedChicken || !selectedChicken.id) {
    return (
      <div style={{ padding: 20 }}>
        <p>Loading chicken...</p>
        <button onClick={() => navigate("registry")}>
          ← Back to Registry
        </button>
      </div>
    );
  }

  // ================= LOCAL STATE =================
  const [chicken, setChicken] = useState(selectedChicken);

  useEffect(() => {
    setChicken(selectedChicken);
  }, [selectedChicken]);

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const [showHealthForm, setShowHealthForm] = useState(false);
  const [editingLogId, setEditingLogId] = useState<number | null>(null);

  // 🔥 NEW: PROFILE EDIT STATE
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    idTag: "",
    breed: "",
    sex: "",
    ageGroup: "",
  });

  useEffect(() => {
    setProfileForm({
      name: chicken.name || "",
      idTag: chicken.idTag || "",
      breed: chicken.breed || "",
      sex: chicken.sex || "",
      ageGroup: chicken.ageGroup || "",
    });
  }, [chicken]);

  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
    treatment: "",
    notes: "",
  });

  const healthLogs = chicken.healthLogs || [];

  // ================= UPDATE =================
  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  // ================= SAVE PROFILE =================
  const saveProfile = () => {
    updateChicken({
      ...chicken,
      ...profileForm,
    });
    setEditingProfile(false);
  };

  // ================= HEALTH =================
  const addHealth = () => {
    if (!healthForm.date) return alert("Date required");

    if (editingLogId) {
      updateChicken({
        ...chicken,
        healthLogs: healthLogs.map((l: any) =>
          l.id === editingLogId ? { ...l, ...healthForm } : l
        ),
      });
    } else {
      updateChicken({
        ...chicken,
        healthLogs: [
          ...healthLogs,
          { id: Date.now(), ...healthForm, resolved: false },
        ],
      });
    }

    setEditingLogId(null);
    setShowHealthForm(false);
    setHealthForm({
      date: "",
      status: "Healthy",
      symptoms: "",
      treatment: "",
      notes: "",
    });
  };

  // ================= STYLES =================
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginBottom: 20,
  };

  const sectionTitle = {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
  };

  const primary = {
    background: "#3b82f6",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  };

  const success = {
    background: "#22c55e",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    width: "100%",
    marginBottom: 8,
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100 }}>

      {/* BACK + EDIT */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
        <button onClick={() => navigate("registry")} style={primary}>
          ← Back
        </button>

        <button onClick={() => setEditingProfile(!editingProfile)} style={primary}>
          ✏️ Edit Profile
        </button>
      </div>

      {/* PROFILE */}
      <div style={card}>
        <div style={{ display: "flex", gap: 20 }}>
          <img
            src={chicken.image}
            style={{ width: 150, height: 150, borderRadius: 12 }}
          />

          <div style={{ flex: 1 }}>
            {editingProfile ? (
              <>
                <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} style={inputStyle} />
                <input value={profileForm.idTag} onChange={(e) => setProfileForm({ ...profileForm, idTag: e.target.value })} style={inputStyle} />
                <input value={profileForm.breed} onChange={(e) => setProfileForm({ ...profileForm, breed: e.target.value })} style={inputStyle} />
                <input value={profileForm.sex} onChange={(e) => setProfileForm({ ...profileForm, sex: e.target.value })} style={inputStyle} />
                <input value={profileForm.ageGroup} onChange={(e) => setProfileForm({ ...profileForm, ageGroup: e.target.value })} style={inputStyle} />

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={saveProfile} style={success}>Save</button>
                  <button onClick={() => setEditingProfile(false)} style={{ background: "#e5e7eb", border: "none", padding: "8px 12px", borderRadius: 8 }}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1>{chicken.name}</h1>
                <div><b>ID Tag:</b> {chicken.idTag}</div>
                <div><b>Breed:</b> {chicken.breed}</div>
                <div><b>Sex:</b> {chicken.sex}</div>
                <div><b>Age:</b> {chicken.ageGroup}</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= KEEP REST OF YOUR PAGE ================= */}
      {/* DO NOT REMOVE BELOW - THIS PRESERVES YOUR EXISTING UI */}

      {/* PHOTO ALBUM */}
      <div style={card}>
        <div style={sectionTitle}>📸 Photo Album</div>

        <label style={success}>
          + Add Photos
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e: any) => {
              const files = Array.from(e.target.files);

              Promise.all(
                files.map(
                  (file: any) =>
                    new Promise((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result);
                      reader.readAsDataURL(file);
                    })
                )
              ).then((images: any) => {
                updateChicken({
                  ...chicken,
                  album: [...(chicken.album || []), ...images],
                });
              });
            }}
          />
        </label>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          {(chicken.album || []).map((img: any, i: number) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={img}
                onClick={() => setActiveImage(img)}
                style={{ width: 100, height: 100, borderRadius: 8, objectFit: "cover", cursor: "pointer" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* HEALTH LOGS (unchanged) */}
      <div style={card}>
        <div style={sectionTitle}>🩺 Health Logs</div>
        <button style={success} onClick={() => setShowHealthForm(!showHealthForm)}>+ Add Health Log</button>

        {healthLogs.map((log: any) => (
          <div key={log.id} style={{ marginTop: 10 }}>
            {log.status} — {log.symptoms}
          </div>
        ))}
      </div>

      {/* IMAGE POPUP */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={activeImage} style={{ maxWidth: "90%", maxHeight: "90%" }} />
        </div>
      )}
    </div>
  );
}