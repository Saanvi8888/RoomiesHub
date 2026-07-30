const Reminder = require("../models/reminder");
const House = require("../models/house");
const logActivity = require("../utils/logActivity");
const createNotification = require("../utils/createNotification")
exports.createReminder = async (req, res) => {
   try {
      const { houseId } = req.params;
      const {title,description,dueDate,assignedTo} = req.body;
      const userId = req.user._id;

      if (!title || !dueDate) {
         return res.status(400).json({ message: "Title and dueDate required"});
      }

      const house = await House.findOne({
         _id: houseId,
         members: userId,
      });

      if (!house) {
         return res.status(403).json({message: "Access denied"});
      }

      const reminder = await Reminder.create({
        house: houseId,
        title,
        description,
        dueDate,
        assignedTo: house.members,
        createdBy: userId,
      });

      await reminder.populate("assignedTo createdBy","name email");

      await logActivity({
         house: houseId,
         user: userId,
         type: "REMINDER_CREATED",
         message: `Created reminder "${title}"`,
         meta: {
            reminderId: reminder._id,
         },
      });
      await createNotification({
        house: houseId,
        user: userId,
        type: "REMINDER_ADDED",
        message: `${req.user.name} added "${title}"`,
        io,
      });
      return res.status(201).json(reminder);
   } catch (error) {
      return res.status(500).json({message: error.message,});
   }
};

exports.getRemindersByDate = async (req, res) => {
    try {
        const { houseId } = req.params;
        const { date } = req.query;
        const userId = req.user._id;

        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }

        const house = await House.findOne({
            _id: houseId,
            members: userId,
        });

        if (!house) {
            return res.status(403).json({ message: "Access denied" });
        }

        const start = new Date(date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        const reminders = await Reminder.find({
            house: houseId,
            dueDate: { $gte: start, $lte: end },
        }).populate("assignedTo createdBy", "name email").sort({ dueDate: 1 });
        return res.status(200).json(reminders);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


exports.markCompleted = async (req, res) => {
    try {
        const { reminderId } = req.params;
        const userId = req.user._id;

        const reminder = await Reminder.findById(reminderId);

        if (!reminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        const house = await House.findOne({
            _id: reminder.house,
            members: userId,
        });

        if (!house) {
            return res.status(403).json({ message: "Not authorized" });
        }

        reminder.isCompleted = true;
        await reminder.save();

        await logActivity({
            house: reminder.house,
            user: userId,
            type: "REMINDER_COMPLETED",
            message: `Completed reminder "${reminder.title}"`,
            meta: { reminderId },
        });
        await createNotification({
            house: reminder.house,
            user: userId,
            type: "REMINDER_COMPLETED",
            message: `${req.user.name} completed "${reminder.title}"`,
            io,
        });
        return res.status(200).json(reminder);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteReminder = async (req, res) => {
    try {
        const { reminderId } = req.params;
        const userId = req.user._id;

        const reminder = await Reminder.findById(reminderId);

        if (!reminder) {
            return res.status(404).json({ message: "Reminder not found" });
        }

        const house = await House.findOne({
            _id: reminder.house,
            members: userId,
        });

        if (!house) {
            return res.status(403).json({ message: "Not Authorized" });
        }

        await reminder.deleteOne();

        await logActivity({
            house: reminder.house,
            user: userId,
            type: "REMINDER_DELETED",
            message: `Deleted reminder "${reminder.title}"`,
            meta: { reminderId },
        });

        return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getRemindersByMonth = async (req, res) => {
   try {
      const { houseId } = req.params;
      const { month, year } = req.query;
      const userId = req.user._id;
      if (!month || !year) {
         return res.status(400).json({
            message: "Month and year required",
         });
      }

      const house = await House.findOne({
         _id: houseId,
         members: userId,
      });

      if (!house) {
         return res.status(403).json({
            message: "Access denied",
         });
      }

      const startDate = new Date(year,month - 1,1);
      const endDate = new Date(year,month,0,23,59,59,999);
      const reminders = await Reminder.find({
         house: houseId,
         dueDate: {
            $gte: startDate,
            $lte: endDate,
         },
      })
      .populate("assignedTo", "name email")
      .sort({ dueDate: 1 });
      return res.status(200).json(reminders);
   } catch (error) {
      return res.status(500).json({
         message: error.message,
      });
   }
};