import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useExpense } from "../../../context/ExpenseContext";
import { useAuth } from "../../../context/AuthContext";
import ExpenseList from "./ExpenseList";
import SettlementList from "./SettlementList";
import ExpenseModal from "./ExpenseModal";

export default function Expenses() {
  const { houseId } = useParams();
  const {expenses,balances,settlements,loading,getExpenses,getBalances,getSettlements,addExpense,updateExpense,deleteExpense} = useExpense();
  const { user } = useAuth();
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [youOwe, setYouOwe] = useState(0);
  const [youAreOwed, setYouAreOwed] = useState(0);

  useEffect(() => {
    if (houseId) {
      refreshData();
    }
  }, [houseId]);

  const refreshData = async () => {
    await Promise.all([
      getExpenses(houseId),
      getBalances(houseId),
      getSettlements(houseId),
    ]);
  };

  useEffect(() => {
    if (balances && user?.id) {
      const netBalance = balances[user.id] || 0;

      if (netBalance >= 0) {
        setYouAreOwed(netBalance);
        setYouOwe(0);
      } else {
        setYouOwe(-netBalance);
        setYouAreOwed(0);
      }
    } else {
      setYouOwe(0);
      setYouAreOwed(0);
    }
  }, [balances, user]);

  const handleAddExpense = async (e) => {
    e.preventDefault();

    await addExpense(houseId, {
      title,
      amount: Number(amount),
    });

    await refreshData();
    resetForm();
    setShowModal(false);
  };

  const handleEditExpense = (expense) => {
    setIsEditing(true);
    setCurrentExpenseId(expense._id);
    setTitle(expense.title);
    setAmount(expense.amount.toString());
    setShowModal(true);
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    await updateExpense(currentExpenseId, {
      title,
      amount: Number(amount),
    });

    await refreshData();
    resetForm();
    setShowModal(false);
  };

  const handleDeleteExpense = async (expenseId) => {
    await deleteExpense(expenseId);
    await refreshData();
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setIsEditing(false);
    setCurrentExpenseId(null);
  };

  const totalSpent = expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );

  const validSettlements = settlements.filter(
    (s) => s.from?.id !== s.to?.id
  );

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Expenses
          </h1>

          <p className="text-white/40 mt-1 text-sm">
            Track shared expenses and settle balances.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-[#4034c6] hover:bg-[#240d8b] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-[#413e5f] rounded-2xl p-5 backdrop-blur-sm border-b-4 border-b-[#dbd8ff]">
          <p className="text-white/40 uppercase text-[11px] tracking-wider mb-2">
            Total spent
          </p>

          <h2 className="text-3xl font-bold text-[#dbd8ff]">
            ₹{totalSpent.toFixed(2)}
          </h2>

          <p className="text-white/25 text-xs mt-2">
            all expenses
          </p>
        </div>

        <div className="bg-white/5 border border-[#413e5f] rounded-2xl p-5 backdrop-blur-sm border-b-4 border-b-[#dbd8ff]">
          <p className="text-white/40 uppercase text-[11px] tracking-wider mb-2">
            You owe
          </p>

          <h2 className="text-3xl font-bold text-[#dbd8ff]">
            ₹{youOwe.toFixed(2)}
          </h2>

          <p className="text-white/25 text-xs mt-2">
            pending payments
          </p>
        </div>

        <div className="bg-white/5 border border-[#413e5f] rounded-2xl p-5 backdrop-blur-sm border-b-4 border-b-[#dbd8ff]">
          <p className="text-white/40 uppercase text-[11px] tracking-wider mb-2">
            You're owed
          </p>

          <h2 className="text-3xl font-bold text-[#dbd8ff]">
            ₹{youAreOwed.toFixed(2)}
          </h2>

          <p className="text-white/25 text-xs mt-2">
            receivable balances
          </p>
        </div>
      </div>

      <ExpenseList
        expenses={expenses}
        loading={loading}
        user={user}
        showAllExpenses={showAllExpenses}
        setShowAllExpenses={setShowAllExpenses}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        getInitials={getInitials}
        formatDate={formatDate}
      />

      <SettlementList
        settlements={validSettlements}
        user={user}
        getInitials={getInitials}
      />

      <ExpenseModal
        showModal={showModal}
        setShowModal={setShowModal}
        isEditing={isEditing}
        title={title}
        amount={amount}
        setTitle={setTitle}
        setAmount={setAmount}
        resetForm={resetForm}
        onSubmit={
          isEditing
            ? handleUpdateExpense
            : handleAddExpense
        }
      />
    </div>
  );
}