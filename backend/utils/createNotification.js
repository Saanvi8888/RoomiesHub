const Notification = require("../models/notification")

async function createNotification({
  house,
  user,
  type,
  message,
  req,
}) {
  const notification = await Notification.create({
    house,
    user,
    type,
    message,
  });

  const io = req?.app?.get("io");

  if (io) {
    io.to(house.toString()).emit(
      "notification",
      notification
    );
  }

  return notification;
}

module.exports = createNotification;