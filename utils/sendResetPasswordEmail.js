
const sendEmail = require('./sendEmail');

const sendResetPasswordEmail = async ({
    fullName,
    email,
    token,
    origin
}) => {
    const resetURL = `${origin}/account/reset-password?token=${token}&email=${email}`;

    const message = `<p>Để đặt lại mật khẩu. <a href="${resetURL}">Bấm vào đây</a></p>`;

    return sendEmail({
        to: email,
        subject: 'Đặt lại mật khẩu',
        html: `<h4>Xin chào, ${fullName}</h4>
        ${message}
        `
    });
};

module.exports = sendResetPasswordEmail;