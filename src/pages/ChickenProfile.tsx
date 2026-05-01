// ONLY showing the changed section to keep it readable

{/* PHOTO GRID */}
<div style={card}>
  <div style={sectionTitle}>📸 Photo Album</div>

  <label style={{ ...btn, background: "#22c55e", color: "#fff" }}>
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

  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
    marginTop: 10
  }}>
    {(chicken.album || []).map((img: any, i: number) => (
      <div key={i} style={{ position: "relative" }}>

        <img
          src={img}
          onClick={() => setActiveImage(img)}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            objectFit: "cover",
            borderRadius: 10,
            cursor: "pointer"
          }}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            updateChicken({
              ...chicken,
              album: chicken.album.filter((_: any, index: number) => index !== i),
            });
          }}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 22,
            height: 22,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ✕
        </button>

      </div>
    ))}
  </div>
</div>