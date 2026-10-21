import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { findValidCoupon } from '../utils/pricing.js';

const router = express.Router();

router.post('/validate', async (req, res) => {
  const { code } = req.body;
  try {
    const coupon = await findValidCoupon(code);
    res.json({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
