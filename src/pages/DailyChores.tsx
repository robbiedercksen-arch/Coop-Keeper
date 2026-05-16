import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function DailyChores() {

  const [choreText, setChoreText] = useState("");

  const [chores, setChores] = useState<any[]>([]);
  useEffect(() => {
  loadChores();
}, []);

const loadChores = async () => {

  const { data, error } = await supabase
    .from("daily_chores")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setChores(data || []);
};

    // ADD CHORE
  const addChore = async () => {

  if (!choreText.trim()) return;

  const { error } = await supabase
    .from("daily_chores")
    .insert([
      {
        title: choreText,
        completed: false,
      },
    ]);

  if (error) {
    console.error(error);
    return;
  }

  setChoreText("");

  loadChores();
};

      // TOGGLE COMPLETE
const toggleComplete = async (chore: any) => {

  const { error } = await supabase
    .from("daily_chores")
    .update({
      completed: !chore.completed,
      last_completed_date: new Date()
        .toISOString()
        .split("T")[0],
    })
    .eq("id", chore.id);

  if (error) {
    console.error(error);
    return;
  }

  loadChores();
};

// DELETE CHORE
const deleteChore = async (id: number) => {

  const { error } = await supabase
    .from("daily_chores")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  loadChores();
};

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >

      {/* ADD CARD */}
      <div
        style={{
          background: "#fff",
          padding: 20,
          borderRadius: 18,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <h2 style={{ margin: 0 }}>
          ✅ Daily Chores
        </h2>

        <input
          placeholder="Enter daily chore..."
          value={choreText}
          onChange={(e) =>
            setChoreText(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={addChore}
          style={addBtn}
        >
          + Add Daily Chore
        </button>
      </div>

      {/* CHORE LIST */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >

        {chores.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#6b7280",
              padding: 20,
            }}
          >
            No daily chores yet.
          </div>
        )}

        {chores.map((chore) => (
          

          <div
            key={chore.id}
            style={{
              background: "#fff",
              padding: 18,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >

            {/* LEFT SIDE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                flex: 1,
              }}
            >

              <input
  type="checkbox"
  checked={chore.completed}
  onChange={() =>
    toggleComplete(chore)
  }
  style={{
    width: 22,
    height: 22,
    cursor: "pointer",
  }}
/>

              <div
                style={{
                  fontWeight: 600,
                  textDecoration: chore.completed
                    ? "line-through"
                    : "none",

                  opacity: chore.completed
                    ? 0.5
                    : 1,
                }}
              >
                {chore.title}
              </div>

            </div>

            {/* DELETE */}
            <button
              onClick={() =>
                deleteChore(chore.id)
              }
              style={deleteBtn}
            >
              🗑
            </button>

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

const addBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "14px",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
};