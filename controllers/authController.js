const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail')
const { createHash, createTokenUser, attachCookiesToResponse, sendResetPasswordEmail } = require('../utils');

const register = async (req, res, next) => {
    const { email, fullName, password, phoneNumber, address } = req.body;
    const isAccountIsAlreadyRegistered = await User.findOne({ email });
    if (isAccountIsAlreadyRegistered)
        throw new CustomError.BadRequestError('Email này đã được đăng ký');

    const isFirstAccount = await User.countDocuments() === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const user = await User.create({
        email,
        fullName,
        password,
        phoneNumber,
        address,
        role,
        verificationToken
    });

    const origin = 'http://localhost:3000';

    await sendVerificationEmail({
        fullName: user.fullName,
        email: user.email,
        verificationToken: user.verificationToken,
        origin
    });

    res.status(StatusCodes.CREATED).json({
        msg: 'Thành công! Hãy kiểm tra email để xác thực tài khoản'
    });
};

const verifyEmail = async (req, res) => {
    const { verificationToken, email } = req.body;
    if (!email || !verificationToken)
        throw new CustomError.BadRequestError('Xác thực thất bại');
    const user = await User.findOne({ email });
    if (!user) throw new CustomError.NotFoundError("Không tìm thấy người dùng với email này");
    if (user.verificationToken !== verificationToken)
        throw new CustomError.UnauthenticatedError('Xác thực thất bại')
    user.isVerified = true;
    user.verified = Date.now();
    user.verificationToken = '';
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Xác thực email thành công' });
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new CustomError.BadRequestError('Vui lòng cung cấp đủ email và mật khẩu');
    const user = await User.findOne({ email });
    if (!user) throw new CustomError.NotFoundError("Không tìm thấy người dùng với email này");
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw new CustomError.UnauthenticatedError('Mật khẩu không đúng');
    if (!user.isVerified)
        throw new CustomError.UnauthenticatedError('Bạn cần xác thực email này để đăng nhập');

    const tokenUser = createTokenUser(user);
    let refreshToken = '';

    const existingToken = await Token.findOne({ user: user._id });

    if (existingToken) {
        const { isValid } = existingToken;
        if (!isValid) {
            throw new CustomError.UnauthenticatedError('Thông tin không hợp lệ');
        }
        refreshToken = existingToken.refreshToken;
        attachCookiesToResponse({ res, user: tokenUser, refreshToken });
        res.status(StatusCodes.OK).json({ user: tokenUser });
        return;
    }
    refreshToken = crypto.randomBytes(40).toString('hex');
    const userToken = { refreshToken, user: user._id };
    await Token.create(userToken);
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res, next) => {
    await Token.findOneAndDelete({
        user: req.user.userId
    });
    res.cookie('accessToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.cookie('refreshToken', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'Đăng xuất thành công' });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) throw new CustomError.BadRequestError('Cần có mật khẩu để lấy lại mật khẩu');

    const user = await User.findOne({ email });

    if (!user) throw new CustomError.NotFoundError('Không tìm thấy người dùng này');

    const passwordToken = crypto.randomBytes(70).toString('hex');
    const origin = 'http://localhost:3000'
    await sendResetPasswordEmail({
        fullName: user.fullName,
        email: user.email,
        token: passwordToken,
        origin
    });

    const tenMinutes = 60 * 10 * 1000;
    const passwordTokenExpiration = new Date(Date.now() + tenMinutes);

    user.passwordToken = passwordToken,
        user.passwordTokenExpiration = passwordTokenExpiration;
    await user.save();

    res
        .status(StatusCodes.OK)
        .json({ msg: 'Kiểm tra email của bạn để đặt lại mật khẩu' });
};

const resetPassword = async (req, res) => {
    const { email, token, password } = req.body;
    if (!email || !token || !password)
        throw new CustomError.BadRequestError('Hãy cung cấp đầy đủ các thông tin');
    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError.NotFoundError('Không tìm thấy người dùng này');
    } else {
        const currentDate = new Date();
        if (
            user.passwordToken === token &&
            user.passwordTokenExpiration > currentDate
        ) {
            user.password = password;
            user.passwordToken = null;
            user.passwordTokenExpiration = null;
            await user.save();
        }
    }
    res.status(StatusCodes.OK).json({ msg: 'Đặt lại mật khẩu thành công' });
};

module.exports = {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    logout
}