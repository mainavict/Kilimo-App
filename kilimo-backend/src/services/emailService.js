// src/services/emailService.js
/**
 * Mock email service for development
 * This logs OTP to console instead of sending real emails
 * In production, replace with Resend API
 */
const sendOTPEmail = async (to, otp) => {
  try {
    // For development, just log to console
    console.log('\n📧 OTP Email (Mock):');
    console.log('---------------------');
    console.log(`To: ${to}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Expires in: ${process.env.OTP_EXPIRE_MINUTES || 2} minutes`);
    console.log('---------------------\n');
    
    // In production, use Resend API:
    // const resend = require('resend');
    // await resend.emails.send({
    //   from: process.env.EMAIL_FROM,
    //   to: to,
    //   subject: 'Your Kilimo App OTP Code',
    //   html: `<p>Your OTP code is: <strong>${otp}</strong></p>`
    // });
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = { sendOTPEmail };