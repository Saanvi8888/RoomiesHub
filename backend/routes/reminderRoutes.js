const express = require("express");
const { createReminder, getRemindersByDate, markCompleted, deleteReminder,getRemindersByMonth } = require("../controllers/reminderController");
const router = express.Router();
const protect = require("../middleware/authMiddleware")

router.post("/:houseId", protect, createReminder);
router.get("/:houseId", protect, getRemindersByDate);
router.get("/month/:houseId",protect,getRemindersByMonth);
router.patch("/:reminderId/complete",protect,markCompleted);
router.delete("/:reminderId",protect,deleteReminder);
module.exports = router;