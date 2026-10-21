import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import customCakeRoutes from './routes/customCakeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

connectDB();

const app = express();

// In production set CLIENT_URL to the frontend's address (comma-separate several)
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((u) => u.trim()) : true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-cakes', customCakeRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
