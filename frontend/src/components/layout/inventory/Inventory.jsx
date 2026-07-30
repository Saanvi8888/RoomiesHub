import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useInventory } from "../../../context/InventoryContext";
import InventoryList from "./InventoryList";
import InventoryModal from "./InventoryModal";

export default function Inventory() {
  const { houseId } = useParams();
  const {items,loading,getItems,addItem,updateItem,deleteItem,increaseQuantity,decreaseQuantity}= useInventory();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    quantity: 1,
    unit: "pcs",
    lowStockThreshold: 1,
  });

  useEffect(() => {
    getItems(houseId);
  }, [houseId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      quantity: 1,
      unit: "pcs",
      lowStockThreshold: 1,
    });
    setEditingItem(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);

    setForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      lowStockThreshold: item.lowStockThreshold,
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      lowStockThreshold: Number(form.lowStockThreshold),
    };

    if (editingItem) {
      await updateItem(editingItem._id, payload);
    } else {
      await addItem(houseId, payload);
    }

    resetForm();
    setShowModal(false);
  };

  const totalItems = items.length;
  const lowStockItems = items.filter((item) => item.isLowStock).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Inventory
          </h1>
          <p className="text-white/40 mt-1 text-sm">
            Manage shared house supplies
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-[#4034c6] hover:bg-[#240d8b] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-md font-semibold text-white mb-4">
          Inventory Insights
        </h3>

        <div className="space-y-3">
          <p className="text-sm text-white/70">
            You currently have{" "}
            <span className="font-medium text-violet-300">
              {totalItems} items
            </span>{" "}
            available in inventory.
          </p>

          <p className="text-sm text-white/70">
            <span className="font-medium text-red-400">
              {lowStockItems} items
            </span>{" "}
            are running low and may require restocking soon.
          </p>
        </div>
      </div>

      <InventoryList
        items={items}
        loading={loading}
        onIncrease={increaseQuantity}
        onDecrease={decreaseQuantity}
        onEdit={openEditModal}
        onDelete={deleteItem}
      />

      <InventoryModal
        showModal={showModal}
        setShowModal={setShowModal}
        editingItem={editingItem}
        form={form}
        handleChange={handleChange}
        onSubmit={handleSubmit}
        resetForm={resetForm}
      />
    </div>
  );
}