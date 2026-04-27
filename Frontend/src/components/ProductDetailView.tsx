import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ReviewSection from './ReviewSection';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Star, ChevronRight, Check, ShieldCheck, Truck, ChevronDown, Package } from 'lucide-react';

interface ProductDetailViewProps {
  product: any;
  onBack: () => void;
  setCartItems: (items: any) => void;
  onProductClick?: (product: any) => void;
}

export default function ProductDetailView({ product, onBack, setCartItems, onProductClick }: ProductDetailViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('White');
  const [showDetails, setShowDetails] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
    setIsHovering(true);
  };

  // Map local assets for the 3 main products as requested
  const productImages = product.images && product.images.length > 0 ? product.images : [];
  const currentOriginalPrice = product.originalPrice || 0;
  
  const getProductColors = () => {
    if (product.colors && product.colors.length > 0) {
      return product.colors.map((c: string) => {
        // Handle "Name (#Hex)" format or direct Hex/Name
        const hexMatch = c.match(/\(#([0-9A-F]{6})\)/i);
        const nameMatch = c.match(/^(.*?) \(#/);
        
        const isHex = hexMatch ? true : /^#?([0-9A-F]{3}){1,2}$/i.test(c);
        const hexValue = hexMatch ? `#${hexMatch[1]}` : (isHex ? (c.startsWith('#') ? c : `#${c}`) : 
                        (c.toLowerCase() === 'white' ? '#ffffff' : 
                        (c.toLowerCase() === 'black' ? '#000000' : 
                        (c.toLowerCase() === 'red' ? '#ef4444' : '#666666'))));
        
        const displayName = nameMatch ? nameMatch[1] : c;
        return { name: displayName, hex: hexValue };
      });
    }
    if (product.name === 'Mater Rc Car') return [{ name: 'Brown', hex: '#5D4037' }];
    if (product.name === 'Bisonix Robo Toy') return [{ name: 'Stary White', hex: '#E8EDF2' }];
    return [{ name: 'Red', hex: '#ef4444' }, { name: 'White', hex: '#ffffff' }, { name: 'Black', hex: '#000000' }];
  };

  const colors = getProductColors();
  const productInfo = product.description || "Premium Bisonix hardware engineered for performance and durability.";
  const rating = product.rating || 5;
  const reviewsCount = `${product.numReviews || 0} reviews`;



  const addToCart = () => {
    if (!user) {
      showToast('Please login to add items to cart 🔒', 'error');
      return;
    }
    setCartItems((prev: any) => {
      const existing = prev.find((item: any) => item.id === product._id || item.id === product.id);
      if (existing) {
        showToast(`${product.name} quantity updated!`, 'info');
        return prev.map((item: any) => 
          (item.id === product._id || item.id === product.id) 
            ? { ...item, qty: item.qty + 1, color: selectedColor } 
            : item
        );
      }
      showToast(`${product.name} added to cart! 🛒`, 'success');
      return [...prev, { 
        id: product._id || product.id, 
        name: product.name, 
        price: product.price, 
        qty: 1, 
        image: productImages[0],
        color: selectedColor 
      }];
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8 transition-colors duration-400"
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-12">
          <button onClick={onBack} className="hover:text-primary transition-colors">Home</button>
          <ChevronRight size={14} />
          <span className="text-[var(--text-main)] font-bold">
            {typeof product.category === 'object' ? product.category.name : product.category}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Image Carousel Section */}
          <div className="space-y-6">
            <div 
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsHovering(false)}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-2xl group cursor-zoom-in"
            >
              {productImages.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={productImages[currentImageIndex]}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: isHovering ? 2 : 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      const swipeThreshold = 50;
                      if (info.offset.x > swipeThreshold) {
                        setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
                      } else if (info.offset.x < -swipeThreshold) {
                        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
                      }
                    }}
                    className="w-full h-full object-cover cursor-grab active:cursor-grabbing"
                  />
                </AnimatePresence>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-4 bg-slate-50">
                  <Package size={64} className="opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">No images available</p>
                </div>
              )}
              
              {/* Carousel Indicators */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {productImages.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentImageIndex === i ? 'bg-primary w-8' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4">
              {productImages.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`relative w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    currentImageIndex === i ? 'border-primary shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                {typeof product.category === 'object' ? product.category.name : product.category}
              </span>
              <span className="flex items-center gap-1 text-green-500 text-[10px] font-black uppercase tracking-widest">
                <Check size={12} /> In Stock
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black font-display text-[var(--text-main)] mb-6 leading-tight">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-1 text-orange-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < rating ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-[var(--text-muted)] text-sm font-medium">({reviewsCount})</span>
            </div>

            {/* Product Details Dropdown */}
            <div className="mb-8">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-primary/30 transition-all group"
              >
                <span className="font-bold text-[var(--text-main)] group-hover:text-primary transition-colors">Product Details</span>
                <ChevronDown size={20} className={`text-[var(--text-muted)] transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 text-sm text-[var(--text-muted)] leading-relaxed bg-[var(--bg-primary)] border-x border-b border-[var(--border-subtle)] rounded-b-2xl mx-2">
                      {productInfo}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-8">
              {/* Pricing */}
              <div>
                <div className="flex items-baseline gap-4 mb-2">
                   <span className="text-5xl font-black text-[var(--text-main)] font-display tracking-tighter">₹{product.price}</span>
                  {currentOriginalPrice && (
                    <span className="text-2xl text-[var(--text-muted)] line-through font-display opacity-50">₹{currentOriginalPrice}</span>
                  )}
                  {currentOriginalPrice && (
                    <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-xs font-bold">
                      SAVE {Math.round((1 - (product.price / currentOriginalPrice)) * 100)}%
                    </span>
                  )}
                  </div>
                <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                  <Truck size={16} /> Free Shipping
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <h4 className="text-[var(--text-main)] font-bold text-sm uppercase tracking-widest mb-4">{colors.length} {colors.length > 1 ? 'Colors' : 'Color'} Launch</h4>
                <div className="flex gap-4">
                  {colors.map((color: any) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`group relative flex flex-col items-center gap-2`}
                    >
                      <div 
                        className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${
                          selectedColor === color.name ? 'border-primary scale-110' : 'border-[var(--border-subtle)]'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className={`text-[10px] font-bold transition-opacity text-center px-1 ${
                        selectedColor === color.name ? 'opacity-100 text-primary' : 'opacity-40'
                      }`}>
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button 
                  onClick={addToCart}
                  className="flex-[2] py-5 rounded-[2rem] bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                  <ShoppingCart size={20} /> Add to Cart
                </button>
                <button className="flex-1 py-5 rounded-[2rem] bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-main)] font-black text-sm transition-all active:scale-95 uppercase tracking-widest">
                  Watch
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)]">
                  <ShieldCheck size={20} className="text-primary" />
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{product.warranty || '2 Year Warranty'}</span>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)]">
                  <Truck size={20} className="text-primary" />
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">{product.deliveryInfo || 'Express Delivery'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product._id} user={user} />

        {/* Suggested Products Section */}

        <div className="mt-32 pt-20 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Recommendations</span>
              <h3 className="text-3xl md:text-4xl font-black text-[var(--text-main)] font-display">Suggested Products</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {([] as any[]).map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--bg-primary)] rounded-[2.5rem] border border-[var(--border-subtle)] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group flex flex-col"
              >
                {/* Image Section - 1920x1080 Aspect Ratio */}
                <div className="relative aspect-[1920/1080] bg-[var(--bg-secondary)]/30 overflow-hidden flex items-center justify-center">
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    onClick={() => onProductClick?.(p)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer" 
                  />
                  {/* Floating Level Badge */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/10">
                    <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Pro Grade</p>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col space-y-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold uppercase tracking-widest border border-blue-100">
                        {p.category}
                      </span>
                      <span className="flex items-center gap-1 text-green-500 text-[9px] font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        In Stock
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-primary transition-colors line-clamp-2">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-4">
                      <span className="text-2xl font-black text-[var(--text-main)] font-display tracking-tight">₹{p.price}</span>
                      <span className="text-sm text-[var(--text-muted)] line-through opacity-50 font-display">
                        ₹{p.name === 'Bisonix Robo Toy' ? '1999' : (p.name === 'Mater Rc Car' ? '2000' : '499')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={() => onProductClick?.(p)}
                      className="flex-1 py-3.5 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-main)] font-black text-[10px] transition-all active:scale-95 uppercase tracking-widest"
                    >
                      Watch
                    </button>
                    <button 
                      onClick={() => onProductClick?.(p)}
                      className="flex-[1.5] py-3.5 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-black text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest"
                    >
                      View more
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
