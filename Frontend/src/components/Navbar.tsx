import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, Sun, Moon, ChevronDown, ChevronRight, X } from 'lucide-react';
import logo from '../assets/logo.png';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';

export default function Navbar({ cartItems, setCartItems, setActiveCategory, setCurrentView }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false); // Default to Light Mode
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Robo Toys', href: '#' },
    { name: 'Drones', href: '#' },
    { name: 'RC Cars', href: '#' },
    { name: '3D Models', href: '#' },
    { name: 'Services', href: '#', hasDropdown: true },
    { name: 'Track Order', href: '#' },
    { name: 'Contact Us', href: '#' },
  ];

  const megaMenuContent = {
    'Robo Toys': [
      { name: 'Alpha-Bot', image: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=200' },
      { name: 'Vortex Motor', image: 'https://images.unsplash.com/photo-1558444479-2706fa58b8c6?auto=format&fit=crop&q=80&w=200' },
      { name: 'B12-X Core', image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=200' },
    ],
    'Drones': [
      { name: 'Spectra-X', image: 'https://images.unsplash.com/photo-1473963484295-11f8cdb29479?auto=format&fit=crop&q=80&w=200' },
      { name: 'Swift-Blade', image: 'https://images.unsplash.com/photo-1524143924104-58682054b8d7?auto=format&fit=crop&q=80&w=200' },
      { name: 'Nano Racer', image: 'https://images.unsplash.com/photo-1506941433945-99a2aa4bd50a?auto=format&fit=crop&q=80&w=200' },
    ],
    'RC Cars': [
      { name: 'Titan Rover', image: 'https://images.unsplash.com/photo-1531693251400-38df35776dc7?auto=format&fit=crop&q=80&w=200' },
      { name: 'Drift King', image: 'https://images.unsplash.com/photo-1594731826601-3827494a8c5f?auto=format&fit=crop&q=80&w=200' },
    ],
    '3D Models': [
      { name: 'Chassis V2', image: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=200' },
      { name: 'Propeller Set', image: 'https://images.unsplash.com/photo-1558444479-2706fa58b8c6?auto=format&fit=crop&q=80&w=200' },
    ],
    'Services': []
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-4' : 'py-6'
        } px-4 sm:px-8`}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-black/60' : 'from-[var(--bg-primary)]/80'} to-transparent pointer-events-none transition-all duration-500`} />

        <div className={`relative z-10 max-w-7xl mx-auto w-full flex justify-between items-center transition-all duration-500 ${
          isScrolled 
            ? 'bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-subtle)] px-6 py-3 rounded-2xl shadow-[var(--card-shadow)]' 
            : 'bg-transparent border border-transparent px-2'
        }`}>
          <div 
            onClick={() => {
              setActiveCategory(null);
              setActiveItem(null);
              setIsMobileMenuOpen(false);
            }}
            className="relative flex items-center cursor-pointer group"
          >
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img src={logo} alt="BISONIX Logo" className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto relative z-10 transition-all duration-300" />
          </div>

          <ul className="hidden lg:flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] relative z-10">
            {navLinks.map((item) => (
              <li 
                key={item.name} 
                onMouseEnter={() => setHoveredLink(item.name)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => {
                  if (item.name === 'Contact Us') {
                    setCurrentView('contact');
                    setActiveItem('Contact Us');
                  } else if (item.name === 'Track Order') {
                    setCurrentView('track-order');
                    setActiveItem('Track Order');
                  } else if (item.name !== 'Services') {
                    setActiveCategory(item.name);
                    setActiveItem(item.name);
                    setCurrentView('category');
                  }
                }}
                className="relative px-4 py-6 cursor-pointer group flex items-center gap-1"
              >
                <span className={`relative z-10 group-hover:text-primary transition-colors duration-300 ${activeItem === item.name ? 'text-primary font-bold' : ''}`}>
                  {item.name}
                </span>
                {item.hasDropdown && <ChevronDown size={14} className="relative z-10 group-hover:text-primary transition-colors" />}
                
                <AnimatePresence>
                  {hoveredLink === item.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-0 cursor-default"
                    >
                      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden flex min-w-[700px] backdrop-blur-xl mt-2">
                        <div className="w-56 bg-[var(--bg-secondary)]/50 p-8 border-r border-[var(--border-subtle)] space-y-6">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Resources</p>
                          {[
                            { name: 'Comparison Tool', view: 'compare' },
                            { name: 'Track Order', view: 'track-order' },
                            { name: 'New Arrivals', view: 'category' },
                            { name: 'Best Sellers', view: 'category' }
                          ].map(link => (
                            <div 
                              key={link.name} 
                              onClick={() => { setCurrentView(link.view); setHoveredLink(null); }}
                              className="text-xs font-bold text-[var(--text-main)] hover:text-primary transition-colors cursor-pointer flex justify-between items-center group/link"
                            >
                              {link.name}
                              <ChevronRight size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </div>
                          ))}
                          <div className="pt-6 mt-6 border-t border-[var(--border-subtle)]">
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                              <p className="text-[10px] font-bold text-[var(--text-main)]">Flash Sale!</p>
                              <p className="text-[9px] text-[var(--text-muted)]">Up to 40% off on Robo Kits</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-8 bg-[var(--bg-primary)]/80">
                          <div className="grid grid-cols-3 gap-8">
                            {megaMenuContent[item.name]?.map((prod, idx) => (
                              <div key={idx} className="group/item cursor-pointer">
                                <div className="aspect-square rounded-2xl bg-[var(--bg-secondary)] overflow-hidden mb-3 border border-[var(--border-subtle)] shadow-sm">
                                  <img src={prod.image} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                                </div>
                                <p className="text-[10px] font-bold text-[var(--text-main)] text-center group-hover/item:text-primary transition-colors">{prod.name}</p>
                              </div>
                            ))}
                            {item.name === 'Services' && (
                              <div className="col-span-3 grid grid-cols-2 gap-4">
                                <div 
                                  onClick={() => { setCurrentView('college-projects'); setHoveredLink(null); }}
                                  className="p-8 rounded-[2rem] bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-all cursor-pointer group/card flex flex-col justify-center text-center"
                                >
                                  <div className="flex justify-center items-center gap-2 mb-2">
                                    <p className="text-base font-bold text-[var(--text-main)] font-display">College Projects</p>
                                    <ChevronRight size={16} className="text-primary opacity-0 group-hover/card:opacity-100 transition-all group-hover/card:translate-x-1" />
                                  </div>
                                  <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">Custom robotics support and components for engineering students.</p>
                                </div>
                                <div 
                                  onClick={() => { setCurrentView('model-upload'); setHoveredLink(null); }}
                                  className="p-8 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all cursor-pointer group/card flex flex-col justify-center text-center"
                                >
                                  <div className="flex justify-center items-center gap-2 mb-2">
                                    <p className="text-base font-bold text-[var(--text-main)] font-display">Customized 3D Model</p>
                                    <ChevronRight size={16} className="text-primary opacity-0 group-hover/card:opacity-100 transition-all group-hover/card:translate-x-1" />
                                  </div>
                                  <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">Upload your proprietary designs for precision industrial 3D printing.</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          <div className="relative z-10 flex items-center gap-2 sm:gap-4 text-[var(--text-main)]">
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 hover:bg-[var(--text-main)]/10 rounded-full transition-all duration-300 relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? 'dark' : 'light'}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isDark ? <Moon size={20} className="text-blue-400" /> : <Sun size={20} className="text-orange-500" />}
                </motion.div>
              </AnimatePresence>
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-[var(--text-main)]/10 rounded-full transition-colors group"
            >
              <ShoppingCart size={20} className="text-[var(--text-muted)] group-hover:text-primary transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="ml-1 sm:ml-2 relative overflow-hidden group bg-[var(--text-main)]/5 hover:bg-[var(--text-main)]/10 border border-[var(--border-subtle)] px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/80 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 group-hover:text-white text-[var(--text-main)] transition-colors duration-300">Sign In</span>
            </button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-[var(--text-main)]/10 rounded-full transition-colors relative z-[60]"
            >
              {isMobileMenuOpen ? <X size={24} className="text-primary" /> : <Menu size={24} className="text-[var(--text-muted)]" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-full max-w-xs bg-[var(--bg-primary)] border-l border-[var(--border-subtle)] z-[56] lg:hidden p-8 pt-24 space-y-8 shadow-2xl"
              >
                <div className="space-y-2">
                  <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Navigation</p>
                  {navLinks.map((item) => (
                    <div key={item.name}>
                      <button 
                        onClick={() => {
                          if (item.name === 'Contact Us') {
                            setCurrentView('contact');
                            setActiveItem('Contact Us');
                            setIsMobileMenuOpen(false);
                          } else if (item.name !== 'Services') {
                            setActiveCategory(item.name);
                            setActiveItem(item.name);
                            setIsMobileMenuOpen(false);
                          } else {
                            setActiveItem(activeItem === 'Services' ? null : 'Services');
                          }
                        }}
                        className="w-full text-left py-4 border-b border-[var(--border-subtle)] flex justify-between items-center group"
                      >
                        <span className={`text-xl font-bold font-display transition-colors ${activeItem === item.name ? 'text-primary' : 'text-[var(--text-main)]'}`}>
                          {item.name}
                        </span>
                        <ChevronRight size={18} className={`text-[var(--text-muted)] transition-transform ${activeItem === item.name && item.name === 'Services' ? 'rotate-90' : ''}`} />
                      </button>
                      
                      {item.name === 'Services' && activeItem === 'Services' && (
                        <div className="pl-4 py-4 space-y-4">
                          <button 
                            onClick={() => { setCurrentView('college-projects'); setIsMobileMenuOpen(false); }}
                            className="w-full text-left py-2 text-sm font-bold text-[var(--text-muted)] hover:text-primary transition-colors"
                          >
                            College Projects
                          </button>
                          <button 
                            onClick={() => { setCurrentView('model-upload'); setIsMobileMenuOpen(false); }}
                            className="w-full text-left py-2 text-sm font-bold text-[var(--text-muted)] hover:text-primary transition-colors"
                          >
                            Customized 3D Model
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="pt-8">
                  <button 
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
                  >
                    Account Access
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} setCartItems={setCartItems} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/7995232673"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.4)] transition-all cursor-pointer group"
      >
        <div className="absolute -top-12 right-0 bg-white text-black text-[10px] font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          Chat with Experts
        </div>
        <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.04c0 2.123.554 4.197 1.606 6.034L0 24l6.135-1.61a11.803 11.803 0 005.912 1.586h.005c6.637 0 12.048-5.413 12.052-12.041a11.83 11.83 0 00-3.526-8.511z" />
        </svg>
      </motion.a>
    </>
  );
}
