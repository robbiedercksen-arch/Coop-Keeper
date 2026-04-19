import { useState, useEffect } from "react";

/* ================= TYPES ================= */
type Chicken = {
  name: string;
  breed: string;
  age: string;
};

type Egg = {
  date: string;
  count: number;
};

type Feed = {
  date: string;
  amount: number;
};

/* ================= APP ================= */
export default function App() {
  const [page, setPage] = useState("dashboard");

  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [eggs, setEggs] = useState<Egg[]>([]);
  const [feed, setFeed] = useState<Feed[]>([]);

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const [eggCount, setEggCount] = useState("");
  const [feedAmount, setFeedAmount] = useState("");

  /* ================= STORAGE ================= */
  useEffect(() => {
    const c = localStorage.getItem("chickens");
    const e = localStorage.getItem("eggs");
    const f = localStorage.getItem("feed");

    if (c) setChickens(JSON.parse(c));
    if (e) setEggs(JSON.parse(e));
    if (f) setFeed(JSON.parse(f));
  }, []);

  useEffect(() => {
    localStorage.setItem("chickens", JSON.stringify(chickens));
  }, [chickens]);

  useEffect(() => {
    localStorage.setItem("eggs", JSON.stringify(eggs));
  }, [eggs]);

  useEffect(() => {
    localStorage.setItem("feed", JSON.stringify(feed));
  }, [feed]);

  /* ================= ACTIONS ================= */
  const addChicken = () => {
    if (!name || !breed || !age) return;
    setChickens([...chickens, { name, breed, age }]);
    setName("");
    setBreed("");
    setAge("");
  };

  const addEggs = () => {
    if (!eggCount) return;
    setEggs([
      ...eggs,
      {
        date: new Date().toISOString().slice(0, 10),
        count: Number(eggCount),
      },
    ]);
    setEggCount("");
  };

  const addFeed = () => {
    if (!feedAmount) return;
    setFeed([
      ...feed,
      {
        date: new Date().toISOString().slice(0, 10),
        amount: Number(feedAmount),
      },
    ]);
    setFeedAmount("");
  };

  /* ================= HELPERS ================= */
  const last7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  };

  const eggChart = last7Days().map((date) => {
    const total = eggs
      .filter((e) => e.date === date)
      .reduce((sum, e) => sum + e.count, 0);
    return { date, value: total };
  });

  const feedChart = last7Days().map((date) => {
    const total = feed
      .filter((f) => f.date === date)
      .reduce((sum, f) => sum + f.amount, 0);
    return { date, value: total };
  });

  /* ================= CHART ================= */
  const Chart = ({ data, color }: any) => {
    const max = Math.max(...data.map((d: any) => d.value), 1);

    return (
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-end",
          height: "180px",
          marginTop: "10px",
          padding: "10px",
          background: "white",
          borderRadius: "10px",
        }}
      >
        {data.map((d: any, i: number) => {
          let height = (d.value / max) * 100;

          // make small values visible
          if (d.value > 0 && height < 8) height = 8;

          return (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "12px" }}>{d.value}</div>

              <div
                style={{
                  height: `${height}%`,
                  background: d.value === 0 ? "#e5e7eb" : color,
                  borderRadius: "6px",
                }}
              />

              <div style={{ fontSize: "10px", marginTop: "5px" }}>
                {d.date.slice(5)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /* ================= UI ================= */
  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: "220px",
          background: "#111827",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>🐔 Coop Keeper</h2>

        {["dashboard", "chickens", "eggs", "feed"].map((p) => (
          <p
            key={p}
            onClick={() => setPage(p)}
            style={{
              marginTop: "15px",
              padding: "8px",
              cursor: "pointer",
              borderRadius: "6px",
              background: page === p ? "#374151" : "transparent",
            }}
          >
            {p}
          </p>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: "30px", background: "#f3f4f6" }}>
        
        {/* DASHBOARD */}
        {page === "dashboard" && (
          <>
            <h1>Dashboard</h1>

            <h3>Egg Production (Last 7 Days)</h3>
            <Chart data={eggChart} color="#f59e0b" />

            <h3 style={{ marginTop: "30px" }}>
              Feed Usage (Last 7 Days)
            </h3>
            <Chart data={feedChart} color="#3b82f6" />
          </>
        )}

        {/* CHICKENS */}
        {page === "chickens" && (
          <>
            <h1>Chickens</h1>

            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
            <input
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <button onClick={addChicken}>Add</button>

            {chickens.map((c, i) => (
              <div key={i}>
                {c.name} - {c.breed} - {c.age}
              </div>
            ))}
          </>
        )}

        {/* EGGS */}
        {page === "eggs" && (
          <>
            <h1>Eggs</h1>

            <input
              placeholder="Egg count"
              value={eggCount}
              onChange={(e) => setEggCount(e.target.value)}
            />

            <button onClick={addEggs}>Add</button>

            {eggs.map((e, i) => (
              <div key={i}>
                {e.date} - {e.count}
              </div>
            ))}
          </>
        )}

        {/* FEED */}
        {page === "feed" && (
          <>
            <h1>Feed</h1>

            <input
              placeholder="Feed (kg)"
              value={feedAmount}
              onChange={(e) => setFeedAmount(e.target.value)}
            />

            <button onClick={addFeed}>Add</button>

            {feed.map((f, i) => (
              <div key={i}>
                {f.date} - {f.amount} kg
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}