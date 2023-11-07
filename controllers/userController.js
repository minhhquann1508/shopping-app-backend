const User = require('../models/User');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { checkPermission } = require('../utils');

const getAllUser = async (req, res) => {
    const { search, sort } = req.query;
    let queryObject = {};

    if (search) {
        queryObject.search = search;
    }

    let result = User.find(queryObject);

    if (sort) {
        const sortList = sort.split(',').join(' ');
        result = result.sort(sortList);
    } else {
        result = result.sort('createdAt');
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const users = await result
        .select('_id fullName email phoneNumber address role createdAt updatedAt');

    res.status(StatusCodes.OK).json({ users, total: users.length, currentPage: page });
};

const getSingleUser = async (req, res) => {
    const { id } = req.params;
    const user = await User
        .findOne({ _id: id }).select('_id fullName email phoneNumber address role createdAt updatedAt');
    if (!user) throw new CustomError(`Không tìm thấy người dùng với id: ${id}`);
    res.status(StatusCodes.OK).json({ user });
};

const getCurrentUser = async (req, res) => {
    const { userId } = req.user;
    const user = await User.findOne({ _id: userId }).select('_id fullName email phoneNumber address role createdAt updatedAt');
    res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { fullName, phoneNumber, address } = req.body;
    if (!fullName || !phoneNumber || !address)
        throw new CustomError.BadRequestError('Không được để trống cách trường giá trị');
    const user = await User.findOne({ _id: id });
    if (!user) throw new CustomError.NotFoundError(`Không tìm thấy người dùng với id : ${id}`);
    checkPermission(user, req.user.userId);
    user.fullName = fullName;
    user.phoneNumber = phoneNumber;
    user.address = address;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Cập nhật người dùng thành công' })
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) throw new CustomError.NotFoundError(`Không tìm thấy người dùng với id : ${id}`);
    await user.deleteOne();
    res.status(StatusCodes.OK).json({ msg: 'Xóa người dùng thành công' });
};

module.exports = {
    getAllUser,
    getSingleUser,
    getCurrentUser,
    updateUser,
    deleteUser
};