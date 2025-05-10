const { createTransport } = require("nodemailer");

const mailTransport = createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/**
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise}
 */
const pushMail = async (to, subject, text, html) => {
  const mailOptions = {
    from: env.SMTP_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await mailTransport.sendMail(mailOptions);
    return info;
  } catch (error) {
    log.error("Error sending email:", error);
    throw error;
  }
};

global.mail = {
  push: pushMail,
};
