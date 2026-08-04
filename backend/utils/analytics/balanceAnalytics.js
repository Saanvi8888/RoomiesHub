const Expense = require("../../models/expense");

const calculateSettlements = async (houseId) => {
  const expenses = await Expense.find({
    house: houseId,
  })
    .populate("paidBy", "name")
    .populate("shares.user", "name");

  const debts = {};
  const users = {};

  for (const expense of expenses) {
    const creditor = expense.paidBy;
    const creditorId = creditor._id.toString();

    users[creditorId] = {
      id: creditorId,
      name: creditor.name,
    };

    for (const share of expense.shares) {
      const debtor = share.user;
      const debtorId = debtor._id.toString();

      users[debtorId] = {
        id: debtorId,
        name: debtor.name,
      };

      if (debtorId === creditorId) continue;

      const key = `${debtorId}-${creditorId}`;

      debts[key] = (debts[key] || 0) + share.amount;
    }
  }

  const settlements = [];
  const visited = new Set();

  for (const key in debts) {
    if (visited.has(key)) continue;

    const [from, to] = key.split("-");
    const reverseKey = `${to}-${from}`;

    const forwardAmount = debts[key] || 0;
    const reverseAmount = debts[reverseKey] || 0;

    const netAmount = forwardAmount - reverseAmount;

    visited.add(key);
    visited.add(reverseKey);

    if (Math.abs(netAmount) < 0.01) continue;
    settlements.push({
      from: netAmount > 0 ? users[from] : users[to],
      to: netAmount > 0 ? users[to] : users[from],
      amount: Number(Math.abs(netAmount).toFixed(2)),
    });
  }

  return settlements;
};

module.exports = {
  calculateSettlements,
};