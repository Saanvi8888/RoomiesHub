const Activity = require("../models/activity");
const House = require("../models/house");

exports.getActivities = async (req, res) => {
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

    const activities = await Activity.find({ house: houseId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};