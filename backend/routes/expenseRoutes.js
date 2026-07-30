const express = require("express")
const { addExpense, getExpenses, getBalances, getSettlements, updateExpense, deleteExpense } = require("../controllers/expenseController")
const router = express.Router()
const protect =require("../middleware/authMiddleware")

router.post("/:houseId",protect,addExpense);
router.get("/:houseId",protect,getExpenses);
router.get("/:houseId/balances",protect,getBalances)
router.get("/:houseId/settlements",protect,getSettlements)
router.put("/:expenseId", protect, updateExpense);
router.delete("/:expenseId", protect, deleteExpense);
module.exports = router