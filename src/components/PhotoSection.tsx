import { useRef, useState } from "react";
import { supabase } from "../supabase";

type Props = {
  chicken: any;
  updateChicken: (updated: any) => void | Promise<void>;
};

export default function PhotoSection({ chicken, updateChicken }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const isValidPhotoUrl = (value: any) =>
    typeof value === "string" &&
    value.trim() !== "" &&
    !value.startsWith("data:image") &&
    !value.startsWith("blob:");

  const photos = (
    chicken.photos && chicken.photos.length > 0 ? chicken.photos : chicken.album || []
  ).filter(isValidPhotoUrl);

  const resizeImageToBlob = (
    file: File,
    maxSize = 1200,
    quality = 0.8
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = () => {
        img.src = reader.result as string;
      };

      reader.onerror = () => reject("Could not read image file.");

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject("Could not resize image.");
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject("Could not compress image.");
              return;
            }

            resolve(blob);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject("Could not load image.");

      reader.readAsDataURL(file);
    });
  };

  const uploadPhotoToStorage = async (file: File) => {
    setUploadStatus("Compressing photo...");

    const resizedBlob = await resizeImageToBlob(file, 1200, 0.8);

    setUploadStatus("Uploading photo...");

    const chickenId = String(chicken.id || "unknown");
    const fileName = `${chickenId}/album-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("chicken-photos")
      .upload(fileName, resizedBlob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("Photo upload error:", uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("chicken-photos")
      .getPublicUrl(fileName);

    if (!data.publicUrl) {
      throw new Error("No public URL returned from Supabase Storage.");
    }

    return data.publicUrl;
  };

  const getStoragePathFromUrl = (url: string) => {
    const marker = "/storage/v1/object/public/chicken-photos/";
    const parts = url.split(marker);

    if (parts.length < 2) return null;

    return decodeURIComponent(parts[1]);
  };

  const deletePhotoFromStorage = async (url: string) => {
    const path = getStoragePathFromUrl(url);
    if (!path) return;

    const { error } = await supabase.storage
      .from("chicken-photos")
      .remove([path]);

    if (error) {
      console.warn("Storage delete warning:", error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);

      const uploadedPhotoUrls: string[] = [];

      for (const file of files) {
        const publicUrl = await uploadPhotoToStorage(file);
        uploadedPhotoUrls.push(publicUrl);
      }

      const updatedPhotos = [...photos, ...uploadedPhotoUrls];

      const updated = {
        ...chicken,
        photos: updatedPhotos,
        album: updatedPhotos,
      };

      await updateChicken(updated);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      alert(
        "Could not upload photo. Please check that the Supabase bucket 'chicken-photos' exists and is public."
      );
    } finally {
      setUploading(false);
      setUploadStatus("");
    }
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = confirm("Delete this photo?");
    if (!confirmed) return;

    const photoToDelete = photos[index];

    await deletePhotoFromStorage(photoToDelete);

    const updatedPhotos = photos.filter((_photo: string, i: number) => i !== index);

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
        disabled={uploading}
        className="bg-blue-500 text-white px-3 py-3 rounded-lg text-base font-semibold disabled:bg-gray-400"
      >
        {uploading ? uploadStatus || "Uploading photo..." : "+ Add Photo"}
      </button>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {photos.length === 0 && (
        <div className="text-sm text-gray-500">No album photos yet.</div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo: string, index: number) => (
          <div key={`${photo}-${index}`} className="relative">
            <img
              src={photo}
              alt="Chicken"
              className="w-full h-24 object-cover rounded-lg cursor-pointer border border-[#d9a441]"
              onClick={() => setSelectedIndex(index)}
              onError={(e) => {
                e.currentTarget.style.opacity = "0.35";
              }}
            />

            <button
              type="button"
              onClick={(e) => handleDelete(e, index)}
              className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded z-20"
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
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 text-white text-xl bg-black/60 px-3 py-1 rounded-full z-50"
          >
            ✕
          </button>

          {selectedIndex > 0 && (
            <button
              type="button"
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
              type="button"
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