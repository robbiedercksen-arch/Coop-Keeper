import { useState } from "react";

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

  const album = selectedChicken.album || [];

  // ================= UPDATE =================
  const updateChicken = (updated: any) => {
    setChickens((prev: any[]) =>
      prev.map((c) => (c.id === selectedChicken.id ? updated : c))
    );
    setSelectedChicken(updated);
  };

  // ================= STYLES =================
  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #ddd",
    marginBottom: 20,
  };

  return (
    <div style={{ padding: 20 }}>

      {/* BACK */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate("registry")}>
          ← Back to Registry
        </button>
      </div>

      {/* PROFILE */}
      <div style={card}>
        <h1>{selectedChicken.name}</h1>

        <div>ID Tag: {selectedChicken.idTag}</div>
        <div>Breed: {selectedChicken.breed}</div>
        <div>Sex: {selectedChicken.sex}</div>
        <div>Age: {selectedChicken.ageGroup}</div>

        <img
          src={selectedChicken.image}
          style={{
            width: 150,
            marginTop: 10,
            borderRadius: 8,
          }}
        />
      </div>

      {/* ================= PHOTO ALBUM ================= */}
      <div style={card}>
        <h3>📸 Photo Album</h3>

        <label>
          <button>+ Add Photos</button>
          <input
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e: any) => {
              const files = Array.from(e.target.files);

              files.forEach((file: any) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  updateChicken({
                    ...selectedChicken,
                    album: [...album, reader.result],
                  });
                };
                reader.readAsDataURL(file);
              });
            }}
          />
        </label>

        {/* IMAGES */}
        <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
          {album.map((img: any, i: number) => (
            <div key={i} style={{ position: "relative" }}>
              <img
                src={img}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />

              {/* DELETE */}
              <button
                onClick={() => {
                  const updated = album.filter((_: any, index: number) => index !== i);
                  updateChicken({ ...selectedChicken, album: updated });
                }}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}