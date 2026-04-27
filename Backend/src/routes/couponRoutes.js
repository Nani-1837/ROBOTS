import express from 'express';
import { createCoupon, getCoupons, validateCoupon, deleteCoupon, getActiveCoupons, revealCoupon } from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/active', protect, getActiveCoupons);
router.post('/reveal/:code', protect, revealCoupon);

router.route('/')

  .post(protect, admin, createCoupon)
  .get(protect, admin, getCoupons);

router.post('/validate', protect, validateCoupon);

router.route('/:id')
  .delete(protect, admin, deleteCoupon);

export default router;
