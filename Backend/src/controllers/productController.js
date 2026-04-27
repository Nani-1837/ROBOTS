import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        // Handle uploaded images from Cloudinary
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        const {
            name,
            description,
            price,
            originalPrice,
            category,
            specs,
            stock,
            featured,
            warranty,
            deliveryInfo,
            colors
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            originalPrice,
            images: imageUrls.length > 0 ? imageUrls : [],
            category,
            specs: typeof specs === 'string' ? JSON.parse(specs) : specs,
            stock,
            featured: featured === 'true' || featured === true,
            warranty,
            deliveryInfo,
            colors: typeof colors === 'string' ? JSON.parse(colors) : colors
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            originalPrice,
            images,
            category,
            specs,
            stock,
            featured,
            warranty,
            deliveryInfo,
            colors
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // Handle uploaded images from Cloudinary
            if (req.files && req.files.length > 0) {
                const newImageUrls = req.files.map(file => file.path);
                product.images = newImageUrls;
            } else if (images) {
                product.images = Array.isArray(images) ? images : [images];
            }

            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.originalPrice = originalPrice || product.originalPrice;
            product.category = category || product.category;
            product.specs = typeof specs === 'string' ? JSON.parse(specs) : (specs || product.specs);
            product.stock = stock || product.stock;
            product.featured = featured !== undefined ? (featured === 'true' || featured === true) : product.featured;
            product.warranty = warranty || product.warranty;
            product.deliveryInfo = deliveryInfo || product.deliveryInfo;
            product.colors = typeof colors === 'string' ? JSON.parse(colors) : (colors || product.colors);

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
