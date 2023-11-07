const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'katelin.boyle55@ethereal.email',
            pass: '8FTT1cKSaGkE1RPSTp'
        }
    });

    return transporter.sendMail({
        from: '"Shopping App" <shoppingapp@gmail.com>',
        to,
        subject,
        html
    });
};

module.exports = sendEmail;