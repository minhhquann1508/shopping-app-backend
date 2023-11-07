const { StatusCodes } = require('http-status-codes');
const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('slugify');
const CustomError = require('../errors')
const createCategory = async (req, res) => {
    const { title } = req.body;
    if (!title) throw new CustomError.BadRequestError('Vui lòng điền tên danh mục');
    const slug = await slugify(title, { lower: true });
    const category = await Category.create({ title, slug });
    res.status(StatusCodes.CREATED).json({ category });
};

const getAllCategory = async (req, res) => {
    const category = await Category.find({});
    res.status(StatusCodes.OK).json({ category });
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    if (!title) throw new CustomError.BadRequestError('Vui lòng điền tên danh mục');
    const category = await Category.findOne({ _id: id });
    if (!category) throw new CustomError.BadRequestError('Không tìm thấy danh mục với id: ', +id);
    category.title = title;
    category.slug = slugify(title, { lower: true });
    await category.save();
    res.status(StatusCodes.OK).json({ msg: 'Cập nhật danh mục thành công' });
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const isCategoryHavedProduct = await Product.findOne({ category: { $in: [id] } });
    if (isCategoryHavedProduct)
        throw new CustomError.BadRequestError('Không thể xóa danh mục đã có sản phẩm đăng ký')
    await Category.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json({ msg: 'Xóa danh mục thành công' });
};

module.exports = {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
}