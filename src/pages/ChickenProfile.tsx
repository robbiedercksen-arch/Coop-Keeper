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
  // SECTION 5: SWIPE DETECTION
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
  // ==========================
  useEffect(() => setChicken(selectedChicken), [selectedChicken]);

  // ==========================
  // SECTION 7: GLOBAL UI STATE
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
  // SECTION 9: HEALTH LOG SORTING
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
  // SECTION 10: UPDATE FUNCTIONS
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
  // SECTION 11: UI HELPERS
  // ==========================
  const getColor = (status: string) => {
    if (status === "Healthy") return "#22c55e";
    if (status === "Sick") return "#ef4444";
    return "#eab308";
  };

  // ==========================
  // SECTION 12: STYLES
  // ==========================
  const card = { padding: 16, borderRadius: 16 };
  const btn = { width: "100%" };
  const input = { width: "100%" };
  const sectionTitle = { fontWeight: 700 };

  // ==========================
  // SECTION 13: NOTES COMPONENT (FIXED)
  // ==========================
  const NotesSection = () => {
    return (
      <div style={card}>
        <div style={sectionTitle}>Notes Section Placeholder</div>
      </div>
    );
  };

  // ==========================
  // SECTION 14: MAIN UI
  // ==========================
  return (
    <div style={{
      maxWidth: 480,
      margin: "0 auto",
      padding: 16,
      minHeight: "100vh"
    }}>
      
      {/* SECTION 15: PROFILE */}
      {/* SECTION 16: NOTES */}
      {/* SECTION 17: PHOTO GRID */}
      {/* SECTION 18: IMAGE VIEWER */}
      {/* SECTION 19: HEALTH LOGS */}
      {/* SECTION 20: HEALTH POPUP */}

      <NotesSection />

    </div>
  );
}