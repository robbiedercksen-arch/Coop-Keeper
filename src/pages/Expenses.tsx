import PageBanner from "../components/PageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Expenses() {

  const [title, setTitle] = useState("");
    const [category, setCategory] =
    useState("Feed");

  const [expenseDate, setExpenseDate] =
    useState("");

    

  const [notes, setNotes] = useState("");

  const [recurring, setRecurring] =
    useState(false);

  const [expenses, setExpenses] =
    useState<any[]>([]);

    const [feedProducts, setFeedProducts] =
  useState<any[]>([]);

const [newFeedBrand, setNewFeedBrand] =
  useState("");

const [newFeedProduct, setNewFeedProduct] =
  useState("");

const [selectedFeed, setSelectedFeed] =
  useState("");

  const [bagSize, setBagSize] =
  useState("");

  const [showAddFeedModal, setShowAddFeedModal] =
  useState(false);

const [showDeleteFeedModal, setShowDeleteFeedModal] =
  useState(false);

const [qty, setQty] =
  useState("1");

  const [unitPrice, setUnitPrice] =
  useState("");

const subtotal =
  Number(qty || 0) *
  Number(unitPrice || 0);

const [slipFiles, setSlipFiles] =
  useState<File[]>([]);

  const [selectedSlipImages, setSelectedSlipImages] =
  useState<string[]>([]);

const [showSlipViewer, setShowSlipViewer] =
  useState(false);

const [activeSlipIndex, setActiveSlipIndex] =
  useState(0);

  useEffect(() => {
  loadExpenses();
  loadFeedProducts();
}, []);

const loadExpenses = async () => {

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setExpenses(data || []);
};

const loadFeedProducts = async () => {

  const { data, error } = await supabase
    .from("feed_products")
    .select("*")
    .order("brand");

  if (error) {
    console.error(error);
    return;
  }

  setFeedProducts(data || []);
};

const addFeedProduct = async () => {

  if (!newFeedBrand || !newFeedProduct)
    return;

  const { error } = await supabase
    .from("feed_products")
    .insert([
      {
        brand: newFeedBrand,
        product_name: newFeedProduct,
        category: "Chicken Feed",
      },
    ]);

  if (error) {
    console.error(error);
    return;
  }

  setNewFeedBrand("");
  setNewFeedProduct("");

  loadFeedProducts();
};

