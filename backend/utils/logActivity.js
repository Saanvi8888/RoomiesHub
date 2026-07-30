const Activity = require("../models/activity");

const logActivity = async ({ house, user, type, message, meta = {} }) => {
  await Activity.create({
    house,
    user,
    type,
    message,
    meta,
  });
};

module.exports = logActivity;