import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user favorites
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle favorite
router.post('/favorites', protect, async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    
    const isFavorite = user.favorites.includes(productId);
    if (isFavorite) {
      user.favorites = user.favorites.filter(id => id.toString() !== productId);
    } else {
      user.favorites.push(productId);
    }
    
    await user.save();
    res.json({ message: isFavorite ? 'Removed from favorites' : 'Added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
