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

  const [selectedProductImages, setSelectedProductImages] = useState<string[]>([]);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseItem, setPurchaseItem] = useState<any>(null);
  const [purchaseCategory, setPurchaseCategory] = useState("Equipment");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [purchaseSlipFiles, setPurchaseSlipFiles] = useState<File[]>([]);

  const totalCost = Number(qty || 0) * Number(unitPrice || 0);

  const normalizeUrl = (url: string) => {
    if (!url) return "";

    const trimmedUrl = url.trim();

    if (
      trimmedUrl.startsWith("http://") ||
      trimmedUrl.startsWith("https://")
    ) {
      return trimmedUrl;
    }

    return `https://${trimmedUrl}`;
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
  };

  const addWishlistItem = async () => {
    if (!itemName || totalCost <= 0) return;

    const uploadedImageUrls: string[] = [];

    for (const file of productImages) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("wishlist-images")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Wishlist Image Upload Error:", uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("wishlist-images")
        .getPublicUrl(fileName);

      uploadedImageUrls.push(data.publicUrl);
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
  };

  const deleteWishlistItem = async (id: string) => {
    const confirmed = confirm("Delete this wishlist item?");
    if (!confirmed) return;

    const { error } = await supabase.from("wishlist").delete().eq("id", id);

    if (error) {
      console.error("Delete Wishlist Error:", error);
      alert(JSON.stringify(error));
      return;
    }

    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const openPurchaseModal = (item: any) => {
    setPurchaseItem(item);
    setPurchaseCategory("Equipment");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setPurchaseSlipFiles([]);
    setShowPurchaseModal(true);
  };

  const completePurchase = async () => {
    if (!purchaseItem || !purchaseDate) {
      alert("Please select a purchase date.");
      return;
    }

    const wishlistId = String(purchaseItem.id);
    const uploadedSlipUrls: string[] = [];

    for (const file of purchaseSlipFiles) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("expense-slips")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Slip Upload Error:", uploadError);
        alert("Slip upload failed. Check console.");
        return;
      }

      const { data } = supabase.storage
        .from("expense-slips")
        .getPublicUrl(fileName);

      uploadedSlipUrls.push(data.publicUrl);
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
              <input
                type="url"
                placeholder="Example: https://www.takealot.com/product"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="border border-[#d9a441] rounded-2xl p-3 bg-white text-base"
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
                className="bg-[#022312] text-[#f7d37b] px-5 py-3 rounded-xl font-bold"
              >
                + Add Wishlist Item
              </button>

              <button
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold"
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
          {wishlistItems.map((item) => (
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
                  <div className="font-extrabold text-[#3d2a10]">{item.qty}</div>
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
    onClick={() => {
      const finalUrl = normalizeUrl(item.product_url);

      if (!finalUrl || finalUrl === "https://") {
        alert("No valid product link saved for this item.");
        return;
      }

      window.location.href = finalUrl;
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
          ))}
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

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPurchaseModal(false);
                  setPurchaseItem(null);
                  setPurchaseSlipFiles([]);
                }}
                className="flex-1 bg-gray-200 rounded-xl p-3 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={completePurchase}
                className="flex-1 bg-green-700 text-white rounded-xl p-3 font-bold"
              >
                Save Purchase
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
                prev === selectedProductImages.length - 1 ? 0 : prev + 1
              )
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