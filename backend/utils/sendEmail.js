const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    console.log("📩 Sending email to:", options.email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Secure College Portal" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || `<p>${options.message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully via Gmail!");
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
