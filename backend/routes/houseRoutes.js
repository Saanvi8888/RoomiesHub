const express=  require("express");
const { createHouse, getHouse, joinHouse, getAllHouses, deleteHouse } = require("../controllers/houseController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/create",protect,createHouse);
router.post("/join",protect,joinHouse)
router.get("/all",protect,getAllHouses)

router.get("/:houseId",protect,getHouse)
router.delete("/:houseId",protect,deleteHouse);

module.exports = router