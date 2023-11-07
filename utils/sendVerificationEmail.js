const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({
    fullName,
    email,
    verificationToken,
    origin
}) => {
    const verifyEmail = `${origin}/account/verify-email?token=${verificationToken}&email=${email}`;

    const message = `<p>Xác thực email của bạn. <a href="${verifyEmail}">Click vào đây</a></p>`;

    return sendEmail({
        to: email,
        subject: 'Xác thực email',
        html: `<h4>Xin chào, ${fullName}</h4>
        ${message}
        `
    });
};

module.exports = sendVerificationEmail;