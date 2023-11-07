const CustomError = require('./bad-request');
const { StatusCodes } = require('http-status-codes')

class UnauthenticatedError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
};

module.exports = UnauthenticatedError;