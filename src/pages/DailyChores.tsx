import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function DailyChores() {
  const [choreText, setChoreText] = useState("");
  const [chores, setChores] = useState<any[]>([]);

  useEffect(() => {
    loadChores();
  }, []);

  const totalTasks = chores.length;

  const completedTasks =
    chores.filter((chore) => chore.completed).length;

  const pendingTasks =
    chores.filter((chore) => !chore.completed).length;

  const loadChores = async () => {
    const { data, error } = await supabase
      .from("daily_chores")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    const choresToReset =
      (data || []).filter(
        (chore) =>
          chore.completed &&
          chore.last_completed_date &&
          chore.last_completed_date !== today
      );

    for (const chore of choresToReset) {
      await supabase
        .from("daily_chores")
        .update({
          completed: false,
        })
        .eq("id", chore.id);
    }

    const { data: refreshedData } =
      await supabase
        .from("daily_chores")
        .select("*")
        .order("id", { ascending: false });

    setChores(refreshedData || []);
  };

  const addChore = async () => {
    if (!choreText.trim()) return;

    const { error } = await supabase
      .from("daily_chores")
      .insert([
        {
          title: choreText,
          completed: false,
          last_completed_date: null,
        },
      ]);

    if (error) {
      console.error(error);
      return;
    }

    setChoreText("");
    loadChores();
  };

  const toggleComplete = async (chore: any) => {
    const newCompletedState =
      !chore.completed;

    const { error } = await supabase
      .from("daily_chores")
      .update({
        completed: newCompletedState,
        last_completed_date:
          newCompletedState
            ? new Date()
                .toISOString()
                .split("T")[0]
            : null,
      })
      .eq("id", chore.id);

    if (error) {
      console.error(error);
      return;
    }

    loadChores();
  };

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
            TASK MANAGER
          </div>

          <h1 className="text-4xl font-bold mb-2">
            Daily Chores
          </h1>

          <div className="text-white/90">
            Track recurring farm tasks and daily routines.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">

          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[110px]">
            <div className="text-3xl font-bold">
              {totalTasks}
            </div>

            <div className="text-[10px] tracking-widest">
              TASKS
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[110px]">
            <div className="text-3xl font-bold">
              {completedTasks}
            </div>

            <div className="text-[10px] tracking-widest">
              DONE
            </div>
          </div>

          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[110px]">
            <div className="text-3xl font-bold">
              {pendingTasks}
            </div>

            <div className="text-[10px] tracking-widest">
              PENDING
            </div>
          </div>

        </div>

      </div>

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