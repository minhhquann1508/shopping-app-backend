const createTokenUser = (user) => {
    return {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        userId: user._id,
        phoneNumber: user.phoneNumber,
        address: user.address
    };
};

module.exports = createTokenUser;