export default function ExpenseCard({ expense }) {
  return (
    <div className="bg-[#161e32] p-4 rounded-xl border border-gray-700 mb-3">
      <h3 className="font-semibold text-lg">{expense.title}</h3>
      <p className="text-gray-400">Category: {expense.category}</p>
      <p className="text-purple-400 font-bold">
        ₹{expense.amount}
      </p>
      <p className="text-sm text-gray-500">
        {new Date(expense.date).toLocaleDateString()}
      </p>
    </div>
  );
}
