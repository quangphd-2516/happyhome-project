const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),

    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),

    // SMTP Config
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),

    // SendGrid (Optional - recommended for production)
    SENDGRID_API_KEY: Joi.string().optional().description('SendGrid API key for email'),
    USE_SENDGRID: Joi.boolean().default(false).description('Use SendGrid instead of SMTP'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Determine SMTP config based on environment
const getSmtpConfig = () => {
  // If using SendGrid, return null (will be handled separately)
  if (envVars.USE_SENDGRID === 'true' || envVars.USE_SENDGRID === true) {
    return null;
  }

  // For Render/Production: Use port 587 with specific settings
  if (envVars.NODE_ENV === 'production') {
    return {
      host: envVars.SMTP_HOST,
      port: 587, // Force port 587 for production
      secure: false, // Must be false for port 587 (STARTTLS)
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certs
        ciphers: 'SSLv3' // Compatibility mode
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 30000, // 30 seconds
      debug: true, // Enable debug for troubleshooting
      logger: true
    };
  }

  // For local development
  return {
    host: envVars.SMTP_HOST,
    port: envVars.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: envVars.SMTP_USERNAME,
      pass: envVars.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  };
};

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,

  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },

  email: {
    smtp: getSmtpConfig(),
    from: envVars.EMAIL_FROM,
  },

  // SendGrid config (if enabled)
  sendgrid: {
    apiKey: envVars.SENDGRID_API_KEY,
    enabled: envVars.USE_SENDGRID === 'true' || envVars.USE_SENDGRID === true,
    fromEmail: envVars.EMAIL_FROM,
  },
};