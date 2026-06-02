import CoopPageBanner from "../components/CoopPageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const cardClass =
  "rounded-3xl p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]";

const statClass =
  "rounded-2xl p-4 text-center bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)]";

export default function Wishlist() {
  const [showForm, setShowForm] = useState(false);

  const [itemCategory, setItemCategory] = useState("Equipment");
  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [itemDetails, setItemDetails] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  const [selectedProductImages, setSelectedProductImages] = useState<string[]>(
    []
  );
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseItem, setPurchaseItem] = useState<any>(null);
  const [purchaseCategory, setPurchaseCategory] = useState("Equipment");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [purchaseSlipFiles, setPurchaseSlipFiles] = useState<File[]>([]);

  const [uploadingWishlistImages, setUploadingWishlistImages] = useState(false);
  const [wishlistUploadStatus, setWishlistUploadStatus] = useState("");
  const [uploadingPurchaseSlips, setUploadingPurchaseSlips] = useState(false);
  const [purchaseUploadStatus, setPurchaseUploadStatus] = useState("");

  const totalCost = Number(qty || 0) * Number(unitPrice || 0);

  const normalizeUrl = (url: string) => {
    if (!url) return "";

    const match = url.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
    if (!match) return "";

    let cleanUrl = match[0].trim();
    cleanUrl = cleanUrl.replace(/[),.;]+$/g, "");

    if (!cleanUrl.startsWith("http")) {
      cleanUrl = `https://${cleanUrl}`;
    }

    return cleanUrl;
  };

  const resizeImageToBlob = (
    file: File,
    maxSize = 1400,
    quality = 0.78
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = () => {
        img.src = reader.result as string;
      };

      reader.onerror = () => reject("Could not read image.");

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
          reject("Could not compress image.");
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject("Could not create compressed image.");
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

  const makeSafeFileName = (file: File) =>
    file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 40);

  const uploadCompressedImage = async (
    file: File,
    bucket: string,
    prefix: string
  ) => {
    const compressedBlob = await resizeImageToBlob(file, 1400, 0.78);

    const safeName = makeSafeFileName(file);

    const fileName = `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}-${safeName}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, compressedBlob, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error(`${bucket} upload error:`, uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

    if (!data.publicUrl) {
      throw new Error(`No public URL returned from ${bucket}.`);
    }

    return data.publicUrl;
  };

  const getStoragePathFromUrl = (url: string, bucket: string) => {
    const marker = `/storage/v1/object/public/${bucket}/`;
    const parts = url.split(marker);

    if (parts.length < 2) return null;

    return decodeURIComponent(parts[1]);
  };

  const deleteFilesFromStorage = async (urls: string[], bucket: string) => {
    const paths = urls
      .map((url) => getStoragePathFromUrl(url, bucket))
      .filter(Boolean) as string[];

    if (paths.length === 0) return;

    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) {
      console.warn(`Could not delete files from ${bucket}:`, error);
    }
  };

  useEffect(() => {
    loadWishlistItems();
  }, []);

  const loadWishlistItems = async () => {
    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Load Wishlist Error:", error);
      alert("Could not load wishlist items.");
      return;
    }

    setWishlistItems(data || []);
  };

  const totalWishlistCost = wishlistItems.reduce(
    (sum, item) => sum + Number(item.total_cost || 0),
    0
  );

  const resetForm = () => {
    setItemCategory("Equipment");
    setItemName("");
    setQty("1");
    setUnitPrice("");
    setItemDetails("");
    setProductUrl("");
    setProductImages([]);
    setShowForm(false);
    setUploadingWishlistImages(false);
    setWishlistUploadStatus("");
  };

  const addWishlistItem = async () => {
    if (!itemName || totalCost <= 0 || uploadingWishlistImages) return;

    try {
      setUploadingWishlistImages(true);

      const uploadedImageUrls: string[] = [];

      for (const file of productImages) {
        setWishlistUploadStatus("Compressing product image...");
        const publicUrl = await uploadCompressedImage(
          file,
          "wishlist-images",
          "wishlist"
        );
        uploadedImageUrls.push(publicUrl);
        setWishlistUploadStatus("Uploading product image...");
      }

      const { error } = await supabase.from("wishlist").insert([
        {
          item_category: itemCategory,
          item_name: itemName,
          qty: Number(qty),
          unit_price: Number(unitPrice),
          total_cost: totalCost,
          item_details: itemDetails,
          product_url: normalizeUrl(productUrl),
          product_images: uploadedImageUrls,
        },
      ]);

      if (error) {
        console.error("Add Wishlist Error:", error);
        alert("Could not add wishlist item.");
        return;
      }

      resetForm();
      await loadWishlistItems();
    } catch (error) {
      console.error("Wishlist image upload error:", error);
      alert(
        "Could not upload wishlist image. Please check the wishlist-images bucket and try again."
      );
    } finally {
      setUploadingWishlistImages(false);
      setWishlistUploadStatus("");
    }
  };

  const deleteWishlistItem = async (id: string) => {
    const confirmed = confirm(
      "Delete this wishlist item and its product images?"
    );
    if (!confirmed) return;

    const itemToDelete = wishlistItems.find(
      (item) => String(item.id) === String(id)
    );

    const productImageUrls = itemToDelete?.product_images || [];

    await deleteFilesFromStorage(productImageUrls, "wishlist-images");

    const { error } = await supabase.from("wishlist").delete().eq("id", id);

    if (error) {
      console.error("Delete Wishlist Error:", error);
      alert(JSON.stringify(error));
      return;
    }

    setWishlistItems((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const openPurchaseModal = (item: any) => {
    setPurchaseItem(item);
    setPurchaseCategory("Equipment");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setPurchaseSlipFiles([]);
    setPurchaseUploadStatus("");
    setUploadingPurchaseSlips(false);
    setShowPurchaseModal(true);
  };

  const completePurchase = async () => {
    if (!purchaseItem || !purchaseDate || uploadingPurchaseSlips) {
      alert("Please select a purchase date.");
      return;
    }

    try {
      setUploadingPurchaseSlips(true);

      const wishlistId = String(purchaseItem.id);
      const uploadedSlipUrls: string[] = [];

      for (const file of purchaseSlipFiles) {
        setPurchaseUploadStatus("Compressing purchase slip...");
        const publicUrl = await uploadCompressedImage(
          file,
          "expense-slips",
          "expense"
        );
        uploadedSlipUrls.push(publicUrl);
        setPurchaseUploadStatus("Uploading purchase slip...");
      }

      const { error: expenseError } = await supabase.from("expenses").insert([
        {
          title: purchaseItem.item_name,
          amount: Number(purchaseItem.total_cost),
          category: purchaseCategory,
          expense_date: purchaseDate,
          notes: purchaseItem.item_details || "Purchased from Wishlist",
          recurring: false,
          feed_product: "",
          bag_size: "",
          qty: Number(purchaseItem.qty),
          unit_price: Number(purchaseItem.unit_price),
          slip_images: uploadedSlipUrls,
        },
      ]);

      if (expenseError) {
        console.error("Expense Insert Error:", expenseError);
        alert("Could not move item to Expenses.");
        return;
      }

      await deleteFilesFromStorage(
        purchaseItem.product_images || [],
        "wishlist-images"
      );

      const { error: deleteError } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", wishlistId);

      if (deleteError) {
        console.error("Wishlist Delete Error:", deleteError);
        alert(JSON.stringify(deleteError));
        return;
      }

      setWishlistItems((prev) =>
        prev.filter((item) => String(item.id) !== wishlistId)
      );

      setShowPurchaseModal(false);
      setPurchaseItem(null);
      setPurchaseSlipFiles([]);

      await loadWishlistItems();

      alert("Item moved to Expenses and deleted from Wishlist.");
    } catch (error) {
      console.error("Complete purchase error:", error);
      alert(
        "Could not upload purchase slip. Please check the expense-slips bucket and try again."
      );
    } finally {
      setUploadingPurchaseSlips(false);
      setPurchaseUploadStatus("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 px-1">
      <CoopPageBanner
        eyebrow="PLANNING"
        title="Wishlist"
        subtitle="Track future farm purchases, upgrades and planned items."
        stats={[
          { label: "Items", value: wishlistItems.length },
          { label: "Active Total", value: `R ${totalWishlistCost.toFixed(2)}` },
        ]}
      />

      <div className={cardClass}>
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-[#022312] text-[#f7d37b] rounded-2xl px-5 py-4 font-extrabold shadow-md"
        >
          ➕ Add Wishlist Item
        </button>
      </div>

      {showForm && (
        <div className={cardClass}>
          <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
            🛒 Add Wishlist Item
          </h2>

          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-extrabold text-[#3d2a10]">
                Select Category
              </span>
              <select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white text-base"
              >
                <option>Minerals & Vitamins</option>
                <option>Food</option>
                <option>Equipment</option>
                <option>Chicken Breeds</option>
                <option>Medicine</option>
                <option>Tools</option>
                <option>Coop Supplies</option>
                <option>Cleaning</option>
                <option>Electronics</option>
                <option>Other</option>
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-extrabold text-[#3d2a10]">Item Name</span>
              <input
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white text-base"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-extrabold text-[#3d2a10]">
                Product Quantity
              </span>
              <input
                type="number"
                placeholder="Quantity"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white text-base"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-extrabold text-[#3d2a10]">
                Product Unit Price
              </span>
              <input
                type="number"
                placeholder="Unit Price"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white text-base"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-extrabold text-[#3d2a10]">
                Product Details
              </span>
              <textarea
                placeholder="Item Details"
                value={itemDetails}
                onChange={(e) => setItemDetails(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white text-base"
                rows={3}
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-extrabold text-[#3d2a10]">
                Add Product URL / Link
              </span>
              <textarea
                placeholder="Paste Takealot share text or product URL here"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white text-base"
                rows={3}
              />
            </label>

            <div className="flex flex-col gap-3">
              <span className="font-extrabold text-[#3d2a10]">
                Product Image Optional
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="border border-[#d9a441] rounded-2xl p-4 bg-white cursor-pointer font-bold text-[#4b3a1d] text-center">
                  📁 Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setProductImages(Array.from(e.target.files || []))
                    }
                    className="hidden"
                  />
                </label>

                <label className="border border-[#d9a441] rounded-2xl p-4 bg-white cursor-pointer font-bold text-[#4b3a1d] text-center">
                  📷 Camera
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    capture="environment"
                    onChange={(e) =>
                      setProductImages(Array.from(e.target.files || []))
                    }
                    className="hidden"
                  />
                </label>
              </div>

              {productImages.length > 0 && (
                <div className="text-sm text-[#6b5a3a] font-semibold">
                  {productImages.length} image(s) selected
                </div>
              )}

              {uploadingWishlistImages && (
                <div className="rounded-2xl p-3 bg-blue-50 border border-blue-200 text-blue-800 font-bold text-sm">
                  {wishlistUploadStatus || "Uploading product image..."}
                </div>
              )}
            </div>

            <div className={statClass}>
              <div className="text-sm text-[#4b3a1d]">Estimated Total Cost</div>
              <div className="text-3xl font-extrabold text-green-800">
                R {totalCost.toFixed(2)}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={addWishlistItem}
                disabled={uploadingWishlistImages}
                className="bg-[#022312] text-[#f7d37b] px-5 py-3 rounded-xl font-bold disabled:bg-gray-400 disabled:text-white"
              >
                {uploadingWishlistImages
                  ? wishlistUploadStatus || "Saving..."
                  : "+ Add Wishlist Item"}
              </button>

              <button
                onClick={resetForm}
                disabled={uploadingWishlistImages}
                className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold disabled:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={cardClass}>
        <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
          🛒 Active Wishlist Items
        </h2>

        {wishlistItems.length === 0 && (
          <div className="text-sm text-[#6b5a3a]">No active wishlist items.</div>
        )}

        <div className="flex flex-col gap-4">
          {wishlistItems.map((item) => {
            const cleanProductUrl = normalizeUrl(item.product_url || "");

            return (
              <div
                key={item.id}
                className="rounded-2xl p-4 bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.12)] flex flex-col gap-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-xl text-[#3d2a10] break-words">
                      {item.item_name}
                    </div>
                    <div className="text-sm text-[#6b5a3a]">
                      {item.item_category}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-extrabold text-2xl text-green-800">
                      R {Number(item.total_cost).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/60 rounded-2xl p-3 border border-[#d9a441]/50">
                    <div className="text-[#6b5a3a]">Quantity</div>
                    <div className="font-extrabold text-[#3d2a10]">
                      {item.qty}
                    </div>
                  </div>

                  <div className="bg-white/60 rounded-2xl p-3 border border-[#d9a441]/50">
                    <div className="text-[#6b5a3a]">Unit Price</div>
                    <div className="font-extrabold text-[#3d2a10]">
                      R {Number(item.unit_price).toFixed(2)}
                    </div>
                  </div>
                </div>

                {item.item_details && (
                  <div className="bg-white/60 rounded-2xl p-3 text-sm border border-[#d9a441]/50 text-[#4b3a1d] break-words">
                    <span className="font-bold">Details:</span>{" "}
                    {item.item_details}
                  </div>
                )}

                {item.product_images && item.product_images.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {item.product_images.map((image: string, index: number) => (
                      <img
                        key={index}
                        src={image}
                        alt="Product"
                        onClick={() => {
                          setSelectedProductImages(item.product_images);
                          setActiveImageIndex(index);
                          setShowImageViewer(true);
                        }}
                        className="w-24 h-24 object-cover rounded-2xl border border-[#d9a441] cursor-pointer hover:scale-105 transition"
                      />
                    ))}
                  </div>
                )}

                {item.product_url && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!cleanProductUrl) {
                        alert(
                          "No valid product link found. Please paste the Takealot share text or product URL again."
                        );
                        return;
                      }

                      window.open(
                        cleanProductUrl,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    className="bg-blue-600 text-white rounded-2xl p-3 text-center font-bold break-words"
                  >
                    🔗 Open Product
                  </button>
                )}

                <button
                  onClick={() => openPurchaseModal(item)}
                  className="bg-green-700 text-white rounded-2xl p-4 font-bold text-lg shadow-md"
                >
                  ✅ Item Purchased
                </button>

                <button
                  onClick={() => deleteWishlistItem(item.id)}
                  className="bg-red-600 text-white rounded-2xl p-3 font-bold"
                >
                  🗑 Delete Item
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {showPurchaseModal && purchaseItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-3">
          <div className={`${cardClass} w-full max-w-md flex flex-col gap-4`}>
            <h2 className="text-xl font-extrabold text-[#3d2a10]">
              ✅ Mark Item as Purchased
            </h2>

            <div className={statClass}>
              <div className="font-extrabold text-[#3d2a10]">
                {purchaseItem.item_name}
              </div>
              <div className="text-sm text-[#4b3a1d]">
                R {Number(purchaseItem.total_cost).toFixed(2)}
              </div>
            </div>

            <select
              value={purchaseCategory}
              onChange={(e) => setPurchaseCategory(e.target.value)}
              className="border border-[#d9a441] rounded-xl p-3 bg-white text-base"
            >
              <option>Feed</option>
              <option>Medicine</option>
              <option>Construction</option>
              <option>Equipment</option>
              <option>Utilities</option>
              <option>Transport</option>
              <option>Maintenance</option>
              <option>Other</option>
            </select>

            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="border border-[#d9a441] rounded-xl p-3 bg-white text-base"
            />

            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={(e) =>
                setPurchaseSlipFiles(Array.from(e.target.files || []))
              }
              className="border border-[#d9a441] rounded-xl p-3 bg-white text-base"
            />

            {purchaseSlipFiles.length > 0 && (
              <div className="text-sm text-[#6b5a3a] font-semibold">
                {purchaseSlipFiles.length} purchase slip(s) selected
              </div>
            )}

            {uploadingPurchaseSlips && (
              <div className="rounded-2xl p-3 bg-blue-50 border border-blue-200 text-blue-800 font-bold text-sm">
                {purchaseUploadStatus || "Uploading purchase slip..."}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPurchaseModal(false);
                  setPurchaseItem(null);
                  setPurchaseSlipFiles([]);
                }}
                disabled={uploadingPurchaseSlips}
                className="flex-1 bg-gray-200 rounded-xl p-3 font-bold disabled:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={completePurchase}
                disabled={uploadingPurchaseSlips}
                className="flex-1 bg-green-700 text-white rounded-xl p-3 font-bold disabled:bg-gray-400"
              >
                {uploadingPurchaseSlips
                  ? purchaseUploadStatus || "Saving..."
                  : "Save Purchase"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showImageViewer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowImageViewer(false)}
            className="absolute top-5 right-5 text-white text-4xl"
          >
            ×
          </button>

          <button
            onClick={() =>
              setActiveImageIndex((prev) =>
                prev === 0 ? selectedProductImages.length - 1 : prev - 1
              )
            }
            className="absolute left-4 text-white text-5xl"
          >
            ‹
          </button>

          <img
            src={selectedProductImages[activeImageIndex]}
            className="max-w-[90%] max-h-[85%] rounded-3xl"
          />

          <button
            onClick={() =>
              setActiveImageIndex((prev) =>
                prev === selectedProductImages.length - 1 ? 0 : prev + 1)
            }
            className="absolute right-4 text-white text-5xl"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}