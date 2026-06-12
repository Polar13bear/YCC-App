const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS?.replace(/\s/g, ''), // remove any spaces
  },
});

const sendVerificationEmail = async (to, name, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await transporter.sendMail({
    from: `"Yoganand Classes" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Verify your email — Yoganand Classes',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e1b4b,#4338ca);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Yoganand Classes</h1>
          <p style="color:rgba(255,255,255,.7);margin:8px 0 0;font-size:14px;">Attendance & Student Management</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#0f172a;margin:0 0 8px;">Hi ${name}! 👋</h2>
          <p style="color:#64748b;line-height:1.6;">Thanks for signing up. Please verify your email address to activate your account.</p>
          <a href="${url}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#4338ca);color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
            Verify Email Address
          </a>
          <p style="color:#94a3b8;font-size:13px;">This link expires in 24 hours. If you didn't sign up, ignore this email.</p>
        </div>
      </div>
    `,
  });
};

const sendResetEmail = async (to, name, otp) => {
  await transporter.sendMail({
    from: `"Yoganand Classes" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Password Reset OTP — Yoganand Classes',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e1b4b,#4338ca);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Yoganand Classes</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#0f172a;margin:0 0 8px;">Hi ${name}!</h2>
          <p style="color:#64748b;line-height:1.6;">Your password reset OTP is:</p>
          <div style="text-align:center;margin:24px 0;">
            <span style="font-size:42px;font-weight:800;letter-spacing:12px;color:#6366f1;background:#ede9fe;padding:16px 32px;border-radius:12px;">${otp}</span>
          </div>
          <p style="color:#94a3b8;font-size:13px;">This OTP expires in 15 minutes. If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  });
};

const sendWelcomeEmail = async (to, name) => {
  await transporter.sendMail({
    from: `"Yoganand Classes" <${process.env.MAIL_USER}>`,
    to,
    subject: 'Welcome to Yoganand Classes! 🎉',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;background:#f8fafc;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e1b4b,#4338ca);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">Yoganand Classes</h1>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#0f172a;">Welcome, ${name}! 🎉</h2>
          <p style="color:#64748b;line-height:1.6;">Your account is now active. You can now manage batches, students, and attendance from your dashboard.</p>
          <a href="${process.env.CLIENT_URL}" style="display:inline-block;margin:24px 0;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#4338ca);color:#fff;border-radius:10px;text-decoration:none;font-weight:600;">
            Go to Dashboard
          </a>
        </div>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendResetEmail, sendWelcomeEmail };
