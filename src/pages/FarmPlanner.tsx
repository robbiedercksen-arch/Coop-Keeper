import { useEffect, useState } from "react";

export default function FarmPlanner() {

  const [dailyChores, setDailyChores] = useState<any[]>([]);
  const [newChore, setNewChore] = useState("");

  // LOAD + RESET DAILY
  useEffect(() => {

    const stored = JSON.parse(
      localStorage.getItem("dailyChores") || "[]"
    );

    const today = new Date().toDateString();

    const resetChores = stored.map((chore: any) => ({
      ...chore,
      completed:
        chore.lastCompletedDate === today
          ? chore.completed
          : false,
    }));

    setDailyChores(resetChores);

  }, []);

  // ADD CHORE
  const addDailyChore = () => {

    if (!newChore.trim()) return;

    const updated = [
      ...dailyChores,
      {
        id: Date.now(),
        text: newChore,
        completed: false,
        lastCompletedDate: "",
      },
    ];

    setDailyChores(updated);

    localStorage.setItem(
      "dailyChores",
      JSON.stringify(updated)
    );

    setNewChore("");

  };

  // TOGGLE COMPLETE
  const toggleChore = (id: number) => {

    const today = new Date().toDateString();

    const updated = dailyChores.map((chore) =>
      chore.id === id
        ? {
            ...chore,
            completed: !chore.completed,
            lastCompletedDate: today,
          }
        : chore
    );

    setDailyChores(updated);

    localStorage.setItem(
      "dailyChores",
      JSON.stringify(updated)
    );

  };

  // DELETE CHORE
  const deleteChore = (id: number) => {

    const updated = dailyChores.filter(
      (chore) => chore.id !== id
    );

    setDailyChores(updated);

    localStorage.setItem(
      "dailyChores",
      JSON.stringify(updated)
    );

  };

  // COMPLETED COUNT
  const completedCount = dailyChores.filter(
    (c) => c.completed
  ).length;

  return (

    <div className="max-w-5xl mx-auto p-4 flex flex-col gap-6">

      {/* HEADER */}
      <div
        className="
          bg-green-700
          text-white
          rounded-3xl
          p-8
          flex
          justify-between
          items-center
        "
      >

        <div>

          <div className="uppercase text-xs tracking-widest opacity-70">
            Planner
          </div>

          <h1 className="text-4xl font-bold">
            Farm Planner
          </h1>

          <p className="opacity-80 mt-2">
            Plans, upgrades and daily routines
          </p>

        </div>

        <div
          className="
            bg-white/20
            rounded-2xl
            px-6
            py-4
            text-center
          "
        >

          <div className="text-4xl font-bold">
            {completedCount}/{dailyChores.length}
          </div>

          <div className="text-xs uppercase tracking-widest">
            Done Today
          </div>

        </div>

      </div>

      {/* DAILY CHORES */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">

        <h2 className="text-2xl font-bold mb-2">
          Daily Chores
        </h2>

        <p className="text-gray-500 mb-5">
          Recurring tasks that reset every day.
          Check them off as you go.
        </p>

        {/* INPUT */}
        <div className="flex gap-3">

          <input
            value={newChore}
            onChange={(e) =>
              setNewChore(e.target.value)
            }
            placeholder="e.g. Collect eggs"
            className="
              flex-1
              border
              rounded-2xl
              px-5
              py-4
            "
          />

          <button
            onClick={addDailyChore}
            className="
              bg-green-700
              text-white
              px-6
              rounded-2xl
              font-semibold
            "
          >
            + Add
          </button>

        </div>

      </div>

      {/* CHORE LIST */}
      <div className="flex flex-col gap-4">

        {dailyChores.map((chore) => (

          <div
            key={chore.id}
            className="
              bg-white
              rounded-3xl
              p-5
              flex
              justify-between
              items-center
              shadow-sm
            "
          >

            <div className="flex items-center gap-4">

              <input
                type="checkbox"
                checked={chore.completed}
                onChange={() =>
                  toggleChore(chore.id)
                }
                className="w-6 h-6"
              />

              <span
                className={
                  chore.completed
                    ? "line-through text-gray-400"
                    : "font-medium"
                }
              >
                {chore.text}
              </span>

            </div>

            <button
              onClick={() =>
                deleteChore(chore.id)
              }
              className="text-gray-400 hover:text-red-500"
            >
              🗑
            </button>

          </div>

        ))}

      </div>

    </div>

  );
}