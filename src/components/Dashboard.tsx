import DashboardFarmBanner from "./DashboardFarmBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const cardClass =
  "rounded-3xl p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]";

const statClass =
  "rounded-2xl p-4 text-center bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)]";

const graphBarClass =
  "bg-gradient-to-t from-[#054020] via-[#d9a441] to-[#f7b267] rounded-t-xl border border-[#d9a441] shadow-[0_8px_18px_rgba(88,54,18,0.18)]";

const cardTitleClass =
  "flex items-center gap-2 text-base text-[#3d2a10] mb-5 font-extrabold tracking-tight";

const iconClass = "text-2xl drop-shadow-sm";
const alarmIconClass = "text-2xl drop-shadow-sm animate-pulse";

const warningClass =
  "rounded-2xl p-4 bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)] text-[#7a2e00] font-semibold";

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
    const { data: eggData } = await supabase.from("egg_logs").select("*");
    setEggLogs(eggData || []);

    const { data: choreData } = await supabase.from("daily_chores").select("*");
    setChores(choreData || []);

    const { data: planData } = await supabase.from("farm_plans").select("*");
    setPlans(planData || []);

    const { data: incubatorData } = await supabase
      .from("incubator_batches")
      .select("*");
    setIncubators(incubatorData || []);

    const { data: wishlistData } = await supabase.from("wishlist").select("*");
    setWishlistItems(wishlistData || []);

    const { data: expenseData } = await supabase.from("expenses").select("*");
    setExpenses(expenseData || []);
  };

  const totalEggs = eggLogs.reduce(
    (sum, log) => sum + Number(log.eggs || 0),
    0
  );

  const currentMonthEggs = eggLogs
    .filter((log) => {
      const logDate = new Date(log.date);
      return (
        logDate.getMonth() === currentMonth &&
        logDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, log) => sum + Number(log.eggs || 0), 0);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(currentDate.getDate() - 7);

  const currentWeekEggs = eggLogs
    .filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= oneWeekAgo;
    })
    .reduce((sum, log) => sum + Number(log.eggs || 0), 0);

  const repeatedTasks = chores.filter((c) => c.repeat_daily).length;
  const pendingTasks = chores.filter((c) => !c.completed).length;
  const completedTasks = chores.filter((c) => c.completed).length;

  const activePlans = plans.filter((p) => !p.completed && !p.archived);
  const completedPlans = plans.filter((p) => p.completed && !p.archived);

  const highPriorityPlans = activePlans.filter(
    (p) => p.priority === "High"
  ).length;

  const activeWishlistItems = wishlistItems.filter((item) => !item.purchased);
  const totalWishlistItems = activeWishlistItems.length;

  const totalWishlistCost = activeWishlistItems.reduce(
    (sum, item) => sum + Number(item.total_cost || 0),
    0
  );

  const currentMonthExpenses = expenses.filter((expense: any) => {
    const expenseDate = new Date(expense.expense_date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const monthlyExpenseTotal = currentMonthExpenses.reduce(
    (sum: number, expense: any) => sum + Number(expense.amount || 0),
    0
  );

  const yearlyExpenseTotal = expenses
    .filter((expense: any) => {
      const expenseDate = new Date(expense.expense_date);
      return expenseDate.getFullYear() === currentYear;
    })
    .reduce(
      (sum: number, expense: any) => sum + Number(expense.amount || 0),
      0
    );

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

  const activeIncubators = incubators.filter(
    (batch: any) =>
      batch.status === "Incubating" ||
      batch.status === "Active" ||
      !batch.status
  );

  const completedIncubators = incubators.filter(
    (batch: any) =>
      batch.status !== "Incubating" &&
      batch.status !== "Active" &&
      batch.status
  );

  const incubatorsWithDays = activeIncubators
    .map((batch: any) => {
      const hatchDate = new Date(batch.hatchdate || batch.expected_hatch_date);

      const daysLeft = Math.ceil(
        (hatchDate.getTime() - currentDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      return { ...batch, daysLeft };
    })
    .filter((batch: any) => !isNaN(batch.daysLeft))
    .sort((a: any, b: any) => a.daysLeft - b.daysLeft);

  const nextHatch =
    incubatorsWithDays.length > 0 ? incubatorsWithDays[0] : null;

  const attentionItems = [];

  if (ongoing > 0)
    attentionItems.push(`${ongoing} chicken health issue(s) need attention`);

  if (pendingTasks > 0)
    attentionItems.push(`${pendingTasks} daily chore(s) still pending`);

  if (nextHatch && nextHatch.daysLeft <= 2)
    attentionItems.push(
      `${nextHatch.batchname || "Incubator batch"} hatches soon`
    );

  if (highPriorityPlans > 0)
    attentionItems.push(`${highPriorityPlans} high priority farm plan(s)`);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const expenseMonthlyGraph = monthNames.map((month, index) => {
    const total = expenses
      .filter((expense: any) => {
        const date = new Date(expense.expense_date);
        return date.getFullYear() === currentYear && date.getMonth() === index;
      })
      .reduce((sum: number, expense: any) => sum + Number(expense.amount || 0), 0);

    return {
      label: month,
      value: total,
      display: `R ${total.toFixed(0)}`,
    };
  });

  const eggMonthlyGraph = monthNames.map((month, index) => {
    const total = eggLogs
      .filter((log: any) => {
        const date = new Date(log.date);
        return date.getFullYear() === currentYear && date.getMonth() === index;
      })
      .reduce((sum: number, log: any) => sum + Number(log.eggs || 0), 0);

    return {
      label: month,
      value: total,
      display: `${total}`,
    };
  });

  const graphYears = Array.from(
    new Set([
      currentYear,
      ...expenses.map((e: any) => new Date(e.expense_date).getFullYear()),
      ...eggLogs.map((e: any) => new Date(e.date).getFullYear()),
    ])
  )
    .filter((year) => !isNaN(year))
    .sort((a, b) => a - b)
    .slice(-5);

  const expenseYearGraph = graphYears.map((year) => {
    const total = expenses
      .filter((expense: any) => {
        const date = new Date(expense.expense_date);
        return date.getFullYear() === year;
      })
      .reduce((sum: number, expense: any) => sum + Number(expense.amount || 0), 0);

    return {
      label: String(year),
      value: total,
      display: `R ${total.toFixed(0)}`,
    };
  });

  const eggYearGraph = graphYears.map((year) => {
    const total = eggLogs
      .filter((log: any) => {
        const date = new Date(log.date);
        return date.getFullYear() === year;
      })
      .reduce((sum: number, log: any) => sum + Number(log.eggs || 0), 0);

    return {
      label: String(year),
      value: total,
      display: `${total}`,
    };
  });

  const SimpleBarGraph = ({
    title,
    icon,
    data,
    emptyText,
  }: {
    title: string;
    icon: string;
    data: any[];
    emptyText: string;
  }) => {
    const maxValue = Math.max(...data.map((item) => Number(item.value || 0)), 1);
    const hasData = data.some((item) => Number(item.value || 0) > 0);

    return (
      <div className={cardClass}>
        <div className={cardTitleClass}>
          <span className={iconClass}>{icon}</span>
          <span>{title}</span>
        </div>

        {!hasData ? (
          <div className="bg-[#eef8e8] border border-[#b9d9a8] rounded-2xl p-4 text-[#28551f] font-semibold">
            {emptyText}
          </div>
        ) : (
          <div className="h-[230px] flex items-end gap-3 border-b border-[#d9a441]/50 pb-3">
            {data.map((item, index) => {
              const height = Math.max((Number(item.value || 0) / maxValue) * 170, 8);

              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div className="text-[10px] font-bold text-[#4b3a1d] min-h-[18px]">
                    {item.value > 0 ? item.display : ""}
                  </div>

                  <div
                    className={graphBarClass}
                    style={{
                      height: `${height}px`,
                      width: "100%",
                      minWidth: 18,
                    }}
                  />

                  <div className="text-[11px] text-[#4b3a1d] font-semibold">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 px-1">
      <DashboardFarmBanner />

      <div className={cardClass}>
        <div className={cardTitleClass}>
          <span className={alarmIconClass}>🚨</span>
          <span>Attention Required</span>
        </div>

        {attentionItems.length === 0 ? (
          <div className="bg-[#eef8e8] border border-[#b9d9a8] rounded-2xl p-4 text-[#28551f] font-semibold">
            ✅ No urgent items right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {attentionItems.map((item, index) => (
              <div key={index} className={warningClass}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={cardClass}>
          <div className={cardTitleClass}>
            <span className={iconClass}>🐓</span>
            <span>Chicken Register</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={statClass}>
              <div className="text-3xl font-bold">{total}</div>
              <div className="text-sm text-[#4b3a1d] mt-1">Total Chickens</div>
            </div>

            <div className={statClass}>
              <div className="text-3xl font-bold">
                {chickens.filter((c: any) => c.sex === "Hen").length}
              </div>
              <div className="text-sm text-[#4b3a1d] mt-1">Hens</div>
            </div>

            <div className={statClass}>
              <div className="text-3xl font-bold">
                {chickens.filter((c: any) => c.sex === "Rooster").length}
              </div>
              <div className="text-sm text-[#4b3a1d] mt-1">Roosters</div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className={cardTitleClass}>
            <span className={iconClass}>❤️</span>
            <span>Chicken Health Monitor</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={statClass}>
              <div className="text-2xl font-bold text-red-700">{ongoing}</div>
              <div className="text-xs text-[#4b3a1d]">Ongoing</div>
            </div>

            <div className={statClass}>
              <div className="text-2xl font-bold text-yellow-800">
                {monitoring}
              </div>
              <div className="text-xs text-[#4b3a1d]">Monitoring</div>
            </div>

            <div className={statClass}>
              <div className="text-2xl font-bold text-green-800">{healthy}</div>
              <div className="text-xs text-[#4b3a1d]">Healthy</div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className={cardTitleClass}>
            <span className={iconClass}>🥚</span>
            <span>Egg Registry</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={statClass}>
              <div className="text-3xl font-bold">{totalEggs}</div>
              <div className="text-xs text-[#4b3a1d] mt-1">Total Eggs</div>
            </div>

            <div className={statClass}>
              <div className="text-3xl font-bold">{currentMonthEggs}</div>
              <div className="text-xs text-[#4b3a1d] mt-1">This Month</div>
            </div>

            <div className={statClass}>
              <div className="text-3xl font-bold">{currentWeekEggs}</div>
              <div className="text-xs text-[#4b3a1d] mt-1">This Week</div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className={cardTitleClass}>
            <span className={iconClass}>✅</span>
            <span>Daily Chores</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={statClass}>
              <div className="text-3xl font-bold">{repeatedTasks}</div>
              <div className="text-xs text-[#4b3a1d] mt-1">Repeating</div>
            </div>

            <div className={statClass}>
              <div className="text-3xl font-bold">{pendingTasks}</div>
              <div className="text-xs text-[#4b3a1d] mt-1">Pending</div>
            </div>

            <div className={statClass}>
              <div className="text-3xl font-bold">{completedTasks}</div>
              <div className="text-xs text-[#4b3a1d] mt-1">Completed</div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className={cardTitleClass}>
            <span className={iconClass}>📋</span>
            <span>Farm Planning</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={statClass}>
              <div className="text-3xl font-bold">{activePlans.length}</div>
              <div className="text-xs text-[#4b3a1d] mt-1">Future Ideas</div>
            </div>

            <div className={statClass}>
              <div className="text-3xl font-bold">{completedPlans.length}</div>
              <div className="text-xs text-[#4b3a1d] mt-1">Completed</div>
            </div>

            <div className={statClass}>
              <div className="text-3xl font-bold text-red-700">
                {highPriorityPlans}
              </div>
              <div className="text-xs text-[#4b3a1d] mt-1">High Priority</div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className={cardTitleClass}>
            <span className={iconClass}>🐣</span>
            <span>Incubator Overview</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className={statClass}>
              <div className="text-3xl font-bold">
                {activeIncubators.length}
              </div>
              <div className="text-xs text-[#4b3a1d] mt-1">Active</div>
            </div>

            <div className={statClass}>
              <div className="text-3xl font-bold">
                {completedIncubators.length}
              </div>
              <div className="text-xs text-[#4b3a1d] mt-1">Completed</div>
            </div>

            <div className={statClass}>
              <div className="text-3xl font-bold">
                {nextHatch
                  ? nextHatch.daysLeft > 0
                    ? nextHatch.daysLeft
                    : 0
                  : "-"}
              </div>
              <div className="text-xs text-[#4b3a1d] mt-1">Days To Hatch</div>
            </div>
          </div>

          {nextHatch && (
            <div className="mt-4 bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] rounded-2xl p-3 text-sm text-[#4b3a1d] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.12)]">
              Closest Hatch:{" "}
              <span className="font-semibold">
                {nextHatch.batchname || "Batch"}
              </span>
            </div>
          )}
        </div>

        <div className={cardClass}>
          <div className={cardTitleClass}>
            <span className={iconClass}>🛒</span>
            <span>Wishlist</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={statClass}>
              <div className="text-3xl font-bold">{totalWishlistItems}</div>
              <div className="text-xs text-[#4b3a1d] mt-1">Active Items</div>
            </div>

            <div className={statClass}>
              <div className="text-2xl font-bold text-green-800">
                R {totalWishlistCost.toFixed(2)}
              </div>
              <div className="text-xs text-[#4b3a1d] mt-1">Planned Cost</div>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className={cardTitleClass}>
            <span className={iconClass}>💰</span>
            <span>Expenses Overview</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={statClass}>
              <div className="text-2xl font-bold text-red-700">
                R {monthlyExpenseTotal.toFixed(2)}
              </div>
              <div className="text-xs text-[#4b3a1d] mt-1">This Month</div>
            </div>

            <div className={statClass}>
              <div className="text-2xl font-bold text-orange-800">
                R {yearlyExpenseTotal.toFixed(2)}
              </div>
              <div className="text-xs text-[#4b3a1d] mt-1">This Year</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <SimpleBarGraph
          title="Monthly Expense Graph"
          icon="📊"
          data={expenseMonthlyGraph}
          emptyText="No monthly expense data yet."
        />

        <SimpleBarGraph
          title="Year Expense Graph"
          icon="📈"
          data={expenseYearGraph}
          emptyText="No yearly expense data yet."
        />

        <SimpleBarGraph
          title="Egg Production Per Month"
          icon="🥚"
          data={eggMonthlyGraph}
          emptyText="No monthly egg data yet."
        />

        <SimpleBarGraph
          title="Egg Production Per Year"
          icon="📆"
          data={eggYearGraph}
          emptyText="No yearly egg data yet."
        />
      </div>
    </div>
  );
}