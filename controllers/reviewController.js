const Review = require('../models/Review');
const Product = require('../models/Product');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');

const createReview = async (req, res) => {
    const { product, rating, comment } = req.body;
    const { userId } = req.user;
    if (!product || !rating || !comment)
        throw new CustomError.BadRequestError('Vui lòng cung cấp đầy đủ thông tin');
    const findingProduct = await Product.findOne({ _id: product });
    if (!findingProduct)
        throw new CustomError.NotFoundError(`Không tìm thấy sản phẩm với id: ${product}`);
    const isAlreadyHaveReview = await Review.findOne({ user: userId });
    if (isAlreadyHaveReview)
        throw new CustomError.BadRequestError('Bạn đã bình luận về sản phẩm này rồi');
    const review = await Review.create({ ...req.body, user: userId });
    res.status(StatusCodes.CREATED).json({ review });
};

const getSingleReview = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findOne({ _id: id }).select('-__v');
    if (!review)
        throw new CustomError.NotFoundError('Không tìm thấy bình luận với id ', id);
    res.status(StatusCodes.CREATED).json({ review });
};

const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    if (!rating || !comment)
        throw new CustomError.BadRequestError('Vui lòng cung cấp đầy đủ thông tin');
    const review = await Review.findOne({ _id: id });
    if (!review)
        throw new CustomError.NotFoundError('Không tìm thấy bình luận với id ', id);

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(StatusCodes.CREATED).json({ msg: 'Cập nhật bình luận thành công' });
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findOne({ _id: id });
    if (!review)
        throw new CustomError.NotFoundError('Không tìm thấy bình luận với id ', id);
    await review.deleteOne();
    res.status(StatusCodes.CREATED).json({ msg: 'Xóa bình luận thành công' });
};

module.exports = {
    createReview,
    getSingleReview,
    updateReview,
    deleteReview
}