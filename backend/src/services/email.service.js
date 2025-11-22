const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

// SendGrid setup (optional)
let sgMail = null;
if (config.sendgrid.enabled) {
  try {
    sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(config.sendgrid.apiKey);
    logger.info('✅ SendGrid initialized');
  } catch (error) {
    logger.warn('⚠️  SendGrid not available, falling back to SMTP');
  }
}

// SMTP Transport setup
let transport = null;
if (config.email.smtp) {
  console.log('📧 SMTP config:', {
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    secure: config.email.smtp.secure,
    user: config.email.smtp.auth.user,
  });

  transport = nodemailer.createTransport(config.email.smtp);

  // Verify connection (non-blocking)
  if (config.env !== 'test') {
    transport
      .verify()
      .then(() => logger.info('✅ Connected to SMTP server'))
      .catch((error) => {
        logger.error('❌ SMTP connection failed:', error.message);
        logger.warn('⚠️  Emails may not be sent. Consider using SendGrid.');
      });
  }
}

/**
 * Send email using SendGrid (primary) or SMTP (fallback)
 */
const sendEmailViaProvider = async (to, subject, text, html) => {
  // Try SendGrid first if enabled
  if (sgMail && config.sendgrid.enabled) {
    try {
      const msg = {
        to,
        from: config.sendgrid.fromEmail,
        subject,
        text,
        html,
      };
      await sgMail.send(msg);
      logger.info(`✅ Email sent via SendGrid to ${to}`);
      return;
    } catch (error) {
      logger.error(`❌ SendGrid failed: ${error.message}`);
      // Fall through to SMTP
    }
  }

  // Fallback to SMTP
  if (!transport) {
    throw new Error('No email transport configured (neither SendGrid nor SMTP)');
  }

  try {
    const msg = {
      from: config.email.from,
      to,
      subject,
      text,
      html,
    };
    await transport.sendMail(msg);
    logger.info(`✅ Email sent via SMTP to ${to}`);
  } catch (error) {
    logger.error(`❌ Failed to send email: ${error.message}`);
    throw error;
  }
};

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  await sendEmailViaProvider(to, subject, text);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;

  const html = `
    <p>Dear user,</p>
    <p>To reset your password, click on this link: <a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>
    <p>If you did not request any password resets, then ignore this email.</p>
  `;

  await sendEmailViaProvider(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  const verificationEmailUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;

  const html = `
    <p>Dear user,</p>
    <p>To verify your email, click on this link: <a href="${verificationEmailUrl}">${verificationEmailUrl}</a></p>
    <p>If you did not create an account, then ignore this email.</p>
  `;

  await sendEmailViaProvider(to, subject, text, html);
};

/**
 * Gửi OTP qua email
 * @param {string} to - Email người nhận
 * @param {string} otp - Mã OTP 6 số
 * @param {string} fullName - Tên người dùng
 * @returns {Promise}
 */
const sendOTPEmail = async (to, otp, fullName) => {
  const subject = 'Verify Your Email - HappyHome';

  const text = `Hi ${fullName},

Your OTP code is: ${otp}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
The HappyHome Team`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #2C3E50;
          color: #ffffff;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
        }
        .otp-code {
          background-color: #f8f9fa;
          border: 2px dashed #2C3E50;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code h2 {
          font-size: 36px;
          letter-spacing: 8px;
          color: #2C3E50;
          margin: 0;
        }
        .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 HappyHome</h1>
          <p>Real Estate & Auction Platform</p>
        </div>
        
        <div class="content">
          <h2>Hi ${fullName},</h2>
          <p>Thank you for registering with HappyHome! To complete your registration, please verify your email address by entering the OTP code below:</p>
          
          <div class="otp-code">
            <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
            <h2>${otp}</h2>
          </div>
          
          <p><strong>This code will expire in 10 minutes.</strong></p>
          
          <p>If you didn't request this code, please ignore this email.</p>
          
          <p>Best regards,<br><strong>The HappyHome Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2025 HappyHome. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmailViaProvider(to, subject, text, html);
};

/**
 * Send deposit payment success email
 */
const sendDepositSuccessEmail = async (to, depositData) => {
  const {
    fullName,
    auctionTitle,
    amount,
    paymentMethod,
    transactionId,
    auctionId,
    paymentDate
  } = depositData;

  const subject = '✅ Deposit Payment Successful - HappyHome';

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);

  const formattedDate = new Date(paymentDate).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const text = `Hi ${fullName},

Your deposit payment of ${formattedAmount} for "${auctionTitle}" has been processed successfully!

Transaction Details:
- Auction: ${auctionTitle}
- Payment Method: ${paymentMethod}
- Transaction ID: ${transactionId}
- Payment Date: ${formattedDate}

You can now participate in the auction when it opens.

Best regards,
The HappyHome Team`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; }
        .success-badge { background-color: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: bold; margin-top: 10px; }
        .content { padding: 40px 30px; }
        .amount-highlight { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .amount-highlight h2 { margin: 0; font-size: 36px; }
        .info-box { background-color: #f8f9fa; border-left: 4px solid #667eea; border-radius: 4px; padding: 20px; margin: 20px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏠 HappyHome</h1>
          <p style="margin: 0;">Real Estate & Auction Platform</p>
          <div class="success-badge">✓ PAYMENT SUCCESSFUL</div>
        </div>
        
        <div class="content">
          <h2>Hi ${fullName},</h2>
          <p>Great news! Your deposit payment has been processed successfully. You are now registered for the auction.</p>

          <div class="amount-highlight">
            <p style="margin: 0;">Deposit Amount</p>
            <h2>${formattedAmount}</h2>
          </div>

          <div class="info-box">
            <h3 style="margin: 0 0 15px 0;">Transaction Details</h3>
            <p><strong>Auction:</strong> ${auctionTitle}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>Payment Date:</strong> ${formattedDate}</p>
          </div>

          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auctions/${auctionId}" 
               style="display: inline-block; background-color: #667eea; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
              View Auction Details
            </a>
          </p>

          <p>Best regards,<br><strong>The HappyHome Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2025 HappyHome. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmailViaProvider(to, subject, text, html);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendOTPEmail,
  sendDepositSuccessEmail,
};