import CoopPageBanner from "../components/CoopPageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import jsPDF from "jspdf";

const cardClass =
  "rounded-3xl p-5 border border-[#d9a441] bg-[#faf7f0] shadow-[0_16px_34px_rgba(76,54,24,0.16),inset_0_1px_0_rgba(255,255,255,0.8)]";

const statClass =
  "rounded-2xl p-4 text-center bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.16)]";

export default function Expenses() {
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Feed");
  const [expenseDate, setExpenseDate] = useState("");
  const [notes, setNotes] = useState("");
  const [recurring, setRecurring] = useState(false);

  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedExpenseView, setSelectedExpenseView] = useState("");

  const [feedProducts, setFeedProducts] = useState<any[]>([]);
  const [selectedFeed, setSelectedFeed] = useState("");
  const [bagSize, setBagSize] = useState("");

  const [qty, setQty] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");

  const [slipFiles, setSlipFiles] = useState<File[]>([]);
  const [selectedSlipImages, setSelectedSlipImages] = useState<string[]>([]);
  const [showSlipViewer, setShowSlipViewer] = useState(false);
  const [activeSlipIndex, setActiveSlipIndex] = useState(0);

  const subtotal = Number(qty || 0) * Number(unitPrice || 0);

  useEffect(() => {
    loadExpenses();
    loadFeedProducts();
  }, []);

  const loadExpenses = async () => {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("expense_date", { ascending: false });

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

  const addExpense = async () => {
    if (!title || subtotal <= 0) return;

    const uploadedSlipUrls: string[] = [];

    for (const file of slipFiles) {
      const fileName = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("expense-slips")
        .upload(fileName, file);

      if (uploadError) {
        console.error(uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("expense-slips")
        .getPublicUrl(fileName);

      uploadedSlipUrls.push(data.publicUrl);
    }

    const { error } = await supabase.from("expenses").insert([
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
    setShowForm(false);

    loadExpenses();
  };

  const deleteExpense = async (id: number) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    loadExpenses();
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const currentMonthTotal = expenses
    .filter((expense: any) => {
      const date = new Date(expense.expense_date);
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const currentYearTotal = expenses
    .filter(
      (expense: any) =>
        new Date(expense.expense_date).getFullYear() === currentYear
    )
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const expenseMonths = Array.from(
    new Set(
      expenses
        .filter(
          (expense: any) =>
            new Date(expense.expense_date).getFullYear() === currentYear
        )
        .map((expense: any) => {
          const date = new Date(expense.expense_date);
          return `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
        })
    )
  )
    .sort()
    .reverse();

  const expenseYears = Array.from(
    new Set(
      expenses
        .filter(
          (expense: any) =>
            new Date(expense.expense_date).getFullYear() < currentYear
        )
        .map((expense: any) => new Date(expense.expense_date).getFullYear())
    )
  ).sort((a: any, b: any) => b - a);

  const activeExpenseView =
    selectedExpenseView || expenseMonths[0] || `${currentYear}`;

  const filteredExpenses = expenses.filter((expense: any) => {
    const date = new Date(expense.expense_date);

    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (activeExpenseView.includes("-")) {
      return monthKey === activeExpenseView;
    }

    return date.getFullYear().toString() === activeExpenseView;
  });

  const selectedViewTotal = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  const selectedCategoryTotals: any = {};

  filteredExpenses.forEach((expense: any) => {
    if (!selectedCategoryTotals[expense.category]) {
      selectedCategoryTotals[expense.category] = 0;
    }

    selectedCategoryTotals[expense.category] += Number(expense.amount);
  });

  const selectedCategorySummary = Object.entries(selectedCategoryTotals).sort(
    (a: any, b: any) => b[1] - a[1]
  );

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split("-");

    return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  const getMonthsForYear = (year: string) => {
    return Array.from(
      new Set(
        expenses
          .filter(
            (expense: any) =>
              new Date(expense.expense_date).getFullYear().toString() === year
          )
          .map((expense: any) => {
            const date = new Date(expense.expense_date);
            return `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}`;
          })
      )
    ).sort();
  };

  const getExpensesForMonth = (monthKey: string) => {
    return expenses.filter((expense: any) => {
      const date = new Date(expense.expense_date);

      const expenseMonthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      return expenseMonthKey === monthKey;
    });
  };

  const imageToDataUrl = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const downloadExpenseReport = async (
    reportExpenses: any[],
    reportTitle: string,
    fileName: string
  ) => {
    const doc = new jsPDF("p", "mm", "a4");
    let y = 15;

    const addLine = (text: string, size = 10, bold = false) => {
      if (y > 280) {
        doc.addPage();
        y = 15;
      }

      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.text(text, 15, y);
      y += 7;
    };

    const total = reportExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    const categoryTotals: any = {};

    reportExpenses.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }

      categoryTotals[expense.category] += Number(expense.amount);
    });

    addLine("Coop Keeper Farm Expense Report", 16, true);
    addLine(reportTitle, 13, true);
    addLine(`Generated: ${new Date().toLocaleDateString()}`);
    addLine(`Total Expenses: R ${total.toFixed(2)}`, 12, true);

    y += 4;
    addLine("Category Summary", 12, true);

    Object.entries(categoryTotals).forEach(([cat, amount]: any) => {
      addLine(`${cat}: R ${Number(amount).toFixed(2)}`);
    });

    y += 5;
    addLine("Detailed Purchases", 12, true);

    for (const expense of reportExpenses) {
      if (y > 245) {
        doc.addPage();
        y = 15;
      }

      doc.setDrawColor(220);
      doc.roundedRect(12, y - 5, 186, 50, 3, 3);

      addLine(`${expense.title}`, 11, true);
      addLine(`Date: ${expense.expense_date}`);
      addLine(`Category: ${expense.category}`);
      addLine(`Amount: R ${Number(expense.amount).toFixed(2)}`);
      addLine(`Feed Product: ${expense.feed_product || "-"}`);
      addLine(`Bag Size: ${expense.bag_size || "-"}`);
      addLine(`Quantity: ${expense.qty || "-"}`);
      addLine(`Unit Price: R ${Number(expense.unit_price || 0).toFixed(2)}`);
      addLine(`Notes: ${expense.notes || "-"}`);

      y += 5;

      if (expense.slip_images && expense.slip_images.length > 0) {
        addLine("Purchase Slips:", 10, true);

        for (const imageUrl of expense.slip_images) {
          try {
            if (y > 220) {
              doc.addPage();
              y = 15;
            }

            const imageData = await imageToDataUrl(imageUrl);

            doc.addImage(imageData, "JPEG", 15, y, 70, 70);
            y += 78;
          } catch (error) {
            addLine("Slip image could not be added to PDF.");
          }
        }
      }

      y += 8;
    }

    doc.save(fileName);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 px-3 sm:px-4 overflow-hidden">
      <CoopPageBanner
        eyebrow="FINANCES"
        title="Expenses Tracker"
        subtitle="Track farm spending, costs and recurring expenses."
        stats={[
          { label: "This Month", value: `R ${currentMonthTotal.toFixed(2)}` },
          { label: "This Year", value: `R ${currentYearTotal.toFixed(2)}` },
          { label: "Total", value: `R ${totalExpenses.toFixed(2)}` },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={statClass}>
          <div className="text-2xl font-bold text-[#3d2a10]">
            R {currentMonthTotal.toFixed(2)}
          </div>
          <div className="text-sm text-[#4b3a1d]">Month Expenses</div>
        </div>

        <div className={statClass}>
          <div className="text-2xl font-bold text-[#3d2a10]">
            R {currentYearTotal.toFixed(2)}
          </div>
          <div className="text-sm text-[#4b3a1d]">Year Expenses</div>
        </div>

        <div className={statClass}>
          <div className="text-2xl font-bold text-[#3d2a10]">
            R {totalExpenses.toFixed(2)}
          </div>
          <div className="text-sm text-[#4b3a1d]">Total Expenses</div>
        </div>
      </div>

      <div className={cardClass}>
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-[#022312] text-[#f7d37b] rounded-2xl px-5 py-4 font-extrabold shadow-md"
        >
          ➕ Add Expense
        </button>
      </div>

      {showForm && (
  <div className={cardClass}>
    <h2 className="text-xl font-extrabold mb-4 text-[#3d2a10]">
      💰 Add Expense
    </h2>

    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-extrabold text-[#3d2a10]">Expense Info</span>
        <input
          placeholder="Expense Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-[#d9a441] rounded-2xl p-3 bg-white"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-extrabold text-[#3d2a10]">Purchase Category</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-[#d9a441] rounded-2xl p-3 bg-white"
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
      </label>

      {category === "Feed" && (
        <>
          <label className="flex flex-col gap-2">
            <span className="font-extrabold text-[#3d2a10]">
              Choose Feed Type
            </span>
            <select
              value={selectedFeed}
              onChange={(e) => setSelectedFeed(e.target.value)}
              className="border border-[#d9a441] rounded-2xl p-3 bg-white"
            >
              <option value="">Select Feed Type</option>

              {feedProducts.map((feed) => (
                <option
                  key={feed.id}
                  value={`${feed.brand} - ${feed.product_name}`}
                >
                  {feed.brand} - {feed.product_name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-extrabold text-[#3d2a10]">
              Feed Bag Size Selection
            </span>
            <select
              value={bagSize}
              onChange={(e) => setBagSize(e.target.value)}
              className="border border-[#d9a441] rounded-2xl p-3 bg-white"
            >
              <option value="">Select Bag Size</option>
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
          </label>
        </>
      )}

      <label className="flex flex-col gap-2">
        <span className="font-extrabold text-[#3d2a10]">Product Quantity</span>
        <input
          type="number"
          placeholder="Product Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="border border-[#d9a441] rounded-2xl p-3 bg-white"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-extrabold text-[#3d2a10]">Unit Price</span>
        <input
          type="number"
          placeholder="Price Per Unit"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          className="border border-[#d9a441] rounded-2xl p-3 bg-white"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-extrabold text-[#3d2a10]">Purchase Date</span>
        <input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          className="border border-[#d9a441] rounded-2xl p-3 bg-white"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-extrabold text-[#3d2a10]">Additional Notes</span>
        <textarea
          placeholder="Additional Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border border-[#d9a441] rounded-2xl p-3 bg-white"
          rows={3}
        />
      </label>

      <div className="flex flex-col gap-3">
        <span className="font-extrabold text-[#3d2a10]">Invoice Slip</span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="border border-[#d9a441] rounded-2xl p-4 bg-white cursor-pointer font-bold text-[#4b3a1d] text-center">
            📁 Upload Files
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setSlipFiles(Array.from(e.target.files || []))}
              className="hidden"
            />
          </label>

          <label className="border border-[#d9a441] rounded-2xl p-4 bg-white cursor-pointer font-bold text-[#4b3a1d] text-center">
            📷 Camera
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => setSlipFiles(Array.from(e.target.files || []))}
              className="hidden"
            />
          </label>
        </div>

        {slipFiles.length > 0 && (
          <div className="text-sm text-[#6b5a3a] font-semibold">
            {slipFiles.length} slip(s) selected
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-[#4b3a1d] font-semibold">
        <input
          type="checkbox"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
        />
        Recurring Expense
      </label>

      <div className={statClass}>
        <div className="text-sm text-[#4b3a1d]">Subtotal</div>
        <div className="text-2xl font-bold text-[#3d2a10]">
          R {subtotal.toFixed(2)}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={addExpense}
          className="bg-[#022312] text-[#f7d37b] px-5 py-3 rounded-xl font-bold"
        >
          + Add Expense
        </button>

        <button
          onClick={() => setShowForm(false)}
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
          📜 Expense History
        </h2>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
          {expenseMonths.map((monthKey) => (
            <button
              key={monthKey}
              onClick={() => setSelectedExpenseView(monthKey)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-bold border transition ${
                activeExpenseView === monthKey
                  ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md"
                  : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"
              }`}
            >
              {formatMonthLabel(monthKey)}
            </button>
          ))}

          {expenseYears.map((year: any) => (
            <button
              key={year}
              onClick={() => setSelectedExpenseView(String(year))}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-bold border transition ${
                activeExpenseView === String(year)
                  ? "bg-[#022312] text-[#f7d37b] border-[#d9a441] shadow-md"
                  : "bg-[#faf7f0] text-[#4b3a1d] border-[#d9a441]/60 hover:bg-[#f3d39a]"
              }`}
            >
              {year} History
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-4 mb-4 bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441]">
          <div className="font-extrabold mb-3 text-[#3d2a10]">
            📊 Category Summary
          </div>

          {selectedCategorySummary.length === 0 ? (
            <div className="text-sm text-[#6b5a3a]">
              No category expenses for this period.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedCategorySummary.map(([category, amount]: any) => (
                <div
                  key={category}
                  className="flex justify-between items-center bg-white/60 rounded-xl px-3 py-2 text-sm border border-[#d9a441]/50"
                >
                  <div className="font-bold text-[#4b3a1d]">{category}</div>

                  <div className="font-extrabold text-green-800">
                    R {Number(amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl p-4 mb-4 bg-white/60 border border-[#d9a441]/60 flex flex-col gap-2">
          <div className="flex justify-between items-center gap-4">
            <div>
              <div className="text-sm text-[#6b5a3a]">Selected Period Total</div>

              <div className="text-xl font-extrabold text-green-800">
                R {selectedViewTotal.toFixed(2)}
              </div>
            </div>

            {activeExpenseView.includes("-") ? (
              <button
                onClick={() =>
                  downloadExpenseReport(
                    filteredExpenses,
                    `${formatMonthLabel(activeExpenseView)} Expense Report`,
                    `${activeExpenseView}-expense-report.pdf`
                  )
                }
                className="bg-blue-600 text-white rounded-xl px-4 py-2 font-bold"
              >
                Download Month PDF
              </button>
            ) : (
              <button
                onClick={() =>
                  downloadExpenseReport(
                    filteredExpenses,
                    `${activeExpenseView} Full Financial Report`,
                    `${activeExpenseView}-financial-report.pdf`
                  )
                }
                className="bg-blue-600 text-white rounded-xl px-4 py-2 font-bold"
              >
                Download Full Year PDF
              </button>
            )}
          </div>

          {!activeExpenseView.includes("-") && (
            <div className="flex gap-2 overflow-x-auto pt-2">
              {getMonthsForYear(activeExpenseView).map((monthKey) => (
                <button
                  key={monthKey}
                  onClick={() =>
                    downloadExpenseReport(
                      getExpensesForMonth(monthKey),
                      `${formatMonthLabel(monthKey)} Expense Report`,
                      `${monthKey}-expense-report.pdf`
                    )
                  }
                  className="whitespace-nowrap bg-gray-200 text-gray-700 rounded-xl px-3 py-2 text-sm font-bold"
                >
                  Download {formatMonthLabel(monthKey)}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="text-sm text-[#6b5a3a]">
            No expenses for this period.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="rounded-2xl p-4 bg-gradient-to-br from-[#f7b267] via-[#f3d39a] to-[#dcecc8] border border-[#d9a441] shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_22px_rgba(88,54,18,0.12)] flex justify-between items-start gap-4"
              >
                <div>
                  <div className="font-extrabold text-lg text-[#3d2a10]">
                    {expense.title}
                  </div>

                  <div className="text-sm text-[#4b3a1d]">{expense.category}</div>

                  <div className="text-sm text-[#6b5a3a] mb-2">
                    {expense.expense_date}
                  </div>

                  {expense.feed_product && (
                    <div className="text-sm text-[#4b3a1d]">
                      <span className="font-bold">Feed Product:</span>{" "}
                      {expense.feed_product}
                    </div>
                  )}

                  {expense.bag_size && (
                    <div className="text-sm text-[#4b3a1d]">
                      <span className="font-bold">Bag Size:</span>{" "}
                      {expense.bag_size}
                    </div>
                  )}

                  {expense.qty && (
                    <div className="text-sm text-[#4b3a1d]">
                      <span className="font-bold">Quantity:</span> {expense.qty}
                    </div>
                  )}

                  {expense.notes && (
                    <div className="text-sm mt-2 bg-white/60 rounded-xl p-2 text-[#4b3a1d] border border-[#d9a441]/50">
                      <span className="font-bold">Notes:</span> {expense.notes}
                    </div>
                  )}

                  {expense.slip_images && expense.slip_images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {expense.slip_images.map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt="Slip"
                          onClick={() => {
                            setSelectedSlipImages(expense.slip_images);
                            setActiveSlipIndex(index);
                            setShowSlipViewer(true);
                          }}
                          className="w-20 h-20 object-cover rounded-xl border cursor-pointer hover:scale-105 transition"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right min-w-[90px]">
                  <div className="font-extrabold text-xl text-green-800">
                    R {Number(expense.amount).toFixed(2)}
                  </div>

                  {expense.recurring && (
                    <div className="text-xs text-blue-700 font-bold">
                      Recurring
                    </div>
                  )}

                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="mt-3 bg-red-600 text-white px-3 py-2 rounded-xl text-sm font-bold"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSlipViewer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowSlipViewer(false)}
            className="absolute top-5 right-5 text-white text-4xl"
          >
            ×
          </button>

          <button
            onClick={() =>
              setActiveSlipIndex((prev) =>
                prev === 0 ? selectedSlipImages.length - 1 : prev - 1
              )
            }
            className="absolute left-4 text-white text-5xl"
          >
            ‹
          </button>

          <img
            src={selectedSlipImages[activeSlipIndex]}
            className="max-w-[90%] max-h-[85%] rounded-2xl"
          />

          <button
            onClick={() =>
              setActiveSlipIndex((prev) =>
                prev === selectedSlipImages.length - 1 ? 0 : prev + 1
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