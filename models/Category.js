const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên danh mục không được bỏ trống']
    },
    slug: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);