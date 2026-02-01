import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CATEGORY_OPTIONS = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Groceries",
  "Entertainment",
  "Subscriptions",
  "Transport",
  "Health",
  "Others",
];

export default function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const filteredSuggestions = CATEGORY_OPTIONS.filter((c) =>
    c.toLowerCase().includes(category.toLowerCase())
  );

  const formattedAmount = amount
    ? `₹${Number(amount).toLocaleString("en-IN")}`
    : "₹0";

  const submit = async (e) => {
    e.preventDefault();

    if (!title || !amount || !category || !date) {
      setError("All fields are required");
      return;
    }

    try {
      await API.post("/expenses/create", {
        title,
        amount,
        category,
        date,
      });
      setError(null);
      setSuccess("Expense saved successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setSuccess(null);
      setError("Error saving expense. Try again.");
    }
  };

  return (
    <div className="bg-[#101726] p-6 rounded-2xl max-w-lg mx-auto shadow-xl text-white">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
      >
        <ArrowLeft size={22} /> Back
      </button>

      <h2 className="text-3xl font-bold mb-6">Add New Expense</h2>

      {success && (
        <div className="bg-green-600/20 border border-green-400 text-green-300 p-4 rounded-xl mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-600/20 border border-red-400 text-red-300 p-4 rounded-xl mb-4">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-5">
        <input
          className="p-3 bg-[#161e32] rounded-lg border border-gray-700 text-gray-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Expense Title"
        />

        <div>
          <input
            className="p-3 w-full bg-[#161e32] rounded-lg border border-gray-700 text-gray-300"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (₹)"
            type="number"
          />
          {amount && (
            <p className="text-gray-400 text-sm mt-1">
              {formattedAmount}
            </p>
          )}
        </div>

        <div className="relative">
          <input
            className="p-3 w-full bg-[#161e32] rounded-lg border border-gray-700 text-gray-300"
            value={category}
            placeholder="Category"
            onChange={(e) => {
              setCategory(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 150);
            }}
            onFocus={() => setShowSuggestions(true)}
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute w-full bg-[#1a2238] border border-gray-700 rounded-lg mt-1 max-h-40 overflow-y-auto z-50">
              {filteredSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onMouseDown={() => {
                    setCategory(item);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#222c45]"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          className="p-3 bg-[#161e32] rounded-lg border border-gray-700 text-gray-300"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
        />

        <button
          className="py-3 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
          type="submit"
        >
          Save Expense
        </button>
      </form>

      {(title || amount || category || date) && (
        <div className="mt-8 bg-[#161e32] p-5 rounded-2xl border border-gray-700">
          <p>{title}</p>
          <p>{formattedAmount}</p>
          <p>{category}</p>
          <p>{new Date(date).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}
