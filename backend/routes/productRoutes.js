import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

import { protect, admin } from '../middleware/authMiddleware.js';
import Order from '../models/Order.js';

router.get('/', async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? {
      name: {
        // Escape regex characters so search text can't break or slow down the query
        $regex: String(req.query.keyword).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        $options: 'i',
      }
    } : {};
    
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));
    
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Strict review check: User must have ordered this product
    const orders = await Order.find({ user: req.user._id, 'orderItems.product': product._id });
    if (orders.length === 0) {
       return res.status(400).json({ message: 'You can only review products you have ordered.' });
    }
    
    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
       return res.status(400).json({ message: 'Product already reviewed' });
    }
    
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
});

// Replaces the whole menu with sample products. Admin only.
router.post('/seed', protect, admin, async (req, res) => {
  const sampleProducts = [
    {
      name: 'Almond Croissant',
      description: 'Buttery layers, almond cream, toasted flakes.',
      price: 280,
      category: 'Pastries',
      tags: [],
      image: '/images/croissants.jpg',
    },
    {
      name: 'Pistachio Macarons (6)',
      description: 'Crisp shell, silky ganache, real pistachio.',
      price: 540,
      category: 'Pastries',
      tags: [],
      image: '/images/macarons.jpg',
    },
    {
      name: 'Blueberry Muffin',
      description: 'Fluffy crumb with wild blueberries.',
      price: 220,
      category: 'Pastries',
      tags: [],
      image: '/images/muffins.jpg',
    },
    {
      name: 'Country Sourdough',
      description: '48-hr ferment, dark crackling crust.',
      price: 380,
      category: 'Breads',
      tags: ['VEGAN', 'EGGLESS'],
      image: '/images/sourdough.jpg',
    },
    {
      name: 'Cinnamon Roll',
      description: 'Soft swirls, cream-cheese glaze.',
      price: 260,
      category: 'Pastries',
      tags: ['EGGLESS'],
      image: '/images/cinnamon-rolls.jpg',
    },
    {
      name: 'Cherry Danish',
      description: 'Flaky pastry, sour cherry compote.',
      price: 290,
      category: 'Pastries',
      tags: [],
      image: '/images/danish.jpg',
    },
    {
      name: 'Classic Choc Chip',
      description: 'Gooey center, crispy edges.',
      price: 180,
      category: 'Pastries',
      tags: ['EGGLESS'],
      image: '/images/choc-muffins.jpg',
    },
    {
      name: 'Fudge Brownie',
      description: 'Rich dark chocolate, sea salt flakes.',
      price: 250,
      category: 'Pastries',
      tags: ['GLUTEN-FREE', 'EGGLESS'],
      image: '/images/brownies.jpg',
    },
  ];

  try {
    await Product.deleteMany();
    const createdProducts = await Product.insertMany(sampleProducts);
    res.status(201).json(createdProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
