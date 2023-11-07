const mongoose = require('mongoose');
const Product = require('./Product');

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Người bình luận không được bỏ trống']
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Mã sản phẩm không được bỏ trống']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 0
    },
    comment: {
        type: String,
        maxlength: [200, 'Bình luận không được vượt quá 200 ký tự']
    },
}, { timestamps: true });

ReviewSchema.statics.calcAverangeRating = async function (productId) {
    const result = await this.aggregate([
        {
            $match: {
                product: productId
            }
        }, {
            $group: {
                _id: null,
                averangeRating: {
                    $avg: '$rating'
                },
                numberOfReviews: {
                    $sum: 1
                }
            }
        }
    ]);
    try {
        await this.model('Product').findOneAndUpdate(
            { _id: productId },
            {
                averangeRating: Math.ceil(result[0].averangeRating || 0),
                numberOfReviews: result[0]?.numberOfReviews || 0,
            }
        )
    } catch (error) {
        console.log(error);
    }
};

ReviewSchema.post('save', async function () {
    await this.constructor.calcAverangeRating(this.product);
});

ReviewSchema.post('deleteOne', async function () {
    await this.constructor.calcAverangeRating(this.product);
})

module.exports = mongoose.model('Review', ReviewSchema);