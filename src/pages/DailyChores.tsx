import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import CoopPageBanner from "../components/CoopPageBanner";

const cardClass =
  "rounded-3xl p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]";

const statClass =
  "rounded-2xl p-4 text-center bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)]";

export default function DailyChores() {
  const [choreText, setChoreText] = useState("");
  const [chores, setChores] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadChores();
  }, []);

  const totalTasks = chores.length;
  const completedTasks = chores.filter((chore) => chore.completed).length;
  const pendingTasks = chores.filter((chore) => !chore.completed).length;

  const loadChores = async () => {
    const { data, error } = await supabase
      .from("daily_chores")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const choresToReset = (data || []).filter(
      (chore) =>
        chore.completed &&
        chore.last_completed_date &&
        chore.last_completed_date !== today
    );

    for (const chore of choresToReset) {
      await supabase
        .from("daily_chores")
        .update({ completed: false })
        .eq("id", chore.id);
    }

    const { data: refreshedData } = await supabase
      .from("daily_chores")
      .select("*")
      .order("id", { ascending: false });

    setChores(refreshedData || []);
  };

  const addChore = async () => {
    if (!choreText.trim()) return;

    const { error } = await supabase.from("daily_chores").insert([
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
    setShowForm(false);
    loadChores();
  };

  const toggleComplete = async (chore: any) => {
    const newCompletedState = !chore.completed;

    const { error } = await supabase
      .from("daily_chores")
      .update({
        completed: newCompletedState,
        last_completed_date: newCompletedState
          ? new Date().toISOString().split("T")[0]
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
    <div className="w-full max-w-6xl mx-auto space-y-4 px-3 sm:px-4 overflow-hidden">
      <CoopPageBanner
        eyebrow="TASK MANAGER"
        title="Daily Chores"
        subtitle="Track recurring farm tasks and daily routines."
        stats={[
          { label: "Tasks", value: totalTasks },
          { label: "Done", value: completedTasks },
          { label: "Pending", value: pendingTasks },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={statClass}>
          <div className="text-3xl font-bold">{totalTasks}</div>
          <div className="text-sm text-[#4b3a1d]">Qty Tasks</div>
        </div>

        <div className={statClass}>
          <div className="text-3xl font-bold">{completedTasks}</div>
          <div className="text-sm text-[#4b3a1d]">Qty Done</div>
        </div>

        <div className={statClass}>
          <div className="text-3xl font-bold">{pendingTasks}</div>
          <div className="text-sm text-[#4b3a1d]">Qty Pending</div>
        </div>
      </div>

      <div className={cardClass}>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-[#022312] text-[#f7d37b] rounded-2xl p-4 font-bold"
          >
            + Add Daily Chores
          </button>
        ) : (
          <>
            <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
              ✅ Add Daily Chore
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[#4b3a1d] font-bold mb-1">
                  Enter New Daily Chore (Repeatable Chore)
                </label>

                <input
                  placeholder="Enter daily chore..."
                  value={choreText}
                  onChange={(e) => setChoreText(e.target.value)}
                  className="border border-[#d9a441] rounded-2xl p-3 bg-white w-full"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addChore}
                  className="bg-[#022312] text-[#f7d37b] rounded-2xl p-4 font-bold"
                >
                  + Add Daily Chore
                </button>

                <button
                  onClick={() => {
                    setShowForm(false);
                    setChoreText("");
                  }}
                  className="bg-gray-500 text-white rounded-2xl p-4 font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className={cardClass}>
        <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
          📋 Chore List
        </h2>

        {chores.length === 0 && (
          <div className="text-[#6b5a3a] text-sm">No daily chores yet.</div>
        )}

        <div className="flex flex-col gap-3">
          {chores.map((chore) => (
            <div
              key={chore.id}
              className="rounded-2xl p-4 bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.12)] flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={chore.completed}
                  onChange={() => toggleComplete(chore)}
                  className="w-6 h-6 cursor-pointer"
                />

                <div
                  className={`font-extrabold ${
                    chore.completed
                      ? "line-through opacity-50 text-[#6b5a3a]"
                      : "text-[#3d2a10]"
                  }`}
                >
                  {chore.title}
                </div>
              </div>

              <button
                onClick={() => deleteChore(chore.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}