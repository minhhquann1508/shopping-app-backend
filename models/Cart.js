const mongoose = require('mongoose');

const cartItem = mongoose.Schema({
    thumbnails: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    }
})

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Vui lòng nhập id người tạo giỏ hàng']
    },
    cart: {
        type: [cartItem],
        required: [true, 'Vui lòng chọn sản phẩm cần thêm vào giỏ']
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);