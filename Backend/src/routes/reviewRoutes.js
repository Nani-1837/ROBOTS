import express from 'express';
import { createProductReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/:id')
  .get(getProductReviews)
  .post(protect, upload.array('images', 5), createProductReview);


export default router;
