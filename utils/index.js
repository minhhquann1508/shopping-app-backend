const sendVerificationEmail = require('./sendVerificationEmail');
const createTokenUser = require('./createTokenUser');
const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const sendResetPasswordEmail = require('./sendResetPasswordEmail');
const createHash = require('./createHash');
const checkPermission = require('./checkPermission');
module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    sendVerificationEmail,
    createTokenUser,
    sendResetPasswordEmail,
    createHash,
    checkPermission
}