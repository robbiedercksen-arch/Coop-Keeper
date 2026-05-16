import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function FarmPlanning() {

  const [planTitle, setPlanTitle] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [planPriority, setPlanPriority] = useState("Medium");
  const [editingId, setEditingId] = useState<number | null>(null);

const [planDueDate, setPlanDueDate] = useState("");

const [planCategory, setPlanCategory] =
  useState("General");

  const [plans, setPlans] = useState<any[]>([]);
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

  const addPlan = async () => {

  if (!planTitle.trim()) return;

  // EDIT EXISTING
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

    setEditingId(null);

  } else {

    // ADD NEW
    const { error } = await supabase
      .from("farm_plans")
      .insert([
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

  setPlanTitle("");
  setPlanDescription("");
  setPlanPriority("Medium");
  setPlanDueDate("");
  setPlanCategory("General");

  loadPlans();
};

const toggleComplete = async (plan: any) => {

  const { error } = await supabase
    .from("farm_plans")
    .update({
      completed: !plan.completed,
    })
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
    .update({
      archived: true,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  loadPlans();
};

const deletePlan = async (id: number) => {

  const { error } = await supabase
    .from("farm_plans")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  loadPlans();
};

const editPlan = (plan: any) => {

  setPlanTitle(plan.title);
  setPlanDescription(plan.description);
  setPlanPriority(plan.priority);
setPlanDueDate(plan.due_date || "");
  setPlanCategory(plan.category || "General");

  setEditingId(plan.id);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

  return (
    <div className="max-w-3xl mx-auto p-4">

      <h1 className="text-3xl font-bold mb-2">
        📋 Farm Planning
      </h1>

      <p className="text-gray-500 mb-6">
        Future farming plans, upgrades and ideas.
      </p>

      {/* TITLE */}
      <input
        type="text"
        placeholder="Plan title..."
        value={planTitle}
        onChange={(e) => setPlanTitle(e.target.value)}
        className="
          w-full
          border
          rounded-xl
          p-3
          mb-3
        "
      />

      {/* DESCRIPTION */}
      <textarea
        placeholder="Describe the plan..."
        value={planDescription}
        onChange={(e) =>
          setPlanDescription(e.target.value)
        }
        className="
          w-full
          border
          rounded-xl
          p-3
          mb-3
          min-h-[120px]
        "
      />

      {/* PRIORITY */}
      <select
        value={planPriority}
        onChange={(e) =>
          setPlanPriority(e.target.value)
        }
        className="
          w-full
          border
          rounded-xl
          p-3
          mb-4
        "
      >
        <option value="Low">
          🟢 Low Priority
        </option>

        <option value="Medium">
          🟡 Medium Priority
        </option>

        <option value="High">
          🔴 High Priority
        </option>
      </select>
      {/* CATEGORY */}
<select
  value={planCategory}
  onChange={(e) =>
    setPlanCategory(e.target.value)
  }
  className="
    w-full
    border
    rounded-xl
    p-3
    mb-3
  "
>
  <option value="General">
    📁 General
  </option>

  <option value="Coop">
    🐔 Coop
  </option>

  <option value="Breeding">
    🥚 Breeding
  </option>

  <option value="Feed">
    🌾 Feed
  </option>

  <option value="Construction">
    🔨 Construction
  </option>

  <option value="Health">
    💊 Health
  </option>
</select>

{/* DUE DATE */}
<input
  type="date"
  value={planDueDate}
  onChange={(e) =>
    setPlanDueDate(e.target.value)
  }
  className="
    w-full
    border
    rounded-xl
    p-3
    mb-4
  "
/>

      {/* ADD BUTTON */}
      <button
        onClick={addPlan}
        className="
          w-full
          bg-green-600
          text-white
          p-3
          rounded-xl
          font-semibold
          mb-6
        "
      >
        {editingId ? "Save Changes" : "+ Add Plan"}
      </button>

      {/* PLANS */}
      <div className="flex flex-col gap-3">

{plans
  .filter((plan) => !plan.archived)
  .map((plan) => (

          <div
            key={plan.id}
            className="
              bg-white
              rounded-2xl
              p-4
              shadow-sm
              border
            "
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
        className={`
          font-bold
          text-lg
          ${
            plan.completed
              ? "line-through text-gray-400"
              : ""
          }
        `}
      >
        {plan.title}
      </div>

    </div>

    <div
      className={`
        mt-1
        ${
          plan.completed
            ? "text-gray-400"
            : "text-gray-600"
        }
      `}
    >
      {plan.description}
    </div>

    {/* CATEGORY + DUE DATE */}
    <div className="flex gap-2 mt-3 flex-wrap">

      <div className="
        bg-blue-100
        text-blue-700
        text-xs
        px-3
        py-1
        rounded-full
      ">
        📁 {plan.category}
      </div>

      {plan.due_date && (
        <div className="
          bg-gray-100
          text-gray-700
          text-xs
          px-3
          py-1
          rounded-full
        ">
          📅 {plan.due_date}
        </div>
      )}

    </div>

    {/* ACTION BUTTONS */}
    <div className="flex gap-2 mt-4 flex-wrap">

      <button
        onClick={() => editPlan(plan)}
        className="
          bg-yellow-500
          text-white
          px-3
          py-2
          rounded-xl
          text-sm
        "
      >
        ✏ Edit
      </button>

      <button
        onClick={() => archivePlan(plan.id)}
        className="
          bg-blue-500
          text-white
          px-3
          py-2
          rounded-xl
          text-sm
        "
      >
        📦 Archive
      </button>

      <button
        onClick={() => deletePlan(plan.id)}
        className="
          bg-red-500
          text-white
          px-3
          py-2
          rounded-xl
          text-sm
        "
      >
        🗑 Delete
      </button>

    </div>

  </div>

  <div
    className={`
      px-3
      py-1
      rounded-full
      text-xs
      font-semibold
      whitespace-nowrap
      ${
        plan.priority === "High"
          ? "bg-red-100 text-red-700"
          : plan.priority === "Medium"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-green-100 text-green-700"
      }
    `}
  >
    {plan.priority}
  </div>

</div>

          </div>

        ))}

      </div>

    </div>
  );
}