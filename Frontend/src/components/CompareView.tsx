import { motion } from 'framer-motion';
import { ChevronRight, Zap, Battery, Cpu, Radio, Scale, ShieldCheck } from 'lucide-react';

interface CompareViewProps {
  onBack: () => void;
}

const products = [
  {
    name: 'Swift-Blade Z1',
    category: 'Racing Drone',
    price: 899,
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?auto=format&fit=crop&q=80&w=400',
    specs: {
      speed: '140 km/h',
      battery: '25 min',
      cpu: 'ARM Cortex M7',
      range: '5 km',
      weight: '450g',
      ai: 'Level 2'
    }
  },
  {
    name: 'Titan-Rover X',
    category: 'All-Terrain',
    price: 1249,
    image: 'https://images.unsplash.com/photo-1531693251400-38df35776dc7?auto=format&fit=crop&q=80&w=400',
    specs: {
      speed: '35 km/h',
      battery: '120 min',
      cpu: 'NVidia Jetson Nano',
      range: '2 km',
      weight: '2.5kg',
      ai: 'Level 5'
    }
  }
];

export default function CompareView({ onBack }: CompareViewProps) {
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
          <span className="text-[var(--text-main)] font-bold">Comparison Tool</span>
        </div>

        <div className="mb-16">
          <h1 className="text-4xl md:text-7xl font-black font-display text-[var(--text-main)] mb-6 tracking-tighter leading-tight">
            Battle of the <span className="text-primary italic">Bots</span>.
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-xl">
            Side-by-side technical specification breakdown of our flagship models.
          </p>
        </div>

        <div className="overflow-x-auto pb-8">
          <div className="min-w-[800px] grid grid-cols-3 gap-6">
            {/* Specs Header */}
            <div className="pt-[200px] space-y-12 pr-8 border-r border-[var(--border-subtle)]">
              {[
                { label: 'Max Velocity', icon: <Zap size={14} /> },
                { label: 'Endurance', icon: <Battery size={14} /> },
                { label: 'Neural Core', icon: <Cpu size={14} /> },
                { label: 'Signal Range', icon: <Radio size={14} /> },
                { label: 'Payload Weight', icon: <Scale size={14} /> },
                { label: 'AI Autonomy', icon: <ShieldCheck size={14} /> }
              ].map((spec, i) => (
                <div key={i} className="flex items-center gap-3 text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px]">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center border border-[var(--border-subtle)]">
                    {spec.icon}
                  </div>
                  {spec.label}
                </div>
              ))}
            </div>

            {/* Product 1 */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-[var(--bg-secondary)] border border-primary/20 rounded-[3rem] p-8 flex flex-col items-center"
            >
              <div className="aspect-square w-48 rounded-2xl overflow-hidden mb-6 shadow-2xl">
                <img src={products[0].image} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-black text-[var(--text-main)] font-display mb-2">{products[0].name}</h3>
              <p className="text-primary font-bold text-xs mb-8">₹{products[0].price.toLocaleString()}</p>
              
              <div className="w-full space-y-12">
                {Object.values(products[0].specs).map((val, i) => (
                  <div key={i} className="text-center font-bold text-[var(--text-main)] text-sm py-1">
                    {val}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Product 2 */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[3rem] p-8 flex flex-col items-center"
            >
              <div className="aspect-square w-48 rounded-2xl overflow-hidden mb-6 shadow-2xl">
                <img src={products[1].image} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-black text-[var(--text-main)] font-display mb-2">{products[1].name}</h3>
              <p className="text-primary font-bold text-xs mb-8">₹{products[1].price.toLocaleString()}</p>
              
              <div className="w-full space-y-12">
                {Object.values(products[1].specs).map((val, i) => (
                  <div key={i} className="text-center font-bold text-[var(--text-main)] text-sm py-1">
                    {val}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
