import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';

dotenv.config();

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const categories = [
            { name: 'Robo Toys', description: 'Interactive and educational robotic toys' },
            { name: 'Drones', description: 'Professional and hobbyist drones' },
            { name: 'RC Vehicles', description: 'Remote controlled cars, boats and more' },
            { name: '3D Models', description: 'Custom 3D printed models and solutions' }
        ];

        for (const cat of categories) {
            await Category.findOneAndUpdate(
                { name: cat.name },
                cat,
                { upsert: true, new: true }
            );
        }

        console.log('Categories seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
