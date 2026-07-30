const express = require("express");

const router = express.Router();

const {getNotifications,markAsRead,markAllAsRead} = require("../controllers/notificationController");

router.get("/:houseId",getNotifications);
router.patch("/:notificationId/read",markAsRead);
router.patch("/:houseId/read-all",markAllAsRead);

module.exports = router;