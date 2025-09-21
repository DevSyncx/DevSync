const nodemailer = require('nodemailer');

// Comment out transporter since we won't use it in dev
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail
//   }
// });

const sendVerificationEmail = async (email, verificationCode) => {
  // Simply log instead of sending an email
  console.log(`[DEV] Skipping email. Verification code for ${email}: ${verificationCode}`);

  // If you want to keep sending emails in production:
  // if (process.env.NODE_ENV !== "development") {
  //   await transporter.sendMail(mailOptions);
  // }
};

module.exports = { sendVerificationEmail };
