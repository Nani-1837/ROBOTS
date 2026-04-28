import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config';

const ProductCard = ({ id, image, name, category, price, originalPrice, rating, numReviews, delay, onProductClick, isWishlisted, onToggle }: any) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleWishlistClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      showToast('Please sign in to add items to your wishlist', 'info');
      return;
    }

    try {
      const token = localStorage.getItem('insforgeToken');
      const method = isWishlisted ? 'DELETE' : 'POST';
      const url = isWishlisted 
        ? `${API_URL}/api/wishlist/${id}` 
        : `${API_URL}/api/wishlist`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: isWishlisted ? null : JSON.stringify({ productId: id })
      });

      if (response.ok) {
        onToggle(id, !isWishlisted);
        showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 'success');
      }
    } catch (error) {
      console.error('Wishlist error:', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-subtle)] overflow-hidden shadow-[var(--card-shadow)] hover:shadow-2xl transition-all duration-500 group flex flex-col card-premium"
    >
      <div 
        className="relative aspect-[1920/1080] bg-[var(--bg-secondary)]/30 overflow-hidden flex items-center justify-center cursor-pointer"
        onClick={() => onProductClick?.({ id, image, name, category, price, originalPrice, rating, numReviews })}
      >
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/10 flex items-center gap-1">
          <Star size={10} className="text-orange-500 fill-orange-500" />
          <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Bestseller</p>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col space-y-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-primary/5 text-primary rounded text-[9px] font-bold uppercase tracking-widest border border-primary/10">
              {typeof category === 'object' ? category.name : category}
            </span>
            <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full opacity-30" />
            <span className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-widest">In Stock</span>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-main)] font-display leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center gap-0.5 text-orange-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill={i < Math.floor(rating || 5) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-[9px] font-bold text-[var(--text-muted)]">({numReviews || 0})</span>
          </div>
        </div>


        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <span className="text-2xl font-black text-[var(--text-main)] font-display tracking-tight">₹{price}</span>
            {originalPrice && (
              <span className="text-[var(--text-muted)] line-through text-xs font-medium mb-1">₹{originalPrice}</span>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={handleWishlistClick}
              className="flex-1 py-3.5 rounded-2xl btn-secondary font-bold text-xs active:scale-95 flex items-center justify-center gap-2"
            >
              <Heart size={14} className={isWishlisted ? "text-red-500 fill-red-500" : "text-red-500"} />
              Wishlist
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onProductClick?.({ id, image, name, category, price, originalPrice, rating, numReviews });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-[1.5] py-3.5 rounded-2xl btn-primary font-bold text-xs shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
            >
              View more
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};


export default function ProductGrid({ setActiveCategory, onProductClick }: { setActiveCategory: (cat: string) => void, onProductClick: (p: any) => void }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch(`${API_URL}/api/products`);
        const prodData = await prodRes.json();
        if (prodRes.ok) {
          setProducts(prodData.filter((p: any) => p.featured).slice(0, 3));
        }

        if (user) {
          const token = localStorage.getItem('insforgeToken');
          const wishRes = await fetch(`${API_URL}/api/wishlist`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const wishData = await wishRes.json();
          if (wishRes.ok) {
            setWishlistIds(wishData.products?.map((p: any) => p._id) || []);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);


  return (
    <section className="relative w-full bg-[var(--bg-primary)] py-32 px-6 transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold font-display text-[var(--text-main)] mb-6"
          >
            The <span className="text-primary italic">Bisonix</span> Collection
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-muted)] max-w-xl mx-auto text-lg"
          >
            Explore our curated selection of high-performance robotics and precision-engineered modules. Built for speed, durability, and total control.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {products.length > 0 ? (
              products.map((product, idx) => (
                <ProductCard 
                  key={product._id}
                  id={product._id}
                  image={product.images?.[0] || 'https://via.placeholder.com/600x400?text=Bisonix+Robotics'}
                  name={product.name} 
                  category={typeof product.category === 'object' ? product.category.name : product.category}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  rating={product.rating || 4.5}
                  numReviews={product.numReviews || 12}
                  delay={idx * 0.1}
                  isWishlisted={wishlistIds.includes(product._id)}
                  onToggle={(id: string, state: boolean) => {
                    if (state) setWishlistIds(prev => [...prev, id]);
                    else setWishlistIds(prev => prev.filter(wid => wid !== id));
                  }}
                  onProductClick={() => {
                    onProductClick?.(product);
                    navigate('/product-detail');
                  }}
                />
              ))
            ) : null}
          </div>
        )}

        <div className="mt-20 text-center">
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            onClick={() => {
              setActiveCategory('Robo Toys');
              navigate('/category');
            }}
            className="px-12 py-5 rounded-2xl btn-secondary font-bold text-sm shadow-sm active:scale-95"
          >
            Browse Full Collection
          </motion.button>
        </div>
      </div>
    </section>
  );
}
