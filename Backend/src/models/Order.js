import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false   // optional — frontend may send id or _id
    },
    name: String,
    price: Number,
    qty: Number,
    image: String,
    color: String
  }],
  total: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  couponCode: {
    type: String,
    default: null
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    email: String,
    address: String,
    city: String,
    pincode: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  paymentMethod: {
    type: String,
    default: 'COD'
  },
  cancelReason: {
    type: String
  },
  trackingHistory: [{
    status: String,
    location: String,
    timestamp: { type: Date, default: Date.now },
    description: String
  }]
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
