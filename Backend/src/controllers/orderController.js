import Order from '../models/Order.js';
import User from '../models/User.js';
import crypto from 'crypto';

export const createOrder = async (req, res) => {
  try {
    const { items, total, subtotal, discount, couponCode, shippingAddress, paymentMethod } = req.body;
    
    // Generate Unique Order ID
    const orderId = 'ORD' + crypto.randomBytes(4).toString('hex').toUpperCase();

    // Safely map items — frontend sends { id, _id, name, price, qty, image, color }
    const mappedItems = (items || []).map(item => ({
      product: item._id || item.id || undefined,
      name: item.name,
      price: item.price,
      qty: item.qty || item.quantity || 1,
      image: item.image,
      color: item.color || item.selectedColor || null,
      dimensions: item.dimensions || null
    }));

    const order = new Order({
      orderId,
      user: req.user._id,
      items: mappedItems,
      total,
      subtotal: subtotal || total,
      discount: discount || 0,
      couponCode: couponCode || null,
      shippingAddress,
      paymentMethod
    });

    const savedOrder = await order.save();

    // Mark coupon as used
    if (couponCode) {
      try {
        const Coupon = (await import('../models/Coupon.js')).default;
        await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase() },
          { $addToSet: { usersUsed: req.user._id } }
        );
      } catch (e) { console.warn('Coupon usage mark failed:', e.message); }
    }

    // ── Sync user phone + GPS location from this order ──
    try {
      const userUpdate = {};
      
      // Save phone if provided and not already set
      if (shippingAddress?.phone && !req.user.phone) {
        userUpdate.phone = shippingAddress.phone;
      }
      
      // Always update lastLocation if GPS coordinates were provided
      if (shippingAddress?.coordinates?.lat && shippingAddress.coordinates.lat !== 0) {
        userUpdate.lastLocation = {
          lat: shippingAddress.coordinates.lat,
          lng: shippingAddress.coordinates.lng,
          address: shippingAddress.address || '',
          city: shippingAddress.city || '',
          updatedAt: new Date()
        };
        
        // Also add/update addresses array
        const newAddr = {
          fullName: shippingAddress.fullName || req.user.name,
          phone: shippingAddress.phone || req.user.phone,
          email: shippingAddress.email || req.user.email,
          address: shippingAddress.address || '',
          city: shippingAddress.city || '',
          pincode: shippingAddress.pincode || '',
          country: shippingAddress.country || 'India',
          coordinates: shippingAddress.coordinates,
          isDefault: true
        };
        
        await User.findByIdAndUpdate(req.user._id, {
          ...userUpdate,
          $push: { 
            addresses: { $each: [newAddr], $position: 0, $slice: 5 } 
          }
        });
      } else if (Object.keys(userUpdate).length > 0) {
        await User.findByIdAndUpdate(req.user._id, userUpdate);
      }
    } catch (syncErr) {
      console.error('User sync after order failed (non-critical):', syncErr.message);
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate('user', 'name email');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId.toUpperCase() })
      .select('orderId orderStatus trackingHistory shippingAddress.city createdAt total discount couponCode items.name items.image items.color');
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      if (order.orderStatus === 'Delivered') {
        return res.status(400).json({ message: 'Cannot cancel a delivered order' });
      }
      order.orderStatus = 'Cancelled';
      order.cancelReason = req.body.reason || 'No reason provided';
      order.trackingHistory.push({
        status: 'Cancelled',
        description: `Order cancelled by user. Reason: ${order.cancelReason}`
      });
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status and tracking
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.orderStatus = req.body.status || order.orderStatus;
      if (req.body.tracking) {
        order.trackingHistory.push({
          status: req.body.status,
          location: req.body.tracking.location,
          description: req.body.tracking.description
        });
      }
      await order.save();
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get order stats
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((acc, item) => acc + (item.total || 0), 0);
    const totalOrders = await Order.countDocuments();
    
    res.json({
      totalRevenue,
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
