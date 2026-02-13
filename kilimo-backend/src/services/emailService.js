
require('dotenv').config();
const nodemailer = require('nodemailer');

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send OTP email using Gmail SMTP
 * @param {string} to - Recipient email
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} Email send result
 */
const sendOTPEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: `"Kilimo App" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Your Kilimo App OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <div style="display: none; max-height: 0px; overflow: hidden;">
            Your Kilimo App verification code is ${otp}. This code expires in ${process.env.OTP_EXPIRE_MINUTES || 2} minutes.
          </div>

          <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f4f7f6; padding: 40px 20px;">
            <tr>
              <td align="center">
                
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                  
                  <tr>
                    <td style="background-color: #0f766e; padding: 32px 40px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">🌱 KILIMO APP</h1>
                      <p style="margin: 8px 0 0 0; color: #ccfbf1; font-size: 15px;">Agricultural Services Platform</p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 22px; font-weight: 600;">Authentication Required</h2>
                      <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 24px;">
                        Hello, <br><br>
                        You recently requested to sign in. Please use the verification code below to complete your secure authentication:
                      </p>

                      <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 40px; font-weight: 700; letter-spacing: 12px; color: #0f766e;">
                          ${otp}
                        </span>
                      </div>

                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #fff1f2; border-left: 4px solid #e11d48; border-radius: 4px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 12px 16px; color: #9f1239; font-size: 14px; line-height: 20px;">
                            <strong>Security Notice:</strong> This code expires in ${process.env.OTP_EXPIRE_MINUTES || 2} minutes. Never share this code with anyone.
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 22px;">
                        If you did not request this code, please ignore this email. Your account remains secure.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px;">
                        Kilimo App • Juja, Kenya
                      </p>
                      <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                        © ${new Date().getFullYear()} Kilimo Agricultural Services. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully via Gmail!');
    console.log('📧 Message ID:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Gmail sending failed:', error.message);
    
    // Fallback to console log
    console.log('\n📧 OTP Email (Fallback):');
    console.log('---------------------');
    console.log(`To: ${to}`);
    console.log(`OTP Code: ${otp}`);
    console.log(`Expires in: ${process.env.OTP_EXPIRE_MINUTES || 2} minutes`);
    console.log('---------------------\n');
    
    return { success: true, message: 'Email fallback to console' };
  }
};

module.exports = { sendOTPEmail };