const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendOrderConfirmation(user, order) {
    const mailOptions = {
      from: 'Flyingwood Furniture <noreply@flyingwood.com>',
      to: user.email,
      subject: `Order Confirmation - #${order._id}`,
      html: this.generateOrderEmail(order, user)
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: 'Flyingwood Furniture <welcome@flyingwood.com>',
      to: user.email,
      subject: 'Welcome to Flyingwood Furniture!',
      html: this.generateWelcomeEmail(user)
    };

    await this.transporter.sendMail(mailOptions);
  }

  generateOrderEmail(order, user) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .header { background: #2E8B57; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .order-details { background: #f9f9f9; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Flyingwood Furniture</h1>
          <h2>Order Confirmed!</h2>
        </div>
        <div class="content">
          <p>Hi ${user.name},</p>
          <p>Thank you for your order! Here are your order details:</p>
          <div class="order-details">
            <h3>Order #${order._id}</h3>
            <p><strong>Total:</strong> $${order.totalAmount}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateWelcomeEmail(user) {
    return `
      <!DOCTYPE html>
      <html>
      <body>
        <h1>Welcome to Flyingwood Furniture, ${user.name}!</h1>
        <p>Thank you for joining our sustainable furniture community.</p>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();