import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Savings() {
  const [savings, setSavings] = useState([]);
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [deadline, setDeadline] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [activeGoal, setActiveGoal] = useState(null);

  const navigate = useNavigate();

  const load = async () => {
    const { data } = await API.get("/savings");
    setSavings(data);
  };

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/savings/create", {
      title,
      targetAmount: target,
      savedAmount: saved,
      deadline,
    });

    setTitle("");
    setTarget("");
    setSaved("");
    setDeadline("");
    load();
  };

  const openAddMore = (goal) => {
    setActiveGoal(goal);
    setShowAdd(true);
  };

  const addMoreSubmit = async () => {
    await API.put(`/savings/add-amount/${activeGoal._id}`, {
      amount: addAmount,
    });

    setShowAdd(false);
    setAddAmount("");
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-[#101726] p-6 rounded-2xl shadow-xl text-white relative">

      <button
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h2 className="text-3xl font-bold mb-6">Savings Goals</h2>

      <div className="bg-[#161e32] p-5 rounded-xl mb-6">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            className="p-3 bg-[#101626] rounded"
            placeholder="Goal Title (e.g., New Phone)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="p-3 bg-[#101626] rounded"
            placeholder="Target Amount"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <input
            className="p-3 bg-[#101626] rounded"
            placeholder="Saved Amount"
            value={saved}
            onChange={(e) => setSaved(e.target.value)}
          />
          <input
            className="p-3 bg-[#101626] rounded"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded">
            Add Saving Goal
          </button>
        </form>
      </div>

      <div className="space-y-5">
        {savings.map((s) => {
          const progress = (s.savedAmount / s.targetAmount) * 100;

          return (
            <div
              key={s._id}
              className="bg-[#161e32] p-4 rounded-xl shadow-md"
            >
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-gray-300">
                Saved: ₹{s.savedAmount.toLocaleString("en-IN")} / ₹
                {s.targetAmount.toLocaleString("en-IN")}
              </p>

              <div className="w-full bg-gray-700 h-3 rounded mt-2">
                <div
                  className="h-3 bg-purple-500 rounded"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {s.deadline && (
                <p className="text-gray-400 text-sm mt-2">
                  Deadline: {new Date(s.deadline).toLocaleDateString()}
                </p>
              )}

              <button
                onClick={() => openAddMore(s)}
                className="mt-3 bg-purple-600 py-2 px-4 rounded-lg text-sm hover:bg-purple-700"
              >
                Add More
              </button>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-[#161e32] p-6 rounded-xl w-full max-w-sm">
            <h3 className="text-xl font-semibold mb-4">
              Add Amount to {activeGoal.title}
            </h3>

            <input
              className="p-3 w-full bg-[#101626] rounded mb-4"
              placeholder="Enter amount"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                className="flex-1 bg-purple-600 p-3 rounded-lg"
                onClick={addMoreSubmit}
              >
                Add
              </button>
              <button
                className="flex-1 bg-gray-700 p-3 rounded-lg"
                onClick={() => setShowAdd(false)}
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
