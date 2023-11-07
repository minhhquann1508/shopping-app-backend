const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const createCart = async (req, res) => {
    const { userId } = req.user;
    const { productId, quantity } = req.body;
    if (!productId || !quantity)
        throw new CustomError.BadRequestError('Vui lòng cung cấp mã sản phẩm và số lượng');
    const product = await Product.findOne({ _id: productId });
    if (!product)
        throw new CustomError.NotFoundError('Không tìm thấy sản phẩm với id: ', +productId);
    const isHavedCart = await Cart.findOne({ user: userId });
    const cartItem = {
        thumbnails: product.thumbnails,
        title: product.title,
        desc: product.desc,
        price: product.price,
        quantity,
        product: productId
    };
    if (!isHavedCart) {
        const cart = await Cart.create({
            user: userId,
            cart: [cartItem]
        });
        res.status(StatusCodes.CREATED).json({ cart });
    } else {
        let { cart } = isHavedCart;
        const index = cart.findIndex((item) => item.product.toString() === productId);
        if (index !== -1) {
            cart[index].quantity += quantity;
        } else {
            cart.push(cartItem);
        }
        const updatedCart = await Cart.findOneAndUpdate(
            { user: userId },
            { cart },
            { new: true }
        );
        res.status(StatusCodes.OK).json({ cart: updatedCart });
    }
};

const getCurrentUserCart = async (req, res) => {
    const { userId } = req.user;
    const cart = await Cart.findOne({ user: userId }).select('cart');
    res.status(StatusCodes.OK).json(cart);
};

const changCartItemQuantity = async (req, res) => {
    const { userId } = req.user;
    const { quantity, cartItemId } = req.body;
    if (!quantity)
        throw new CustomError.BadRequestError('Vui lòng cung cấp số lượng sản phẩm');
    const cartItem = await Cart.findOne({ user: userId, 'cart._id': cartItemId });
    if (!cartItem)
        throw new CustomError.NotFoundError('Không tìm thấy sản phẩm cần thay đổi số lượng');
    const updateCartItem = cartItem.cart.find((item) => item._id.toString() == cartItemId);
    updateCartItem.quantity = quantity;
    await cartItem.save();
    res.status(StatusCodes.OK).json({ msg: 'Cập nhật số lượng thành công' });
};

const deleteCartItem = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const userCart = await Cart.findOne({ user: userId });
    if (!userCart)
        throw new CustomError.NotFoundError('Không tìm thấy giỏ hàng của người dùng này');
    const { cart } = userCart;
    const index = cart.findIndex((item) => item.product.toString() === id);
    if (index !== -1) {
        cart.splice(index, 1);
        await userCart.save();
        res.status(StatusCodes.OK).json({ msg: 'Xóa sản phẩm thành công' });
    } else {
        throw new CustomError.NotFoundError('Không tìm thấy sản phẩm trong giỏ hàng');
    }
};

module.exports = {
    createCart,
    getCurrentUserCart,
    changCartItemQuantity,
    deleteCartItem
}