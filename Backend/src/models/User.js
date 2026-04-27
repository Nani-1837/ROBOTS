import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    insforgeId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    referralCode: {
        type: String,
        unique: true,
        sparse: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Last known GPS location from checkout
    lastLocation: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 },
        address: { type: String, default: '' },
        city: { type: String, default: '' },
        updatedAt: { type: Date, default: Date.now }
    },
    addresses: [{
        fullName: String,
        phone: String,
        email: String,
        address: String,
        city: String,
        pincode: String,
        country: String,
        isDefault: { type: Boolean, default: false },
        coordinates: {
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 }
        }
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;
