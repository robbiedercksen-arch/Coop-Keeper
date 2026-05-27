import PageBanner from "./PageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
export default function Dashboard({ chickens }: any) {
const [expenses, setExpenses] =
  useState<any[]>([]);
const [eggLogs, setEggLogs] = useState<any[]>([]);
const [chores, setChores] = useState<any[]>([]);
const [plans, setPlans] = useState<any[]>([]);
const [incubators, setIncubators] = useState<any[]>([]);  
const total = chickens.length;
const [wishlistItems, setWishlistItems] =
  useState<any[]>([]);
const totalWishlistItems =
  wishlistItems.length;

const totalWishlistCost =
  wishlistItems.reduce(
    (sum, item) =>
      sum + Number(item.total_cost),
    0
  );

  const totalEggs =
  eggLogs.reduce(
    (sum, log) => sum + log.eggs,
    0
  );

const currentDate = new Date();

const currentMonthEggs =
  eggLogs.filter((log) => {

    const logDate = new Date(log.date);

    return (
      logDate.getMonth() ===
        currentDate.getMonth() &&
      logDate.getFullYear() ===
        currentDate.getFullYear()
    );
  })
  .reduce(
    (sum, log) => sum + log.eggs,
    0
  );

const oneWeekAgo = new Date();

oneWeekAgo.setDate(
  currentDate.getDate() - 7
);

const currentWeekEggs =
  eggLogs.filter((log) => {

    const logDate = new Date(log.date);

    return logDate >= oneWeekAgo;
  })
  .reduce(
    (sum, log) => sum + log.eggs,
    0
  );

const repeatedTasks =
  chores.filter(
    (c) => c.repeat_daily
  ).length;

const pendingTasks =
  chores.filter(
    (c) => !c.completed
  ).length;

const completedTasks =
  chores.filter(
    (c) => c.completed
  ).length;

const activePlans =
  plans.filter(
    (p) => !p.completed
  );

const completedPlans =
  plans.filter(
    (p) => p.completed
  );

  const currentMonth =
  currentDate.getMonth();

const currentYear =
  currentDate.getFullYear();

const currentMonthExpenses =
  expenses.filter((expense: any) => {

    const expenseDate =
      new Date(expense.expense_date);

    return (
      expenseDate.getMonth() ===
        currentMonth &&
      expenseDate.getFullYear() ===
        currentYear
    );
  });

const monthlyExpenseTotal =
  currentMonthExpenses.reduce(
    (sum: number, expense: any) =>
      sum + Number(expense.amount),
    0
  );

const yearlyExpenseTotal =
  expenses
    .filter((expense: any) => {

      const expenseDate =
        new Date(expense.expense_date);

      return (
        expenseDate.getFullYear() ===
        currentYear
      );
    })
    .reduce(
      (sum: number, expense: any) =>
        sum + Number(expense.amount),
      0
    );

const categoryTotals: any = {};

expenses.forEach((expense: any) => {

  if (!categoryTotals[expense.category]) {
    categoryTotals[expense.category] = 0;
  }

  categoryTotals[expense.category] +=
    Number(expense.amount);

});

const topCategories =
  Object.entries(categoryTotals)
    .sort(
      (a: any, b: any) => b[1] - a[1]
    )
    .slice(0, 5);

const monthlyPurchases: any = {};

expenses.forEach((expense: any) => {

  const date =
    new Date(expense.expense_date);

  const monthName =
    date.toLocaleString("default", {
      month: "short",
    });

  if (!monthlyPurchases[monthName]) {

    monthlyPurchases[monthName] = {
      qty: 0,
      total: 0,
    };
  }

  monthlyPurchases[monthName].qty += 1;

  monthlyPurchases[monthName].total +=
    Number(expense.amount);

});


  let ongoing = 0;
  let monitoring = 0;
  let healthy = 0;

  chickens.forEach((chicken: any) => {
    const logs = chicken.healthLogs || [];

    const hasOngoing = logs.some((log: any) => log.status === "Ongoing");
    const hasMonitoring = logs.some((log: any) => log.status === "Monitoring");

    if (hasOngoing) ongoing++;
    else if (hasMonitoring) monitoring++;
    else healthy++;
  });
useEffect(() => {
  loadDashboardData();
}, []);

const loadDashboardData = async () => {

  // EGGS
  const { data: eggData } = await supabase
    .from("egg_logs")
    .select("*");

  setEggLogs(eggData || []);

  // CHORES
  const { data: choreData } = await supabase
    .from("daily_chores")
    .select("*");

  setChores(choreData || []);

  // PLANS
  const { data: planData } = await supabase
    .from("farm_plans")
    .select("*");

  setPlans(planData || []);

  // INCUBATORS
  const { data: incubatorData } = await supabase
    .from("incubator_batches")
    .select("*");

  setIncubators(incubatorData || []);

    // WISHLIST
  const { data: wishlistData } = await supabase
    .from("wishlist")
    .select("*");

  setWishlistItems(wishlistData || []);

  const { data: expenseData } =
  await supabase
    .from("expenses")
    .select("*");

setExpenses(expenseData || []);
};

  return (
  <div className="max-w-6xl mx-auto space-y-4 px-1">

    <PageBanner
      eyebrow="WELCOME"
      title="Dashboard"
      subtitle="Your flock at a glance."
      stat={total}
      statLabel="CHICKENS"
    />
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

  {/* CHICKEN REGISTER */}
{/* CHICKEN REGISTER */}
<div className="
  bg-white
  rounded-3xl
  p-5
  border
  border-gray-100
  shadow-[0_6px_24px_rgba(15,23,42,0.06)]
">

  <div className="text-sm text-gray-500 mb-4">
    🐔 Chicken Register
  </div>

  <div className="grid grid-cols-3 gap-4">

    {/* TOTAL */}
    <div className="bg-gray-50 rounded-2xl p-4">

      <div className="text-3xl font-bold">
        {total}
      </div>

      <div className="text-sm text-gray-500 mt-1">
        Total Chickens
      </div>

    </div>

    {/* HENS */}
    <div className="bg-pink-50 rounded-2xl p-4">

      <div className="text-3xl font-bold">
        {
          chickens.filter(
            (c: any) =>
              c.sex === "Hen"
          ).length
        }
      </div>

      <div className="text-sm text-gray-500 mt-1">
        Hens
      </div>

    </div>

    {/* ROOSTERS */}
    <div className="bg-blue-50 rounded-2xl p-4 border border-white/50">

      <div className="text-3xl font-bold">
        {
          chickens.filter(
            (c: any) =>
              c.sex === "Rooster"
          ).length
        }
      </div>

      <div className="text-sm text-gray-500 mt-1">
        Roosters
      </div>

    </div>

  </div>

</div>

  {/* HEALTH */}
  <div className="
  bg-white
  rounded-3xl
  p-5
  border
  border-gray-100
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
">

    <div className="text-sm text-gray-500 mb-4">
      ❤️ Chicken Health Monitor
    </div>

    <div className="grid grid-cols-3 gap-4">

      <div className="bg-red-100 rounded-2xl p-3 text-center">
        <div className="text-2xl font-bold">
          {ongoing}
        </div>

        <div className="text-xs">
          Ongoing
        </div>
      </div>

      <div className="bg-yellow-100 rounded-2xl p-3 text-center">
        <div className="text-2xl font-bold">
          {monitoring}
        </div>

        <div className="text-xs">
          Monitoring
        </div>
      </div>

      <div className="bg-green-100 rounded-2xl p-3 text-center">
        <div className="text-2xl font-bold">
          {healthy}
        </div>

        <div className="text-xs">
          Healthy
        </div>
      </div>

    </div>
  </div>

  {/* EGG REGISTRY */}
<div className="
  bg-white
  rounded-3xl
  p-5
  border
  border-gray-100
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
">

  <div className="text-sm text-gray-500 mb-4">
    🥚 Egg Registry
  </div>

  <div className="grid grid-cols-3 gap-4">

    {/* TOTAL */}
    <div className="bg-amber-50 rounded-2xl p-4 text-center">

      <div className="text-3xl font-bold">
        {totalEggs}
      </div>

      <div className="text-xs mt-1">
        Total Eggs
      </div>

    </div>

    {/* MONTH */}
    <div className="bg-orange-50 rounded-2xl p-4 text-center">

      <div className="text-3xl font-bold">
        {currentMonthEggs}
      </div>

      <div className="text-xs mt-1">
        This Month
      </div>

    </div>

    {/* WEEK */}
    <div className="bg-yellow-50 rounded-2xl p-4 text-center">

      <div className="text-3xl font-bold">
        {currentWeekEggs}
      </div>

      <div className="text-xs mt-1">
        This Week
      </div>

    </div>

  </div>

</div>
  
  {/* DAILY CHORES */}
<div className="
  bg-white
  rounded-3xl
  p-5
  border
  border-gray-100
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
">

  <div className="text-sm text-gray-500 mb-4">
    ✅ Daily Chores
  </div>

  <div className="grid grid-cols-3 gap-4">

    {/* REPEATING */}
    <div className="bg-blue-50 rounded-2xl p-4 border border-white/50 border border-white/50 border border-white/50 border border-white/50 border border-white/50 border border-white/50 text-center">

      <div className="text-3xl font-bold">
        {repeatedTasks}
      </div>

      <div className="text-xs mt-1">
        Repeating
      </div>

    </div>

    {/* PENDING */}
    <div className="bg-orange-50 rounded-2xl p-4 text-center">

      <div className="text-3xl font-bold">
        {pendingTasks}
      </div>

      <div className="text-xs mt-1">
        Pending
      </div>

    </div>

    {/* COMPLETED */}
    <div className="bg-green-50 rounded-2xl p-4 text-center">

      <div className="text-3xl font-bold">
        {completedTasks}
      </div>

      <div className="text-xs mt-1">
  Completed
</div>

    </div>

  </div>

</div>

  </div>

  {/* FARM PLANNING */}
<div className="
  bg-white
  rounded-3xl
  p-5
  border
  border-gray-100
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
">

  <div className="text-sm text-gray-500 mb-4">
    📋 Farm Planning
  </div>

  {/* SUMMARY */}
  <div className="grid grid-cols-2 gap-4 mb-4">

    <div className="bg-blue-50 rounded-2xl p-4 border border-white/50 border border-white/50 border border-white/50 border border-white/50 border border-white/50 border border-white/50 text-center">

      <div className="text-3xl font-bold">
        {activePlans.length}
      </div>

      <div className="text-xs mt-1">
        Future Planned Ideas
      </div>

    </div>

    <div className="bg-green-50 rounded-2xl p-4 text-center">

      <div className="text-3xl font-bold">
        {completedPlans.length}
      </div>

      <div className="text-xs mt-1">
        Completed Planned Ideas
      </div>

    </div>

  </div>

  {/* ACTIVE PLANS */}
  <div className="flex flex-col gap-3">

    {activePlans.slice(0, 3).map((plan: any) => (

      <div
        key={plan.id}
        className="
          border
          rounded-2xl
          p-3
          bg-gray-50
        "
      >

        <div className="flex justify-between items-start mb-3">

          <div className="font-semibold">
            📌 {plan.title}
          </div>

          <div
            className={`
              text-xs
              px-2
              py-1
              rounded-full
              font-semibold
              ${
                plan.priority === "High"
                  ? "bg-red-100 text-red-600"
                  : plan.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }
            `}
          >
            {plan.priority || "Normal"}
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">

          <div>

            <div className="text-gray-400 text-xs">
              Category
            </div>

            <div className="font-medium">
              {plan.category || "-"}
            </div>

          </div>

          <div>

            <div className="text-gray-400 text-xs">
              Estimated Rollout
            </div>

            <div className="font-medium">
              {plan.due_date || "-"}
            </div>

          </div>

        </div>

      </div>

    ))}

    {activePlans.length === 0 && (

      <div className="text-sm text-gray-400">
        No future plans added yet.
      </div>

    )}

  </div>

</div>

  {/* INCUBATORS */}
<div className="
  bg-white
  rounded-3xl
  p-5
  border
  border-gray-100
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
">

  <div className="text-sm text-gray-500 mb-4">
    🐣 Incubator Registry
  </div>

  {/* TOTAL ACTIVE BATCHES */}
  <div className="mb-4">

    <div className="text-3xl font-bold">
      {incubators.length}
    </div>

    <div className="text-sm text-gray-400">
      Active Incubation Batches
    </div>

  </div>

  {/* BATCH LIST */}
  <div className="flex flex-col gap-3">

    {incubators.map((batch: any) => {

      const hatchDate =
        new Date(batch.hatchdate);

      const today =
        new Date();

      const daysLeft =
        Math.ceil(
          (
            hatchDate.getTime() -
            today.getTime()
          ) /
          (1000 * 60 * 60 * 24)
        );

      return (

        <div
  key={batch.id}
  className="
    border
    rounded-2xl
    p-2.5
    bg-gray-50
  "
>

  <div className="flex justify-between items-center mb-3">

    <div className="font-semibold">
      🥚 {batch.batchname || "Batch"}
    </div>

    <div className="text-sm font-semibold text-orange-600">
      {daysLeft > 0
        ? `${daysLeft} Days Left`
        : "Hatching Time"}
    </div>

  </div>

  <div className="grid grid-cols-3 gap-4 text-sm">

    <div>

      <div className="text-gray-400 text-xs">
        Start
      </div>

      <div className="font-medium">
        {batch.startdate || "-"}
      </div>

    </div>

    <div>

      <div className="text-gray-400 text-xs">
        Hatch
      </div>

      <div className="font-medium">
        {batch.hatchdate || "-"}
      </div>

    </div>

    <div>

      <div className="text-gray-400 text-xs">
        Eggs
      </div>

      <div className="font-medium">
        {batch.eggcount || 0}
      </div>

    </div>

  </div>

</div>

      );
    })}

    {incubators.length === 0 && (

      <div className="text-sm text-gray-400">
        No active incubation batches.
      </div>

    )}

  </div>

</div>

{/* WISHLIST */}
<div className="
  bg-white
  rounded-3xl
  p-5
  border
  border-gray-100
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
">

  <div className="text-sm text-gray-500 mb-2">
    🛒 Wishlist
  </div>

  <div className="flex justify-between items-center">

    <div>

      <div className="text-3xl font-bold">
        {totalWishlistItems}
      </div>

      <div className="text-sm text-gray-400 mt-2">
        Wishlist Items
      </div>

    </div>

    <div className="text-right">

      <div className="text-2xl font-bold text-green-700">
        R {totalWishlistCost.toFixed(2)}
      </div>

      <div className="text-sm text-gray-400 mt-2">
  Planned Cost
</div>

    </div>

  </div>

</div>

{/* EXPENSES */}
<div className="
  bg-white
  rounded-3xl
  p-5
  border
  border-gray-100
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
">

  <div className="text-sm text-gray-500 mb-4">
    💰 Expenses Overview
  </div>

  {/* SUMMARY */}
  <div className="grid grid-cols-2 gap-4 mb-4">

    <div className="bg-red-50 rounded-2xl p-4 text-center">

      <div className="text-2xl font-bold text-red-600">
        R {monthlyExpenseTotal.toFixed(2)}
      </div>

      <div className="text-xs mt-1">
        This Month
      </div>

    </div>

    <div className="bg-orange-50 rounded-2xl p-4 text-center">

      <div className="text-2xl font-bold text-orange-600">
        R {yearlyExpenseTotal.toFixed(2)}
      </div>

      <div className="text-xs mt-1">
        This Year
      </div>

    </div>

  </div>

  {/* TOP CATEGORIES */}
  <div className="mb-4">

    <div className="text-xs text-gray-400 mb-2">
      Top Expense Categories
    </div>

    <div className="flex flex-col gap-2">

      {topCategories.map(
        ([category, amount]: any) => (

          <div
            key={category}
            className="
              flex
              justify-between
              bg-gray-50
              rounded-xl
              px-3
              py-2
              text-sm
            "
          >

            <div>{category}</div>

            <div className="font-semibold">
              R {Number(amount).toFixed(2)}
            </div>

          </div>

        )
      )}

    </div>

  </div>

  {/* MONTHLY PURCHASES */}
<div>

  <div className="text-xs text-gray-400 mb-2">
    Monthly Purchases
  </div>

  <div className="flex flex-col gap-2">

    {Object.entries(monthlyPurchases).map(
      ([month, data]: any) => (

        <div
          key={month}
          className="
            flex
            justify-between
            bg-gray-50
            rounded-xl
            px-3
            py-2
            text-sm
          "
        >

          <div>
            {month} ({data.qty})
          </div>

          <div className="font-semibold">
            R {data.total.toFixed(2)}
          </div>

        </div>

      )
    )}

  </div>

</div>

</div>

  </div>
);
}