import React, { useEffect, useState } from "react";
import API from "../api/axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Trash2 } from "lucide-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Dashboard() {
  const now = new Date();

  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  useEffect(() => {
    const load = async () => {
      await fetchMonthly();
      await fetchInsights();
    };
    load();
  }, [year, month]);

  const fetchMonthly = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/expenses/monthly/${year}/${month}`);
      setData(res.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await API.get(`/ai/insights/${year}/${month}`);
      setInsights(res.data?.insights || "");
    } catch {
      setInsights("");
    }
  };

  const openDeleteModal = (id) => {
    setSelectedExpenseId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/expenses/${selectedExpenseId}`);
      setData((prev) => prev.filter((e) => e._id !== selectedExpenseId));
    } finally {
      setShowDeleteConfirm(false);
      setSelectedExpenseId(null);
    }
  };

  const categoryTotals = data.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Amount",
        data: Object.values(categoryTotals),
        backgroundColor: "rgba(139, 92, 246, 0.8)",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="bg-[#101726] min-h-screen text-white p-6 rounded-2xl shadow-xl">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold">Dashboard</h2>

        <div className="flex gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-[#161e32] border border-gray-700 rounded-lg px-4 py-2"
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-[#161e32] border border-gray-700 rounded-lg px-4 py-2"
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const y = now.getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#161e32] p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Category Breakdown
              </h3>

              {Object.keys(categoryTotals).length === 0 ? (
                <p className="text-gray-400">No expenses for this month.</p>
              ) : (
                <Bar data={chartData} />
              )}
            </div>

            <div className="bg-[#161e32] p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4">AI Insights</h3>

              {!insights ? (
                <p className="text-gray-400">No insights available.</p>
              ) : (
                <div className="bg-[#101626] p-4 rounded-lg border border-gray-700 text-gray-200">
                  <div
                    className="prose prose-invert"
                    dangerouslySetInnerHTML={{
                      __html: insights.replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 bg-[#161e32] p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>

            {data.length === 0 ? (
              <p className="text-gray-400">No expenses found.</p>
            ) : (
              <ul className="divide-y divide-gray-700">
                {[...data].reverse().map((e) => (
                  <li
                    key={e._id}
                    className="py-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{e.title}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(e.date).toLocaleDateString()} — {e.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold text-purple-400">
                        ₹{e.amount}
                      </p>

                      <button
                        onClick={() => openDeleteModal(e._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#161e32] p-6 rounded-2xl w-full max-w-sm border border-gray-700 shadow-xl">
            <h3 className="text-xl font-semibold text-red-400 mb-3">
              Delete Expense?
            </h3>

            <p className="text-gray-300 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
              >
                Delete
              </button>

              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

