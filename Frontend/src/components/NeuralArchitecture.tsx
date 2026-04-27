import { motion } from 'framer-motion';
import { Cpu, Zap, Brain } from 'lucide-react';

const NeuralPoint = ({ title, desc, icon: Icon, index }: { title: string, desc: string, icon: any, index: number }) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`relative flex items-center justify-center w-full mb-24 md:mb-32 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
      {/* Content Card */}
      <motion.div 
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ 
          scale: 1.05, 
          rotateY: isEven ? -10 : 10,
          perspective: 1000
        }}
        className={`w-full md:w-[45%] p-6 relative group cursor-none transition-all duration-500 ${isEven ? 'md:pr-20 text-right flex flex-col items-end' : 'md:pl-20 text-left flex flex-col items-start'}`}
      >
        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary mb-6 ${isEven ? 'ml-auto' : ''}`}>
            <Icon size={24} />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[var(--text-main)] font-display mb-3">
            {title}
          </h3>
          <p className="text-[var(--text-muted)] leading-relaxed text-sm md:text-base max-w-md">
            {desc}
          </p>
          
          <div className="mt-6 flex gap-3 max-w-[200px]">
            <div className="w-full h-0.5 bg-[var(--border-subtle)] rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "70%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Center Line Indicator Dot */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary z-20 items-center justify-center shadow-[0_0_15px_rgba(255,106,0,0.8)]">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      </div>

      {/* Spacer for the other side */}
      <div className="hidden md:block w-[45%]" />
    </div>
  );
};

export default function NeuralArchitecture() {
  const points = [
    {
      title: "Bionic Processing Unit",
      desc: "Real-time computation built for intelligent decision-making under complex conditions.",
      icon: Cpu
    },
    {
      title: "Kinetic Optimization",
      desc: "Physics-driven motion control for stability, efficiency, and seamless movement.",
      icon: Zap
    },
    {
      title: "Adaptive Neural Mesh",
      desc: "A self-evolving system that continuously learns, adapts, and improves performance.",
      icon: Brain
    }
  ];

  return (
    <section className="relative w-full py-32 px-6 overflow-hidden bg-[var(--bg-primary)] transition-colors duration-400">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(255,106,0,0.5)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">System Core</span>
            <h2 className="text-4xl md:text-6xl font-bold font-display text-[var(--text-main)] mb-6">
              Powered by <span className="text-primary italic">Intelligent Systems</span>
            </h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg leading-relaxed">
              At the heart of BISONIX lies a high-performance computing engine designed for real-time autonomy and precision control.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          {/* The Vertical Line for Mobile */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-[var(--border-subtle)] md:-translate-x-1/2" />

          <div className="space-y-12 relative">
            {points.map((point, i) => (
              <NeuralPoint key={i} {...point} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
