const CustomError = require('./custom-error');
const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-request');
const UnauthenticatedError = require('./unauthenticated');
const UnauthorizedError = require('./unthorized');

module.exports = {
    CustomError,
    NotFoundError,
    BadRequestError,
    UnauthenticatedError,
    UnauthorizedError
}