import { useRef, useState } from "react";

type Props = {
  chicken: any;
  updateChicken: (updated: any) => void | Promise<void>;
};

export default function PhotoSection({ chicken, updateChicken }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);

  const photos = chicken.photos || chicken.album || [];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

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

    const newPhotos = await Promise.all(readers);
    const updatedPhotos = [...photos, ...newPhotos];

    const updated = {
      ...chicken,
      photos: updatedPhotos,
      album: updatedPhotos,
    };

    await updateChicken(updated);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (index: number) => {
    const confirmed = confirm("Delete this photo?");
    if (!confirmed) return;

    const updatedPhotos = photos.filter(
      (_photo: string, i: number) => i !== index
    );

    const updated = {
      ...chicken,
      photos: updatedPhotos,
      album: updatedPhotos,
    };

    await updateChicken(updated);

    if (selectedIndex === index) {
      setSelectedIndex(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleUploadClick}
        className="bg-blue-500 text-white px-3 py-3 rounded-lg text-base font-semibold"
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

      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo: string, index: number) => (
          <div key={index} className="relative">
            <img
              src={photo}
              alt="Chicken"
              className="w-full h-24 object-cover rounded-lg cursor-pointer"
              onClick={() => setSelectedIndex(index)}
            />

            <button
              onClick={() => handleDelete(index)}
              className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {selectedIndex !== null && photos[selectedIndex] && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
          onTouchEnd={(e) => {
            const distance = touchStart - e.changedTouches[0].clientX;

            if (distance > 50 && selectedIndex < photos.length - 1) {
              setSelectedIndex(selectedIndex + 1);
            }

            if (distance < -50 && selectedIndex > 0) {
              setSelectedIndex(selectedIndex - 1);
            }
          }}
        >
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white text-xl bg-black/60 px-3 py-1 rounded-full z-50"
          >
            ✕
          </button>

          {selectedIndex > 0 && (
            <button
              onClick={() => setSelectedIndex(selectedIndex - 1)}
              className="absolute left-4 text-white text-3xl z-50"
            >
              ←
            </button>
          )}

          <img
            src={photos[selectedIndex]}
            alt="Chicken full view"
            className="max-w-full max-h-full z-40"
          />

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