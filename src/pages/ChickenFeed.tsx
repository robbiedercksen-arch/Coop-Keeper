import PageBanner from "../components/PageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function ChickenFeed() {
  const [feedProducts, setFeedProducts] = useState<any[]>([]);

  const [newFeedBrand, setNewFeedBrand] = useState("");
  const [newFeedProduct, setNewFeedProduct] = useState("");

  const [selectedFeedId, setSelectedFeedId] = useState("");
  const [bagSize, setBagSize] = useState("");
  const [feedCost, setFeedCost] = useState("");

  const [ingredientName, setIngredientName] = useState("");
  const [ingredientQty, setIngredientQty] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("g/kg");

  useEffect(() => {
    loadFeedProducts();
  }, []);

  const normalizeIngredients = (ingredients: any) => {
    if (Array.isArray(ingredients)) return ingredients;

    if (typeof ingredients === "string") {
      try {
        const parsed = JSON.parse(ingredients);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

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
    if (!newFeedBrand || !newFeedProduct) {
      alert("Please add feed brand and product name.");
      return;
    }

    const { error } = await supabase
      .from("feed_products")
      .insert([
        {
          brand: newFeedBrand,
          product_name: newFeedProduct,
          category: "Chicken Feed",
          bag_size: bagSize,
          feed_cost: feedCost ? Number(feedCost) : null,
          ingredients: [],
        },
      ]);

    if (error) {
      console.error(error);
      alert("Could not add feed product.");
      return;
    }

    setNewFeedBrand("");
    setNewFeedProduct("");
    setBagSize("");
    setFeedCost("");

    await loadFeedProducts();
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

    await loadFeedProducts();
  };

  const updateFeedDetails = async (feed: any) => {
    const { error } = await supabase
      .from("feed_products")
      .update({
        bag_size: feed.bag_size || null,
        feed_cost: feed.feed_cost ? Number(feed.feed_cost) : null,
        ingredients: normalizeIngredients(feed.ingredients),
      })
      .eq("id", feed.id);

    if (error) {
      console.error(error);
      alert("Could not update feed.");
      return;
    }

    await loadFeedProducts();
    alert("Feed details saved.");
  };

  const addIngredient = async () => {
    if (!selectedFeedId || !ingredientName || !ingredientQty) {
      alert("Please select a feed and complete ingredient details.");
      return;
    }

    const feed = feedProducts.find(
      (item) => String(item.id) === String(selectedFeedId)
    );

    if (!feed) {
      alert("Feed product not found.");
      return;
    }

    const currentIngredients = normalizeIngredients(feed.ingredients);

    const updatedIngredients = [
      ...currentIngredients,
      {
        name: ingredientName,
        qty: Number(ingredientQty),
        unit: ingredientUnit,
      },
    ];

    const { error } = await supabase
      .from("feed_products")
      .update({
        ingredients: updatedIngredients,
      })
      .eq("id", feed.id);

    if (error) {
      console.error("Ingredient Save Error:", error);
      alert(JSON.stringify(error));
      return;
    }

    setIngredientName("");
    setIngredientQty("");
    setIngredientUnit("g/kg");

    await loadFeedProducts();

    alert("Ingredient added successfully.");
  };

  const deleteIngredient = async (feed: any, index: number) => {
    const updatedIngredients = normalizeIngredients(feed.ingredients);

    updatedIngredients.splice(index, 1);

    const { error } = await supabase
      .from("feed_products")
      .update({
        ingredients: updatedIngredients,
      })
      .eq("id", feed.id);

    if (error) {
      console.error(error);
      alert("Could not delete ingredient.");
      return;
    }

    await loadFeedProducts();
  };

  const feedWithIngredients = feedProducts.filter(
    (feed) => normalizeIngredients(feed.ingredients).length > 0
  ).length;

  const totalCost = feedProducts.reduce(
    (sum, feed) => sum + Number(feed.feed_cost || 0),
    0
  );

  const averageCost =
    feedProducts.length === 0 ? 0 : totalCost / feedProducts.length;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">

      <PageBanner
        eyebrow="NUTRITION"
        title="Chicken Feed"
        subtitle="Compare feed brands, ingredients, bag sizes and costs."
        stat={feedProducts.length}
        statLabel="FEEDS"
      />

      <div className="grid grid-cols-3 gap-3">

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Feed Products</div>
          <div className="text-3xl font-bold">{feedProducts.length}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">With Ingredients</div>
          <div className="text-3xl font-bold">{feedWithIngredients}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-gray-500 text-sm">Average Cost</div>
          <div className="text-3xl font-bold">
            R {averageCost.toFixed(2)}
          </div>
        </div>

      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-3">

        <h2 className="text-xl font-semibold">
          + Add Feed Brand
        </h2>

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

        <input
          placeholder="Feed Bag Size e.g. 40KG"
          value={bagSize}
          onChange={(e) => setBagSize(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <input
          type="number"
          placeholder="Feed Cost"
          value={feedCost}
          onChange={(e) => setFeedCost(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <button
          onClick={addFeedProduct}
          className="bg-green-600 text-white rounded-2xl p-4 font-semibold"
        >
          + Add Feed Brand
        </button>

      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm flex flex-col gap-3">

        <h2 className="text-xl font-semibold">
          + Add Ingredient To Feed
        </h2>

        <select
          value={selectedFeedId}
          onChange={(e) => setSelectedFeedId(e.target.value)}
          className="border rounded-2xl p-3"
        >
          <option value="">Select Feed Product</option>

          {feedProducts.map((feed) => (
            <option key={feed.id} value={feed.id}>
              {feed.brand} - {feed.product_name}
            </option>
          ))}
        </select>

        <input
          placeholder="Ingredient Name e.g. Protein"
          value={ingredientName}
          onChange={(e) => setIngredientName(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <input
          type="number"
          placeholder="Ingredient Quantity"
          value={ingredientQty}
          onChange={(e) => setIngredientQty(e.target.value)}
          className="border rounded-2xl p-3"
        />

        <select
          value={ingredientUnit}
          onChange={(e) => setIngredientUnit(e.target.value)}
          className="border rounded-2xl p-3"
        >
          <option>g/kg</option>
          <option>%</option>
          <option>mg/kg</option>
          <option>IU/kg</option>
        </select>

        <button
          onClick={addIngredient}
          className="bg-blue-600 text-white rounded-2xl p-4 font-semibold"
        >
          + Add Ingredient
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
            const ingredients = normalizeIngredients(feed.ingredients);

            return (
              <div
                key={feed.id}
                className="border rounded-3xl p-4 flex flex-col gap-4"
              >

                <div className="flex justify-between gap-4">

                  <div>
                    <div className="text-xl font-bold">
                      {feed.brand}
                    </div>

                    <div className="text-gray-500">
                      {feed.product_name}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteFeedProduct(feed.id)}
                    className="bg-red-500 text-white rounded-xl px-4 py-2 font-semibold"
                  >
                    🗑 Delete
                  </button>

                </div>

                <div className="grid grid-cols-2 gap-3">

                  <div className="bg-gray-50 rounded-2xl p-3">
                    <div className="text-gray-500 text-sm">
                      Bag Size
                    </div>

                    <input
                      value={feed.bag_size || ""}
                      onChange={(e) => {
                        const updated = feedProducts.map((item) =>
                          item.id === feed.id
                            ? { ...item, bag_size: e.target.value }
                            : item
                        );

                        setFeedProducts(updated);
                      }}
                      className="border rounded-xl p-2 w-full mt-1"
                      placeholder="40KG"
                    />
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-3">
                    <div className="text-gray-500 text-sm">
                      Feed Cost
                    </div>

                    <input
                      type="number"
                      value={feed.feed_cost || ""}
                      onChange={(e) => {
                        const updated = feedProducts.map((item) =>
                          item.id === feed.id
                            ? { ...item, feed_cost: e.target.value }
                            : item
                        );

                        setFeedProducts(updated);
                      }}
                      className="border rounded-xl p-2 w-full mt-1"
                      placeholder="365"
                    />
                  </div>

                </div>

                <button
                  onClick={() => updateFeedDetails(feed)}
                  className="bg-green-600 text-white rounded-2xl p-3 font-semibold"
                >
                  Save Feed Details
                </button>

                <div>
                  <h3 className="font-semibold mb-2">
                    Ingredients
                  </h3>

                  {ingredients.length === 0 && (
                    <div className="text-sm text-gray-400">
                      No ingredients added yet.
                    </div>
                  )}

                  <div className="flex flex-col gap-2">

                    {ingredients.map(
                      (ingredient: any, index: number) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-2xl p-3 flex justify-between items-center"
                        >
                          <div>
                            <div className="font-semibold">
                              {ingredient.name}
                            </div>

                            <div className="text-sm text-gray-500">
                              {ingredient.qty} {ingredient.unit}
                            </div>
                          </div>

                          <button
                            onClick={() => deleteIngredient(feed, index)}
                            className="bg-red-500 text-white rounded-xl px-3 py-2 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}