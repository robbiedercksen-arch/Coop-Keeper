type Chicken = {
  id?: string | number;
  name?: string;
  breed?: string;
  sex?: string;
  ageGroup?: string;
};

type FeedGroup = {
  label: string;
  birds: Chicken[];
  gramsPerDay: number;
  feedType: string;
  note: string;
};

export default function FlockFeedPlan({ chickens }: { chickens: Chicken[] }) {
  const activeChickens = chickens || [];

  const isHen = (sex?: string) =>
    ["hen", "female"].includes((sex || "").toLowerCase());

  const isRooster = (sex?: string) =>
    ["rooster", "male", "cock"].includes((sex || "").toLowerCase());

  const age = (c: Chicken) => (c.ageGroup || "").toLowerCase();
  const breed = (c: Chicken) => (c.breed || "").toLowerCase();

  const isLargeBreed = (c: Chicken) =>
    breed(c).includes("orpington") ||
    breed(c).includes("brahma") ||
    breed(c).includes("wyandotte");

  const chicks = activeChickens.filter((c) =>
    ["chick", "chicks", "baby"].some((x) => age(c).includes(x))
  );

  const growers = activeChickens.filter((c) =>
    ["grower", "juvenile", "teen"].some((x) => age(c).includes(x))
  );

  const adultHens = activeChickens.filter(
    (c) => isHen(c.sex) && ["adult", "laying"].some((x) => age(c).includes(x))
  );

  const adultRoosters = activeChickens.filter(
    (c) => isRooster(c.sex) && ["adult", "mature"].some((x) => age(c).includes(x))
  );

  const unknown = activeChickens.filter(
    (c) =>
      !chicks.includes(c) &&
      !growers.includes(c) &&
      !adultHens.includes(c) &&
      !adultRoosters.includes(c)
  );

  const getGrams = (base: number, birds: Chicken[]) => {
    const hasLargeBreed = birds.some(isLargeBreed);
    return hasLargeBreed ? base + 15 : base;
  };

  const groups: FeedGroup[] = [
    {
      label: "Chicks",
      birds: chicks,
      gramsPerDay: getGrams(45, chicks),
      feedType: "Chick starter / crumble",
      note: "Higher protein feed for early growth.",
    },
    {
      label: "Growers",
      birds: growers,
      gramsPerDay: getGrams(90, growers),
      feedType: "Grower pellets",
      note: "Good for young birds before laying age.",
    },
    {
      label: "Adult Hens",
      birds: adultHens,
      gramsPerDay: getGrams(125, adultHens),
      feedType: "Layer pellets",
      note: "Best for laying hens because of calcium support.",
    },
    {
      label: "Adult Roosters",
      birds: adultRoosters,
      gramsPerDay: getGrams(135, adultRoosters),
      feedType: "Maintenance / mixed flock feed",
      note: "Roosters do not need high calcium layer feed as their main diet.",
    },
    {
      label: "Unsorted / Unknown",
      birds: unknown,
      gramsPerDay: 100,
      feedType: "General mixed flock feed",
      note: "Update sex and age group for better recommendations.",
    },
  ].filter((g) => g.birds.length > 0);

  const totalGramsPerDay = groups.reduce(
    (sum, g) => sum + g.birds.length * g.gramsPerDay,
    0
  );

  const totalKgPerDay = totalGramsPerDay / 1000;
  const totalKgPerMonth = totalKgPerDay * 30;

  const estimated50KgBags = totalKgPerMonth / 50;

  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-4 border">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">🌾 Flock Feed Plan</h2>
          <p className="text-sm text-gray-500">
            Auto-calculated from your current chicken register.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
          <p className="text-xs text-gray-500">Total Birds</p>
          <p className="text-2xl font-bold">{activeChickens.length}</p>
        </div>

        <div className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
          <p className="text-xs text-gray-500">Feed / Day</p>
          <p className="text-2xl font-bold">{totalKgPerDay.toFixed(2)} kg</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <p className="text-xs text-gray-500">Feed / Month</p>
          <p className="text-2xl font-bold">{totalKgPerMonth.toFixed(1)} kg</p>
        </div>

        <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
          <p className="text-xs text-gray-500">50kg Bags / Month</p>
          <p className="text-2xl font-bold">{estimated50KgBags.toFixed(1)}</p>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
          No chickens found yet. Add chickens to automatically build a feed plan.
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((group) => {
            const dailyKg = (group.birds.length * group.gramsPerDay) / 1000;
            const monthlyKg = dailyKg * 30;

            return (
              <div
                key={group.label}
                className="rounded-xl border bg-gray-50 p-3"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{group.label}</h3>
                    <p className="text-sm text-gray-600">
                      {group.birds.length} birds × {group.gramsPerDay}g/day
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">{dailyKg.toFixed(2)} kg/day</p>
                    <p className="text-xs text-gray-500">
                      {monthlyKg.toFixed(1)} kg/month
                    </p>
                  </div>
                </div>

                <div className="mt-3 bg-white rounded-lg p-3 border">
                  <p className="text-sm">
                    <span className="font-semibold">Recommended feed:</span>{" "}
                    {group.feedType}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{group.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 bg-orange-50 border border-orange-100 rounded-xl p-3">
        ⚠️ Feed amounts are rough planning estimates. Actual intake can change
        with breed size, weather, free-ranging, laying condition, and feed waste.
      </div>
    </div>
  );
}