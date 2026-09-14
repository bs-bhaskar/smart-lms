const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: 'v1',
  auth: oauth2Client,
});


// Create Gmail-compatible MIME message
const createRawMessage = ({ to, from, subject, text, html }) => {
  const message = [
    `From: Smart Learn LMS <${from}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="boundary123"',
    '',
    '--boundary123',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    text,
    '',
    '--boundary123',
    'Content-Type: text/html; charset="UTF-8"',
    '',
    html,
    '',
    '--boundary123--',
  ].join('\r\n');

  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};


// Common email sender
const sendEmail = async (to, subject, text, html = null) => {
  try {
    console.log('📧 Sending email via Gmail API...');
    console.log('To:', to);

    const rawMessage = createRawMessage({
      to,
      from: process.env.GMAIL_USER_EMAIL,
      subject,
      text,
      html: html || text,
    });

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: rawMessage,
      },
    });

    console.log(
      '✅ Email sent successfully:',
      response.data.id
    );

    return response.data;

  } catch (err) {
    console.error(
      '❌ Gmail API email sending failed:',
      err.response?.data || err.message
    );

    throw err;
  }
};


// Premium OTP Email
const sendOTP = async (to, otp) => {
  const subject = 'Smart Learn LMS | Your Password Reset OTP';

  const text = `
Smart Learn LMS

Password Reset Request

Your OTP is: ${otp}

This OTP will expire in 10 minutes.

If you did not request a password reset, you can safely ignore this email.

© 2026 Smart Learn LMS
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Smart Learn LMS - OTP</title>
</head>

<body style="
  margin:0;
  padding:0;
  background:#f1f5f9;
  font-family:Arial, Helvetica, sans-serif;
">

  <div style="
    width:100%;
    padding:45px 15px;
    box-sizing:border-box;
  ">

    <div style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:18px;
      overflow:hidden;
      box-shadow:0 8px 30px rgba(15,23,42,0.10);
    ">

      <div style="
        background:linear-gradient(135deg,#2563eb,#4f46e5);
        padding:32px 25px;
        text-align:center;
      ">

        <div style="
          width:62px;
          height:62px;
          margin:0 auto 14px;
          background:rgba(255,255,255,0.18);
          border-radius:16px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:32px;
        ">
          🎓
        </div>

        <h1 style="
          margin:0;
          color:#ffffff;
          font-size:28px;
          font-weight:700;
        ">
          Smart Learn LMS
        </h1>

        <p style="
          margin:8px 0 0;
          color:#dbeafe;
          font-size:14px;
        ">
          Smart Learning Management System
        </p>

      </div>

      <div style="
        padding:40px 35px;
        text-align:center;
      ">

        <p style="
          margin:0 0 10px;
          color:#2563eb;
          font-size:13px;
          font-weight:700;
          text-transform:uppercase;
          letter-spacing:1px;
        ">
          Account Security
        </p>

        <h2 style="
          margin:0 0 15px;
          color:#0f172a;
          font-size:25px;
        ">
          Password Reset Request
        </h2>

        <p style="
          margin:0 auto;
          max-width:450px;
          color:#64748b;
          font-size:15px;
          line-height:1.7;
        ">
          We received a request to reset your Smart Learn LMS password.
          Use the verification code below to continue.
        </p>

        <div style="
          margin:30px auto;
          padding:25px 20px;
          max-width:350px;
          background:#eff6ff;
          border:1px solid #bfdbfe;
          border-radius:14px;
        ">

          <p style="
            margin:0 0 10px;
            color:#64748b;
            font-size:12px;
            font-weight:600;
            text-transform:uppercase;
            letter-spacing:1px;
          ">
            Your Verification Code
          </p>

          <div style="
            color:#1d4ed8;
            font-size:34px;
            font-weight:800;
            letter-spacing:8px;
          ">
            ${otp}
          </div>

        </div>

        <div style="
          display:inline-block;
          padding:10px 16px;
          background:#fff7ed;
          border-radius:8px;
          color:#c2410c;
          font-size:13px;
          font-weight:600;
        ">
          ⏱️ This OTP expires in 10 minutes
        </div>

        <div style="
          margin-top:30px;
          padding:18px;
          background:#f8fafc;
          border-radius:10px;
          text-align:left;
        ">

          <p style="
            margin:0 0 7px;
            color:#334155;
            font-size:13px;
            font-weight:700;
          ">
            🔐 Security Notice
          </p>

          <p style="
            margin:0;
            color:#64748b;
            font-size:12px;
            line-height:1.6;
          ">
            If you did not request a password reset, you can safely
            ignore this email. Never share your OTP with anyone.
          </p>

        </div>

      </div>

      <div style="
        padding:22px 25px;
        background:#f8fafc;
        border-top:1px solid #e2e8f0;
        text-align:center;
      ">

        <p style="
          margin:0;
          color:#475569;
          font-size:13px;
          font-weight:600;
        ">
          Smart Learn LMS
        </p>

        <p style="
          margin:7px 0 0;
          color:#94a3b8;
          font-size:11px;
          line-height:1.5;
        ">
          This is an automated security email. Please do not reply.
        </p>

        <p style="
          margin:10px 0 0;
          color:#cbd5e1;
          font-size:10px;
        ">
          © 2026 Smart Learn LMS. All rights reserved.
        </p>

      </div>

    </div>

  </div>

</body>
</html>
  `;

  return sendEmail(to, subject, text, html);
};


module.exports = {
  sendEmail,
  sendOTP,
};