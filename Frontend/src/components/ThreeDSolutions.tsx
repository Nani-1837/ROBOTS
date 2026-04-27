import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Box, Plus } from 'lucide-react';
interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: any;
}

export default function ThreeDSolutions({ onProductClick, setActiveCategory }: { onProductClick: (p: any) => void, setActiveCategory: (cat: string) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch3DProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        if (response.ok) {
          // Filter for 3D Models / 3D Solutions category
          const filtered = data.filter((p: any) => {
            const catName = typeof p.category === 'object' ? p.category.name : p.category;
            return catName === '3D Models' || catName === '3D Solutions';
          });
          setProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching 3D products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch3DProducts();
  }, []);

  if (loading) return null;
  if (products.length === 0) return null;

  const displayProducts = products.slice(0, 5);

  return (
    <section className="relative w-full bg-[var(--bg-secondary)]/30 py-32 px-6 transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-primary mb-4"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                <Box size={20} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em]">Precision Engineering</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black font-display text-[var(--text-main)]"
            >
              3D <span className="text-primary italic">Solutions</span>
            </motion.h2>
          </div>
          
          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            onClick={() => setActiveCategory('3D Models')}
            className="group flex items-center gap-3 text-[var(--text-main)] font-black uppercase tracking-widest text-xs hover:text-primary transition-colors"
          >
            Explore All Models
            <div className="w-10 h-10 rounded-full border border-[var(--border-subtle)] flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
              <ChevronRight size={18} />
            </div>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onProductClick(product)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-[var(--bg-primary)] border border-[var(--border-subtle)] mb-6 shadow-sm group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-500">
                <img 
                  src={product.images[0] || ''} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                   <p className="text-white font-black text-sm mb-1">{product.name}</p>
                   <p className="text-primary font-bold text-xs">₹{product.price}</p>
                </div>
              </div>
              <div className="px-2">
                <h4 className="text-[13px] font-black text-[var(--text-main)] mb-1 group-hover:text-primary transition-colors truncate">{product.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-primary">₹{product.price}</span>
                  {product.originalPrice && <span className="text-[10px] text-[var(--text-muted)] line-through opacity-50 font-medium">₹{product.originalPrice}</span>}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Show All Card */}
          {products.length > 5 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setActiveCategory('3D Models')}
              className="group cursor-pointer"
            >
              <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-primary flex flex-col items-center justify-center text-white text-center p-8 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-500">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus size={32} strokeWidth={3} />
                </div>
                <h4 className="text-xl font-black font-display uppercase tracking-wider mb-2">Show All</h4>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em]">{products.length - 5}+ More Products</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}


