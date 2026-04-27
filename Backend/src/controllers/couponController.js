import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
  try {
    const { code, discountAmount, expiryDate, targetUser, isAllUsers } = req.body;

    const couponExists = await Coupon.findOne({ code });

    if (couponExists) {
      return res.status(400).json({ message: 'Coupon already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountAmount,
      expiryDate,
      targetUser: isAllUsers ? null : targetUser,
      isAllUsers
    });

    // Create Notification
    await Notification.create({
      user: isAllUsers ? null : targetUser,
      title: 'New Promo Code Issued! 🎁',
      message: `You've received a new coupon: ${coupon.code}. Get ₹${discountAmount} OFF!`,
      type: 'coupon',
      isGlobal: isAllUsers
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active coupons for users
// @route   GET /api/coupons/active
// @access  Private
export const getActiveCoupons = async (req, res) => {
  try {
    const userId = req.user._id;
    const coupons = await Coupon.find({ 
      isActive: true, 
      expiryDate: { $gt: new Date() },
      $or: [
        { isAllUsers: true },
        { targetUser: userId }
      ]
    }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark coupon as revealed
// @route   POST /api/coupons/reveal/:code
// @access  Private
export const revealCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user._id;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    if (!coupon.usersRevealed.includes(userId)) {
      coupon.usersRevealed.push(userId);
      await coupon.save();
    }

    res.json({ message: 'Coupon revealed', coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usersUsed.includes(req.user._id)) {
      return res.status(400).json({ message: 'Coupon already used by you' });
    }

    res.json({
      code: coupon.code,
      discountAmount: coupon.discountAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
