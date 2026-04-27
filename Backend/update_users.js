import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const updateExistingUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Update all users who don't have a phone field
        const result = await User.updateMany(
            { phone: { $exists: false } },
            { $set: { phone: 'Not Provided' } }
        );

        console.log(`Successfully updated ${result.modifiedCount} users.`);
        process.exit(0);
    } catch (error) {
        console.error('Error updating users:', error);
        process.exit(1);
    }
};

updateExistingUsers();
