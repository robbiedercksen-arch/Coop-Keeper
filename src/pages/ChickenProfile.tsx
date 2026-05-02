import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ==========================
// SECTION 1: COMPONENT SETUP & PROPS
// ==========================
export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
  saveChickenToDB, 
}: any) {

  // ==========================
  // SECTION 2: SAFETY CHECK (LOADING STATE)
  // ==========================
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

  // ==========================
  // SECTION 3: CORE STATE (CHICKEN DATA)
  // ==========================
  const [chicken, setChicken] = useState(selectedChicken);

  // ==========================
  // SECTION 4: IMAGE VIEWER STATE + NAVIGATION
  // Handles fullscreen image + next/prev swipe navigation
  // ==========================
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const nextImage = () => {
    const album = chicken.album || [];
    if (activeIndex < album.length - 1) {
      const next = activeIndex + 1;
      setActiveIndex(next);
      setActiveImage(album[next]);
    }
  };

  const prevImage = () => {
    const album = chicken.album || [];
    if (activeIndex > 0) {
      const prev = activeIndex - 1;
      setActiveIndex(prev);
      setActiveImage(album[prev]);
    }
  };

  // ==========================
  // SECTION 5: SWIPE DETECTION (TOUCH CONTROLS)
  // Uses touch start/end to detect swipe direction
  // ==========================
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: any) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: any) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (diff > 50) nextImage();
    if (diff < -50) prevImage();
  };

  // ==========================
  // SECTION 6: SYNC SELECTED CHICKEN
  // Keeps local state updated when parent changes
  // ==========================
  useEffect(() => setChicken(selectedChicken), [selectedChicken]);

  // ==========================
  // SECTION 7: GLOBAL UI STATE (NOTES + HEALTH)
  // ==========================
  const [viewNote, setViewNote] = useState<any>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [showHealthForm, setShowHealthForm] = useState(false);
  const [viewLog, setViewLog] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // ==========================
  // SECTION 8: FORM STATES
  // ==========================
  const [healthForm, setHealthForm] = useState({
    date: "",
    status: "Healthy",
    symptoms: "",
  });

  const [editingChicken, setEditingChicken] = useState(false);

  const [editForm, setEditForm] = useState({
    name: chicken.name || "",
    idTag: chicken.idTag || "",
    breed: chicken.breed || "",
    sex: chicken.sex || "Hen",
    ageGroup: chicken.ageGroup || "",
  });

  // ==========================
  // SECTION 9: HEALTH LOG SORTING LOGIC
  // ==========================
  const getPriority = (log: any) => {
    if (log.resolved) return 99;
    if (log.status === "Sick") return 1;
    if (log.status === "Recovering") return 2;
    return 3;
  };

  const healthLogs = (chicken.healthLogs || []).sort((a: any, b: any) => {
    const priorityDiff = getPriority(a) - getPriority(b);
    if (priorityDiff !== 0) return priorityDiff;
    return b.id - a.id;
  });

  // ==========================
  // SECTION 10: DATA UPDATE FUNCTIONS
  // Critical: updates local + global + DB
  // ==========================
  const updateChicken = (updated: any) => {
    setChicken(updated);
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setSelectedChicken(updated);
    saveChickenToDB(updated);
  };

  const saveChickenInfo = () => {
    updateChicken({ ...chicken, ...editForm });
    setEditingChicken(false);
  };

  const saveHealth = () => {
    if (!healthForm.date) return;

    if (editingId) {
      updateChicken({
        ...chicken,
        healthLogs: healthLogs.map((l: any) =>
          l.id === editingId ? { ...l, ...healthForm } : l
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

    setHealthForm({ date: "", status: "Healthy", symptoms: "" });
    setShowHealthForm(false);
    setEditingId(null);
    setViewLog(null);
  };

  // ==========================
  // SECTION 11: UI HELPERS (COLORS)
  // ==========================
  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
  };

  // ==========================
  // SECTION 12: GLOBAL STYLES
  // ==========================
  const card = {
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "none",
    padding: 16,
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    marginBottom: 16,
  };

  const btn = {
    width: "100%",
    minHeight: 44,
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  };

  const input = {
    width: "100%",
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  };

  const sectionTitle = {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    color: "#374151",
  };

  // ==========================
  // SECTION 13: NOTES COMPONENT
  // ==========================
  const NotesSection = () => {
    ...
  };

  // ==========================
  // SECTION 14: MAIN UI RETURN
  // ==========================
  return (
    <div style={{
      maxWidth: 480,
      margin: "0 auto",
      padding: 16,
      minHeight: "100vh"
}}>
  {/* ========================== */}
          SECTION 15: PROFILE CARD
      ========================== */}
      
      {/* ==========================
          SECTION 16: NOTES POPUP
      ========================== */}

      {/* ==========================
          SECTION 17: PHOTO GRID
      ========================== */}

      {/* ==========================
          SECTION 18: IMAGE VIEWER (FULLSCREEN)
      ========================== */}

      {/* ==========================
          SECTION 19: HEALTH LOGS
      ========================== */}

      {/* ==========================
          SECTION 20: HEALTH POPUP
      ========================== */}

    </div>
  );
}