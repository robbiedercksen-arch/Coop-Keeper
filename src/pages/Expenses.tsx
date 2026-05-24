import PageBanner from "../components/PageBanner";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Expenses() {

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] =
    useState("Feed");

  const [expenseDate, setExpenseDate] =
    useState("");

  const [notes, setNotes] = useState("");

  const [recurring, setRecurring] =
    useState(false);

  const [expenses, setExpenses] =
    useState<any[]>([]);

  useEffect(() => {
    loadExpenses();
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

  const addExpense = async () => {

    if (!title || !amount) return;

    const { error } = await supabase
      .from("expenses")
      .insert([
        {
          title,
          amount: Number(amount),
          category,
          expense_date: expenseDate,
          notes,
          recurring,
        },
      ]);

    if (error) {
      console.error(error);
      return;
    }

    setTitle("");
    setAmount("");
    setCategory("Feed");
    setExpenseDate("");
    setNotes("");
    setRecurring(false);

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

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
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

                <div className="font-bold">
                  {expense.title}
                </div>

                <div className="text-sm text-gray-500">
                  {expense.category}
                </div>

                <div className="text-sm text-gray-400">
                  {expense.expense_date}
                </div>

                {expense.notes && (
                  <div className="text-sm mt-2">
                    {expense.notes}
                  </div>
                )}

              </div>

              <div className="text-right">

                <div className="font-bold text-xl">
                  R {expense.amount}
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

    </div>
  );
}