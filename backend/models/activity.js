const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "EXPENSE_ADDED",
        "EXPENSE_UPDATED",
        "EXPENSE_DELETED",
        "NOTE_CREATED",
        "NOTE_UPDATED",
        "NOTE_DELETED",
        "REMINDER_CREATED",
        "REMINDER_COMPLETED",
        "INVENTORY_ADDED",
        "INVENTORY_UPDATED",
        "INVENTORY_DELETED",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    meta: {
      type: Object, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);