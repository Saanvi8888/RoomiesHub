const cron = require("node-cron");
const Reminder = require("../models/reminder");
const sendEmail = require("./mailer");

cron.schedule("* * * * *", async () => {
   try {
      const now = new Date();
      const reminders = await Reminder.find({
         dueDate: {
            $lte: now,
            $gte: new Date(now.getTime() - 60 * 1000), 
         },
         isCompleted: false,
      }).populate("assignedTo");

      for (const reminder of reminders) {
         if (!reminder.assignedTo || reminder.assignedTo.length === 0) {
            console.log("No users for reminder:", reminder.title);
            continue;
         }

         await Promise.all(
            reminder.assignedTo.map((user) =>
               sendEmail({
                  to: user.email,
                  subject: `Reminder: ${reminder.title}`,
                  html: `
                     <div>
                        <h2>${reminder.title}</h2>
                        <p>${reminder.description || ""}</p>
                        <p>Due now</p>
                     </div>
                  `,
               })
            )
         );

         await Reminder.updateOne(
            { _id: reminder._id },
            { lastNotified: now }
         );
      }

   } catch (error) {
      console.error("Cron Error:", error.message);
   }
},{
   timezone: "Asia/Kolkata"
});