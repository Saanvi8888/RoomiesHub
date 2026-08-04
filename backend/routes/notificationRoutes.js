const express = require("express");

const router = express.Router();
const protect = require("../middleware/authMiddleware")
const {getNotifications,markAsRead,markAllAsRead} = require("../controllers/notificationController");

router.get("/:houseId",protect,getNotifications);
router.patch("/:notificationId/read",protect,markAsRead);
router.patch("/:houseId/read-all",protect,markAllAsRead);

module.exports = router;