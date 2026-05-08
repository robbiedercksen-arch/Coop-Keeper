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

  useEffect(() => {
    setChicken(selectedChicken);
  }, [selectedChicken]);

  // ✅ CORRECT place for scroll logic
  useEffect(() => {
    if (selectedChicken?.goTo === "health" && healthRef.current) {
      healthRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChicken]);

  if (!chicken) {
    return <div className="p-4">Loading...</div>;
  }

  const photos = chicken?.photos || [];
  const mainPhoto = selectedChicken?.image;

  const updateChicken = async (updated: any) => {
  setChicken(updated);

  setChickens((prev: any[]) =>
    prev.map((c) => (c.id === updated.id ? updated : c))
  );

  setSelectedChicken(updated);

  await saveChickenToDB(updated);
};

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">🐔 Chicken Profile</h2>

        <button
          className="bg-gray-500 text-white px-3 py-1 rounded-lg"
          onClick={() => navigate("registry")}
        >
          ← Back
        </button>
      </div>

      {/* PROFILE PHOTO */}
      <div className="flex justify-center">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200">
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt="Chicken"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Photo
            </div>
          )}
        </div>
      </div>

      {/* INFO */}
      <ProfileSection title="Info">
        <div className="flex flex-col gap-3 text-sm">

          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{chicken.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">ID</span>
            <span>{chicken.idTag}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Breed</span>
            <span>{chicken.breed}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Sex</span>
            <span>{chicken.sex}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Age</span>
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

      {/* NOTES */}
      <ProfileSection title="Notes">
        <NotesSection 
          chicken={chicken}
          updateChicken={updateChicken}
        />
      </ProfileSection>

      {/* HEALTH */}
      <ProfileSection title="Health">
        <ProfileSection title="Activity">
  <div className="flex flex-col gap-2 text-xs">

    {(chicken.activity || []).length === 0 && (
      <div className="text-gray-400">No activity yet</div>
    )}

    {(chicken.activity || [])
      .slice()
      .reverse()
      .map((item: any, i: number) => (
        <div
          key={i}
          className="bg-gray-50 p-2 rounded-md flex justify-between"
        >
          <span>{item.text}</span>
          <span className="text-gray-400">
            {new Date(item.time).toLocaleDateString()}
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