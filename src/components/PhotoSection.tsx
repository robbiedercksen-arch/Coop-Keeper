import { useRef, useState } from "react";

type Props = {
  chicken: any;
  updateChicken: (updated: any) => void;
};

export default function PhotoSection({ chicken, updateChicken }: Props) {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const readers: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result as string);
        };

        reader.readAsDataURL(file);
      });

      readers.push(promise);
    }

    Promise.all(readers).then((newPhotos) => {
      const updated = {
        ...chicken,
        photos: [...(chicken.photos || []), ...newPhotos],
      };

      updateChicken(updated);
    });
  };

  const handleDelete = (index: number) => {
    const updated = {
      ...chicken,
      photos: chicken.photos.filter((_: string, i: number) => i !== index),
    };
    updateChicken(updated);
  };

const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
const [touchStart, setTouchStart] = useState(0);
const [touchEnd, setTouchEnd] = useState(0);
const photos = chicken.photos || [];
  return (
    <div className="flex flex-col gap-3">

      <button
        onClick={handleUploadClick}
        className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm"
      >
        + Add Photo
      </button>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* PHOTO GRID */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo: string, index: number) => (
          <div key={index} className="relative">

            <img
              src={photo}
              className="w-full h-24 object-cover rounded-lg"
              onClick={() => setSelectedIndex(index)}
            />

            {/* DELETE BUTTON */}
            <button
              onClick={() => handleDelete(index)}
              className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
            >
              ✕
            </button>

          </div>
        ))}
      </div>

      {selectedIndex !== null && (
  <div
    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
    onTouchEnd={(e) => {
      setTouchEnd(e.changedTouches[0].clientX);

      const distance = touchStart - e.changedTouches[0].clientX;

      // 👉 Swipe Left = Next
      if (distance > 50 && selectedIndex < photos.length - 1) {
        setSelectedIndex(selectedIndex + 1);
      }

      // 👈 Swipe Right = Previous
      if (distance < -50 && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
      }
    }}
  >

    {/* CLOSE BUTTON */}
    <button
      onClick={() => setSelectedIndex(null)}
      className="absolute top-4 right-4 text-white text-xl bg-black/60 px-3 py-1 rounded-full z-50"
    >
      ✕
    </button>

    {/* LEFT BUTTON */}
    {selectedIndex > 0 && (
      <button
        onClick={() => setSelectedIndex(selectedIndex - 1)}
        className="absolute left-4 text-white text-3xl z-50"
      >
        ←
      </button>
    )}

    {/* IMAGE */}
    <img
      src={photos[selectedIndex]}
      className="max-w-full max-h-full z-40"
    />

    {/* RIGHT BUTTON */}
    {selectedIndex < photos.length - 1 && (
      <button
        onClick={() => setSelectedIndex(selectedIndex + 1)}
        className="absolute right-4 text-white text-3xl z-50"
      >
        →
      </button>
    )}

    </div>
)}

    </div>
  );
}