import mongoose from 'mongoose';

const battleSchema = new mongoose.Schema({
  product1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  product2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, { timestamps: true });

const Battle = mongoose.model('Battle', battleSchema);
export default Battle;
