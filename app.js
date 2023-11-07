require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const categoryRouter = require('./routes/categoryRoute');
const cartRouter = require('./routes/cartRoute');
const reviewRouter = require('./routes/reviewRoute');
const paymentRouter = require('./routes/paymentRoute');

const errorHandlerMiddleware = require('./middleware/errors-handler');
const notFoundMiddleware = require('./middleware/not-found');

const connectDb = require('./db/connectDb');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/payment', paymentRouter);


app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 60,
    })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDb(process.env.MONGODB_URL);
        app.listen(port, () => {
            console.log(`Server is listening on ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
};

start();