import CoopPageBanner from "../components/CoopPageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const cardClass =
  "rounded-3xl p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]";

const statClass =
  "rounded-2xl p-4 text-center bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)]";

export default function FarmPlanning() {
  const [planTitle, setPlanTitle] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planPriority, setPlanPriority] = useState("Medium");
  const [planDueDate, setPlanDueDate] = useState("");
  const [planCategory, setPlanCategory] = useState("General");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [plans, setPlans] = useState<any[]>([]);
  const [planFilter, setPlanFilter] = useState("active");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from("farm_plans")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setPlans(data || []);
  };

  const activePlans = plans.filter(
    (plan) => !plan.archived && !plan.completed
  );

  const completedPlans = plans.filter(
    (plan) => !plan.archived && plan.completed
  );

  const highPriorityPlans = activePlans.filter(
    (plan) => plan.priority === "High"
  );

  const visiblePlans =
    planFilter === "active" ? activePlans : completedPlans;

  const resetForm = () => {
    setPlanTitle("");
    setPlanDescription("");
    setPlanPriority("Medium");
    setPlanDueDate("");
    setPlanCategory("General");
    setEditingId(null);
    setShowForm(false);
  };

  const addPlan = async () => {
    if (!planTitle.trim()) return;

    if (editingId) {
      const { error } = await supabase
        .from("farm_plans")
        .update({
          title: planTitle,
          description: planDescription,
          priority: planPriority,
          due_date: planDueDate,
          category: planCategory,
        })
        .eq("id", editingId);

      if (error) {
        console.error(error);
        return;
      }
    } else {
      const { error } = await supabase.from("farm_plans").insert([
        {
          title: planTitle,
          description: planDescription,
          priority: planPriority,
          due_date: planDueDate,
          category: planCategory,
          completed: false,
          archived: false,
        },
      ]);

      if (error) {
        console.error(error);
        return;
      }
    }

    resetForm();
    loadPlans();
  };

  const toggleComplete = async (plan: any) => {
    const { error } = await supabase
      .from("farm_plans")
      .update({ completed: !plan.completed })
      .eq("id", plan.id);

    if (error) {
      console.error(error);
      return;
    }

    loadPlans();
  };

  const archivePlan = async (id: number) => {
    const { error } = await supabase
      .from("farm_plans")
      .update({ archived: true })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadPlans();
  };

  const deletePlan = async (id: number) => {
    const { error } = await supabase.from("farm_plans").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadPlans();
  };

  const editPlan = (plan: any) => {
    setPlanTitle(plan.title || "");
    setPlanDescription(plan.description || "");
    setPlanPriority(plan.priority || "Medium");
    setPlanDueDate(plan.due_date || "");
    setPlanCategory(plan.category || "General");
    setEditingId(plan.id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 px-1">
      <CoopPageBanner
        eyebrow="FARM MANAGEMENT"
        title="Farm Planning"
        subtitle="Organize future upgrades, projects and farming goals."
        stats={[
          { label: "Future Plans", value: activePlans.length },
          { label: "Completed", value: completedPlans.length },
          { label: "High Priority", value: highPriorityPlans.length },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={statClass}>
          <div className="text-3xl font-bold">{activePlans.length}</div>
          <div className="text-sm text-[#4b3a1d]">Future Plans</div>
        </div>

        <div className={statClass}>
          <div className="text-3xl font-bold">{completedPlans.length}</div>
          <div className="text-sm text-[#4b3a1d]">Completed Plans</div>
        </div>

        <div className={statClass}>
          <div className="text-3xl font-bold">{highPriorityPlans.length}</div>
          <div className="text-sm text-[#4b3a1d]">High Priority</div>
        </div>
      </div>

      <div className={cardClass}>
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(true);
          }}
          className="w-full bg-[#022312] text-[#f7d37b] rounded-2xl px-5 py-4 font-extrabold shadow-md"
        >
          ➕ Add Farm Plan
        </button>
      </div>

      <div className={cardClass}>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPlanFilter("active")}
            className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
              planFilter === "active"
                ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md"
                : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"
            }`}
          >
            Future Farm Plans
          </button>

          <button
            onClick={() => setPlanFilter("completed")}
            className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
              planFilter === "completed"
                ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md"
                : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"
            }`}
          >
            Completed Farm Plans
          </button>
        </div>
      </div>

      {showForm && (
        <div className={cardClass}>
          <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
            📋 {editingId ? "Edit Farm Plan" : "New Farm Plan"}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-[#4b3a1d] font-bold mb-1">
                Plan Title
              </label>

              <input
                type="text"
                placeholder="Plan title..."
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white w-full"
              />
            </div>

            <div>
              <label className="block text-[#4b3a1d] font-bold mb-1">
                Describe Your Plan
              </label>

              <textarea
                placeholder="Describe the plan..."
                value={planDescription}
                onChange={(e) => setPlanDescription(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white min-h-[120px] w-full"
              />
            </div>

            <div>
              <label className="block text-[#4b3a1d] font-bold mb-1">
                Select Plan Priority
              </label>

              <select
                value={planPriority}
                onChange={(e) => setPlanPriority(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white w-full"
              >
                <option value="Low">🟢 Low Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="High">🔴 High Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-[#4b3a1d] font-bold mb-1">
                Choose Plan Category
              </label>

              <select
                value={planCategory}
                onChange={(e) => setPlanCategory(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white w-full"
              >
                <option value="General">📁 General</option>
                <option value="Coop">🐔 Coop</option>
                <option value="Breeding">🥚 Breeding</option>
                <option value="Feed">🌾 Feed</option>
                <option value="Construction">🔨 Construction</option>
                <option value="Health">💊 Health</option>
              </select>
            </div>

            <div>
              <label className="block text-[#4b3a1d] font-bold mb-1">
                Estimated Planning Date
              </label>

              <input
                type="date"
                value={planDueDate}
                onChange={(e) => setPlanDueDate(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={addPlan}
              className="bg-[#022312] text-[#f7d37b] px-5 py-3 rounded-xl font-bold"
            >
              {editingId ? "Save Changes" : "+ Add Plan"}
            </button>

            <button
              onClick={resetForm}
              className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={cardClass}>
        <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
          {planFilter === "active"
            ? "📋 Future Farm Plans"
            : "✅ Completed Farm Plans"}
        </h2>

        {visiblePlans.length === 0 && (
          <div className="text-[#6b5a3a] text-sm text-center">
            {planFilter === "active"
              ? "No future farm plans yet."
              : "No completed farm plans yet."}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {visiblePlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl p-4 bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.12)]"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={plan.completed}
                      onChange={() => toggleComplete(plan)}
                      className="w-5 h-5"
                    />

                    <div
                      className={`font-extrabold text-lg ${
                        plan.completed
                          ? "line-through text-[#6b5a3a]/60"
                          : "text-[#3d2a10]"
                      }`}
                    >
                      {plan.title}
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-[#4b3a1d]">
                    {plan.description || "No description added."}
                  </div>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <div className="bg-[#022312]/90 text-[#f7d37b] text-xs px-3 py-1 rounded-full font-bold">
                      📁 {plan.category || "General"}
                    </div>

                    {plan.due_date && (
                      <div className="bg-white/60 text-[#4b3a1d] border border-[#d9a441] text-xs px-3 py-1 rounded-full font-bold">
                        📅 Estimated Rollout: {plan.due_date}
                      </div>
                    )}

                    {plan.completed && (
                      <div className="bg-green-700 text-white text-xs px-3 py-1 rounded-full font-bold">
                        ✅ Completed
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button
                      onClick={() => editPlan(plan)}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      ✏ Edit
                    </button>

                    <button
                      onClick={() => archivePlan(plan.id)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      📦 Archive
                    </button>

                    <button
                      onClick={() => deletePlan(plan.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded-xl text-sm font-bold"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    plan.priority === "High"
                      ? "bg-red-700 text-white"
                      : plan.priority === "Medium"
                      ? "bg-yellow-500 text-white"
                      : "bg-green-700 text-white"
                  }`}
                >
                  {plan.priority}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}