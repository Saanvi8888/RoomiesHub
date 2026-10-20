const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 587,
   secure: false,
   auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
   },
});

const sendEmail = async ({ to, subject, text, html }) => {
   await transporter.sendMail({
      from: `"RoomiesHub" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
      html,
   });
};

module.exports = sendEmail;
