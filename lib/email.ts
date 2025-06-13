import nodemailer from "nodemailer"

// Email configuration
const createTransporter = () => {
  if (process.env.NODE_ENV === "production") {
    // Production email configuration (use your preferred email service)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else {
    // Development - use Ethereal Email for testing
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "ethereal.user@ethereal.email",
        pass: "ethereal.pass",
      },
    })
  }
}

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.FROM_EMAIL || "noreply@naijadelights.com",
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    }

    const info = await transporter.sendMail(mailOptions)

    if (process.env.NODE_ENV === "development") {
      console.log("Email sent:", nodemailer.getTestMessageUrl(info))
    }

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export function generateEmailVerificationTemplate(name: string, verificationUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Naija Delights</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Naija Delights!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for signing up with Naija Delights! We're excited to have you join our community of food lovers.</p>
          <p>To complete your registration and start ordering delicious Nigerian cuisine, please verify your email address by clicking the button below:</p>
          <div style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </div>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #22c55e;">${verificationUrl}</p>
          <p><strong>This verification link will expire in 24 hours.</strong></p>
          <p>If you didn't create an account with us, please ignore this email.</p>
          <p>Best regards,<br>The Naija Delights Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Naija Delights. All rights reserved.</p>
          <p>123 Victoria Island, Lagos, Nigeria</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generatePasswordResetTemplate(name: string, otp: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - Naija Delights</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .otp-code { background: #fff; border: 2px solid #22c55e; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 8px; color: #22c55e; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>We received a request to reset your password for your Naija Delights account.</p>
          <p>Use the following 6-digit code to reset your password:</p>
          <div class="otp-code">${otp}</div>
          <p><strong>This code will expire in 15 minutes.</strong></p>
          <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.</p>
          <p>For security reasons, never share this code with anyone.</p>
          <p>Best regards,<br>The Naija Delights Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Naija Delights. All rights reserved.</p>
          <p>123 Victoria Island, Lagos, Nigeria</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
