const notFoundMiddleware = async (req, res, next) => res.status(404).json({ msg: 'Không tìm thấy đường dẫn này' });

module.exports = notFoundMiddleware;
