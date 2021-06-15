require('dotenv').config();
const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendActivationLink(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Account activation: ${process.env.API_URL}`,
      html: genMailHTML(link)
    });
  }
}

module.exports = new MailService();

function genMailHTML(link) {
  return `
    <div>
      <h1>Follow this link to activate your account</h1>
      <a href="${link}">${link}</a>
    </div>
  `;
}
