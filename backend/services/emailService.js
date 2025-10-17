const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App Password
  },
});

// Verification email
const sendVerificationEmail = async (email, verificationCode) => {

  //Email Verifer GET Request being sent 
  const {data} = await axios.get(`https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${process.env.EMAIL_VERIFIER_API_KEY}`);
  //Verfying the response type
  if(data.data.status === 'invalid')
  {
      //Invalid Email hence Sending a Error Message
      console.log('Invalid Email ID')
      //Sending the Invalid Email Id Error
      throw new Error('Invalid Email ID');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification - DevSync",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is: <strong>${verificationCode}</strong></p>
      <p>This code will expire in 15 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Password reset email
const sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset - DevSync",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
