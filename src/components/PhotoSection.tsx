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

  const photos = chicken.photos || [];
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
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
  multiple   // ✅ ADD THIS
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

  </div>
  );
}