import mongoose from 'mongoose';

const customPrintOrderSchema = new mongoose.Schema({
  modelUrl: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  contact: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  shipping: {
    address: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['Pending', 'Quoted', 'In Production', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

const CustomPrintOrder = mongoose.model('CustomPrintOrder', customPrintOrderSchema);
export default CustomPrintOrder;
