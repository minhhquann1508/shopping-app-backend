const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Tên người dùng không để trống']
    },
    email: {
        type: String,
        required: [true, 'Email người dùng không để trống'],
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Số điện thoại không được để trống'],
        unique: true
    },
    address: {
        type: String,
        required: [true, 'Địa chỉ không được để trống'],
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu không được để trống'],
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verified: Date,
    verificationToken: String,
    passwordToken: String,
    passwordTokenExpiration: Date
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
};

module.exports = mongoose.model('User', UserSchema);