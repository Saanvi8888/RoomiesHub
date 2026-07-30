import { Boxes, X } from "lucide-react";

export default function InventoryModal({showModal,setShowModal,editingItem,form,handleChange,onSubmit,resetForm}) {
  if (!showModal) return null;
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1a1c1c] border border-white/15 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <Boxes size={20} className="text-[#7F77DD]" />

            <h2 className="text-xl font-mono font-bold text-white">
              {editingItem ? "Edit Item" : "Add New Item"}
            </h2>
          </div>

          <button
            onClick={closeModal}
            className="text-white/50 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-mono text-white/60 block mb-2">
              ITEM NAME
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Milk"
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#7F77DD] transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-mono text-white/60 block mb-2">
                QUANTITY
              </label>

              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                min="0"
                required
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#7F77DD] transition"
              />
            </div>

            <div>
              <label className="text-sm font-mono text-white/60 block mb-2">
                UNIT
              </label>

              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#7F77DD] transition"
              >
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="litre">litre</option>
                <option value="pack">pack</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-mono text-white/60 block mb-2">
              LOW STOCK THRESHOLD
            </label>

            <input
              type="number"
              name="lowStockThreshold"
              value={form.lowStockThreshold}
              onChange={handleChange}
              min="0"
              required
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#7F77DD] transition"
            />
          </div>

          <button
            type="submit"
            className="w-full font-mono bg-[#4034c6] hover:bg-[#240d8b] transition-all duration-300 py-3 rounded-xl font-medium shadow-lg mt-4"
          >
            {editingItem ? "Update Item" : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}