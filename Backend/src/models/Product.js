import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    originalPrice: {
        type: Number
    },
    images: [{
        type: String
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    specs: {
        type: Map,
        of: String
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    warranty: {
        type: String
    },
    deliveryInfo: {
        type: String
    },
    colors: [{
        type: String
    }],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    }

}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
