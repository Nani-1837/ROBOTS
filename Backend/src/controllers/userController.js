import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            avatar: user.avatar,
            addresses: user.addresses,
            lastLocation: user.lastLocation,
            referralCode: user.referralCode,
            referredBy: user.referredBy,
            createdAt: user.createdAt
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user avatar
// @route   PUT /api/users/profile/avatar
// @access  Private
export const updateAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.avatar = req.file.path;
            await user.save();
            res.json({ avatar: user.avatar });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (req.body.name) user.name = req.body.name;
            if (req.body.phone) user.phone = req.body.phone;
            
            // Direct lastLocation update (from signup GPS capture)
            if (req.body.lastLocation && req.body.lastLocation.lat) {
                user.lastLocation = {
                    lat: req.body.lastLocation.lat,
                    lng: req.body.lastLocation.lng,
                    address: req.body.lastLocation.address || '',
                    city: req.body.lastLocation.city || '',
                    updatedAt: new Date()
                };
            }
            
            // Handle addresses array with GPS coordinates
            if (req.body.addresses && Array.isArray(req.body.addresses)) {
                // Merge: replace matching city or just prepend new address
                const newAddresses = req.body.addresses.map(addr => ({
                    fullName: addr.fullName || user.name,
                    phone: addr.phone || req.body.phone || user.phone,
                    address: addr.address || '',
                    city: addr.city || '',
                    pincode: addr.pincode || '',
                    country: addr.country || 'India',
                    email: addr.email || '',
                    coordinates: {
                        lat: addr.coordinates?.lat || 0,
                        lng: addr.coordinates?.lng || 0
                    },
                    isDefault: true
                }));
                
                // Keep old addresses, add new ones at front
                user.addresses = [...newAddresses, ...user.addresses.filter(a => 
                    !newAddresses.some(n => n.city === a.city && n.pincode === a.pincode)
                )].slice(0, 5); // Max 5 saved addresses
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                addresses: updatedUser.addresses,
                referralCode: updatedUser.referralCode,
                referredBy: updatedUser.referredBy
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate a referral code for the user
// @route   PUT /api/users/profile/referral
// @access  Private
export const generateReferralCode = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (user.referralCode) {
                return res.status(400).json({ message: 'User already has a referral code', referralCode: user.referralCode });
            }
            
            // Generate a unique 8-character code
            const crypto = await import('crypto');
            let isUnique = false;
            let code = '';
            
            while (!isUnique) {
                code = crypto.randomBytes(4).toString('hex').toUpperCase();
                const existing = await User.findOne({ referralCode: code });
                if (!existing) isUnique = true;
            }
            
            user.referralCode = code;
            await user.save();
            
            res.json({ referralCode: user.referralCode });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
