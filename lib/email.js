import "server-only";
import nodemailer from "nodemailer";

function getEnv(name) {
  return process.env[name];
}

function getSmtpConfig() {
  const config = {
    host: getEnv("SKILLIVIO_SMTP_HOST"),
    port: Number(getEnv("SKILLIVIO_SMTP_PORT") || 587),
    user: getEnv("SKILLIVIO_SMTP_USER"),
    pass: getEnv("SKILLIVIO_SMTP_PASS"),
    to: getEnv("SKILLIVIO_EMAIL_TO") || getEnv("EMAIL_TO"),
  };

  const required = {
    SKILLIVIO_SMTP_HOST: config.host,
    SKILLIVIO_SMTP_USER: config.user,
    SKILLIVIO_SMTP_PASS: config.pass,
    SKILLIVIO_EMAIL_TO: config.to,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing SMTP configuration: ${missing.join(", ")}`);
  }

  return config;
}

function createTransporter(config) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildContactEmailHtml(formData) {
  const name = [formData.firstName, formData.lastName].filter(Boolean).join(" ").trim() || "Unknown";
  const email = formData.businessEmail || "Not provided";
  const phone = formData.phoneNumber || "Not provided";
  const project = formData.company || "Not provided";
  const message = [
    formData.jobTitle && `Job Title: ${formData.jobTitle}`,
    formData.industry && `Industry: ${formData.industry}`,
    formData.country && `Country: ${formData.country}`,
    formData.noOfLMs && `No. of LMS: ${formData.noOfLMs}`,
    formData.type && `Tenant: ${formData.type}`,
    formData.status && `Status: ${formData.status}`,
  ]
    .filter(Boolean)
    .join("<br />");

  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f0f4f8; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e1e8f0;">
        <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">New Demo Request</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">A new developer lead has just been registered.</p>
        </div>

        <div style="padding: 40px 30px;">
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">Lead Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; width: 40px; vertical-align: top;">👤</td>
                <td style="padding: 12px 0;">
                  <div style="font-size: 12px; color: #94a3b8;">Full Name</div>
                  <div style="font-size: 16px; color: #1e293b; font-weight: 600;">${escapeHtml(name)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; width: 40px; vertical-align: top;">📧</td>
                <td style="padding: 12px 0;">
                  <div style="font-size: 12px; color: #94a3b8;">Email Address</div>
                  <div style="font-size: 16px; color: #0d9488; font-weight: 600;"><a href="mailto:${escapeHtml(email)}" style="color: #0d9488; text-decoration: none;">${escapeHtml(email)}</a></div>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; width: 40px; vertical-align: top;">📱</td>
                <td style="padding: 12px 0;">
                  <div style="font-size: 12px; color: #94a3b8;">Phone Number</div>
                  <div style="font-size: 16px; color: #1e293b; font-weight: 600;">${escapeHtml(phone)}</div>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; width: 40px; vertical-align: top;">🏢</td>
                <td style="padding: 12px 0;">
                  <div style="font-size: 12px; color: #94a3b8;">Project Type</div>
                  <div style="font-size: 16px; color: #1e293b; font-weight: 600;">${escapeHtml(project)}</div>
                </td>
              </tr>
            </table>
          </div>

          <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; border: 1px solid #f1f5f9;">
            <div style="font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 0.1em; margin-bottom: 15px;">💬 Message</div>
            <div style="font-size: 15px; color: #334155; line-height: 1.6; font-style: italic;">"${message || "No message"}"</div>
          </div>

          <div style="margin-top: 40px; text-align: center;">
            <a href="mailto:${escapeHtml(email)}" style="display: inline-block; background-color: #0d9488; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700;">Reply to Lead</a>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">Sent via Skillivio Platform • ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
        </div>
      </div>
    </div>
  `;
}

export async function sendContactUsEmail(formData) {
  const smtpConfig = getSmtpConfig();
  const transporter = createTransporter(smtpConfig);
  const fromEmail = `"Skillivio Notifications" <${smtpConfig.user}>`;
  const toEmail = smtpConfig.to;
  const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(" ").trim() || "Unknown";

  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    replyTo: formData.businessEmail,
    subject: `New Demo Request from ${fullName}`,
    html: buildContactEmailHtml(formData),
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}
