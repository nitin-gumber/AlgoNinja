import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

export const sendMail = async ({ to, subject, message, htmlMessage }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"AlgoNinja" <${process.env.SMTP_SENDEREMAIL}>`,
    to: to,
    subject: subject,
    text: message,
    html: htmlMessage,
  };

  await transporter.sendMail(mailOptions);
};
