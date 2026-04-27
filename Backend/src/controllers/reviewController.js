import Review from '../models/Review.js';
import Product from '../models/Product.js';
import cloudinary from 'cloudinary';

// @desc    Create new review
// @route   POST /api/reviews/:id
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, images } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const review = await Review.create({
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      product: productId,
      images: imageUrls,
    });


    const reviews = await Review.find({ product: productId });

    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/:id
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
