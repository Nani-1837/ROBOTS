import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';

dotenv.config();

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Get Categories
        const roboToys = await Category.findOne({ name: 'Robo Toys' });
        const rcVehicles = await Category.findOne({ name: 'RC Vehicles' });
        const models3d = await Category.findOne({ name: '3D Models' });

        if (!roboToys || !rcVehicles || !models3d) {
            console.error('Categories not found. Please run category seed first.');
            process.exit(1);
        }

        const products = [
            {
                name: 'BloomKeepers',
                description: 'Elegant 3D printed decorative piece for modern homes.',
                price: 199,
                originalPrice: 499,
                category: models3d._id,
                images: ['https://res.cloudinary.com/dqp0zkagb/image/upload/v1714131234/bisonix_products/bloomkeepers.jpg'],
                stock: 50,
                featured: true,
                warranty: '1 Year Warranty',
                deliveryInfo: 'Express Delivery'
            },
            {
                name: 'Mater Rc Car',
                description: 'High-speed remote controlled vehicle with off-road capabilities.',
                price: 999,
                originalPrice: 2000,
                category: rcVehicles._id,
                images: ['https://res.cloudinary.com/dqp0zkagb/image/upload/v1714131234/bisonix_products/mater.jpg'],
                stock: 15,
                featured: true,
                warranty: '2 Year Warranty',
                deliveryInfo: 'Standard Shipping'
            },
            {
                name: 'Bisonix Robo Toy',
                description: 'Intelligent robot companion with voice control and interactive games.',
                price: 899,
                originalPrice: 1999,
                category: roboToys._id,
                images: ['https://res.cloudinary.com/dqp0zkagb/image/upload/v1714131234/bisonix_products/robo.png'],
                stock: 25,
                featured: true,
                warranty: '2 Year Warranty',
                deliveryInfo: 'Express Delivery'
            }
        ];

        for (const p of products) {
            await Product.findOneAndUpdate(
                { name: p.name },
                p,
                { upsert: true, new: true }
            );
        }

        console.log('Existing products seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
