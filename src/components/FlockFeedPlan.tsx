const cardClass =
  "rounded-3xl p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]";

const statClass =
  "rounded-2xl p-4 text-center bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)]";

export default function FlockFeedPlan({ chickens = [] }: any) {
  const activeChickens = chickens.filter(
    (c: any) =>
      !c.archived &&
      c.status !== "Inactive Chicken" &&
      c.status !== "Sold"
  );

  const isHen = (c: any) =>
    ["hen", "female"].includes((c.sex || "").toLowerCase());

  const isRooster = (c: any) =>
    ["rooster", "male", "cock"].includes((c.sex || "").toLowerCase());

  const isChick = (c: any) =>
    (c.ageGroup || "").toLowerCase().includes("chick");

  const isGrower = (c: any) =>
    (c.ageGroup || "").toLowerCase().includes("grower");

  const isAdult = (c: any) =>
    (c.ageGroup || "").toLowerCase().includes("adult");

  const hens = activeChickens.filter((c: any) => isHen(c) && isAdult(c));
  const roosters = activeChickens.filter((c: any) => isRooster(c) && isAdult(c));
  const chicks = activeChickens.filter(isChick);
  const growers = activeChickens.filter(isGrower);

  const unsureAdults = activeChickens.filter(
    (c: any) =>
      !isHen(c) &&
      !isRooster(c) &&
      !isChick(c) &&
      !isGrower(c)
  );

  const groups = [
    {
      label: "Adult Hens",
      qty: hens.length,
      gramsEach: 120,
      feed: "Layer pellets / breeder feed",
      note: "Best for laying hens and adult female birds.",
    },
    {
      label: "Adult Roosters",
      qty: roosters.length,
      gramsEach: 130,
      feed: "Maintenance feed / breeder feed",
      note: "Roosters need good protein but not high layer calcium.",
    },
    {
      label: "Chicks",
      qty: chicks.length,
      gramsEach: 35,
      feed: "Chick starter crumbs",
      note: "Best for 0–6 week old chicks.",
    },
    {
      label: "Growers",
      qty: growers.length,
      gramsEach: 85,
      feed: "Grower pellets / grower mash",
      note: "Best for 6–20 week birds.",
    },
    {
      label: "Unsure / Other Adults",
      qty: unsureAdults.length,
      gramsEach: 120,
      feed: "General maintenance feed",
      note: "Use until sex or age group is confirmed.",
    },
  ];

  const totalGramsPerDay = groups.reduce(
    (sum, group) => sum + group.qty * group.gramsEach,
    0
  );

  const totalKgPerDay = totalGramsPerDay / 1000;
  const totalKgPerMonth = totalKgPerDay * 30;

  return (
    <div className={cardClass}>
      <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
        🐔 Flock Feed Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        <div className={statClass}>
          <div className="text-3xl font-bold">{activeChickens.length}</div>
          <div className="text-sm text-[#4b3a1d]">Active Chickens</div>
        </div>

        <div className={statClass}>
          <div className="text-3xl font-bold">{totalKgPerDay.toFixed(2)} kg</div>
          <div className="text-sm text-[#4b3a1d]">Feed / Day</div>
        </div>

        <div className={statClass}>
          <div className="text-3xl font-bold">{totalKgPerMonth.toFixed(1)} kg</div>
          <div className="text-sm text-[#4b3a1d]">Feed / Month</div>
        </div>

        <div className={statClass}>
          <div className="text-3xl font-bold">
            {Math.ceil(totalKgPerMonth / 40)}
          </div>
          <div className="text-sm text-[#4b3a1d]">40kg Bags / Month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((group) => {
          const groupTotalGrams = group.qty * group.gramsEach;
          const groupKg = groupTotalGrams / 1000;

          return (
            <div key={group.label} className={statClass}>
              <div className="text-xl font-extrabold text-[#3d2a10]">
                {group.label}
              </div>

              <div className="mt-2 text-sm text-[#4b3a1d]">
                Qty: <b>{group.qty}</b>
              </div>

              <div className="text-sm text-[#4b3a1d]">
                Feed Each: <b>{group.gramsEach}g/day</b>
              </div>

              <div className="text-sm text-[#4b3a1d]">
                Group Total: <b>{groupKg.toFixed(2)}kg/day</b>
              </div>

              <div className="mt-3 text-[#022312] font-extrabold">
                Best Feed: {group.feed}
              </div>

              <div className="text-xs text-[#6b5a3a] mt-1">
                {group.note}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl p-4 border border-[#d9a441] bg-[#fff8e8] text-[#4b3a1d] font-semibold">
        This is an estimated feeding plan. Adjust slightly for breed size,
        weather, free-ranging, laying condition and wastage.
      </div>
    </div>
  );
}