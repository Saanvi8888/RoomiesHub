const express = require("express");
const router = express.Router();
const {ask} = require("../controllers/aiController")
const protect = require("../middleware/authMiddleware");

router.post("/ask", protect,ask);

module.exports = router;