const Product = require('../models/Product');
const CustomError = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Cart = require('../models/Cart');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const createProduct = async (req, res) => {
    const { userId } = req.user;
    const product = await Product.create({ ...req.body, createdBy: userId });
    res.status(StatusCodes.CREATED).json({ product });
};

const uploadProductImage = async (req, res) => {
    const { productId } = req.params;
    if (!req.files)
        throw new CustomError.NotFoundError('Không tìm thấy file cần upload');
    if (!req.files.image.mimetype.startsWith('image'))
        throw new CustomError.BadRequestError('File gửi lên phải là file ảnh');
    const maxSize = 1024 * 1024;
    if (req.files.image.size > maxSize)
        throw new CustomError.BadRequestError('Dung lượng ảnh vượt quá 1MB');
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: 'shopping_app',
        unique_filename: true
    });
    fs.unlinkSync(req.files.image.tempFilePath);
    const product = await Product.findOne({ _id: productId });
    product.thumbnails = result.secure_url;
    await product.save();
    res.status(StatusCodes.OK).json({ msg: 'Cập nhật hình ảnh thành công' })
}

const getAllProduct = async (req, res) => {
    const { price, brand, search, category } = req.query;
    let queryObject = {};

    if (brand) {
        queryObject.brand = brand;
    }

    if (search) {
        queryObject.title = search;
    }

    if (category) {
        const categoryList = category.split(',');
        queryObject.category = categoryList;
    }

    let result = Product.find(queryObject);

    if (price) {
        result = result.sort('price');
    } else {
        result = result.sort('createdAt');
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit).select('-__v');

    const product = await result.populate('category');

    res.status(StatusCodes.OK).json({ product, currentPage: page, total: product.length });
};

const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id }).populate('category').select('-__v').populate('reviews');
    if (!product)
        throw new CustomError.NotFoundError('Không tìm thấy sản phẩm với id: ', +id);
    res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { title, desc, price, brand, size } = req.body;
    if (!title || !desc || !price || !brand || !size)
        throw new CustomError.BadRequestError('Vui lòng nhập đầy đủ thông tin');
    const product = await Product.findOne({ _id: id });
    if (!product)
        throw new CustomError.NotFoundError('Không tìm thấy sản phẩm với id: ', +id);

    product.title = title;
    product.desc = desc;
    product.price = price;
    product.brand = brand;
    product.size = size;
    await product.save();

    res.status(StatusCodes.OK).json({ msg: 'Cập nhật sản phẩm thành công' });
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id });
    if (!product) throw new CustomError.NotFoundError('Không tìm thấy sản phẩm với id: ', +id);
    const cart = await Cart.findOne({ cart: { $elemMatch: { product: id } } });
    if (cart) throw new CustomError.BadRequestError('Không thể xóa do sản phẩm này đã được thêm vào giỏ hàng');
    await product.deleteOne();
    res.status(StatusCodes.OK).json({ msg: 'Xóa sản phẩm thành công' });
};

module.exports = {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
}