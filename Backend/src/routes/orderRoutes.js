import express from 'express';
import { createOrder, getMyOrders, getOrderById, getAllOrders, cancelOrder, updateOrderStatus, trackOrder, getOrderStats } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/track/:orderId', trackOrder);
router.post('/', protect, createOrder);
router.get('/stats', protect, admin, getOrderStats);
router.get('/', protect, admin, getAllOrders);
router.get('/my', protect, getMyOrders);
router.get('/:orderId', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
