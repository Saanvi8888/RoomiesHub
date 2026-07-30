const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },

    unit: {
      type: String,
      default: "unit",
    },

    lowStockThreshold: {
      type: Number,
      default: 1,
    },

    isLowStock: {
      type: Boolean,
      default: false,
    },

    lastNotifiedAt: {
      type: Date,
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

InventorySchema.pre("save", function () {
  this.isLowStock = this.quantity <= this.lowStockThreshold;
});

InventorySchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (
    update.quantity !== undefined ||
    update.lowStockThreshold !== undefined
  ) {
    const qty = update.quantity ?? this._update.quantity;

    const threshold =
      update.lowStockThreshold ?? this._update.lowStockThreshold;

    if (qty !== undefined && threshold !== undefined) {
      update.isLowStock = qty <= threshold;
    }
  }
});

InventorySchema.index({ house: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Inventory", InventorySchema);