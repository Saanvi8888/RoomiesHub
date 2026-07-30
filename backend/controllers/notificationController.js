const Notification = require("../models/notification");
const House = require("../models/house")
exports.getNotifications = async (req, res) => {
  try {
    const { houseId } = req.params;
    const house = await House.findOne({
        _id: houseId,
        members: req.user._id,
    });

    if (!house) {
        return res.status(403).json({
            message: "Access denied",
        });
    }
    const notifications =await Notification.find({house: houseId})
    .sort({ createdAt: -1 })
    .limit(50);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    // const notification =await Notification.findByIdAndUpdate(notificationId,{read: true,},{new: true});
    // if(!notification){
    //   return res.status(404).json({message:"Noification not found",})
    // }
    // res.status(200).json(notification);
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        return res.status(404).json({
            message: "Notification not found",
        });
    }

    const house = await House.findOne({
        _id: notification.house,
        members: req.user._id,
    });

    if (!house) {
        return res.status(403).json({
            message: "Access denied",
        });
    }

    notification.read = true;
    await notification.save();

    return res.status(200).json(notification);
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { houseId } = req.params;
    const house = await House.findOne({
        _id: houseId,
        members: req.user._id,
    });

    if (!house) {
        return res.status(403).json({
            message: "Access denied",
        });
    }
    await Notification.updateMany(
      {
        house: houseId,
        read: false,
      },
      {
        read: true,
      }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};