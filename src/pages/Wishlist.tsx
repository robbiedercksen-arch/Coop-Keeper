import PageBanner from "../components/PageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Wishlist() {

  const [itemCategory, setItemCategory] =
    useState("Equipment");

  const [itemName, setItemName] =
    useState("");

  const [qty, setQty] =
    useState("1");

  const [unitPrice, setUnitPrice] =
    useState("");

  const [itemDetails, setItemDetails] =
    useState("");

  const [productUrl, setProductUrl] =
    useState("");

  const [productImages, setProductImages] =
    useState<File[]>([]);

  const [wishlistItems, setWishlistItems] =
    useState<any[]>([]);

  const [selectedProductImages, setSelectedProductImages] =
    useState<string[]>([]);

  const [showImageViewer, setShowImageViewer] =
    useState(false);

  const [activeImageIndex, setActiveImageIndex] =
    useState(0);

  const totalCost =
    Number(qty || 0) *
    Number(unitPrice || 0);

  useEffect(() => {
    loadWishlistItems();
  }, []);

  const loadWishlistItems = async () => {

    const { data, error } = await supabase
      .from("wishlist")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setWishlistItems(data || []);
  };

  const addWishlistItem = async () => {

    if (!itemName || totalCost <= 0)
      return;

    const uploadedImageUrls: string[] = [];

    for (const file of productImages) {

      const fileName =
        `${Date.now()}-${file.name}`;

      const { error: uploadError } =
        await supabase.storage
          .from("wishlist-images")
          .upload(fileName, file);

      if (uploadError) {
        console.error(uploadError);
        continue;
      }

      const { data } = supabase
        .storage
        .from("wishlist-images")
        .getPublicUrl(fileName);

      uploadedImageUrls.push(
        data.publicUrl
      );
    }

    const { error } = await supabase
      .from("wishlist")
      .insert([
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
      console.error(error);
      return;
    }

    setItemCategory("Equipment");
    setItemName("");
    setQty("1");
    setUnitPrice("");
    setItemDetails("");
    setProductUrl("");
    setProductImages([]);

    loadWishlistItems();
  };

  const deleteWishlistItem = async (
    id: number
  ) => {

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadWishlistItems();
  };

  const totalWishlistCost =
    wishlistItems.reduce(
      (sum, item) =>
        sum + Number(item.total_cost),
      0
    );

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">

      <PageBanner
        eyebrow="PLANNING"
        title="Wishlist"
        subtitle="Track future farm purchases, upgrades and planned items."
        stat={`R ${totalWishlistCost.toFixed(2)}`}
        statLabel="TOTAL"
      />

      {/* FORM */}
      <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-4">

        <h2 className="text-xl font-semibold">
          🛒 Add Wishlist Item
        </h2>

        <select
          value={itemCategory}
          onChange={(e) =>
            setItemCategory(e.target.value)
          }
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
          onChange={(e) =>
            setItemName(e.target.value)
          }
          className="border rounded-2xl p-3"
        />

        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) =>
            setQty(e.target.value)
          }
          className="border rounded-2xl p-3"
        />

        <input
          type="number"
          placeholder="Unit Price"
          value={unitPrice}
          onChange={(e) =>
            setUnitPrice(e.target.value)
          }
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
          onChange={(e) =>
            setItemDetails(e.target.value)
          }
          className="border rounded-2xl p-3"
        />

        <input
          type="url"
          placeholder="Product URL"
          value={productUrl}
          onChange={(e) =>
            setProductUrl(e.target.value)
          }
          className="border rounded-2xl p-3"
        />

        <div className="flex flex-col gap-2">

          <div className="font-semibold text-sm">
            📸 Product Images
          </div>

          <input
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={(e) =>
              setProductImages(
                Array.from(
                  e.target.files || []
                )
              )
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
          className="
            bg-green-600
            text-white
            rounded-2xl
            p-4
            font-semibold
          "
        >
          + Add Wishlist Item
        </button>

      </div>

      {/* WISHLIST ITEMS */}
      <div className="bg-white rounded-3xl p-4 shadow-sm">

        <h2 className="text-xl font-semibold mb-4">
          🛒 Wishlist Items
        </h2>

        <div className="flex flex-col gap-4">

          {wishlistItems.map((item) => (

            <div
              key={item.id}
              className="
                border
                rounded-3xl
                p-4
                flex
                flex-col
                gap-4
              "
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
                  <div className="text-gray-500">
                    Quantity
                  </div>

                  <div className="font-bold">
                    {item.qty}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-3">
                  <div className="text-gray-500">
                    Unit Price
                  </div>

                  <div className="font-bold">
                    R {Number(item.unit_price).toFixed(2)}
                  </div>
                </div>

              </div>

              {item.item_details && (

                <div className="bg-gray-50 rounded-2xl p-3 text-sm">
                  <span className="font-semibold">
                    Details:
                  </span>{" "}
                  {item.item_details}
                </div>

              )}

              {item.product_images &&
                item.product_images.length > 0 && (

                <div className="flex gap-2 flex-wrap">

                  {item.product_images.map(
                    (
                      image: string,
                      index: number
                    ) => (

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
                        className="
                          w-24
                          h-24
                          object-cover
                          rounded-2xl
                          border
                          cursor-pointer
                        "
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
                  className="
                    bg-blue-500
                    text-white
                    rounded-2xl
                    p-3
                    text-center
                    font-semibold
                  "
                >
                  🔗 Open Product
                </a>

              )}

              <button
                onClick={() =>
                  deleteWishlistItem(item.id)
                }
                className="
                  bg-red-500
                  text-white
                  rounded-2xl
                  p-3
                  font-semibold
                "
              >
                🗑 Delete Item
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* IMAGE VIEWER */}
      {showImageViewer && (

        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

          <button
            onClick={() =>
              setShowImageViewer(false)
            }
            className="
              absolute
              top-5
              right-5
              text-white
              text-4xl
            "
          >
            ×
          </button>

          <button
            onClick={() =>
              setActiveImageIndex((prev) =>
                prev === 0
                  ? selectedProductImages.length - 1
                  : prev - 1
              )
            }
            className="
              absolute
              left-4
              text-white
              text-5xl
            "
          >
            ‹
          </button>

          <img
            src={
              selectedProductImages[
                activeImageIndex
              ]
            }
            className="
              max-w-[90%]
              max-h-[85%]
              rounded-3xl
            "
          />

          <button
            onClick={() =>
              setActiveImageIndex((prev) =>
                prev ===
                selectedProductImages.length - 1
                  ? 0
                  : prev + 1
              )
            }
            className="
              absolute
              right-4
              text-white
              text-5xl
            "
          >
            ›
          </button>

        </div>

      )}

    </div>
  );
}