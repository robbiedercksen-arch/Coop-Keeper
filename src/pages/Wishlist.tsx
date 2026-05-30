import PageBanner from "../components/PageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Wishlist() {
  const [itemCategory, setItemCategory] = useState("Equipment");
  const [itemName, setItemName] = useState("");
  const [qty, setQty] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [itemDetails, setItemDetails] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productImages, setProductImages] = useState<File[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  const [selectedProductImages, setSelectedProductImages] =
    useState<string[]>([]);
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
        product_url: productUrl,
        product_images: uploadedImageUrls,
      },
    ]);

    if (error) {
      console.error("Add Wishlist Error:", error);
      alert("Could not add wishlist item.");
      return;
    }

    setItemCategory("Equipment");
    setItemName("");
    setQty("1");
    setUnitPrice("");
    setItemDetails("");
    setProductUrl("");
    setProductImages([]);

    await loadWishlistItems();
  };

  const deleteWishlistItem = async (id: string) => {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete Wishlist Error:", error);
      alert(JSON.stringify(error));
      return;
    }

    setWishlistItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
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

    const { error: expenseError } = await supabase
      .from("expenses")
      .insert([
        {
          title: purchaseItem.item_name,
          amount: Number(purchaseItem.total_cost),
          category: purchaseCategory,
          expense_date: purchaseDate,
          notes:
            purchaseItem.item_details ||
            "Purchased from Wishlist",
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
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      <PageBanner
        eyebrow="PLANNING"
        title="Wishlist"
        subtitle="Track future farm purchases, upgrades and planned items."
        stat={`R ${totalWishlistCost.toFixed(2)}`}
        statLabel="ACTIVE TOTAL"
      />

      <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-4">
        <h2 className="text-xl font-semibold">🛒 Add Wishlist Item</h2>

        <select
          value={itemCategory}
          onChange={(e) => setItemCategory(e.target.value)}
          className="border rounded-2xl p-3"
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

        <input
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <input
          type="number"
          placeholder="Unit Price"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <div className="bg-green-50 border border-green-200 rounded-3xl p-4">
          <div className="text-sm text-gray-500">
            Estimated Total Cost
          </div>
          <div className="text-3xl font-bold text-green-700">
            R {totalCost.toFixed(2)}
          </div>
        </div>

        <textarea
          placeholder="Item Details"
          value={itemDetails}
          onChange={(e) => setItemDetails(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <input
          type="url"
          placeholder="Product URL"
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <div className="flex flex-col gap-2">
          <div className="font-semibold text-sm">📸 Product Images</div>

          <input
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={(e) =>
              setProductImages(Array.from(e.target.files || []))
            }
            className="border rounded-2xl p-3"
          />

          {productImages.length > 0 && (
            <div className="text-sm text-gray-500">
              {productImages.length} image(s) selected
            </div>
          )}
        </div>

        <button
          onClick={addWishlistItem}
          className="bg-green-600 text-white rounded-2xl p-4 font-semibold"
        >
          + Add Wishlist Item
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          🛒 Active Wishlist Items
        </h2>

        {wishlistItems.length === 0 && (
          <div className="text-sm text-gray-400">
            No active wishlist items.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-3xl p-4 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="font-bold text-xl">
                    {item.item_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.item_category}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-2xl text-green-700">
                    R {Number(item.total_cost).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-2xl p-3">
                  <div className="text-gray-500">Quantity</div>
                  <div className="font-bold">{item.qty}</div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3">
                  <div className="text-gray-500">Unit Price</div>
                  <div className="font-bold">
                    R {Number(item.unit_price).toFixed(2)}
                  </div>
                </div>
              </div>

              {item.item_details && (
                <div className="bg-gray-50 rounded-2xl p-3 text-sm">
                  <span className="font-semibold">Details:</span>{" "}
                  {item.item_details}
                </div>
              )}

              {item.product_images &&
                item.product_images.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {item.product_images.map(
                      (image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt="Product"
                          onClick={() => {
                            setSelectedProductImages(
                              item.product_images
                            );
                            setActiveImageIndex(index);
                            setShowImageViewer(true);
                          }}
                          className="w-24 h-24 object-cover rounded-2xl border cursor-pointer"
                        />
                      )
                    )}
                  </div>
                )}

              {item.product_url && (
                <a
                  href={item.product_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white rounded-2xl p-3 text-center font-semibold"
                >
                  🔗 Open Product
                </a>
              )}

              <button
                onClick={() => openPurchaseModal(item)}
                className="bg-green-600 text-white rounded-2xl p-4 font-bold text-lg shadow-md"
              >
                ✅ Item Purchased
              </button>

              <button
                onClick={() => deleteWishlistItem(item.id)}
                className="bg-red-500 text-white rounded-2xl p-3 font-semibold"
              >
                🗑 Delete Item
              </button>
            </div>
          ))}
        </div>
      </div>

      {showPurchaseModal && purchaseItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md flex flex-col gap-4">
            <h2 className="text-xl font-bold">
              ✅ Mark Item as Purchased
            </h2>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-3">
              <div className="font-bold">
                {purchaseItem.item_name}
              </div>
              <div className="text-sm text-gray-500">
                R {Number(purchaseItem.total_cost).toFixed(2)}
              </div>
            </div>

            <select
              value={purchaseCategory}
              onChange={(e) => setPurchaseCategory(e.target.value)}
              className="border rounded-xl p-3"
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
              className="border rounded-xl p-3"
            />

            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={(e) =>
                setPurchaseSlipFiles(Array.from(e.target.files || []))
              }
              className="border rounded-xl p-3"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPurchaseModal(false);
                  setPurchaseItem(null);
                  setPurchaseSlipFiles([]);
                }}
                className="flex-1 bg-gray-200 rounded-xl p-3 font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={completePurchase}
                className="flex-1 bg-green-600 text-white rounded-xl p-3 font-semibold"
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

          <img
            src={selectedProductImages[activeImageIndex]}
            className="max-w-[90%] max-h-[85%] rounded-3xl"
          />
        </div>
      )}
    </div>
  );
}