const deleteFeedProduct = async () => {

  if (!selectedFeed) return;

  const selected = feedProducts.find(
    (feed) =>
      `${feed.brand} - ${feed.product_name}` ===
      selectedFeed
  );

  if (!selected) return;

  const { error } = await supabase
    .from("feed_products")
    .delete()
    .eq("id", selected.id);

  if (error) {
    console.error(error);
    return;
  }

  setSelectedFeed("");

  loadFeedProducts();
};
const addExpense = async () => {

  if (!title || subtotal <= 0) return;
const uploadedSlipUrls: string[] = [];

for (const file of slipFiles) {

  const fileName =
    `${Date.now()}-${file.name}`;

  const { error: uploadError } =
    await supabase.storage
      .from("expense-slips")
      .upload(fileName, file);

  if (uploadError) {
    console.error(uploadError);
    continue;
  }

  const { data } = supabase
    .storage
    .from("expense-slips")
    .getPublicUrl(fileName);

  uploadedSlipUrls.push(
    data.publicUrl
  );
}
console.log(uploadedSlipUrls);

const { error } = await supabase
  .from("expenses")
  .insert([
    {
      title,
      amount: subtotal,
      category,
      expense_date: expenseDate,
      notes,
      recurring,

      feed_product: selectedFeed,
      bag_size: bagSize,
      qty: Number(qty),
      unit_price: Number(unitPrice),

      slip_images: uploadedSlipUrls,
    },
  ]);

  if (error) {
    console.error(error);
    return;
  }

  setTitle("");
  setCategory("Feed");
  setExpenseDate("");
  setNotes("");
  setRecurring(false);

setQty("1");
setUnitPrice("");
setBagSize("");
setSelectedFeed("");
setSlipFiles([]);

  loadExpenses();
};

      const deleteExpense = async (
    id: number
  ) => {

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadExpenses();
  };

  const totalExpenses =
    expenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">

      <PageBanner
        eyebrow="FINANCES"
        title="Expenses Tracker"
        subtitle="Track farm spending, costs and recurring expenses."
        stat={`R ${totalExpenses}`}
        statLabel="TOTAL"
      />

      {/* FORM */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">

        <h2 className="text-lg font-semibold">
          💰 Add Expense
        </h2>

        <input
          placeholder="Expense Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="border rounded-xl p-3"
        />

        
        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
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
        {/* FEED PRODUCT SELECTOR */}
{category === "Feed" && (

  <div className="flex flex-col gap-3">

    <select
  value={selectedFeed}
  onChange={(e) =>
    setSelectedFeed(e.target.value)
  }
  className="border rounded-xl p-3"
>

  <option value="">
    Select Feed Product
  </option>

  {feedProducts.map((feed) => (

    <option
      key={feed.id}
      value={`${feed.brand} - ${feed.product_name}`}
    >
      {feed.brand} - {feed.product_name}
    </option>

  ))}

</select>

<div className="flex gap-2">

  <button
    onClick={() =>
      setShowAddFeedModal(true)
    }
    className="
      flex-1
      bg-blue-500
      text-white
      rounded-xl
      p-3
      font-semibold
    "
  >
    + Add Feed Brand
  </button>

  <button
    onClick={() =>
      setShowDeleteFeedModal(true)
    }
    className="
      flex-1
      bg-red-500
      text-white
      rounded-xl
      p-3
      font-semibold
    "
  >
    🗑 Delete Feed Brand
  </button>

</div>
<select
  value={bagSize}
  onChange={(e) =>
    setBagSize(e.target.value)
  }
  className="border rounded-xl p-3"
>

  <option value="">
    Select Bag Size
  </option>

  <option>5KG</option>
  <option>10KG</option>
  <option>20KG</option>
  <option>25KG</option>
  <option>40KG</option>
  <option>50KG</option>
  <option>60KG</option>
  <option>80KG</option>
  <option>100KG</option>

</select>
<input
  type="number"
  placeholder="Quantity"
  value={qty}
  onChange={(e) =>
    setQty(e.target.value)
  }
  className="border rounded-xl p-3"
/>
<input
  type="number"
  placeholder="Price Per Bag / Unit"
  value={unitPrice}
  onChange={(e) =>
    setUnitPrice(e.target.value)
  }
  className="border rounded-xl p-3"
/>
<div className="bg-green-50 border border-green-200 rounded-2xl p-4">

  <div className="text-sm text-gray-500">
    Subtotal
  </div>

  <div className="text-2xl font-bold text-green-700">
    R {subtotal.toFixed(2)}
  </div>

</div>
  </div>

)}
        <input
          type="date"
          value={expenseDate}
          onChange={(e) =>
            setExpenseDate(e.target.value)
          }
          className="border rounded-xl p-3"
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          className="border rounded-xl p-3"
        />
<div className="flex flex-col gap-2">

  <div className="font-semibold text-sm">
    📸 Purchase Slips
  </div>

  <input
    type="file"
    accept="image/*"
    multiple
    capture="environment"
    onChange={(e) =>
      setSlipFiles(
        Array.from(e.target.files || [])
      )
    }
    className="border rounded-xl p-3"
  />

  {slipFiles.length > 0 && (

    <div className="text-sm text-gray-500">
      {slipFiles.length} slip(s) selected
    </div>

  )}

</div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) =>
              setRecurring(e.target.checked)
            }
          />

          Recurring Expense
        </label>

        <button
          onClick={addExpense}
          className="
            bg-green-600
            text-white
            rounded-xl
            p-3
            font-semibold
          "
        >
          + Add Expense
        </button>

      </div>

      {/* HISTORY */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">

        <h2 className="text-lg font-semibold mb-4">
          📜 Expense History
        </h2>

        <div className="flex flex-col gap-3">

          {expenses.map((expense) => (

            <div
              key={expense.id}
              className="
                border
                rounded-2xl
                p-4
                flex
                justify-between
                items-start
              "
            >

              <div>

  {/* TITLE */}
  <div className="font-bold text-lg">
    {expense.title}
  </div>

  {/* CATEGORY */}
  <div className="text-sm text-gray-500">
    {expense.category}
  </div>

  {/* DATE */}
  <div className="text-sm text-gray-400 mb-2">
    {expense.expense_date}
  </div>

  {/* FEED PRODUCT */}
  {expense.feed_product && (
    <div className="text-sm">
      <span className="font-semibold">
        Feed Product:
      </span>{" "}
      {expense.feed_product}
    </div>
  )}

  {/* BAG SIZE */}
  {expense.bag_size && (
    <div className="text-sm">
      <span className="font-semibold">
        Bag Size:
      </span>{" "}
      {expense.bag_size}
    </div>
  )}

  {/* QUANTITY */}
  {expense.qty && (
    <div className="text-sm">
      <span className="font-semibold">
        Quantity:
      </span>{" "}
      {expense.qty}
    </div>
  )}

  {/* NOTES */}
  {expense.notes && (
    <div className="text-sm mt-2 bg-gray-50 rounded-xl p-2">
      <span className="font-semibold">
        Notes:
      </span>{" "}
      {expense.notes}
    </div>
  )}

  {/* SLIP THUMBNAILS */}
  {expense.slip_images &&
   expense.slip_images.length > 0 && (

    <div className="flex gap-2 mt-3 flex-wrap">

      {expense.slip_images.map(
        (
          image: string,
          index: number
        ) => (

          <img
            key={index}
            src={image}
            alt="Slip"
            onClick={() => {

              setSelectedSlipImages(
                expense.slip_images
              );

              setActiveSlipIndex(index);

              setShowSlipViewer(true);
            }}
            className="
              w-20
              h-20
              object-cover
              rounded-xl
              border
              cursor-pointer
              hover:scale-105
              transition
            "
          />

        )
      )}

    </div>

  )}

</div>

<div className="text-right min-w-[90px]">

  <div className="font-bold text-xl text-green-700">
    R {Number(expense.amount).toFixed(2)}
  </div>

                {expense.recurring && (
                  <div className="text-xs text-blue-500">
                    Recurring
                  </div>
                )}

                <button
                  onClick={() =>
                    deleteExpense(expense.id)
                  }
                  className="
                    mt-3
                    bg-red-500
                    text-white
                    px-3
                    py-2
                    rounded-xl
                    text-sm
                  "
                >
                  🗑 Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
{/* ADD FEED MODAL */}
{showAddFeedModal && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-3xl p-6 w-full max-w-md flex flex-col gap-4">

      <h2 className="text-xl font-bold">
        + Add Feed Product
      </h2>

      <input
        placeholder="Brand"
        value={newFeedBrand}
        onChange={(e) =>
          setNewFeedBrand(e.target.value)
        }
        className="border rounded-xl p-3"
      />

      <input
        placeholder="Product Name"
        value={newFeedProduct}
        onChange={(e) =>
          setNewFeedProduct(e.target.value)
        }
        className="border rounded-xl p-3"
      />

      <div className="flex gap-2">

        <button
          onClick={() =>
            setShowAddFeedModal(false)
          }
          className="
            flex-1
            bg-gray-200
            rounded-xl
            p-3
            font-semibold
          "
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await addFeedProduct();
            setShowAddFeedModal(false);
          }}
          className="
            flex-1
            bg-blue-500
            text-white
            rounded-xl
            p-3
            font-semibold
          "
        >
          Save Feed Product
        </button>

      </div>

    </div>

  </div>

)}

{/* DELETE FEED MODAL */}
{showDeleteFeedModal && (

  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-3xl p-6 w-full max-w-md flex flex-col gap-4">

      <h2 className="text-xl font-bold text-red-500">
        Delete Feed Product
      </h2>

      <div className="text-sm text-gray-500">
        Are you sure you want to delete:
      </div>

      <div className="font-semibold">
        {selectedFeed || "No Feed Selected"}
      </div>

      <div className="flex gap-2">

        <button
          onClick={() =>
            setShowDeleteFeedModal(false)
          }
          className="
            flex-1
            bg-gray-200
            rounded-xl
            p-3
            font-semibold
          "
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await deleteFeedProduct();
            setShowDeleteFeedModal(false);
          }}
          className="
            flex-1
            bg-red-500
            text-white
            rounded-xl
            p-3
            font-semibold
          "
        >
          Delete
        </button>

      </div>

    </div>

  </div>

)}
{/* SLIP VIEWER */}
{showSlipViewer && (

  <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">

    <button
      onClick={() =>
        setShowSlipViewer(false)
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
        setActiveSlipIndex((prev) =>
          prev === 0
            ? selectedSlipImages.length - 1
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
        selectedSlipImages[
          activeSlipIndex
        ]
      }
      className="
        max-w-[90%]
        max-h-[85%]
        rounded-2xl
      "
    />

    <button
      onClick={() =>
        setActiveSlipIndex((prev) =>
          prev ===
          selectedSlipImages.length - 1
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