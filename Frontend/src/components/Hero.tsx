import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const herosectionImage = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282207/bisonix_assets/herosection.png";

export default function Hero({ setCurrentView, setActiveCategory }: { setCurrentView: any, setActiveCategory: any }) {
  const [index, setIndex] = useState(0);
  const words = ["Robots", "Drones", "Cars", "3D Models"];
  const colors = ["#FF6B00", "#007AFF", "#8B5CF6", "#800000"];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const exploreAll = () => {
    setActiveCategory('All');
    setCurrentView('category');
  };

  return (
    <section className="relative min-h-screen pt-24 pb-10 flex flex-col items-center justify-start overflow-hidden">
      
      {/* CURVED BACKGROUND */}
      <div className="absolute top-0 left-0 w-full h-[55vh] sm:h-[60vh] bg-[var(--bg-secondary)] z-10 transition-colors duration-400">
        <svg 
          className="absolute top-full left-0 w-full h-12 sm:h-20 md:h-28 lg:h-36 -mt-[1px] text-[var(--bg-secondary)] transition-colors duration-400" 
          viewBox="0 0 1440 100" 
          preserveAspectRatio="none"
        >
          <path fill="currentColor" d="M0,0 Q720,100 1440,0 Z" />
        </svg>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-gradient-to-t from-primary/5 to-transparent pointer-events-none z-0" />

      {/* Side Blinks */}
      <motion.div 
        animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute left-10 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-primary to-transparent blur-[2px] hidden lg:block"
      />
      <motion.div 
        animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
        className="absolute right-10 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-primary to-transparent blur-[2px] hidden lg:block"
      />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center mt-4 sm:mt-10">
        
        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="font-sans text-[2.5rem] leading-[1.05] sm:text-6xl md:text-[5rem] font-bold tracking-tight mb-6 text-[var(--text-main)] font-display"
        >
          Engineering <br />
          Intelligent{" "}
          <span className="relative inline-block h-[1.1em] min-w-[140px] xs:min-w-[180px] sm:min-w-[220px] md:min-w-[320px] align-top text-left ml-1 sm:ml-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{ color: colors[index % colors.length] }}
                className="absolute left-0 top-0 whitespace-nowrap"
              >
                {words[index]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          style={{ color: '#6B7280' }}
          className="max-w-xl mx-auto text-sm sm:text-base md:text-lg font-medium mb-8 sm:mb-10 leading-relaxed px-2"
        >
          BISONIX builds advanced robots, drones, and RC systems <br className="hidden md:block" />
          for real-world performance and innovation.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-6 px-4"
        >
          <button 
            onClick={exploreAll}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-primary text-white font-bold text-sm transition-all hover:bg-orange-600 shadow-xl shadow-primary/10 active:scale-95"
          >
            Explore
          </button>
          
          <button 
            onClick={scrollToAbout}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--text-main)]/20 text-[var(--text-main)] font-bold text-sm transition-all active:scale-95"
          >
            Watch Demo
          </button>
        </motion.div>
      </div>

      {/* Hero Image */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="relative z-0 w-full max-w-[1920px] mx-auto mt-12 sm:mt-20 px-4 sm:px-8 pb-20"
      >
        <div className="relative w-full rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] border border-white/10 group">
          <img 
            src={herosectionImage} 
            alt="Bisonix Platform" 
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>

    </section>
  );
}
