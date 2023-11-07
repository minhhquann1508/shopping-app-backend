const mongoose = require('mongoose');
const Review = require('./Review');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên sản phẩm không được bỏ trống']
    },
    desc: {
        type: String,
        required: [true, 'Mô tả sản phẩm không được bỏ trống'],
        maxlength: [300, 'Mô tả sản phẩm không được vượt quá 300 ký tự']
    },
    price: {
        type: Number,
        required: [true, 'Giá sản phẩm không được bỏ trống'],
    },
    thumbnails: {
        type: String,
        default: ''
    },
    images: {
        type: [String],
        default: []
    },
    category: {
        type: [{
            type: mongoose.Types.ObjectId,
            ref: 'Category',
        }],
        required: [true, 'Danh mục sản phẩm không được bỏ trống']
    },
    brand: {
        type: String,
        required: [true, 'Nhãn hàng sản phẩm không được bỏ trống']
    },
    size: {
        type: [String],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người tạo sản phẩm không được bỏ trống']
    },
    averangeRating: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
});

ProductSchema.pre('deleteOne', async function () {
    await Review.deleteMany({ product: this._conditions._id });
})



module.exports = mongoose.model('Product', ProductSchema);