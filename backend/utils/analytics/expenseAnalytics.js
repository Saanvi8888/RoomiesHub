const Expense = require("../../models/expense");

const getMonthlySpending = async (houseId) => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const expenses = await Expense.find({
    house: houseId,
    createdAt: { $gte: start },
  });

  const total = expenses.reduce((sum, expense) => sum + expense.amount,0);
  return {
    totalSpent: total,
    expenseCount: expenses.length,
  };
};

const getTopContributor = async (houseId) => {
  const expenses = await Expense.find({ house: houseId }).populate("paidBy", "name");
  const contributions = {};
  expenses.forEach((expense) => {const name = expense.paidBy.name;
    contributions[name] =(contributions[name] || 0) +expense.amount;
  });

  let topContributor = null;
  let maxAmount = 0;

  Object.entries(contributions).forEach(
    ([name, amount]) => {
      if (amount > maxAmount) {
        topContributor = name;
        maxAmount = amount;
      }
    }
  );
  console.log("getTopContributor houseId:", houseId);
  return {
    topContributor,
    amount: maxAmount,
  };
};



module.exports = {
  getMonthlySpending,
  getTopContributor,
};