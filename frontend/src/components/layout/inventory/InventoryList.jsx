import {Plus,Minus,Pencil,Trash2,Package} from "lucide-react";
export default function InventoryList({items,loading,onIncrease,onDecrease,onEdit,onDelete}) {
  return (
    <div>
      <div className="flex items-center justify-between px-3 pt-4 pb-2">
        <h3 className="text-md font-semibold text-white mb-3">
          All Items
        </h3>
      </div>

      {loading ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/40">
          Loading inventory...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-white/40">
          No items yet. Click "Add Item" to start.
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.isLowStock
                    ? "bg-red-500/20 text-red-400"
                    : "bg-violet-500/20 text-violet-300"
                  }`}
                >
                  <Package size={16} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-medium text-white truncate">
                        {item.name}
                      </h3>

                      {item.isLowStock && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                          Low Stock
                        </span>
                      )}
                    </div>

                    <p className="text-white/30 text-xs mt-0.5">
                      Added by {item.addedBy?.name || "Unknown"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDecrease(item._id)}
                        className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 transition text-white/60"
                      >
                        <Minus size={12} />
                      </button>

                      <div className="text-center min-w-[60px]">
                        <p className="text-sm font-semibold text-white">
                          {item.quantity}
                        </p>

                        <p className="text-[10px] text-white/40 uppercase">
                          {item.unit}
                        </p>
                      </div>

                      <button
                        onClick={() => onIncrease(item._id)}
                        className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 transition text-white/60"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="w-7 h-7 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/5 transition text-white/60"
                      >
                        <Pencil size={12} />
                      </button>

                      <button
                        onClick={() => onDelete(item._id)}
                        className="w-7 h-7 rounded-lg border border-red-500/30 flex items-center justify-center hover:bg-red-500/10 transition text-red-400"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}