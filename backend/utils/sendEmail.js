const sendEmail = async (options) => {
  try {
    console.log("📩 Sending email to:", options.email);

    // Using Brevo's HTTP API to bypass Render's SMTP restrictions
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: "Secure College Portal",
          email: process.env.EMAIL_USER || "uploadsbyc.123@gmail.com"
        },
        to: [{ email: options.email }],
        subject: options.subject,
        htmlContent: options.html || `<p>${options.message}</p>`,
        textContent: options.message || ""
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Brevo API Error:", errorData);
      throw new Error(`Failed to send email: ${errorData.message}`);
    }

    console.log("✅ Email sent successfully via Brevo!");
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
