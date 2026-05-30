import CoopPageBanner from "../components/CoopPageBanner";
import { useState } from "react";

const chickenBreeds = [
  "Australorp",
  "Barnevelder",
  "Brahma",
  "Buff Orpington",
  "Cochin",
  "Cream Legbar",
  "Dorking",
  "Easter Egger",
  "Faverolles",
  "Frizzle",
  "ISA Brown",
  "Koekoek",
  "Leghorn",
  "Marans",
  "New Hampshire",
  "Orpington",
  "Plymouth Rock",
  "Polish",
  "Rhode Island Red",
  "Silkie",
  "Sussex",
  "Welsummer",
  "Wyandotte",
  "Other",
  "Mix Breed",
];

const cardClass =
  "rounded-3xl p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]";

const statClass =
  "rounded-2xl p-4 text-center bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)]";

export default function ChickenRegistry({
  chickens,
  setChickens,
  setSelectedChicken,
  navigate,
  saveChickenToDB,
}: any) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("active");

  const [form, setForm] = useState({
    idTagColor: "Green",
    idTag: "",
    name: "",
    breed: "Orpington",
    motherBreed: "",
    fatherBreed: "",
    sex: "Hen",
    status: "Active Chicken",
    hatchDate: "",
    ageGroup: "Adult",
    image: "",
  });

  const activeChickens = chickens.filter((c: any) => !c.archived);

  const isHen = (c: any) =>
    ["hen", "female"].includes((c.sex || "").toLowerCase());

  const isRooster = (c: any) =>
    ["rooster", "male", "cock"].includes((c.sex || "").toLowerCase());

  const isChick = (c: any) =>
    (c.ageGroup || "").toLowerCase().includes("chick");

  const activeHens = activeChickens.filter(isHen).length;
  const activeRoosters = activeChickens.filter(isRooster).length;
  const activeChicks = activeChickens.filter(isChick).length;

  const filterButtons = [
    { key: "active", label: "Active Chickens" },
    { key: "inactive", label: "Inactive Chickens" },
    { key: "roosters", label: "Roosters Only" },
    { key: "hens", label: "Hens Only" },
    { key: "chicks", label: "Chicks Only" },
    { key: "issues", label: "Health Issues" },
  ];

  const filteredChickens = chickens.filter((c: any) => {
    if (filter === "active") return !c.archived;
    if (filter === "inactive") return c.archived;
    if (filter === "roosters") return !c.archived && isRooster(c);
    if (filter === "hens") return !c.archived && isHen(c);
    if (filter === "chicks") return !c.archived && isChick(c);

    if (filter === "issues") {
      return (
        !c.archived &&
        (c.healthLogs || []).some(
          (log: any) =>
            log.status === "Ongoing" || log.status === "Monitoring"
        )
      );
    }

    return !c.archived;
  });

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({
        ...form,
        image: reader.result as string,
      });
    };

    reader.readAsDataURL(file);
  };

  const addChicken = () => {
    if (!form.idTag) return alert("ID Tag required");
    if (!form.name) return alert("Chicken name required");

    const isInactive =
      form.status === "Inactive Chicken" || form.status === "Sold";

    const finalBreed =
      form.breed === "Mix Breed"
        ? `Mix Breed (${form.motherBreed || "Unknown"} x ${
            form.fatherBreed || "Unknown"
          })`
        : form.breed;

    const newChicken = {
      id: Date.now(),
      idTagColor: form.idTagColor,
      idTag: form.idTag,
      name: form.name,
      breed: finalBreed,
      breedType: form.breed,
      motherBreed: form.breed === "Mix Breed" ? form.motherBreed : "",
      fatherBreed: form.breed === "Mix Breed" ? form.fatherBreed : "",
      sex: form.sex,
      status: form.status,
      hatchDate: form.hatchDate || null,
      ageGroup: form.ageGroup,
      image: form.image,
      archived: isInactive,
      healthLogs: [],
      notes: [],
      album: [],
      activity: [
        {
          type: "created",
          text: "Chicken profile created",
          time: Date.now(),
        },
      ],
    };

    setChickens((prev: any[]) => [...prev, newChicken]);
    saveChickenToDB(newChicken);

    setForm({
      idTagColor: "Green",
      idTag: "",
      name: "",
      breed: "Orpington",
      motherBreed: "",
      fatherBreed: "",
      sex: "Hen",
      status: "Active Chicken",
      hatchDate: "",
      ageGroup: "Adult",
      image: "",
    });

    setShowForm(false);
  };

  const getHealthStatus = (c: any) => {
    const logs = c.healthLogs || [];

    if (logs.some((l: any) => l.status === "Ongoing")) {
      return { color: "#ef4444", label: "Ongoing" };
    }

    if (logs.some((l: any) => l.status === "Monitoring")) {
      return { color: "#eab308", label: "Monitoring" };
    }

    return { color: "#22c55e", label: "Healthy" };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 px-1">
      <CoopPageBanner
        eyebrow="FLOCK"
        title="Chicken Registry"
        subtitle="Manage your chickens, breeding stock and profiles."
      />

      <div className={cardClass}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={statClass}>
            <div className="text-3xl font-bold">{activeChickens.length}</div>
            <div className="text-sm text-[#4b3a1d] mt-1">Active Chickens</div>
          </div>

          <div className={statClass}>
            <div className="text-3xl font-bold">{activeHens}</div>
            <div className="text-sm text-[#4b3a1d] mt-1">Hens</div>
          </div>

          <div className={statClass}>
            <div className="text-3xl font-bold">{activeRoosters}</div>
            <div className="text-sm text-[#4b3a1d] mt-1">Roosters</div>
          </div>

          <div className={statClass}>
            <div className="text-3xl font-bold">{activeChicks}</div>
            <div className="text-sm text-[#4b3a1d] mt-1">Chicks</div>
          </div>
        </div>
      </div>

      <div className={cardClass}>
  <button
    onClick={() => setShowForm(true)}
    className="w-full bg-green-500 text-white rounded-xl px-4 py-3 font-bold"
  >
    ➕ Add Chicken
  </button>
</div>
      
      <div className={cardClass}>
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition ${
                filter === btn.key
                  ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md"
                  : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {showForm && (
        <div className={cardClass}>
          <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
            Add Chicken
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d]">
              ID Tag Color
              <select
                value={form.idTagColor}
                onChange={(e) =>
                  setForm({ ...form, idTagColor: e.target.value })
                }
                className="rounded-xl border border-[#d9a441] p-3 bg-white"
              >
                <option>Green</option>
                <option>Red</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d]">
              ID Tag Number
              <input
                type="number"
                placeholder="Example: 001"
                value={form.idTag}
                onChange={(e) => setForm({ ...form, idTag: e.target.value })}
                className="rounded-xl border border-[#d9a441] p-3"
              />
            </label>

            <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d]">
              Chicken Name
              <input
                placeholder="Chicken name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border border-[#d9a441] p-3"
              />
            </label>

            <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d]">
              Breed
              <select
                value={form.breed}
                onChange={(e) =>
                  setForm({
                    ...form,
                    breed: e.target.value,
                    motherBreed: "",
                    fatherBreed: "",
                  })
                }
                className="rounded-xl border border-[#d9a441] p-3 bg-white"
              >
                {chickenBreeds.map((breed) => (
                  <option key={breed}>{breed}</option>
                ))}
              </select>
            </label>

            {form.breed === "Mix Breed" && (
              <>
                <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d]">
                  Mother Breed
                  <select
                    value={form.motherBreed}
                    onChange={(e) =>
                      setForm({ ...form, motherBreed: e.target.value })
                    }
                    className="rounded-xl border border-[#d9a441] p-3 bg-white"
                  >
                    <option value="">Select mother breed</option>
                    {chickenBreeds
                      .filter((b) => b !== "Mix Breed")
                      .map((breed) => (
                        <option key={breed}>{breed}</option>
                      ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d]">
                  Father Breed
                  <select
                    value={form.fatherBreed}
                    onChange={(e) =>
                      setForm({ ...form, fatherBreed: e.target.value })
                    }
                    className="rounded-xl border border-[#d9a441] p-3 bg-white"
                  >
                    <option value="">Select father breed</option>
                    {chickenBreeds
                      .filter((b) => b !== "Mix Breed")
                      .map((breed) => (
                        <option key={breed}>{breed}</option>
                      ))}
                  </select>
                </label>
              </>
            )}

            <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d]">
              Sex
              <select
                value={form.sex}
                onChange={(e) => setForm({ ...form, sex: e.target.value })}
                className="rounded-xl border border-[#d9a441] p-3 bg-white"
              >
                <option>Hen</option>
                <option>Rooster</option>
                <option>Unsure</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d]">
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="rounded-xl border border-[#d9a441] p-3 bg-white"
              >
                <option>Active Chicken</option>
                <option>Inactive Chicken</option>
                <option>Sold</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d]">
              Hatch Date Optional
              <input
                type="date"
                value={form.hatchDate}
                onChange={(e) =>
                  setForm({ ...form, hatchDate: e.target.value })
                }
                className="rounded-xl border border-[#d9a441] p-3"
              />
            </label>

            <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d]">
              Age Group
              <select
                value={form.ageGroup}
                onChange={(e) =>
                  setForm({ ...form, ageGroup: e.target.value })
                }
                className="rounded-xl border border-[#d9a441] p-3 bg-white"
              >
                <option>Chick (0-6 Weeks)</option>
                <option>Grower (6-20 Weeks)</option>
                <option>Adult</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 font-semibold text-[#4b3a1d] md:col-span-2">
              Profile Photo Optional
              <input
                type="file"
                onChange={handleImage}
                className="rounded-xl border border-[#d9a441] p-3 bg-white"
              />
            </label>
          </div>

          <div className="flex gap-3 mt-5">
            <button
              onClick={addChicken}
              className="bg-[#022312] text-[#f7d37b] px-5 py-3 rounded-xl font-bold"
            >
              Save Chicken
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {filteredChickens.length === 0 && (
        <div className={cardClass}>
          <p className="text-[#6b5a3a] font-semibold">
            No chickens found for this filter.
          </p>
        </div>
      )}

      {filteredChickens.map((c: any) => {
        const status = getHealthStatus(c);

        return (
          <div
            key={c.id}
            className="rounded-3xl p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16)] cursor-pointer"
            onClick={() => {
              setSelectedChicken({
                ...c,
                goTo: "health",
              });

              navigate("profile");
            }}
          >
            <div className="flex gap-4 items-center">
              <img
                src={c.image || "https://via.placeholder.com/80"}
                className="w-24 h-24 rounded-2xl object-cover bg-gray-200 border border-[#d9a441]"
              />

              <div className="flex-1">
                <h3 className="font-extrabold text-xl text-[#3d2a10]">
                  {c.name}
                </h3>

                <div className="text-sm text-[#4b3a1d] mt-1">
                  Tag: {c.idTagColor} {c.idTag}
                </div>

                <div className="text-sm text-[#4b3a1d]">
                  {c.sex} • {c.ageGroup} • {c.breed}
                </div>

                <div className="text-sm text-[#4b3a1d]">
                  Status:{" "}
                  {c.status ||
                    (c.archived ? "Inactive Chicken" : "Active Chicken")}
                </div>

                {c.hatchDate && (
                  <div className="text-sm text-[#4b3a1d]">
                    Hatch Date: {c.hatchDate}
                  </div>
                )}

                <div
                  className="inline-block mt-3 text-xs px-3 py-1 rounded-full text-white font-bold"
                  style={{ background: status.color }}
                >
                  {status.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}