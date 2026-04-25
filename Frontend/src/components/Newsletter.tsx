import { motion } from 'framer-motion';
import { Send, Zap } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="relative w-full bg-[var(--bg-primary)] py-32 px-6 overflow-hidden transition-colors duration-400">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-primary/20 p-8 md:p-20 overflow-hidden group shadow-2xl"
        >
          {/* Animated Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 text-center flex flex-col items-center">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 md:mb-8"
            >
              <Zap size={28} className="md:w-8 md:h-8" />
            </motion.div>

            <h2 className="text-3xl md:text-6xl font-black font-display text-[var(--text-main)] mb-6 tracking-tighter">
              Join the <span className="text-primary italic">Hive</span>.
            </h2>
            <p className="text-[var(--text-muted)] text-base md:text-lg mb-8 md:mb-12 max-w-xl">
              Get early access to flagship launches, open-source documentation, and exclusive hardware discounts.
            </p>

            <form className="w-full max-w-md relative flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl md:rounded-2xl px-6 py-4 md:py-5 text-sm focus:border-primary outline-none transition-all shadow-inner"
              />
              <button className="bg-primary hover:bg-orange-600 text-white p-4 md:p-5 rounded-xl md:rounded-2xl transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center">
                <Send size={20} className="md:w-6 md:h-6" />
                <span className="ml-2 sm:hidden font-bold">Subscribe</span>
              </button>
            </form>
            
            <p className="mt-8 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest opacity-50">
              No spam. Just high-tech updates.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
