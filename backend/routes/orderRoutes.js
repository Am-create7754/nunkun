import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/authMiddleware.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';
import { priceOrder } from '../utils/pricing.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { deliveryAddress, phone, paymentMethod, deliveryDate, deliveryTimeSlot, couponApplied } = req.body;

  let priced;
  try {
    // Never trust prices, discounts or points from the client
    priced = await priceOrder({ ...req.body, user: req.user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  const { orderItems, totalPrice, pointsUsed } = priced;

  try {
    const order = new Order({
      orderItems,
      user: req.user._id,
      deliveryAddress,
      phone,
      paymentMethod,
      totalPrice,
      deliveryDate,
      deliveryTimeSlot,
      couponApplied: couponApplied || undefined,
      pointsUsed,
    });

    if (paymentMethod === 'Card' || paymentMethod === 'UPI') {
      if (totalPrice < 1) {
        return res.status(400).json({ message: 'Online payments must be at least ₹1. Please choose Cash on Delivery.' });
      }

      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: Math.round(totalPrice * 100), // amount in smallest currency unit (paise)
        currency: 'INR',
        receipt: `receipt_order_${new Date().getTime()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);
      order.razorpayOrderId = razorpayOrder.id;
      const createdOrder = await order.save();
      res.status(201).json({ ...createdOrder._doc, razorpayOrder });
    } else {
      // Cash on Delivery
      const createdOrder = await order.save();
      
      const user = await User.findById(req.user._id);
      user.points = Math.max(0, user.points - pointsUsed) + Math.floor(totalPrice / 100);
      await user.save();

      try {
        await sendEmail({
          email: req.user.email,
          subject: `Order Confirmation - ${createdOrder._id}`,
          html: `<h1>Thank you for your order!</h1><p>Your order for ${orderItems.length} items has been received.</p>`,
        });
      } catch (e) { console.error('Email error:', e); }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify-payment', protect, async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
  const digest = shasum.digest('hex');

  if (digest !== razorpaySignature) {
    return res.status(400).json({ message: 'Invalid payment signature' });
  }

  try {
    const order = await Order.findOne({ razorpayOrderId: String(razorpayOrderId), user: req.user._id }).populate('user', 'email name');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // Replaying the same payment must not award points twice
    if (order.paymentStatus === 'Paid') {
      return res.json({ message: 'Payment already verified' });
    }

    order.paymentStatus = 'Paid';
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    const user = await User.findById(order.user._id);
    user.points = Math.max(0, user.points - order.pointsUsed) + Math.floor(order.totalPrice / 100);
    await user.save();

    try {
      await sendEmail({
        email: order.user.email,
        subject: `Payment Confirmed - ${order._id}`,
        html: `<h1>Payment Received!</h1><p>Your payment for order ${order._id} was successful.</p>`,
      });
    } catch (e) { console.error('Email error:', e); }

    res.json({ message: 'Payment verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    // Only the customer who placed the order (or an admin) can see it
    if (order && (order.user._id.equals(req.user._id) || req.user.isAdmin)) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
