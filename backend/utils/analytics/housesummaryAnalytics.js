const Expense = require("../../models/expense");
const Inventory = require("../../models/inventory");
const Note = require("../../models/note");
const Reminder = require("../../models/reminder");

const getHouseSummary = async (houseId) => {
  const [expenseCount,inventoryCount,noteCount,reminderCount] = await Promise.all([
    Expense.countDocuments({ house: houseId }),
    Inventory.countDocuments({ house: houseId }),
    Note.countDocuments({ house: houseId }),
    Reminder.countDocuments({ house: houseId }),
  ]);

  const totalExpenses = await Expense.aggregate([
    {
      $match: {
        house: Expense.db.base.Types.ObjectId.createFromHexString(
          houseId
        ),
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  return {
    totalSpent:
      totalExpenses.length > 0
        ? totalExpenses[0].total
        : 0,
    expenseCount,
    inventoryCount,
    noteCount,
    reminderCount,
  };
};

module.exports = {
  getHouseSummary,
};