const Inventory = require("../models/inventory");
const House = require("../models/house");
const logActivity = require("../utils/logActivity");
const createNotification = require("../utils/createNotification")
exports.addItem = async (req, res) => {
  try {
    const { houseId } = req.params;
    const { name, quantity, unit, lowStockThreshold } = req.body;
    const userId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Item name is required" });
    }
    const house = await House.findOne({
      _id: houseId,
      members: userId,
    });

    if (!house) {
      return res.status(403).json({ message: "Access denied" });
    }
    const item = await Inventory.create({
      house: houseId,
      name,
      quantity,
      unit,
      lowStockThreshold,
      addedBy: userId,
      lastUpdatedBy: userId,
    });

    await item.populate("addedBy lastUpdatedBy", "name");
    await logActivity({
      house: houseId,
      user: userId,
      type: "INVENTORY_ADDED",
      message: `${req.user.name} added inventory item "${name}"`,
      meta: {
        itemId: item._id,
        name,
        quantity: item.quantity,
        unit: item.unit,
      },
    });
    await createNotification({
      house: houseId,
      user: userId,
      type: "INVENTORY_ADDED",
      message: `${req.user.name} added the item "${name}"`,
      req,
    });

    res.status(201).json(item);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Item already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { houseId } = req.params;
    const userId = req.user._id;

    const house = await House.findOne({
      _id: houseId,
      members: userId,
    });

    if (!house) {
      return res.status(403).json({ message: "Access denied" });
    }

    const items = await Inventory.find({ house: houseId })
      .populate("addedBy lastUpdatedBy", "name")
      .sort({ isLowStock: -1, updatedAt: -1 }); 

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.increaseQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const item = await Inventory.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    const house = await House.findOne({
      _id: item.house,
      members: userId,
    });
    if (!house) {
      return res.status(403).json({ message: "Not authorized" });
    }

    item.quantity += 1;
    item.lastUpdatedBy = userId;

    await item.save();
    await item.populate("addedBy lastUpdatedBy", "name");
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.decreaseQuantity = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const item = await Inventory.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const house = await House.findOne({
      _id: item.house,
      members: userId,
    });

    if (!house) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (item.quantity > 0) {
      item.quantity -= 1;
    }

    item.lastUpdatedBy = userId;
    await item.save();
    await item.populate("addedBy lastUpdatedBy", "name");
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, quantity, unit, lowStockThreshold } = req.body;
    const userId = req.user._id;

    const item = await Inventory.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const house = await House.findOne({
      _id: item.house,
      members: userId,
    });

    if (!house) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let isModified = false;
    if (name !== undefined && name.trim() !== "") {
      item.name = name.trim();
      isModified = true;
    }

    if (quantity !== undefined) {
      item.quantity = quantity;
      isModified = true;
    }

    if (unit !== undefined) {
      item.unit = unit;
      isModified = true;
    }

    if (lowStockThreshold !== undefined) {
      item.lowStockThreshold = lowStockThreshold;
      isModified = true;
    }
    if (!isModified) {
      return res.status(200).json(item);
    }

    item.lastUpdatedBy = userId;

    await item.save();
    await item.populate("addedBy lastUpdatedBy", "name");

    await logActivity({
      house: item.house,
      user: userId,
      type: "INVENTORY_UPDATED",
      message: `${req.user.name} updated inventory item "${item.name}"`,
      meta: {
        itemId: item._id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
      },
    });

    await createNotification({
      house: item.house,
      user: userId,
      type: "INVENTORY_UPDATED",
      message: `${req.user.name} updated the item "${item.name}"`,
      req,
    });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    const item = await Inventory.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const house = await House.findOne({
      _id: item.house,
      members: userId,
    });

    if (!house) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await logActivity({
      house: item.house,
      user: userId,
      type: "INVENTORY_DELETED",
      message: `${req.user.name} deleted inventory item "${item.name}"`,
      meta: {
        itemId: item._id,
        name: item.name,
      },
    });
    await item.deleteOne();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};