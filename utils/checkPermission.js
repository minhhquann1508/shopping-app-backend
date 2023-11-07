const CustomError = require("../errors");

const checkPermission = (user, userId) => {
    if (user.role === 'admin') return;
    if (user._id.toString() === userId) return;
    throw new CustomError.UnauthorizedError('Bạn không đủ quyền thực hiện thao tác này');
};

module.exports = checkPermission;