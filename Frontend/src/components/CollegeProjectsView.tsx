import { motion } from 'framer-motion';
import { ChevronRight, GraduationCap, ShoppingCart, Star } from 'lucide-react';

interface CollegeProjectsViewProps {
  onBack: () => void;
  setCartItems: (items: any) => void;
}

const ProjectCard = ({ image, name, category, price, delay, setCartItems }) => {
  const addToCart = () => {
    setCartItems((prev: any) => {
      const existing = prev.find((item: any) => item.name === name);
      if (existing) {
        return prev.map((item: any) => item.name === name ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { name, price, qty: 1, image }];
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-subtle)] overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group flex flex-col"
    >
      <div className="relative aspect-[1920/1080] bg-[var(--bg-secondary)]/30 overflow-hidden flex items-center justify-center">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/10 flex items-center gap-1">
          <Star size={10} className="text-orange-500 fill-orange-500" />
          <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Academic Grade</p>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col space-y-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-primary/5 text-primary rounded text-[9px] font-bold uppercase tracking-widest border border-primary/10">
              {category}
            </span>
            <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full opacity-30" />
            <span className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-widest">In Stock</span>
          </div>
          <h3 className="text-xl font-bold text-[var(--text-main)] font-display leading-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <span className="text-2xl font-black text-[var(--text-main)] font-display tracking-tight">₹{price.toLocaleString()}</span>
            <span className="text-[var(--text-muted)] line-through text-xs font-medium mb-1">₹{(price * 1.4).toFixed(0)}</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-3.5 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-main)] font-bold text-xs transition-all active:scale-95">
              Guide
            </button>
            <button 
              onClick={addToCart}
              className="flex-[1.5] py-3.5 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={14} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function CollegeProjectsView({ onBack, setCartItems }: CollegeProjectsViewProps) {
  const projects = [
    {
      name: "Spider-Bot Chassis Kit",
      price: 15999,
      category: "Bionic Research",
      image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=1920&h=1080"
    },
    {
      name: "Neural Swarm Core",
      price: 8499,
      category: "AI Control",
      image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=1920&h=1080"
    },
    {
      name: "Omni-Drive Platform",
      price: 12999,
      category: "Mobile Robotics",
      image: "https://images.unsplash.com/photo-1531693251400-38df35776dc7?auto=format&fit=crop&q=80&w=1920&h=1080"
    },
    {
      name: "Hydra-Link Arm",
      price: 24999,
      category: "Manipulation",
      image: "https://images.unsplash.com/photo-1558444479-2706fa58b8c6?auto=format&fit=crop&q=80&w=1920&h=1080"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8 transition-colors duration-400"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-12">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
            Home
          </button>
          <ChevronRight size={12} />
          <span className="text-[var(--text-main)] font-bold">College Projects</span>
        </div>

        <div className="mb-16">
          <h1 className="text-4xl md:text-7xl font-black font-display text-[var(--text-main)] mb-6 leading-[0.9] tracking-tighter">
            College <span className="text-primary italic">Projects</span> Support.
          </h1>
          <p className="text-[var(--text-muted)] max-w-2xl text-lg">
            High-performance hardware kits designed specifically for engineering students and research labs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, i) => (
            <ProjectCard 
              key={i} 
              {...project} 
              delay={i * 0.1} 
              setCartItems={setCartItems}
            />
          ))}
        </div>

        
      </div>
    </motion.div>
  );
}
