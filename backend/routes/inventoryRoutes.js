const express=  require("express");
const { addItem,getItems,increaseQuantity,decreaseQuantity,updateItem,deleteItem} = require("../controllers/inventoryController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/:houseId",protect,addItem);
router.get("/:houseId",protect,getItems);
router.patch("/:itemId/increase",protect,increaseQuantity)
router.patch("/:itemId/decrease",protect,decreaseQuantity)
router.put("/:itemId", protect, updateItem);
router.delete("/:itemId",protect,deleteItem);

module.exports = router