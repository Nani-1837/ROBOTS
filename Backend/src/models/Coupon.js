import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  discountAmount: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  usersUsed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isAllUsers: {
    type: Boolean,
    default: true,
  },
  usersRevealed: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
