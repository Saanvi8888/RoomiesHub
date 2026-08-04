import { Wallet, X } from "lucide-react";

export default function ExpenseModal({showModal,setShowModal,isEditing,title,amount,setTitle,setAmount,resetForm,onSubmit}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1a1c1c] border border-white/15 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <Wallet size={20} className="text-[#7F77DD]" />

            <h2 className="text-xl font-mono font-bold text-white">
              {isEditing ? "Edit Expense" : "Add Expense"}
            </h2>
          </div>

          <button
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
            className="text-white/50 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-mono text-white/60 block mb-2">
              TITLE
            </label>

            <input
              type="text"
              placeholder="Groceries"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#7F77DD] transition"
            />
          </div>

          <div>
            <label className="text-sm font-mono text-white/60 block mb-2">
              AMOUNT (Rs.)
            </label>

            <input
              type="number"
              placeholder="1200"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#7F77DD] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full font-mono bg-[#4034c6] hover:bg-[#240d8b] transition-all duration-300 py-3 rounded-xl font-medium shadow-lg mt-4"
          >
            {isEditing ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}