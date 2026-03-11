import transporter from "./config/mailer.js";
import dotenv from "dotenv";

dotenv.config();

async function sendMail() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      html: "<h2>Email system working successfully</h2>"
    });

    console.log("✅ Email Sent Successfully");
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
}

sendMail();
