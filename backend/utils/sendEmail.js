const { Resend } = require("resend");

const sendEmail = async (name, email, message) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const FRONTEND_PRODUCTION_URL = process.env.FRONTEND_PRODUCTION_URL;
  const resend = new Resend(RESEND_API_KEY);
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [ADMIN_EMAIL],
    subject: `📩 New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #4CAF50;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #4CAF50; padding-left: 10px; color: #555;">
          ${message}
        </blockquote>
        <hr />
        <p style="font-size: 12px; color: #888;">
          This email was generated from the contact form on <a href="${FRONTEND_PRODUCTION_URL}">
          ${FRONTEND_PRODUCTION_URL}
          </a>
        </p>
      </div>
    `,
  });
};

module.exports = sendEmail;
