const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

console.log('📧 SMTP config:', config.email.smtp);
const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};
// ============ THÊM MỚI - GỬI OTP ============

/**
 * Gửi OTP qua email
 * @param {string} to - Email người nhận
 * @param {string} otp - Mã OTP 6 số
 * @param {string} fullName - Tên người dùng
 * @returns {Promise}
 */
const sendOTPEmail = async (to, otp, fullName) => {
  const subject = 'Verify Your Email - Dwello';

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
          <h1>Dwello</h1>
          <p>Real Estate & Auction Platform</p>
        </div>
        
        <div class="content">
          <h2>Hi ${fullName},</h2>
          <p>Thank you for registering with Dwello! To complete your registration, please verify your email address by entering the OTP code below:</p>
          
          <div class="otp-code">
            <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
            <h2>${otp}</h2>
          </div>
          
          <p><strong>This code will expire in 10 minutes.</strong></p>
          
          <p>If you didn't request this code, please ignore this email.</p>
          
          <p>Best regards,<br><strong>The Dwello Team</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2025 Dwello. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const msg = {
    from: config.email.from,
    to,
    subject,
    html
  };

  await transport.sendMail(msg);
};
// CODE GỬI EMAIL KHI THANH TOÁN CỌC THÀNH CÔNG QUA VNPAY/MOMO
/**
 * Send deposit payment success email
 * @param {string} to - Email người nhận
 * @param {Object} depositData - Thông tin deposit
 * @param {string} depositData.fullName - Tên người dùng
 * @param {string} depositData.auctionTitle - Tên phiên đấu giá
 * @param {number} depositData.amount - Số tiền cọc
 * @param {string} depositData.paymentMethod - Phương thức thanh toán (VNPAY/MOMO)
 * @param {string} depositData.transactionId - Mã giao dịch
 * @param {string} depositData.auctionId - ID phiên đấu giá
 * @param {Date} depositData.paymentDate - Ngày thanh toán
 * @returns {Promise}
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

  const subject = '✅ Deposit Payment Successful - Dwello';

  // Format số tiền
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);

  // Format ngày giờ
  const formattedDate = new Date(paymentDate).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        .success-badge {
          background-color: #10b981;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          font-size: 14px;
          font-weight: bold;
          margin-top: 10px;
        }
        .content {
          padding: 40px 30px;
        }
        .info-box {
          background-color: #f8f9fa;
          border-left: 4px solid #667eea;
          border-radius: 4px;
          padding: 20px;
          margin: 20px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          color: #6b7280;
          font-size: 14px;
        }
        .info-value {
          color: #111827;
          font-weight: 600;
          font-size: 14px;
          text-align: right;
        }
        .amount-highlight {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 20px 0;
        }
        .amount-highlight h2 {
          margin: 0;
          font-size: 36px;
        }
        .amount-highlight p {
          margin: 5px 0 0 0;
          font-size: 14px;
          opacity: 0.9;
        }
        .action-button {
          display: inline-block;
          background-color: #667eea;
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 20px 0;
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
          <h1>🏠 Dwello</h1>
          <p style="margin: 0;">Nền tảng Bất động sản & Đấu giá</p>
          <div class="success-badge">✓ THANH TOÁN THÀNH CÔNG</div>
        </div>
        
        <div class="content">
          <h2 style="color: #111827;">Xin chào ${fullName},</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Tin vui! Khoản tiền đặt cọc của bạn đã được xử lý thành công. Bạn hiện đã được đăng ký tham gia buổi đấu giá.
          </p>

          <div class="amount-highlight">
            <p style="margin: 0;">Số tiền đặt cọc</p>
            <h2>${formattedAmount}</h2>
          </div>

          <div class="info-box">
            <h3 style="margin: 0 0 15px 0; color: #111827;">Chi tiết giao dịch</h3>
            
            <div class="info-row">
              <span class="info-label">Phiên đấu giá</span>
              <span class="info-value">${auctionTitle}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Phương thức thanh toán</span>
              <span class="info-value">${paymentMethod}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Mã giao dịch</span>
              <span class="info-value">${transactionId}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">Ngày thanh toán</span>
              <span class="info-value">${formattedDate}</span>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/auctions/${auctionId}" class="action-button">
              Xem chi tiết phiên đấu giá
            </a>
          </div>

          <h3 style="color: #111827; margin-top: 30px;">Bước tiếp theo là gì?</h3>
          <ul style="color: #6b7280; line-height: 1.8;">
            <li>Bạn có thể bắt đầu đặt giá khi phiên đấu giá mở</li>
            <li>Theo dõi trạng thái phiên đấu giá trên bảng điều khiển</li>
            <li>Nhận thông báo theo thời gian thực khi có cập nhật giá thầu</li>
            <li>Hoàn tất thanh toán trong vòng 24 giờ nếu bạn là người thắng</li>
          </ul>

          <p style="color: #6b7280; margin-top: 30px;">
            Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
          </p>
          
          <p style="margin-top: 20px;">Trân trọng,<br><strong>Quang D17CNPM5</strong></p>
        </div>
        
        <div class="footer">
          <p>© 2025 OK NHA BRO!!!!</p>
          <p>Đây là email tự động, vui lòng không trả lời.</p>
          <p style="margin-top: 10px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: #667eea;">Liên hệ hỗ trợ</a> | 
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/terms" style="color: #667eea;">Điều khoản</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const msg = {
    from: config.email.from,
    to,
    subject,
    html
  };

  await transport.sendMail(msg);
};
module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendOTPEmail,
  sendDepositSuccessEmail,
};
