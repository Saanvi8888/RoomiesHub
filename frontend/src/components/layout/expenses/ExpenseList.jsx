import { Pencil, Trash2, ArrowRight } from "lucide-react";

export default function ExpenseList({
  expenses,
  loading,
  user,
  showAllExpenses,
  setShowAllExpenses,
  onEdit,
  onDelete,
  getInitials,
  formatDate,
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-3 pt-4 pb-2">
        <h3 className="text-md font-semibold text-white mb-3">
          Recent Expenses
        </h3>

        {expenses.length > 5 && (
          <button
            onClick={() => setShowAllExpenses(!showAllExpenses)}
            className="flex items-center gap-0.5 text-[#dbd8ff] text-xs hover:text-[#a89ef5] transition"
          >
            {showAllExpenses ? "Show Less" : "View All"}
            <ArrowRight size={12} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/40">
          Loading expenses...
        </div>
      ) : expenses.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/40">
          No expenses added yet.
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {(showAllExpenses ? expenses : expenses.slice(0, 5)).map(
              (expense) => {
                const paidByYou = expense.paidBy?._id === user?.id;

                return (
                  <div
                    key={expense._id}
                    className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.03] transition"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        paidByYou
                          ? "bg-violet-500/20 text-violet-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
                    >
                      {getInitials(expense.paidBy?.name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-white/90">
                            {expense.title}
                          </p>

                          <p className="text-white/30 text-xs mt-0.5">
                            {paidByYou ? "You" : expense.paidBy?.name} paid |{" "}
                            {formatDate(expense.createdAt)}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-white">
                            ₹{expense.amount.toFixed(2)}
                          </p>

                          <p className="text-xs mt-0.5 text-[#dbd8ff]">
                            Amount paid
                          </p>
                        </div>
                      </div>

                      {paidByYou && (
                        <div className="flex gap-4 mt-3">
                          <button
                            onClick={() => onEdit(expense)}
                            className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>

                          <button
                            onClick={() => onDelete(expense._id)}
                            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition"
                          >
                            <Trash2 size={12} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}