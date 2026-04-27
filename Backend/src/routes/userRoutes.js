import express from 'express';
const router = express.Router();
import { getUserProfile, getUsers, updateUserRole, updateAvatar, updateProfile, generateReferralCode } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/referral', protect, generateReferralCode);
router.put('/profile/avatar', protect, upload.single('image'), updateAvatar);
router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, updateUserRole);

export default router;
