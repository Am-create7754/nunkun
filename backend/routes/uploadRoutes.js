import express from 'express';
import upload from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({
      message: 'Image Uploaded successfully',
      imageUrl: req.file.path,
    });
  } else {
    res.status(400).json({ message: 'Image upload failed' });
  }
});

export default router;
