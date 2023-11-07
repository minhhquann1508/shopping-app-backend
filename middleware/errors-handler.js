const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('../errors')

const errorHandlerMiddleware = async (err, req, res, next) => {
    const customError = {
        msg: err.message || 'Có lỗi xảy ra! Xin hãy thử lại sau',
        statusCode: err.statusCode || 500,
    };
    if (err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors).map((item) => item.message).join(',');
        customError.statusCode = 400;
    }
    if (err.code && err.code === 11000) {
        customError.msg = `Giá trị ${Object.keys(
            err.keyValue
        )} bị trùng lặp, vui lòng nhập giá trị khác`;
        customError.statusCode = 400;
    }
    if (err.name === 'CastError') {
        customError.msg = `Không tìm thấy id: ${err.value}`;
        customError.statusCode = 404;
    }
    res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;