const nodemailer = require('nodemailer');
const axios = require('axios')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use App Password for Gmail 
  }
});

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
    subject: 'Email Verification - DevSync',
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is: <strong>${verificationCode}</strong></p>
      <p>This code will expire in 15 minutes.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };