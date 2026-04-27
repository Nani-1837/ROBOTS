import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, Sun, Moon, ChevronDown, ChevronRight, X, LogOut, Settings, User as UserIcon, Bell, Ticket, MoreVertical } from 'lucide-react';
import logo from '../assets/logo.png';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import dronesImg from '../assets/Drones.jpg';
import carsImg from '../assets/Cars.jpg';
import robotsImg from '../assets/Robots.jpg';
import collegeProjectsImg from '../assets/College-Projects.jpg';
import customBuildsImg from '../assets/Custom Builds.jpg';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  cartItems: any[];
  setCartItems: (items: any[]) => void;
  setActiveCategory: (cat: string | null) => void;
  setCurrentView: (view: any) => void;
  setSelectedProduct: (product: any) => void;
}

export default function Navbar({ cartItems, setCartItems, setActiveCategory, setCurrentView, setSelectedProduct }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false); // Default to Light Mode
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const { user, logout } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem('insforgeToken');
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setNotifications(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markNotificationAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('insforgeToken');
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  useEffect(() => {
    if (user) console.log('Current User in Navbar:', user);
  }, [user]);

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

  const [dynamic3DProducts, setDynamic3DProducts] = useState<any[]>([]);

  interface NavLink {
    name: string;
    href?: string;
    hasDropdown?: boolean;
  }

  const navLinks: NavLink[] = [
    { name: 'Products', hasDropdown: true },
    ...(dynamic3DProducts.length > 0 ? [{ name: '3D Solutions', hasDropdown: true }] : []),
    { name: 'Services', hasDropdown: true },
    { name: 'Contact', href: '#' },
  ];

  // Add Admin Link if user is admin
  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin Panel', href: '#', hasDropdown: false });
  }

  const fetch3D = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      if (res.ok) {
        const filtered = data.filter((p: any) => {
          const catName = typeof p.category === 'object' ? p.category.name : p.category;
          return catName?.toLowerCase().includes('3d');
        });
        setDynamic3DProducts(filtered.map((p: any) => ({
          name: p.name,
          image: p.images?.[0] || '',
          view: 'product-detail', // Use product detail view
          product: p, // Pass the whole product object
          category: typeof p.category === 'object' ? p.category.name : p.category
        })));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetch3D();
  }, []);

  const sidebarLinks: Record<string, any[]> = {
    'Products': [
      { name: 'New Arrivals', view: 'category', cat: 'Robo Toys' },
      { name: 'Best Sellers', view: 'category', cat: 'Drones' },
      { name: 'Support', view: 'contact' }
    ],
    '3D Solutions': [
      { name: '3D Models', view: 'category', cat: '3D Models' },
      { name: 'Comparison Tool', view: 'compare' },
      { name: 'Custom Prints', view: 'model-upload' }
    ],
    'Services': [
      { name: 'Project Support', view: 'college-projects' },
      { name: 'Custom Hardware', view: 'contact' },
      { name: 'Technical Docs', view: 'home' },
      { name: 'Consultation', view: 'contact' }
    ],
    'Default': [
      { name: 'Comparison Tool', view: 'compare' },
      { name: 'Support', view: 'contact' }
    ]
  };

  const megaMenuContent: Record<string, any[]> = {
    'Products': [
      { name: 'Robots', image: robotsImg, view: 'category', category: 'Robo Toys' },
      { name: 'Drones', image: dronesImg, view: 'category', category: 'Drones' },
      { name: 'RC Vehicles', image: carsImg, view: 'category', category: 'RC Vehicles' },
    ],
    '3D Solutions': dynamic3DProducts,
    'Services': [
      { name: 'College Projects', image: collegeProjectsImg, view: 'college-projects', category: null },
      { name: 'Custom Builds', image: customBuildsImg, view: 'model-upload', category: null },
    ]
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
            className="flex items-center cursor-pointer group"
            onClick={() => {
              setCurrentView('home');
              setActiveCategory(null);
              setActiveItem(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <img src={logo} alt="BISONIX Logo" className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto relative z-10 transition-all duration-300" />
          </div>

          <ul className="hidden lg:flex items-center gap-1 text-sm font-medium text-[var(--text-muted)] relative z-10">
            {navLinks.map((item) => (
              <li 
                key={item.name} 
                onMouseEnter={() => {
                  setHoveredLink(item.name);
                  if (item.name === '3D Solutions') fetch3D();
                }}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={() => {
                  if (item.name === 'Contact') {
                    setCurrentView('contact');
                    setActiveItem('Contact');
                  } else if (item.name === 'Track Order') {
                    setCurrentView('track-order');
                    setActiveItem('Track Order');
                  } else if (item.name === 'Admin Panel') {
                    setCurrentView('admin');
                    setActiveItem('Admin Panel');
                  }
                }}
                className="relative px-4 py-6 cursor-pointer group flex items-center gap-1"
              >
                <span className={`relative z-10 group-hover:text-primary transition-colors duration-300 ${activeItem === item.name ? 'text-primary font-bold' : ''}`}>
                  {item.name}
                </span>
                {item.hasDropdown && <ChevronDown size={14} className="relative z-10 group-hover:text-primary transition-colors" />}
                
                <AnimatePresence>
                  {hoveredLink === item.name && item.hasDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-0 cursor-default"
                    >
                      <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden flex min-w-[750px] backdrop-blur-xl mt-2">
                        <div className="w-56 bg-[var(--bg-secondary)]/50 p-8 border-r border-[var(--border-subtle)] space-y-6">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Quick Access</p>
                          {(sidebarLinks[item.name] || sidebarLinks['Default']).map((link: any) => (
                            <div 
                              key={link.name} 
                              onClick={() => { 
                                setCurrentView(link.view); 
                                if (link.cat) setActiveCategory(link.cat);
                                setHoveredLink(null); 
                              }}
                              className="text-xs font-bold text-[var(--text-main)] hover:text-primary transition-colors cursor-pointer flex justify-between items-center group/link"
                            >
                              {link.name}
                              <ChevronRight size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                            </div>
                          ))}
                          <div className="pt-6 mt-6 border-t border-[var(--border-subtle)]">
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                              <p className="text-[10px] font-bold text-[var(--text-main)]">Special Offer!</p>
                              <p className="text-[9px] text-[var(--text-muted)]">Get 15% off on your first custom build.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-8 bg-[var(--bg-primary)]/80">
                          <div className="grid grid-cols-3 gap-8">
                            {megaMenuContent[item.name]?.map((subItem: any, idx: number) => (
                              <div 
                                key={idx} 
                                onClick={() => {
                                  setCurrentView(subItem.view);
                                  if (subItem.category) setActiveCategory(subItem.category);
                                  if (subItem.product) setSelectedProduct(subItem.product);
                                  setActiveItem(item.name);
                                  setHoveredLink(null);
                                }}
                                className="group/item cursor-pointer text-center"
                              >
                                <div className="aspect-square rounded-2xl bg-[var(--bg-secondary)] overflow-hidden mb-3 border border-[var(--border-subtle)] shadow-sm">
                                  <img src={subItem.image} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110" />
                                </div>
                                <p className="text-[10px] font-bold text-[var(--text-main)] group-hover/item:text-primary transition-colors uppercase tracking-wider">{subItem.name}</p>
                              </div>
                            ))}
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
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
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

              {user && (
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="p-2 hover:bg-[var(--text-main)]/10 rounded-full transition-colors group"
                  >
                    <Bell size={20} className="text-[var(--text-muted)] group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-4 w-80 bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[400px]"
                      >
                        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-primary)]/50">
                          <p className="text-[10px] font-black text-[var(--text-main)] uppercase tracking-widest">Notifications</p>
                          {unreadCount > 0 && <span className="text-[10px] font-bold text-primary">{unreadCount} New</span>}
                        </div>
                        
                        <div className="overflow-y-auto flex-1 py-2 custom-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                              <p className="text-xs text-[var(--text-muted)]">No notifications yet</p>
                            </div>
                          ) : (
                            notifications.map((notif) => (
                              <div 
                                key={notif._id} 
                                onClick={() => { markNotificationAsRead(notif._id); if (notif.type === 'coupon') setCurrentView('profile'); }}
                                className={`p-4 hover:bg-[var(--text-main)]/5 transition-all cursor-pointer border-b border-[var(--border-subtle)] last:border-0 ${!notif.isRead ? 'bg-primary/5' : ''}`}
                              >
                                <div className="flex gap-3">
                                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${notif.type === 'coupon' ? 'bg-orange-500/20 text-orange-500' : 'bg-primary/20 text-primary'}`}>
                                    {notif.type === 'coupon' ? <Ticket size={14} /> : <Bell size={14} />}
                                  </div>
                                  <div className="flex-1 text-left">
                                    <p className="text-[11px] font-bold text-[var(--text-main)] mb-1">{notif.title}</p>
                                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{notif.message}</p>
                                    <p className="text-[9px] text-[var(--text-muted)] mt-2 font-medium">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                  </div>
                                  {!notif.isRead && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

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

              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center bg-[var(--text-main)]/5 hover:bg-[var(--text-main)]/10 border border-[var(--border-subtle)] p-1 rounded-full transition-all duration-300 group shadow-lg shadow-black/10"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center text-white font-bold text-xs overflow-hidden ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <span>{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl shadow-2xl overflow-hidden z-50 p-2"
                      >
                        <button 
                          onClick={() => { setCurrentView('profile'); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[var(--text-main)] hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                        >
                          <UserIcon size={16} />
                          My Profile
                        </button>
                        
                        {user.role === 'admin' && (
                          <button 
                            onClick={() => { setCurrentView('admin'); setIsProfileOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[var(--text-main)] hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                          >
                            <Settings size={16} />
                            Admin Dashboard
                          </button>
                        )}
                        <div className="h-[1px] bg-[var(--border-subtle)] my-1 mx-2" />
                        <button 
                          onClick={() => { logout(); setIsProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="ml-2 relative overflow-hidden group bg-[var(--text-main)]/5 hover:bg-[var(--text-main)]/10 border border-[var(--border-subtle)] px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/80 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 group-hover:text-white text-[var(--text-main)] transition-colors duration-300">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Actions Overlay/Menu Trigger */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-2 text-[var(--text-muted)] hover:text-primary transition-colors"
                >
                  <MoreVertical size={24} />
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-64 bg-[var(--bg-secondary)] backdrop-blur-xl border border-[var(--border-subtle)] rounded-3xl shadow-2xl overflow-hidden z-50 p-4 space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => setIsDark(!isDark)}
                          className="flex flex-col items-center justify-center p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl hover:border-primary transition-all"
                        >
                          {isDark ? <Moon size={20} className="text-blue-400 mb-2" /> : <Sun size={20} className="text-orange-500 mb-2" />}
                          <span className="text-[10px] font-bold uppercase tracking-widest">{isDark ? 'Dark' : 'Light'}</span>
                        </button>
                        
                        <button 
                          onClick={() => { setIsCartOpen(true); setIsProfileOpen(false); }}
                          className="flex flex-col items-center justify-center p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl hover:border-primary transition-all relative"
                        >
                          <ShoppingCart size={20} className="text-[var(--text-muted)] mb-2" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Cart</span>
                          {cartItems.length > 0 && (
                            <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                              {cartItems.length}
                            </span>
                          )}
                        </button>

                        {user && (
                          <>
                            <button 
                              onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
                              className="flex flex-col items-center justify-center p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl hover:border-primary transition-all relative"
                            >
                              <Bell size={20} className="text-[var(--text-muted)] mb-2" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Alerts</span>
                              {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                  {unreadCount}
                                </span>
                              )}
                            </button>
                            <button 
                              onClick={() => { setCurrentView('profile'); setIsProfileOpen(false); }}
                              className="flex flex-col items-center justify-center p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl hover:border-primary transition-all"
                            >
                              <UserIcon size={20} className="text-[var(--text-muted)] mb-2" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
                            </button>
                          </>
                        )}
                      </div>

                      {user?.role === 'admin' && (
                        <button 
                          onClick={() => { setCurrentView('admin'); setIsProfileOpen(false); }}
                          className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Settings size={14} /> Admin Dashboard
                        </button>
                      )}

                      {user ? (
                        <button 
                          onClick={() => { logout(); setIsProfileOpen(false); }}
                          className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-red-500/20"
                        >
                          Sign Out
                        </button>
                      ) : (
                        <button 
                          onClick={() => { setIsAuthModalOpen(true); setIsProfileOpen(false); }}
                          className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                          Sign In
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-[var(--text-main)]/10 rounded-full transition-colors relative z-[60]"
              >
                {isMobileMenuOpen ? <X size={24} className="text-primary" /> : <Menu size={24} className="text-[var(--text-muted)]" />}
              </button>
            </div>
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
                className="fixed top-0 right-0 h-full w-full max-w-xs bg-[var(--bg-primary)] border-l border-[var(--border-subtle)] z-[56] lg:hidden p-8 pt-24 space-y-8 shadow-2xl overflow-y-auto"
              >
                <div className="space-y-2">
                  <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Navigation</p>
                  {navLinks.map((item) => (
                    <div key={item.name}>
                      <button 
                        onClick={() => {
                          if (item.name === 'Contact') {
                            setCurrentView('contact');
                            setActiveItem('Contact');
                            setIsMobileMenuOpen(false);
                          } else if (item.name === 'Track Order') {
                            setCurrentView('track-order');
                            setActiveItem('Track Order');
                            setIsMobileMenuOpen(false);
                          } else if (item.hasDropdown) {
                            setActiveItem(activeItem === item.name ? null : item.name);
                          } else {
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className="w-full text-left py-4 border-b border-[var(--border-subtle)] flex justify-between items-center group"
                      >
                        <span className={`text-xl font-bold font-display transition-colors ${activeItem === item.name ? 'text-primary' : 'text-[var(--text-main)]'}`}>
                          {item.name}
                        </span>
                        {item.hasDropdown && (
                          <ChevronRight size={18} className={`text-[var(--text-muted)] transition-transform ${activeItem === item.name ? 'rotate-90' : ''}`} />
                        )}
                      </button>
                      
                      {item.hasDropdown && activeItem === item.name && (
                        <div className="pl-4 py-4 space-y-4">
                          {megaMenuContent[item.name]?.map((subItem: any, idx: number) => (
                            <button 
                              key={idx}
                              onClick={() => { 
                                setCurrentView(subItem.view); 
                                if (subItem.category) setActiveCategory(subItem.category);
                                setIsMobileMenuOpen(false); 
                              }}
                              className="w-full text-left py-2 text-sm font-bold text-[var(--text-muted)] hover:text-primary transition-colors flex justify-between items-center"
                            >
                              {subItem.name}
                              <ChevronRight size={14} className="opacity-30" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="pt-8">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center p-6 bg-[var(--text-main)]/5 rounded-3xl border border-[var(--border-subtle)]">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center text-white font-bold text-2xl overflow-hidden shadow-2xl shadow-primary/20">
                          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span>{user.name?.charAt(0) || 'U'}</span>}
                        </div>
                      </div>
                      
                      {user.role === 'admin' && (
                        <button 
                          onClick={() => { setCurrentView('admin'); setIsMobileMenuOpen(false); }}
                          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Settings size={18} />
                          Admin Dashboard
                        </button>
                      )}
                      
                      <button 
                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                        className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-bold border border-red-500/20"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg shadow-primary/20"
                    >
                      Account Access
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} setCartItems={setCartItems} setCurrentView={setCurrentView} />
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
