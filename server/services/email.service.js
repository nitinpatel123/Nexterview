import dotenv from "dotenv";
dotenv.config();

const SMTP_CONFIGURED = !!(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;
  const nodemailer = await import("nodemailer");
  transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
};

/**
 * Sends a password reset OTP email. If SMTP isn't configured (no env vars
 * set), falls back to logging the OTP to the server console — this lets
 * the flow be fully testable locally without needing real email credentials.
 */
export const sendResetOtpEmail = async (toEmail, otp) => {
  if (!SMTP_CONFIGURED) {
    console.log("\n📧 [Email not configured — printing OTP instead]");
    console.log(`   To: ${toEmail}`);
    console.log(`   OTP: ${otp} (valid for 10 minutes)\n`);
    return { simulated: true };
  }

  const mailer = await getTransporter();
  await mailer.sendMail({
    from: process.env.EMAIL_FROM || `"Nexterview AI" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Your Nexterview AI password reset code",
    html: `
      <p>You requested a password reset for your Nexterview AI account.</p>
      <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
      <p>This code is valid for 10 minutes. If you didn't request this, you can safely ignore this email.</p>
    `,
  });

  return { simulated: false };
};
