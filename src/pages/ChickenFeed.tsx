import PageBanner from "../components/PageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function ChickenFeed() {
  const [feedProducts, setFeedProducts] = useState<any[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<any>(null);
  const [editing, setEditing] = useState(false);

  const [newFeedBrand, setNewFeedBrand] = useState("");
  const [newFeedProduct, setNewFeedProduct] = useState("");

  useEffect(() => {
    loadFeedProducts();
  }, []);

  const nutritionFields = (feed: any) => [
    ["Protein", feed.protein],
    ["Fat / Oils", feed.fat_oils],
    ["Fibre", feed.fibre],
    ["Calcium", feed.calcium],
    ["Phosphorus", feed.phosphorus],
    ["Moisture", feed.moisture],
    ["Lysine", feed.lysine],
    ["Methionine", feed.methionine],
    ["Salt / Sodium", feed.salt_sodium],
  ].filter((field) => field[1]);

  const loadFeedProducts = async () => {
    const { data, error } = await supabase
      .from("feed_products")
      .select("*")
      .order("brand");

    if (error) {
      console.error(error);
      alert("Could not load feed products.");
      return;
    }

    setFeedProducts(data || []);
  };

  const addFeedProduct = async () => {
    if (!newFeedBrand.trim() || !newFeedProduct.trim()) {
      alert("Please enter brand and product name.");
      return;
    }

    const { error } = await supabase
      .from("feed_products")
      .insert([
        {
          brand: newFeedBrand.trim(),
          product_name: newFeedProduct.trim(),
          category: "Chicken Feed",
        },
      ]);

    if (error) {
      console.error(error);
      alert("Could not add feed product.");
      return;
    }

    setNewFeedBrand("");
    setNewFeedProduct("");

    await loadFeedProducts();
  };

  const saveFeed = async () => {
    if (!selectedFeed) return;

    const cleanedFeed = {
      brand: selectedFeed.brand || "",
      product_name: selectedFeed.product_name || "",
      bag_size: selectedFeed.bag_size || null,
      feed_cost:
        selectedFeed.feed_cost !== "" &&
        selectedFeed.feed_cost !== null &&
        selectedFeed.feed_cost !== undefined
          ? Number(selectedFeed.feed_cost)
          : null,
      protein: selectedFeed.protein || null,
      fat_oils: selectedFeed.fat_oils || null,
      fibre: selectedFeed.fibre || null,
      calcium: selectedFeed.calcium || null,
      phosphorus: selectedFeed.phosphorus || null,
      moisture: selectedFeed.moisture || null,
      lysine: selectedFeed.lysine || null,
      methionine: selectedFeed.methionine || null,
      salt_sodium: selectedFeed.salt_sodium || null,
      best_for: selectedFeed.best_for || null,
      notes: selectedFeed.notes || null,
    };

    const { data, error } = await supabase
      .from("feed_products")
      .update(cleanedFeed)
      .eq("id", selectedFeed.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Could not save feed details.");
      return;
    }

    setSelectedFeed(data);
    setEditing(false);
    await loadFeedProducts();

    alert("Feed details saved.");
  };

  const deleteFeedProduct = async (id: number) => {
    const confirmed = confirm("Delete this feed product?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("feed_products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete feed product.");
      return;
    }

    setSelectedFeed(null);
    setEditing(false);
    await loadFeedProducts();
  };

  const getCostPerKg = (feed: any) => {
    if (!feed?.bag_size || !feed?.feed_cost) return null;

    const kg = Number(String(feed.bag_size).replace(/[^0-9.]/g, ""));

    if (!kg || kg <= 0) return null;

    return Number(feed.feed_cost) / kg;
  };

  const updateField = (field: string, value: any) => {
    setSelectedFeed({
      ...selectedFeed,
      [field]: value,
    });
  };

  const averageCost =
    feedProducts.length === 0
      ? 0
      : feedProducts.reduce(
          (sum, feed) => sum + Number(feed.feed_cost || 0),
          0
        ) / feedProducts.length;

  const feedsWithDetails = feedProducts.filter(
    (feed) => nutritionFields(feed).length > 0 || feed.best_for
  ).length;

  if (selectedFeed) {
    const perKg = getCostPerKg(selectedFeed);

    return (
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <PageBanner
          eyebrow="FEED PROFILE"
          title={`${selectedFeed.brand || "Feed"} ${
            selectedFeed.product_name || ""
          }`}
          subtitle="View and edit feed nutrition, cost and usage details."
          stat={
            selectedFeed.feed_cost
              ? `R ${Number(selectedFeed.feed_cost).toFixed(2)}`
              : "R 0.00"
          }
          statLabel="FEED COST"
        />

        <div className="bg-white rounded-3xl p-4 shadow-sm flex gap-2">
          <button
            onClick={() => {
              setSelectedFeed(null);
              setEditing(false);
            }}
            className="bg-gray-500 text-white rounded-xl px-4 py-2 font-semibold"
          >
            ← Back
          </button>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold"
            >
              ✏ Edit
            </button>
          ) : (
            <button
              onClick={saveFeed}
              className="bg-green-600 text-white rounded-xl px-4 py-2 font-semibold"
            >
              Save
            </button>
          )}

          <button
            onClick={() => deleteFeedProduct(selectedFeed.id)}
            className="bg-red-600 text-white rounded-xl px-4 py-2 font-semibold ml-auto"
          >
            🗑 Delete
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">Bag Size</div>
            <div className="text-2xl font-bold">
              {selectedFeed.bag_size || "-"}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">Feed Cost</div>
            <div className="text-2xl font-bold">
              R{" "}
              {selectedFeed.feed_cost
                ? Number(selectedFeed.feed_cost).toFixed(2)
                : "0.00"}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-gray-500 text-sm">Cost / KG</div>
            <div className="text-2xl font-bold">
              {perKg ? `R ${perKg.toFixed(2)}` : "-"}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Feed Information</h2>

          <FeedInput label="Brand" value={selectedFeed.brand} editing={editing} onChange={(v: string) => updateField("brand", v)} />
          <FeedInput label="Product Name" value={selectedFeed.product_name} editing={editing} onChange={(v: string) => updateField("product_name", v)} />
          <FeedInput label="Bag Size" value={selectedFeed.bag_size} editing={editing} placeholder="40KG" onChange={(v: string) => updateField("bag_size", v)} />
          <FeedInput label="Feed Cost" value={selectedFeed.feed_cost} editing={editing} type="number" placeholder="365" onChange={(v: string) => updateField("feed_cost", v)} />

          <div className="flex justify-between items-center gap-3 border-b pb-2">
            <span className="text-gray-500">Best For</span>

            {editing ? (
              <select
                value={selectedFeed.best_for || ""}
                onChange={(e) => updateField("best_for", e.target.value)}
                className="border rounded-xl p-2 w-48"
              >
                <option value="">Select Purpose</option>
                <option>Grower</option>
                <option>Layer</option>
                <option>Breeder</option>
                <option>Chicks</option>
                <option>Broiler</option>
                <option>Moulting / Feather Recovery</option>
                <option>General Maintenance</option>
              </select>
            ) : (
              <span className="font-semibold">
                {selectedFeed.best_for || "-"}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Nutrition / Ingredients</h2>

          <FeedInput label="Protein" value={selectedFeed.protein} editing={editing} placeholder="180 g/kg or 18%" onChange={(v: string) => updateField("protein", v)} />
          <FeedInput label="Fat / Oils" value={selectedFeed.fat_oils} editing={editing} placeholder="25 g/kg" onChange={(v: string) => updateField("fat_oils", v)} />
          <FeedInput label="Fibre" value={selectedFeed.fibre} editing={editing} placeholder="70 g/kg" onChange={(v: string) => updateField("fibre", v)} />
          <FeedInput label="Calcium" value={selectedFeed.calcium} editing={editing} placeholder="40 g/kg" onChange={(v: string) => updateField("calcium", v)} />
          <FeedInput label="Phosphorus" value={selectedFeed.phosphorus} editing={editing} placeholder="6 g/kg" onChange={(v: string) => updateField("phosphorus", v)} />
          <FeedInput label="Moisture" value={selectedFeed.moisture} editing={editing} placeholder="120 g/kg" onChange={(v: string) => updateField("moisture", v)} />
          <FeedInput label="Lysine" value={selectedFeed.lysine} editing={editing} placeholder="8 g/kg" onChange={(v: string) => updateField("lysine", v)} />
          <FeedInput label="Methionine" value={selectedFeed.methionine} editing={editing} placeholder="3 g/kg" onChange={(v: string) => updateField("methionine", v)} />
          <FeedInput label="Salt / Sodium" value={selectedFeed.salt_sodium} editing={editing} placeholder="3 g/kg" onChange={(v: string) => updateField("salt_sodium", v)} />
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Notes</h2>

          {editing ? (
            <textarea
              value={selectedFeed.notes || ""}
              onChange={(e) => updateField("notes", e.target.value)}
              className="border rounded-2xl p-3 min-h-[120px]"
              placeholder="Notes about this feed..."
            />
          ) : (
            <div className="text-gray-600 whitespace-pre-wrap">
              {selectedFeed.notes || "No notes added yet."}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      <PageBanner
        eyebrow="NUTRITION"
        title="Chicken Feed"
        subtitle="Compare feed brands, nutrition, bag sizes and costs."
        stat={feedProducts.length}
        statLabel="FEEDS"
      />

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Feed Products</div>
          <div className="text-3xl font-bold">{feedProducts.length}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">With Details</div>
          <div className="text-3xl font-bold">{feedsWithDetails}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Average Cost</div>
          <div className="text-3xl font-bold">
            R {averageCost.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-3">
        <h2 className="text-xl font-semibold">+ Add Feed Brand</h2>

        <input
          placeholder="Feed Brand"
          value={newFeedBrand}
          onChange={(e) => setNewFeedBrand(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <input
          placeholder="Product Name"
          value={newFeedProduct}
          onChange={(e) => setNewFeedProduct(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <button
          onClick={addFeedProduct}
          className="bg-green-600 text-white rounded-2xl p-4 font-semibold"
        >
          + Add Feed Brand
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          🌾 Feed Products
        </h2>

        {feedProducts.length === 0 && (
          <div className="text-gray-400 text-sm">
            No feed products added yet.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {feedProducts.map((feed) => {
            const perKg = getCostPerKg(feed);
            const filledNutrition = nutritionFields(feed);

            return (
              <div
                key={feed.id}
                onClick={() => setSelectedFeed(feed)}
                className="border rounded-3xl p-4 cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-xl font-bold">
                      {feed.brand}
                    </div>

                    <div className="text-gray-500">
                      {feed.product_name}
                    </div>

                    <div className="text-sm text-gray-400 mt-1">
                      {feed.best_for || "No purpose selected"}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-green-700">
                      {feed.feed_cost
                        ? `R ${Number(feed.feed_cost).toFixed(2)}`
                        : "No Cost"}
                    </div>

                    <div className="text-sm text-gray-400">
                      {feed.bag_size || "No Bag Size"}
                    </div>

                    <div className="text-xs text-gray-400">
                      {perKg ? `R ${perKg.toFixed(2)} / kg` : ""}
                    </div>
                  </div>
                </div>

                {filledNutrition.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 text-sm">
                    {filledNutrition.map(([label, value]: any) => (
                      <div
                        key={label}
                        className="bg-gray-50 rounded-xl p-2"
                      >
                        <div className="text-gray-400">{label}</div>
                        <div className="font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeedInput({
  label,
  value,
  editing,
  onChange,
  placeholder = "",
  type = "text",
}: any) {
  return (
    <div className="flex justify-between items-center gap-3 border-b pb-2">
      <span className="text-gray-500">{label}</span>

      {editing ? (
        <input
          type={type}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded-xl p-2 w-48"
        />
      ) : (
        <span className="font-semibold text-right">
          {value || "-"}
        </span>
      )}
    </div>
  );
}