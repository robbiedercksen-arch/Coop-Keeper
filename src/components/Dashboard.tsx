import PageBanner from "./PageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Dashboard({ chickens }: any) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [eggLogs, setEggLogs] = useState<any[]>([]);
  const [chores, setChores] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [incubators, setIncubators] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  const total = chickens.length;
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const { data: eggData } = await supabase
      .from("egg_logs")
      .select("*");

    setEggLogs(eggData || []);

    const { data: choreData } = await supabase
      .from("daily_chores")
      .select("*");

    setChores(choreData || []);

    const { data: planData } = await supabase
      .from("farm_plans")
      .select("*");

    setPlans(planData || []);

    const { data: incubatorData } = await supabase
      .from("incubator_batches")
      .select("*");

    setIncubators(incubatorData || []);

    const { data: wishlistData } = await supabase
      .from("wishlist")
      .select("*");

    setWishlistItems(wishlistData || []);

    const { data: expenseData } = await supabase
      .from("expenses")
      .select("*");

    setExpenses(expenseData || []);
  };

  const totalEggs =
    eggLogs.reduce(
      (sum, log) => sum + Number(log.eggs || 0),
      0
    );

  const currentMonthEggs =
    eggLogs
      .filter((log) => {
        const logDate = new Date(log.date);

        return (
          logDate.getMonth() === currentMonth &&
          logDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (sum, log) => sum + Number(log.eggs || 0),
        0
      );

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(currentDate.getDate() - 7);

  const currentWeekEggs =
    eggLogs
      .filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= oneWeekAgo;
      })
      .reduce(
        (sum, log) => sum + Number(log.eggs || 0),
        0
      );

  const repeatedTasks =
    chores.filter((c) => c.repeat_daily).length;

  const pendingTasks =
    chores.filter((c) => !c.completed).length;

  const completedTasks =
    chores.filter((c) => c.completed).length;

  const activePlans =
    plans.filter(
      (p) => !p.completed && !p.archived
    );

  const completedPlans =
    plans.filter(
      (p) => p.completed && !p.archived
    );

  const highPriorityPlans =
    activePlans.filter(
      (p) => p.priority === "High"
    ).length;

  const activeWishlistItems =
    wishlistItems.filter(
      (item) => !item.purchased
    );

  const totalWishlistItems =
    activeWishlistItems.length;

  const totalWishlistCost =
    activeWishlistItems.reduce(
      (sum, item) =>
        sum + Number(item.total_cost || 0),
      0
    );

  const currentMonthExpenses =
    expenses.filter((expense: any) => {
      const expenseDate =
        new Date(expense.expense_date);

      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

  const monthlyExpenseTotal =
    currentMonthExpenses.reduce(
      (sum: number, expense: any) =>
        sum + Number(expense.amount || 0),
      0
    );

  const yearlyExpenseTotal =
    expenses
      .filter((expense: any) => {
        const expenseDate =
          new Date(expense.expense_date);

        return (
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce(
        (sum: number, expense: any) =>
          sum + Number(expense.amount || 0),
        0
      );

  let ongoing = 0;
  let monitoring = 0;
  let healthy = 0;

  chickens.forEach((chicken: any) => {
    const logs = chicken.healthLogs || [];

    const hasOngoing = logs.some(
      (log: any) => log.status === "Ongoing"
    );

    const hasMonitoring = logs.some(
      (log: any) => log.status === "Monitoring"
    );

    if (hasOngoing) ongoing++;
    else if (hasMonitoring) monitoring++;
    else healthy++;
  });

  const activeIncubators =
    incubators.filter(
      (batch: any) =>
        batch.status === "Incubating" ||
        batch.status === "Active" ||
        !batch.status
    );

  const completedIncubators =
    incubators.filter(
      (batch: any) =>
        batch.status !== "Incubating" &&
        batch.status !== "Active" &&
        batch.status
    );

  const incubatorsWithDays =
    activeIncubators
      .map((batch: any) => {
        const hatchDate = new Date(
          batch.hatchdate ||
            batch.expected_hatch_date
        );

        const daysLeft = Math.ceil(
          (
            hatchDate.getTime() -
            currentDate.getTime()
          ) /
            (1000 * 60 * 60 * 24)
        );

        return {
          ...batch,
          daysLeft,
        };
      })
      .filter((batch: any) => !isNaN(batch.daysLeft))
      .sort(
        (a: any, b: any) =>
          a.daysLeft - b.daysLeft
      );

  const nextHatch =
    incubatorsWithDays.length > 0
      ? incubatorsWithDays[0]
      : null;

  const attentionItems = [];

  if (ongoing > 0) {
    attentionItems.push(
      `${ongoing} chicken health issue(s) need attention`
    );
  }

  if (pendingTasks > 0) {
    attentionItems.push(
      `${pendingTasks} daily chore(s) still pending`
    );
  }

  if (nextHatch && nextHatch.daysLeft <= 2) {
    attentionItems.push(
      `${nextHatch.batchname || "Incubator batch"} hatches soon`
    );
  }

  if (highPriorityPlans > 0) {
    attentionItems.push(
      `${highPriorityPlans} high priority farm plan(s)`
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 px-1">

      <PageBanner
  eyebrow="WELCOME"
  title="Dashboard"
  subtitle="Your flock at a glance."
/>

      {/* ATTENTION REQUIRED */}
      <div
        className="
          bg-white
          rounded-3xl
          p-5
          border
          border-gray-100
          shadow-[0_6px_24px_rgba(15,23,42,0.06)]
        "
      >
        <div className="text-sm text-gray-500 mb-4">
          🚨 Attention Required
        </div>

        {attentionItems.length === 0 ? (
          <div className="bg-green-50 rounded-2xl p-4 text-green-700 font-semibold">
            ✅ No urgent items right now.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {attentionItems.map((item, index) => (
              <div
                key={index}
                className="bg-red-50 rounded-2xl p-3 text-red-700 font-semibold"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* CHICKEN REGISTER */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <div className="text-sm text-gray-500 mb-4">
            🐔 Chicken Register
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="text-3xl font-bold">
                {total}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Total Chickens
              </div>
            </div>

            <div className="bg-pink-50 rounded-2xl p-4">
              <div className="text-3xl font-bold">
                {
                  chickens.filter(
                    (c: any) => c.sex === "Hen"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Hens
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4">
              <div className="text-3xl font-bold">
                {
                  chickens.filter(
                    (c: any) => c.sex === "Rooster"
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
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
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
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <div className="text-sm text-gray-500 mb-4">
            🥚 Egg Registry
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-amber-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {totalEggs}
              </div>
              <div className="text-xs mt-1">
                Total Eggs
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {currentMonthEggs}
              </div>
              <div className="text-xs mt-1">
                This Month
              </div>
            </div>

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
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <div className="text-sm text-gray-500 mb-4">
            ✅ Daily Chores
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {repeatedTasks}
              </div>
              <div className="text-xs mt-1">
                Repeating
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {pendingTasks}
              </div>
              <div className="text-xs mt-1">
                Pending
              </div>
            </div>

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

        {/* FARM PLANNING */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <div className="text-sm text-gray-500 mb-4">
            📋 Farm Planning
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {activePlans.length}
              </div>
              <div className="text-xs mt-1">
                Future Ideas
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {completedPlans.length}
              </div>
              <div className="text-xs mt-1">
                Completed
              </div>
            </div>

            <div className="bg-red-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-red-600">
                {highPriorityPlans}
              </div>
              <div className="text-xs mt-1">
                High Priority
              </div>
            </div>
          </div>
        </div>

        {/* INCUBATORS */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <div className="text-sm text-gray-500 mb-4">
            🐣 Incubator Overview
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {activeIncubators.length}
              </div>
              <div className="text-xs mt-1">
                Active
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {completedIncubators.length}
              </div>
              <div className="text-xs mt-1">
                Completed
              </div>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {nextHatch
                  ? nextHatch.daysLeft > 0
                    ? nextHatch.daysLeft
                    : 0
                  : "-"}
              </div>
              <div className="text-xs mt-1">
                Days To Hatch
              </div>
            </div>
          </div>

          {nextHatch && (
            <div className="mt-4 bg-gray-50 rounded-2xl p-3 text-sm">
              Closest Hatch:{" "}
              <span className="font-semibold">
                {nextHatch.batchname || "Batch"}
              </span>
            </div>
          )}
        </div>

        {/* WISHLIST */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <div className="text-sm text-gray-500 mb-4">
            🛒 Wishlist
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold">
                {totalWishlistItems}
              </div>
              <div className="text-xs mt-1">
                Active Items
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-green-700">
                R {totalWishlistCost.toFixed(2)}
              </div>
              <div className="text-xs mt-1">
                Planned Cost
              </div>
            </div>
          </div>
        </div>

        {/* EXPENSES */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <div className="text-sm text-gray-500 mb-4">
            💰 Expenses Overview
          </div>

          <div className="grid grid-cols-2 gap-4">
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
        </div>

      </div>
    </div>
  );
}