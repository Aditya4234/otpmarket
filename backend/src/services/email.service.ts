import nodemailer from 'nodemailer';
import { env } from '@/config/env';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, html, text } = options;

  await transporter.sendMail({
    from: `"OTP Marketplace" <${env.SMTP_FROM}>`,
    to,
    subject,
    html,
    text,
  });
}

export async function sendVerificationOTP(email: string, otp: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Verify your email address',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h1 style="color: #111827; font-size: 24px; margin: 0 0 8px;">Welcome to OTP Marketplace!</h1>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.5; margin: 0 0 24px;">Use the OTP below to verify your email address.</p>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #111827;">${otp}</span>
          </div>
          <p style="color: #9ca3af; font-size: 13px; margin: 0;">This OTP expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  await sendEmail({
    to: email,
    subject: 'Reset your password',
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 24px;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h1 style="color: #111827; font-size: 24px; margin: 0 0 8px;">Reset your password</h1>
          <p style="color: #6b7280; font-size: 15px; line-height: 1.5; margin: 0 0 24px;">Click the button below to reset your password. This link expires in 1 hour.</p>
          <a href="${resetUrl}" style="display: block; background: #4f46e5; color: #ffffff; text-align: center; padding: 14px 24px; border-radius: 8px; text-decoration: none; font-size: 15px; font-weight: 600; margin-bottom: 24px;">Reset Password</a>
          <p style="color: #9ca3af; font-size: 13px; margin: 0;">If you didn't request this, please ignore this email.</p>
        </div>
      </body>
      </html>
    `,
  });
}
