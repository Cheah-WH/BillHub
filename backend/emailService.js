const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "cheahwh3@gmail.com", // Gmail address
    pass: "ihsh louk iovh aysl", // Gmail application-specific password
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: "cheahwh3@gmail.com",
    to,
    subject,
    text,
    html,
  };

  try {
    console.log("Sending email to:", to);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email: " + error.message);
  }
};

module.exports = { sendEmail };
