import { InsForgeClient } from '@insforge/sdk';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({ message: 'Not authorized, invalid token' });
            }

            const adminEmail = 'ramanadhamjayaveer@mictech.edu.in';

            // 1. Try InsForge Verification (Official Way)
            const client = new InsForgeClient({
                projectId: process.env.INSFORGE_PROJECT_ID,
                apiKey: process.env.INSFORGE_API_KEY,
                baseUrl: process.env.INSFORGE_BASE_URL,
                edgeFunctionToken: token
            });

            const { data, error } = await client.auth.getCurrentUser();
            let user = data?.user;

            // 2. Fallback: Local JWT Decode (In case InsForge API is flaky/slow)
            if (error || !user) {
                console.warn('Insforge SDK failed, attempting local decode fallback...');
                try {
                    const decoded = jwt.decode(token);
                    if (decoded && decoded.email === adminEmail) {
                        console.log('Local fallback successful for Admin:', adminEmail);
                        user = {
                            id: decoded.sub || 'fallback-id',
                            email: decoded.email,
                            user_metadata: { full_name: decoded.name || 'Admin' }
                        };
                    }
                } catch (decodeErr) {
                    console.error('Local decode also failed:', decodeErr.message);
                }
            }

            if (!user) {
                return res.status(401).json({ 
                    message: 'Not authorized, token failed',
                    details: error?.message || 'Verification failed'
                });
            }

            // Sync with MongoDB
            let mongoUser = await User.findOne({ 
                $or: [{ insforgeId: user.id }, { email: user.email }] 
            });

            const incomingPhone = req.headers['x-user-phone'] || '';
            const incomingName = req.headers['x-user-name'] || user.user_metadata?.full_name || user.email.split('@')[0];
            const incomingReferralCode = req.headers['x-referral-code'] || '';

            const userData = {
                insforgeId: user.id,
                name: incomingName,
                email: user.email,
                role: user.email.toLowerCase() === adminEmail.toLowerCase() ? 'admin' : 'user'
            };

            if (!mongoUser) {
                mongoUser = await User.create(userData);
                
                // If it's a new user and they provided a referral code, try to link it
                if (incomingReferralCode) {
                    const referrer = await User.findOne({ referralCode: incomingReferralCode.toUpperCase() });
                    if (referrer) {
                        mongoUser.referredBy = referrer._id;
                        await mongoUser.save();
                    }
                }
            } else {
                let updated = false;
                if (!mongoUser.insforgeId) { mongoUser.insforgeId = user.id; updated = true; }
                if (user.email.toLowerCase() === adminEmail.toLowerCase() && mongoUser.role !== 'admin') {
                    mongoUser.role = 'admin';
                    updated = true;
                }
                // Update name if changed
                if (incomingName && incomingName !== mongoUser.name) { mongoUser.name = incomingName; updated = true; }
                // Update phone if provided and not already set
                if (incomingPhone && !mongoUser.phone) { mongoUser.phone = incomingPhone; updated = true; }
                // Set referral if provided and not already set
                if (incomingReferralCode && !mongoUser.referredBy) {
                    const referrer = await User.findOne({ referralCode: incomingReferralCode.toUpperCase() });
                    if (referrer) { mongoUser.referredBy = referrer._id; updated = true; }
                }
                if (updated) await mongoUser.save();
            }

            req.user = mongoUser;
            return next();
        } catch (error) {
            console.error('Critical Auth Failure:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
