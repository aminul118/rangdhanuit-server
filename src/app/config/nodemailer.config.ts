import nodemailer from 'nodemailer';
import envVars from './env';

const nodeMailerTransporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: envVars.EMAIL_SENDER.SMTP_PORT,
  secure: envVars.EMAIL_SENDER.SMTP_PORT === 465,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default nodeMailerTransporter;
