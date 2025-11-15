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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [insights, setInsights] = useState("");
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  useEffect(() => {
    fetchMonthly();
    fetchInsights();
  }, []);

  const fetchMonthly = async () => {
    try {
      const { data } = await API.get(`/expenses/monthly/${year}/${month}`);
      setData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInsights = async () => {
    try {
      const { data } = await API.get(`/ai/insights/${year}/${month}`);
      setInsights(data.insights);
    } catch (err) {
      console.error(err);
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

      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-[#161e32] p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>

          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-gray-400">No expense data available.</p>
          ) : (
            <Bar data={chartData} />
          )}
        </div>

        <div className="bg-[#161e32] p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">AI Insights</h3>

          {!insights ? (
            <p className="text-gray-400">No insights yet</p>
          ) : (
            <div className="space-y-5 text-gray-200 leading-relaxed">
              <div className="bg-[#101626] p-4 rounded-lg border border-gray-700">
                <div
                  className="prose prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: insights.replace(/\n/g, "<br/>"),
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 bg-[#161e32] p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Recent Expenses</h3>

        {data.length === 0 ? (
          <p className="text-gray-400">No expenses added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {data
              .slice()
              .reverse()
              .map((e) => (
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

                  <p className="text-lg font-bold text-purple-400">
                    ₹{e.amount}
                  </p>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

