import PageBanner from "./PageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
export default function Dashboard({ chickens }: any) {
const [eggLogs, setEggLogs] = useState<any[]>([]);
const [chores, setChores] = useState<any[]>([]);
const [plans, setPlans] = useState<any[]>([]);
const [incubators, setIncubators] = useState<any[]>([]);  
  const total = chickens.length;

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
    .from("incubators")
    .select("*");

  setIncubators(incubatorData || []);
};

  return (
  <div>

    <PageBanner
      eyebrow="WELCOME"
      title="Dashboard"
      subtitle="Your flock at a glance."
      stat={total}
      statLabel="CHICKENS"
    />
    <div className="grid md:grid-cols-2 gap-4">

  {/* CHICKEN REGISTER */}
  <div className="bg-white rounded-3xl p-5 shadow-sm">
    <div className="text-sm text-gray-500 mb-2">
      🐔 Chicken Register
    </div>

    <div className="text-3xl font-bold">
      {total}
    </div>

    <div className="text-sm text-gray-400 mt-2">
      Total Chickens
    </div>

    <div className="mt-4 text-sm text-gray-500">
      Wishlist Qty: 0
    </div>
  </div>

  {/* HEALTH */}
  <div className="bg-white rounded-3xl p-5 shadow-sm">

    <div className="text-sm text-gray-500 mb-4">
      ❤️ Chicken Health Monitor
    </div>

    <div className="grid grid-cols-3 gap-3">

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
  <div className="bg-white rounded-3xl p-5 shadow-sm">

    <div className="text-sm text-gray-500 mb-2">
      🥚 Egg Registry
    </div>

    <div className="text-3xl font-bold">
      {eggLogs.reduce(
        (sum, log) => sum + log.eggs,
        0
      )}
    </div>

    <div className="text-sm text-gray-400 mt-2">
      Total Eggs Logged
    </div>

  </div>

  {/* DAILY CHORES */}
  <div className="bg-white rounded-3xl p-5 shadow-sm">

    <div className="text-sm text-gray-500 mb-2">
      ✅ Daily Chores
    </div>

    <div className="text-3xl font-bold">
      {
        chores.filter((c) => c.completed)
          .length
      }
      /
      {chores.length}
    </div>

    <div className="text-sm text-gray-400 mt-2">
      Tasks Completed
    </div>

  </div>

  {/* FARM PLANNING */}
  <div className="bg-white rounded-3xl p-5 shadow-sm">

    <div className="text-sm text-gray-500 mb-2">
      📋 Farm Planning
    </div>

    <div className="flex gap-6 mt-4">

      <div>
        <div className="text-2xl font-bold">
          {
            plans.filter((p) => !p.completed)
              .length
          }
        </div>

        <div className="text-xs text-gray-500">
          Active
        </div>
      </div>

      <div>
        <div className="text-2xl font-bold">
          {
            plans.filter((p) => p.completed)
              .length
          }
        </div>

        <div className="text-xs text-gray-500">
          Completed
        </div>
      </div>

    </div>

  </div>

  {/* INCUBATORS */}
  <div className="bg-white rounded-3xl p-5 shadow-sm">

    <div className="text-sm text-gray-500 mb-2">
      🐣 Incubator Registry
    </div>

    <div className="text-3xl font-bold">
      {incubators.length}
    </div>

    <div className="text-sm text-gray-400 mt-2">
      Active Incubators
    </div>

  </div>

</div>
    
  </div>
);
}