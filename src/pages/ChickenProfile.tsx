import { supabase } from "../supabase";
import { useState, useEffect, useRef } from "react";
import ProfileSection from "../components/ProfileSection";
import PhotoSection from "../components/PhotoSection";
import NotesSection from "../components/NotesSection";
import HealthSection from "../components/HealthSection";

export default function ChickenProfile({
  selectedChicken,
  setChickens,
  setSelectedChicken,
  navigate,
  saveChickenToDB,
}: any) {

  const healthRef = useRef<HTMLDivElement | null>(null);

  const [chicken, setChicken] = useState(selectedChicken);
  const [editing, setEditing] = useState(false);

  const [eggStats, setEggStats] = useState({
    week: 0,
    month: 0,
    lifetime: 0,
    lastDate: "None",
  });

  useEffect(() => {
    setChicken(selectedChicken);
  }, [selectedChicken]);

  useEffect(() => {
    if (selectedChicken?.goTo === "health" && healthRef.current) {
      healthRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [selectedChicken]);

  useEffect(() => {
    loadEggStats();
  }, [selectedChicken]);

  const loadEggStats = async () => {
    if (!selectedChicken) return;

    const { data, error } = await supabase
      .from("egg_logs")
      .select("*")
      .eq("henid", selectedChicken.id);

    if (error || !data) return;

    const now = new Date();

    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setMonth(now.getMonth() - 1);

    const weekEggs = data
      .filter((log) => new Date(log.date) >= weekAgo)
      .reduce((sum, log) => sum + log.eggs, 0);

    const monthEggs = data
      .filter((log) => new Date(log.date) >= monthAgo)
      .reduce((sum, log) => sum + log.eggs, 0);

    const lifetimeEggs = data.reduce(
      (sum, log) => sum + log.eggs,
      0
    );

    const lastDate =
      data.length > 0
        ? data[data.length - 1].date
        : "None";

    setEggStats({
      week: weekEggs,
      month: monthEggs,
      lifetime: lifetimeEggs,
      lastDate,
    });
  };

  if (!chicken) {
    return <div className="p-4">Loading...</div>;
  }

  const updateChicken = async (updated: any) => {
    setChicken(updated);

    setChickens((prev: any[]) =>
      prev.map((c) =>
        c.id === updated.id ? updated : c
      )
    );

    setSelectedChicken(updated);

    await saveChickenToDB(updated);
  };

  const saveEdits = async () => {
    await updateChicken(chicken);
    setEditing(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-4">

      {/* HEADER */}
      <div className="flex flex-col items-center gap-4">

        <h2 className="text-2xl font-bold">
          🐔 Chicken Profile
        </h2>

        {/* PROFILE PHOTO */}
        {(chicken.photos || []).length > 0 && (
          <div className="relative">

            <img
              src={chicken.photos[0]}
              className="
                w-40
                h-40
                object-cover
                rounded-full
                border-4
                border-white
                shadow-xl
              "
            />

            <div
              className="
                absolute
                bottom-1
                right-1
                bg-green-500
                w-5
                h-5
                rounded-full
                border-2
                border-white
              "
            />

          </div>
        )}

        {/* NAME */}
        <div className="text-center">
          <div className="text-xl font-semibold">
            {chicken.name}
          </div>

          <div className="text-gray-500 text-sm">
            {chicken.breed}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2">

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="
                bg-blue-500
                text-white
                px-4
                py-2
                rounded-xl
                text-sm
              "
            >
              Edit
            </button>
          ) : (
            <button
              onClick={saveEdits}
              className="
                bg-green-500
                text-white
                px-4
                py-2
                rounded-xl
                text-sm
              "
            >
              Save
            </button>
          )}

          <button
            className="
              bg-gray-500
              text-white
              px-4
              py-2
              rounded-xl
            "
            onClick={() => navigate("registry")}
          >
            ← Back
          </button>

        </div>

      </div>

      {/* INFO */}
      <ProfileSection title="Info">

        <div className="flex flex-col gap-3 text-sm">

          <div className="flex justify-between">
            <span className="text-gray-500">
              Name
            </span>

            {editing ? (
              <input
                value={chicken.name || ""}
                onChange={(e) =>
                  setChicken({
                    ...chicken,
                    name: e.target.value,
                  })
                }
                className="
                  border
                  rounded
                  px-2
                  py-1
                  text-sm
                "
              />
            ) : (
              <span className="font-medium">
                {chicken.name}
              </span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              ID
            </span>

            <span>{chicken.idTag}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Breed
            </span>

            {editing ? (
              <input
                value={chicken.breed || ""}
                onChange={(e) =>
                  setChicken({
                    ...chicken,
                    breed: e.target.value,
                  })
                }
                className="
                  border
                  rounded
                  px-2
                  py-1
                  text-sm
                "
              />
            ) : (
              <span>{chicken.breed}</span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Sex
            </span>

            {editing ? (
              <select
                value={chicken.sex || ""}
                onChange={(e) =>
                  setChicken({
                    ...chicken,
                    sex: e.target.value,
                  })
                }
                className="
                  border
                  rounded
                  px-2
                  py-1
                  text-sm
                "
              >
                <option value="Hen">Hen</option>
                <option value="Rooster">
                  Rooster
                </option>
                <option value="Unknown">
                  Unknown
                </option>
              </select>
            ) : (
              <span>{chicken.sex}</span>
            )}
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">
              Age
            </span>

            <span>{chicken.ageGroup}</span>
          </div>

        </div>

      </ProfileSection>

      {/* PHOTOS */}
      <ProfileSection title="Photos">
        <PhotoSection
          chicken={chicken}
          updateChicken={updateChicken}
        />
      </ProfileSection>

      {/* EGG PRODUCTION */}
      {chicken.sex?.toLowerCase() === "hen" && (
        <ProfileSection title="🥚 Egg Production">

          <div className="flex flex-col gap-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Eggs This Week
              </span>

              <span className="font-medium">
                {eggStats.week}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Eggs This Month
              </span>

              <span className="font-medium">
                {eggStats.month}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Lifetime Eggs
              </span>

              <span className="font-medium">
                {eggStats.lifetime}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Last Egg Logged
              </span>

              <span className="font-medium">
                {eggStats.lastDate}
              </span>
            </div>

          </div>

        </ProfileSection>
      )}

      {/* NOTES */}
      <ProfileSection title="Notes">
        <NotesSection
          chicken={chicken}
          updateChicken={updateChicken}
        />
      </ProfileSection>

      {/* HEALTH */}
      <ProfileSection title="Health">

        {/* ACTIVITY */}
        <ProfileSection title="Activity">

          <div className="flex flex-col gap-2 text-xs">

            {(chicken.activity || []).length === 0 && (
              <div className="text-gray-400">
                No activity yet
              </div>
            )}

            {(chicken.activity || [])
              .slice()
              .reverse()
              .map((item: any, i: number) => (
                <div
                  key={i}
                  className="
                    bg-gray-50
                    p-2
                    rounded-md
                    flex
                    justify-between
                  "
                >
                  <span>{item.text}</span>

                  <span className="text-gray-400">
                    {new Date(
                      item.time
                    ).toLocaleDateString()}
                  </span>

                </div>
              ))}

          </div>

        </ProfileSection>

        <div ref={healthRef}>
          <HealthSection
            chicken={chicken}
            updateChicken={updateChicken}
          />
        </div>

      </ProfileSection>

    </div>
  );
}