const Expense = require("../models/expense");
const House = require("../models/house");
const simplifyDebts = require("../utils/simplifyDebts");
const logActivity = require("../utils/logActivity");
const createNotification = require("../utils/createNotification")
exports.addExpense = async (req, res) => {
    try {
        const { title, amount } = req.body;
        const { houseId } = req.params;
        const paidBy = req.user._id;

        if (!title || !amount) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than 0" });
        }
        const house = await House.findOne({
            _id: houseId,
            members: paidBy
        });

        if (!house) {
            return res.status(403).json({ message: "Access denied" });
        }

        const participants = house.members;
        const total = Number(amount);
        const perPerson = Math.floor((total / participants.length) * 100) / 100;
        let remaining = total;

        const shares = participants.map((userId, index) => {
            let shareAmount = perPerson;

            if (index === participants.length - 1) {
                shareAmount = parseFloat(remaining.toFixed(2));
            }

            remaining -= shareAmount;

            return {
                user: userId,
                amount: shareAmount
            };
        });

        const expense = await Expense.create({
            house: houseId,
            title,
            amount: total,
            paidBy,
            participants,
            shares,
            splitType: "equal",
        });

        await expense.populate("paidBy", "name");
        await expense.populate("participants", "name");
        await logActivity({
            house: houseId,
            user: paidBy,
            type: "EXPENSE_ADDED",
            message: `${req.user.name} added expense "${title}"`,
            meta: {
                expenseId: expense._id,
                title,
                amount: total,
            },
        });

        await createNotification({
            house: houseId,
            user: paidBy,
            type: "EXPENSE_ADDED",
            message: `${req.user.name} added "${title}"`,
            req,
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const { houseId } = req.params;
        const house = await House.findOne({
            _id: houseId,
            members: req.user._id,
        });

        if (!house) {
            return res.status(403).json({ message: "Not authorized" });
        }
        const expenses = await Expense.find({ house: houseId })
            .populate("paidBy", "name")
            .populate("participants", "name")
            .populate("shares.user", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(expenses);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBalances = async (req, res) => {
    try {
        const { houseId } = req.params;
        const house = await House.findOne({
            _id: houseId,
            members: req.user._id,
        });

        if (!house) {
            return res.status(403).json({
                message: "Access denied",
            });
        }
        const expenses = await Expense.find({ house: houseId })
            .populate("paidBy", "name")
            .populate("shares.user", "name");

        const balanceMap = {};

        for (const expense of expenses) {
            const payerId = expense.paidBy._id.toString();

            balanceMap[payerId] = (balanceMap[payerId] || 0) + expense.amount;

            for (const share of expense.shares) {
                const uid = share.user._id.toString();

                balanceMap[uid] = (balanceMap[uid] || 0) - share.amount;
            }
        }

        res.status(200).json(balanceMap);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// exports.getSettlements = async (req, res) => {
//   try {
//     const { houseId } = req.params;

//     const expenses = await Expense.find({
//       house: houseId,
//     })
//       .populate("paidBy", "name")
//       .populate("shares.user", "name");

//     const debts = {};
//     const users = {};

//     for (const expense of expenses) {
//       const creditor = expense.paidBy;
//       const creditorId = creditor._id.toString();

//       users[creditorId] = {
//         id: creditorId,
//         name: creditor.name,
//       };

//       for (const share of expense.shares) {
//         const debtor = share.user;
//         const debtorId = debtor._id.toString();

//         users[debtorId] = {
//           id: debtorId,
//           name: debtor.name,
//         };

//         if (debtorId === creditorId) continue;

//         const key = `${debtorId}-${creditorId}`;

//         debts[key] = (debts[key] || 0) + share.amount;
//       }
//     }

//     const settlements = [];
//     const visited = new Set();

//     for (const key in debts) {
//       if (visited.has(key)) continue;

//       const [from, to] = key.split("-");
//       const reverseKey = `${to}-${from}`;

//       const forwardAmount = debts[key] || 0;
//       const reverseAmount = debts[reverseKey] || 0;

//       const netAmount = forwardAmount - reverseAmount;

//       visited.add(key);
//       visited.add(reverseKey);

//       if (Math.abs(netAmount) < 0.01) continue;

//       settlements.push({
//         from: netAmount > 0 ? users[from] : users[to],
//         to: netAmount > 0 ? users[to] : users[from],
//         amount: Number(Math.abs(netAmount).toFixed(2)),
//       });
//     }

//     res.status(200).json(settlements);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
exports.getSettlements = async (req, res) => {
  try {
    const { houseId } = req.params;
    const house = await House.findOne({
        _id: houseId,
        members: req.user._id,
    });

    if (!house) {
        return res.status(403).json({
            message: "Access denied",
        });
    }
    const expenses = await Expense.find({
      house: houseId,
    })
      .populate("paidBy", "name")
      .populate("shares.user", "name");

    const settlements = simplifyDebts(expenses);

    res.status(200).json(settlements);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { title, amount } = req.body;
    const userId = req.user._id;

    if (!title && amount === undefined) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.paidBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this expense" });
    }

    const house = await House.findById(expense.house);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    if (title) expense.title = title;

    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({ message: "Amount must be greater than 0" });
      }

      const total = Number(amount);
      expense.amount = total;

      const participants = house.members; 
      const perPerson = Math.floor((total / participants.length) * 100) / 100;
      let remaining = total;

      const shares = participants.map((userId, index) => {
        let shareAmount = perPerson;
        if (index === participants.length - 1) {
          shareAmount = parseFloat(remaining.toFixed(2));
        }
        remaining -= shareAmount;
        return {
          user: userId,
          amount: shareAmount,
        };
      });

      expense.participants = participants;
      expense.shares = shares;
    }

    await expense.save();

    await expense.populate([
      { path: "paidBy", select: "name" },
      { path: "participants", select: "name" },
      { path: "shares.user", select: "name" },
    ]);

    await logActivity({
      house: expense.house,
      user: userId,
      type: "EXPENSE_UPDATED",
      message: `${req.user.name} updated expense "${expense.title}"`,
      meta: {
        expenseId: expense._id,
        title: expense.title,
        amount: expense.amount,
      },
    });

    await createNotification({
        house: expense.house,
        user: userId,
        type: "EXPENSE_UPDATED",
        message: `${req.user.name} updated "${expense.title}"`,
        req,
    });
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const userId = req.user._id;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    if (expense.paidBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    const houseId = expense.house;
    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    await expense.deleteOne();

    await logActivity({
      house: houseId,
      user: userId,
      type: "EXPENSE_DELETED",
      message: `${req.user.name} deleted expense "${expense.title}"`,
      meta: {
        expenseId: expense._id,
        title: expense.title,
        amount: expense.amount,
      },
    });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};