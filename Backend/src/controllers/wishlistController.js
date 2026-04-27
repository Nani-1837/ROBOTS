import Wishlist from '../models/Wishlist.js';

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      } else {
        return res.status(200).json({ message: 'Product already in wishlist', wishlist });
      }
    }

    await wishlist.save();
    res.status(200).json({ message: 'Added to wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
    res.status(200).json(wishlist || { products: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
      await wishlist.save();
    }

    res.status(200).json({ message: 'Removed from wishlist', wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
