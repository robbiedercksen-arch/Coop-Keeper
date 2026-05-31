import CoopPageBanner from "../components/CoopPageBanner";
import FlockFeedPlan from "../components/FlockFeedPlan";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const cardClass =
  "rounded-3xl p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]";

const statClass =
  "rounded-2xl p-4 text-center bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)]";

export default function ChickenFeed({ chickens = [] }: any) {
  const [feedProducts, setFeedProducts] = useState<any[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [showAddFeedForm, setShowAddFeedForm] = useState(false);

  const [compareFeedA, setCompareFeedA] = useState("");
  const [compareFeedB, setCompareFeedB] = useState("");

  const [newFeedBrand, setNewFeedBrand] = useState("");
  const [newFeedProduct, setNewFeedProduct] = useState("");
  const [newFeedSupplier, setNewFeedSupplier] = useState("");

  useEffect(() => {
    loadFeedProducts();
  }, []);

  const nutritionFields = (feed: any) =>
    [
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

    const { error } = await supabase.from("feed_products").insert([
      {
        brand: newFeedBrand.trim(),
        product_name: newFeedProduct.trim(),
        supplier: newFeedSupplier.trim() || null,
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
    setNewFeedSupplier("");
    setShowAddFeedForm(false);
    await loadFeedProducts();
  };

  const saveFeed = async () => {
    if (!selectedFeed) return;

    const cleanedFeed = {
      supplier: selectedFeed.supplier || null,
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

    const { error } = await supabase.from("feed_products").delete().eq("id", id);

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

  if (selectedFeed) {
    const perKg = getCostPerKg(selectedFeed);

    return (
      <div className="max-w-6xl mx-auto space-y-4 px-1">
        <CoopPageBanner
          eyebrow="FEED PROFILE"
          title={`${selectedFeed.brand || "Feed"} ${
            selectedFeed.product_name || ""
          }`}
          subtitle="View and edit feed nutrition, cost and usage details."
        />

        <div className={cardClass}>
          <div className="flex gap-2">
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
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className={statClass}>
            <div className="text-[#4b3a1d] text-sm">Bag Size</div>
            <div className="text-2xl font-bold">
              {selectedFeed.bag_size || "-"}
            </div>
          </div>

          <div className={statClass}>
            <div className="text-[#4b3a1d] text-sm">Feed Cost</div>
            <div className="text-2xl font-bold">
              R{" "}
              {selectedFeed.feed_cost
                ? Number(selectedFeed.feed_cost).toFixed(2)
                : "0.00"}
            </div>
          </div>

          <div className={statClass}>
            <div className="text-[#4b3a1d] text-sm">Cost / KG</div>
            <div className="text-2xl font-bold">
              {perKg ? `R ${perKg.toFixed(2)}` : "-"}
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
            Feed Information
          </h2>

          <div className="flex flex-col gap-3">
            <FeedInput label="Supplier" value={selectedFeed.supplier} editing={editing} placeholder="Where feed was bought" onChange={(v: string) => updateField("supplier", v)} />
            <FeedInput label="Brand" value={selectedFeed.brand} editing={editing} onChange={(v: string) => updateField("brand", v)} />
            <FeedInput label="Product Name" value={selectedFeed.product_name} editing={editing} onChange={(v: string) => updateField("product_name", v)} />
            <FeedInput label="Bag Size" value={selectedFeed.bag_size} editing={editing} placeholder="40KG" onChange={(v: string) => updateField("bag_size", v)} />
            <FeedInput label="Feed Cost" value={selectedFeed.feed_cost} editing={editing} type="number" placeholder="365" onChange={(v: string) => updateField("feed_cost", v)} />

            <div className="flex justify-between items-center gap-3 border-b border-[#d9a441]/40 pb-2">
              <span className="text-[#4b3a1d] font-semibold">Best For</span>

              {editing ? (
                <select
                  value={selectedFeed.best_for || ""}
                  onChange={(e) => updateField("best_for", e.target.value)}
                  className="border border-[#d9a441] rounded-xl p-2 w-48 bg-white"
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
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
            Nutrition / Ingredients
          </h2>

          <div className="flex flex-col gap-3">
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
        </div>

        <div className={cardClass}>
          <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
            Notes
          </h2>

          {editing ? (
            <textarea
              value={selectedFeed.notes || ""}
              onChange={(e) => updateField("notes", e.target.value)}
              className="border border-[#d9a441] rounded-2xl p-3 min-h-[120px] w-full bg-white"
              placeholder="Notes about this feed..."
            />
          ) : (
            <div className="text-[#4b3a1d] whitespace-pre-wrap">
              {selectedFeed.notes || "No notes added yet."}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 px-1">
      <CoopPageBanner
        eyebrow="NUTRITION"
        title="Chicken Feed"
        subtitle="Compare feed brands, nutrition, flock feed planning and feed costs."
      />

      <div className={cardClass}>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveTab("products")} className={`px-4 py-2 rounded-full text-sm font-bold border transition ${activeTab === "products" ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md" : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"}`}>
            🌾 Feed Products
          </button>

          <button onClick={() => setActiveTab("flock-plan")} className={`px-4 py-2 rounded-full text-sm font-bold border transition ${activeTab === "flock-plan" ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md" : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"}`}>
            🐔 Flock Feed Plan
          </button>

          <button onClick={() => setActiveTab("compare")} className={`px-4 py-2 rounded-full text-sm font-bold border transition ${activeTab === "compare" ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md" : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"}`}>
            ⚖️ Feed Compare
          </button>
        </div>
      </div>

      {activeTab === "flock-plan" && <FlockFeedPlan chickens={chickens} />}

      {activeTab === "compare" && (
        <div className={cardClass}>
          <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
            ⚖️ Feed Compare
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <select
              value={compareFeedA}
              onChange={(e) => setCompareFeedA(e.target.value)}
              className="border border-[#d9a441] rounded-2xl p-3 bg-white"
            >
              <option value="">Select First Feed</option>
              {feedProducts.map((feed) => (
                <option key={feed.id} value={feed.id}>
                  {feed.brand} - {feed.product_name}
                </option>
              ))}
            </select>

            <select
              value={compareFeedB}
              onChange={(e) => setCompareFeedB(e.target.value)}
              className="border border-[#d9a441] rounded-2xl p-3 bg-white"
            >
              <option value="">Select Second Feed</option>
              {feedProducts.map((feed) => (
                <option key={feed.id} value={feed.id}>
                  {feed.brand} - {feed.product_name}
                </option>
              ))}
            </select>
          </div>

          {compareFeedA && compareFeedB ? (
            <FeedCompareTable
              feedA={feedProducts.find((f) => String(f.id) === String(compareFeedA))}
              feedB={feedProducts.find((f) => String(f.id) === String(compareFeedB))}
              getCostPerKg={getCostPerKg}
            />
          ) : (
            <div className="text-[#6b5a3a] font-semibold">
              Select two feeds to compare cost, bag size, supplier, nutrition and best use.
            </div>
          )}
        </div>
      )}

      {activeTab === "products" && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className={statClass}>
              <div className="text-[#4b3a1d] text-sm">Feed Products</div>
              <div className="text-3xl font-bold">{feedProducts.length}</div>
            </div>

            <div className={statClass}>
              <div className="text-[#4b3a1d] text-sm">Average Cost</div>
              <div className="text-3xl font-bold">
                R {averageCost.toFixed(2)}
              </div>
            </div>
          </div>

          <div className={cardClass}>
            {!showAddFeedForm ? (
              <button
                onClick={() => setShowAddFeedForm(true)}
                className="bg-[#022312] text-[#f7d37b] rounded-2xl p-4 font-bold w-full sm:w-auto"
              >
                + Add Feed Brand
              </button>
            ) : (
              <>
                <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
                  + Add Feed Brand
                </h2>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[#4b3a1d] font-bold mb-1">
                      Supplier Name
                    </label>
                    <input
                      placeholder="Supplier / Shop"
                      value={newFeedSupplier}
                      onChange={(e) => setNewFeedSupplier(e.target.value)}
                      className="border border-[#d9a441] rounded-2xl p-3 bg-white w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4b3a1d] font-bold mb-1">
                      Feed - Brand Name
                    </label>
                    <input
                      placeholder="Feed Brand"
                      value={newFeedBrand}
                      onChange={(e) => setNewFeedBrand(e.target.value)}
                      className="border border-[#d9a441] rounded-2xl p-3 bg-white w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-[#4b3a1d] font-bold mb-1">
                      Feed Type Name
                    </label>
                    <input
                      placeholder="Product Name"
                      value={newFeedProduct}
                      onChange={(e) => setNewFeedProduct(e.target.value)}
                      className="border border-[#d9a441] rounded-2xl p-3 bg-white w-full"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={addFeedProduct}
                      className="bg-[#022312] text-[#f7d37b] rounded-2xl p-4 font-bold"
                    >
                      + Add Feed Brand
                    </button>

                    <button
                      onClick={() => {
                        setShowAddFeedForm(false);
                        setNewFeedSupplier("");
                        setNewFeedBrand("");
                        setNewFeedProduct("");
                      }}
                      className="bg-gray-500 text-white rounded-2xl p-4 font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={cardClass}>
            <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
              🌾 Feed Products
            </h2>

            {feedProducts.length === 0 && (
              <div className="text-[#6b5a3a] text-sm">
                No feed products added yet.
              </div>
            )}

            <div className="flex flex-col gap-4">
              {feedProducts.map((feed) => {
                const perKg = getCostPerKg(feed);
                const filledNutrition = nutritionFields(feed);

                return (
                  <div key={feed.id} onClick={() => setSelectedFeed(feed)} className="border border-[#d9a441] bg-[#faf7f0] rounded-3xl p-4 cursor-pointer hover:bg-[#f3d39a]/40 transition">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-xl font-extrabold text-[#3d2a10]">
                          {feed.brand}
                        </div>

                        <div className="text-[#4b3a1d]">
                          {feed.product_name}
                        </div>

                        <div className="text-sm text-[#6b5a3a] mt-1">
                          Supplier: {feed.supplier || "Not added"}
                        </div>

                        <div className="text-sm text-[#6b5a3a] mt-1">
                          {feed.best_for || "No purpose selected"}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-green-800">
                          {feed.feed_cost
                            ? `R ${Number(feed.feed_cost).toFixed(2)}`
                            : "No Cost"}
                        </div>

                        <div className="text-sm text-[#6b5a3a]">
                          {feed.bag_size || "No Bag Size"}
                        </div>

                        <div className="text-xs text-[#6b5a3a]">
                          {perKg ? `R ${perKg.toFixed(2)} / kg` : ""}
                        </div>
                      </div>
                    </div>

                    {filledNutrition.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 text-sm">
                        {filledNutrition.map(([label, value]: any) => (
                          <div key={label} className={statClass}>
                            <div className="text-[#4b3a1d]">{label}</div>
                            <div className="font-bold">{value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
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
    <div className="flex justify-between items-center gap-3 border-b border-[#d9a441]/40 pb-2">
      <span className="text-[#4b3a1d] font-semibold">{label}</span>

      {editing ? (
        <input
          type={type}
          value={value || ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="border border-[#d9a441] rounded-xl p-2 w-48 bg-white"
        />
      ) : (
        <span className="font-semibold text-right">{value || "-"}</span>
      )}
    </div>
  );
}

function FeedCompareTable({ feedA, feedB, getCostPerKg }: any) {
  if (!feedA || !feedB) return null;

  const costA = getCostPerKg(feedA);
  const costB = getCostPerKg(feedB);

  const rows = [
    ["Supplier", feedA.supplier || "-", feedB.supplier || "-"],
    ["Brand", feedA.brand || "-", feedB.brand || "-"],
    ["Product", feedA.product_name || "-", feedB.product_name || "-"],
    ["Best For", feedA.best_for || "-", feedB.best_for || "-"],
    ["Bag Size", feedA.bag_size || "-", feedB.bag_size || "-"],
    [
      "Feed Cost",
      feedA.feed_cost ? `R ${Number(feedA.feed_cost).toFixed(2)}` : "-",
      feedB.feed_cost ? `R ${Number(feedB.feed_cost).toFixed(2)}` : "-",
    ],
    [
      "Cost / KG",
      costA ? `R ${costA.toFixed(2)}` : "-",
      costB ? `R ${costB.toFixed(2)}` : "-",
    ],
    ["Protein", feedA.protein || "-", feedB.protein || "-"],
    ["Fat / Oils", feedA.fat_oils || "-", feedB.fat_oils || "-"],
    ["Fibre", feedA.fibre || "-", feedB.fibre || "-"],
    ["Calcium", feedA.calcium || "-", feedB.calcium || "-"],
    ["Phosphorus", feedA.phosphorus || "-", feedB.phosphorus || "-"],
    ["Moisture", feedA.moisture || "-", feedB.moisture || "-"],
    ["Lysine", feedA.lysine || "-", feedB.lysine || "-"],
    ["Methionine", feedA.methionine || "-", feedB.methionine || "-"],
    ["Salt / Sodium", feedA.salt_sodium || "-", feedB.salt_sodium || "-"],
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-[#d9a441] bg-white/50">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-[#f7b267] via-[#f3d39a] to-[#dcecc8]">
            <th className="text-left p-3 text-[#3d2a10]">Compare</th>
            <th className="p-3 text-[#3d2a10]">
              {feedA.brand} {feedA.product_name}
            </th>
            <th className="p-3 text-[#3d2a10]">
              {feedB.brand} {feedB.product_name}
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map(([label, a, b]: any) => (
            <tr key={label} className="border-t border-[#d9a441]/40">
              <td className="p-3 font-bold text-[#4b3a1d]">{label}</td>
              <td className="p-3 text-center text-[#4b3a1d]">{a}</td>
              <td className="p-3 text-center text-[#4b3a1d]">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}