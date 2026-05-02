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

const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
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
              onClick={() => setSelectedPhoto(photo)}
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

      {/* 👇 ADD THIS BLOCK RIGHT HERE */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white text-xl bg-black/60 px-3 py-1 rounded-full"
          >
            ✕
          </button>

          {/* IMAGE */}
          <img
            src={selectedPhoto}
            className="max-w-full max-h-full"
          />

          {/* OPTIONAL: still allow tap background to close */}
          <div
            className="absolute inset-0"
            onClick={() => setSelectedPhoto(null)}
          />

        </div>
      )}
    </div>
  );
}
