const Inventory = require("../../models/inventory");

const getLowStockItems = async (houseId) => {

  const items = await Inventory.find({
    house: houseId,
    isLowStock: true,
  });
  return items;
};

module.exports = {
  getLowStockItems,
};