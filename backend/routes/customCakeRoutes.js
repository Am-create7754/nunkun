import express from 'express';
import CustomCake from '../models/CustomCake.js';
import { protect } from '../middleware/authMiddleware.js';
import { calculateCustomCakePrice } from '../utils/pricing.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { tiers, shape, flavor, toppings, referenceImage } = req.body;

  try {
    // Price is calculated here, not taken from the client
    const price = calculateCustomCakePrice({ tiers: Number(tiers), shape, flavor, toppings });
    const cake = new CustomCake({
      user: req.user._id,
      tiers,
      shape,
      flavor,
      toppings,
      referenceImage,
      price,
    });
    
    const createdCake = await cake.save();
    res.status(201).json(createdCake);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user', protect, async (req, res) => {
  try {
    const cakes = await CustomCake.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(cakes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
