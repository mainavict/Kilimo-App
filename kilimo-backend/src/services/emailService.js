// src/services/emailService.js
require('dotenv').config();
const resend = require('resend');

/**
 * Send OTP email using Resend API
 * @param {string} to - Recipient email
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Email send result
 */
const sendOTPEmail = async (to, otp) => {
  try {
    // For development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('\n📧 OTP Email (Development):');
      console.log('---------------------');
      console.log(`To: ${to}`);
      console.log(`OTP Code: ${otp}`);
      console.log(`Expires in: ${process.env.OTP_EXPIRE_MINUTES || 2} minutes`);
      console.log('---------------------\n');
      
      return { success: true, message: 'Email logged to console (development mode)' };
    }

    // For production, use Resend API
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Kilimo App <noreply@kilimoapp.com>',
      to: to,
      subject: 'Your Kilimo App OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px;">
            <h1 style="color: white; margin: 0;">Kilimo App</h1>
          </div>
          
          <div style="background-color: #f9fafb; padding: 30px; border-radius: 8px; margin-top: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">OTP Verification</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Hello,
            </p>
            <p style="color: #4b5563; line-height: 1.6;">
              Your one-time password (OTP) for Kilimo App is:
            </p>
            
            <div style="background-color: #ffffff; padding: 30px; text-align: center; margin: 20px 0; border-radius: 8px; border: 2px solid #2563eb;">
              <span style="font-size: 48px; font-weight: bold; letter-spacing: 10px; color: #1f2937; font-family: monospace;">
                ${otp}
              </span>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              <strong>This code will expire in ${process.env.OTP_EXPIRE_MINUTES || 2} minutes.</strong>
            </p>
            
            <p style="color: #4b5563; line-height: 1.6;">
              If you didn't request this code, please ignore this email or contact support if you have concerns.
            </p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              © ${new Date().getFullYear()} Kilimo App. All rights reserved.<br>
              Nairobi, Kenya
            </p>
          </div>
        </div>
      `
    });

    console.log('📧 Email sent successfully via Resend');
    return response;
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Don't throw error in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Email service in development mode - continuing without email');
      return { success: true, message: 'Development mode - email not sent' };
    }
    
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOTPEmail };