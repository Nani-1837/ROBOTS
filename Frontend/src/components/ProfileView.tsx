import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, Heart, Ticket, HelpCircle, Activity, 
  MapPin, Star, LogOut, Camera, ChevronRight, 
  Clock, ShieldCheck, Mail, Phone, ExternalLink, Share2, Copy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ScratchCard from './ScratchCard';
import MapComponent from './MapComponent';

export default function ProfileView({ setCartItems }: { setCartItems?: React.Dispatch<React.SetStateAction<any[]>> }) {
  const { user, logout, handleSession } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [coupons, setCoupons] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [cancelReason, setCancelReason] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [isGeneratingReferral, setIsGeneratingReferral] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddToCart = (item: any) => {
    if (!setCartItems) {
      showToast('Cart not available', 'error');
      return;
    }
    setCartItems(prev => {
      const exists = prev.find(c => c.id === item._id);
      if (exists) {
        showToast(`${item.name} already in cart!`, 'info');
        return prev;
      }
      showToast(`${item.name} added to cart!`, 'success');
      return [...prev, {
        id: item._id,
        name: item.name,
        price: item.price,
        qty: 1,
        image: item.images?.[0] || item.image || ''
      }];
    });
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const token = localStorage.getItem('insforgeToken');
      await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setWishlist(prev => prev.filter(w => w._id !== productId));
      showToast('Removed from wishlist', 'success');
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'coupons') fetchCoupons();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'wishlist') fetchWishlist();
  }, [activeTab]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('insforgeToken');
      const res = await fetch('http://localhost:5000/api/wishlist', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setWishlist(data.products || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCancelOrder = async (id: string) => {
    if (!cancelReason) {
      showToast('Please provide a reason for cancellation', 'error');
      return;
    }
    try {
      const token = localStorage.getItem('insforgeToken');
      const res = await fetch(`http://localhost:5000/api/orders/${id}/cancel`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: cancelReason })
      });
      if (res.ok) {
        showToast('Order cancelled successfully', 'success');
        setCancellingOrderId(null);
        setCancelReason('');
        fetchOrders();
      }
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('insforgeToken');
      const res = await fetch('http://localhost:5000/api/orders/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('insforgeToken');
      const res = await fetch('http://localhost:5000/api/coupons/active', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setCoupons(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleReveal = async (code: string) => {
    // Persist revealed state in localStorage
    const revealed = JSON.parse(localStorage.getItem('revealedCoupons') || '[]');
    if (!revealed.includes(code)) {
      localStorage.setItem('revealedCoupons', JSON.stringify([...revealed, code]));
    }
    try {
      const token = localStorage.getItem('insforgeToken');
      await fetch(`http://localhost:5000/api/coupons/reveal/${code}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) { console.error(err); }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const token = localStorage.getItem('insforgeToken');
      const res = await fetch('http://localhost:5000/api/users/profile/avatar', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        showToast('Avatar updated!', 'success');
        if (token) {
          await handleSession(token);
        }
      }
    } catch (err) { console.error(err); }
    finally { setIsUploading(false); }
  };

  const generateReferral = async () => {
    setIsGeneratingReferral(true);
    try {
      const token = localStorage.getItem('insforgeToken');
      const res = await fetch('http://localhost:5000/api/users/profile/referral', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Referral code generated!', 'success');
        if (token) {
          await handleSession(token);
        }
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to generate code', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setIsGeneratingReferral(false);
    }
  };

  const handleCopyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      showToast('Referral code copied to clipboard!', 'success');
    }
  };

  const menuItems = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'referrals', label: 'Referrals', icon: Share2 },
    { id: 'address', label: 'My Address', icon: MapPin },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'activity', label: 'My Activity', icon: Activity },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8 transition-colors duration-400">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Sidebar */}
          <aside className="lg:w-80 space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-r from-primary to-orange-600 p-1 shadow-2xl shadow-primary/20">
                    <div className="w-full h-full rounded-[1.8rem] bg-[var(--bg-primary)] overflow-hidden flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} className="text-primary" />
                      )}
                    </div>
                  </div>
                  <label className="absolute -bottom-2 -right-2 p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-[var(--border-subtle)] cursor-pointer hover:bg-primary hover:text-white transition-all">
                    {isUploading ? <Clock size={16} className="animate-spin" /> : <Camera size={16} />}
                    <input type="file" hidden onChange={handleAvatarUpload} accept="image/*" />
                  </label>
                </div>
                <h2 className="text-2xl font-black text-[var(--text-main)] font-display">{user?.name || 'User'}</h2>
                <p className="text-[var(--text-muted)] text-sm font-medium mb-6">{user?.email}</p>
              </div>
            </div>

            {/* Desktop nav — hidden on mobile */}
            <nav className="hidden lg:block space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                    activeTab === item.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-2' 
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                  <ChevronRight size={16} className={`ml-auto opacity-50 ${activeTab === item.id ? 'opacity-100' : ''}`} />
                </button>
              ))}
              <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all mt-8">
                <LogOut size={20} />
                <span className="font-bold text-sm tracking-wide">Logout</span>
              </button>
            </nav>

            {/* Mobile horizontal scrollable tab strip — visible below lg */}
            <nav className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`snap-start shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all text-center ${
                      activeTab === item.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    <item.icon size={18} />
                    <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{item.label}</span>
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="snap-start shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/10 transition-all"
                >
                  <LogOut size={18} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Logout</span>
                </button>
              </div>
            </nav>
          </aside>

          <main className="flex-1">
            <div className="p-4 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-[var(--bg-secondary)]/30 border border-[var(--border-subtle)] min-h-[600px]">
              <AnimatePresence mode="wait">
                {activeTab === 'orders' && (
                  <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-3xl font-black text-[var(--text-main)] font-display mb-8">My Orders</h3>
                    <div className="space-y-4">
                      {loading ? (
                        <div className="py-20 text-center animate-pulse text-primary font-bold">Syncing your orders...</div>
                      ) : orders.length > 0 ? (
                        orders.map((order) => (
                          <div key={order._id} className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center gap-6 group hover:border-primary/30 transition-all">
                            <div className="w-20 h-20 rounded-2xl bg-[var(--bg-secondary)] overflow-hidden shrink-0">
                              <img src={order.items[0]?.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
                                <div>
                                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Order #{order.orderId}</p>
                                  <h4 className="font-bold text-[var(--text-main)]">{order.items[0]?.name} {order.items.length > 1 && `+ ${order.items.length - 1} more`}</h4>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  order.orderStatus === 'Delivered' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                                }`}>{order.orderStatus}</span>
                              </div>
                              <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-[var(--text-muted)] text-xs font-medium">
                                <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><ShieldCheck size={14} /> ₹{order.total}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 mt-4 sm:mt-0 items-center sm:items-end">
                              {order.orderStatus === 'Processing' && (
                                <button 
                                  onClick={() => setCancellingOrderId(order._id)}
                                  className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:underline"
                                >
                                  Cancel Order
                                </button>
                              )}
                              
                              <AnimatePresence>
                                {cancellingOrderId === order._id && (
                                  <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="mt-4 space-y-3 w-full"
                                  >
                                    <input 
                                      type="text" 
                                      placeholder="Reason for cancellation..."
                                      value={cancelReason}
                                      onChange={(e) => setCancelReason(e.target.value)}
                                      className="w-full bg-[var(--bg-secondary)] border border-red-500/20 rounded-xl px-4 py-2 text-xs outline-none focus:border-red-500"
                                    />
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleCancelOrder(order._id)}
                                        className="flex-1 bg-red-500 text-white py-2 rounded-xl text-[10px] font-bold uppercase"
                                      >
                                        Confirm
                                      </button>
                                      <button 
                                        onClick={() => setCancellingOrderId(null)}
                                        className="flex-1 bg-[var(--bg-secondary)] text-[var(--text-muted)] py-2 rounded-xl text-[10px] font-bold uppercase"
                                      >
                                        Back
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 text-center rounded-3xl bg-[var(--bg-primary)] border border-dashed border-[var(--border-subtle)]">
                          <Package size={40} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                          <p className="text-[var(--text-muted)] font-medium">No orders yet. Start your journey!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'wishlist' && (
                  <motion.div key="wishlist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-3xl font-black text-[var(--text-main)] font-display mb-8">My Wishlist</h3>
                    {loading ? (
                      <div className="py-20 text-center animate-pulse text-primary font-bold">Loading your favorites...</div>
                    ) : wishlist.length > 0 ? (
                      <div className="space-y-4">
                        {wishlist.map((item) => (
                          <div key={item._id} className="group flex flex-col sm:flex-row gap-5 p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                            {/* Product Image */}
                            <div className="relative w-full h-48 sm:w-32 sm:h-32 rounded-2xl bg-[var(--bg-secondary)] overflow-hidden shrink-0">
                              <img 
                                src={item.images?.[0] || item.image || 'https://via.placeholder.com/200'} 
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                              />
                              {item.originalPrice && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-[9px] font-black rounded-full uppercase">
                                  {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">
                                  {typeof item.category === 'object' ? item.category?.name : item.category || 'Robotics'}
                                </p>
                                <h4 className="font-black text-[var(--text-main)] text-base leading-tight mb-2 truncate">{item.name}</h4>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-xl font-black text-[var(--text-main)]">₹{item.price?.toLocaleString()}</span>
                                  {item.originalPrice && (
                                    <span className="text-xs text-[var(--text-muted)] line-through">₹{item.originalPrice?.toLocaleString()}</span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-3 mt-4">
                                <button 
                                  onClick={() => handleAddToCart(item)}
                                  className="flex-1 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:from-orange-600 hover:to-orange-500 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                  <Package size={14} /> Add to Cart
                                </button>
                                <button 
                                  onClick={() => handleRemoveFromWishlist(item._id)}
                                  className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                                  title="Remove from wishlist"
                                >
                                  <Heart size={16} className="fill-red-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-20 text-center rounded-3xl bg-[var(--bg-primary)] border border-dashed border-[var(--border-subtle)]">
                        <Heart size={48} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                        <p className="text-[var(--text-muted)] font-bold text-lg">Your wishlist is empty</p>
                        <p className="text-[var(--text-muted)] text-sm mt-1">Heart a product to save it here.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'coupons' && (
                  <motion.div key="coupons" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-3xl font-black text-[var(--text-main)] font-display mb-8">My Coupons</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {loading ? (
                        <div className="col-span-full py-12 text-center text-primary animate-pulse font-bold">Fetching rewards...</div>
                      ) : coupons.length > 0 ? (
                        coupons.map((c) => {
                          const revealedLocally = JSON.parse(localStorage.getItem('revealedCoupons') || '[]').includes(c.code);
                          const isRevealed = revealedLocally || c.usersRevealed?.includes(user?.id) || c.usersRevealed?.includes(user?._id);
                          return (
                            <ScratchCard 
                              key={c._id} 
                              code={c.code} 
                              amount={c.discountAmount} 
                              onReveal={() => handleReveal(c.code)}
                              initialIsRevealed={isRevealed}
                            />
                          );
                        })
                      ) : (
                        <div className="col-span-full py-20 text-center rounded-3xl bg-[var(--bg-primary)] border border-dashed border-[var(--border-subtle)]">
                          <Ticket size={40} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                          <p className="text-[var(--text-muted)] font-medium">No active coupons available.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'referrals' && (
                  <motion.div key="referrals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-3xl font-black text-[var(--text-main)] font-display mb-8">Referral Program</h3>
                    <div className="p-8 sm:p-12 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-3xl border border-primary/20 text-center flex flex-col items-center">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                        <Share2 size={32} className="text-primary" />
                      </div>
                      <h4 className="text-2xl font-black text-[var(--text-main)] mb-3">Invite Friends & Earn</h4>
                      <p className="text-[var(--text-muted)] max-w-md mx-auto mb-8 font-medium">
                        Share your unique referral code with friends. When they sign up using your code, you both get exclusive rewards and discounts!
                      </p>

                      {user?.referralCode ? (
                        <div className="w-full max-w-sm space-y-4">
                          <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest text-left">Your Referral Code</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[var(--bg-primary)] border border-primary/30 rounded-2xl py-4 px-6 text-2xl font-black text-primary tracking-[0.2em]">
                              {user.referralCode}
                            </div>
                            <button 
                              onClick={handleCopyReferral}
                              className="h-full px-6 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all flex flex-col items-center justify-center shadow-lg shadow-primary/20 active:scale-95 py-4"
                            >
                              <Copy size={20} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={generateReferral}
                          disabled={isGeneratingReferral}
                          className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isGeneratingReferral ? 'Generating...' : 'Generate My Code'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'address' && (
                  <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-3xl font-black text-[var(--text-main)] font-display mb-8">Shipping Address</h3>
                    <div className="space-y-8">
                      <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <MapPin size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-[var(--text-main)] mb-1">Primary GPS Location</h4>
                            <p className="text-xs text-[var(--text-muted)]">Your location is used for precise autonomous delivery and tracking.</p>
                          </div>
                        </div>
                        <MapComponent onLocationSelect={() => showToast('Location updated in profile', 'success')} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'help' && (
                  <motion.div key="help" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h3 className="text-3xl font-black text-[var(--text-main)] font-display mb-8">Help Center</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-orange-500/5 border border-primary/10 group hover:border-primary/30 transition-all">
                        <Mail className="text-primary mb-4" size={32} />
                        <h4 className="text-lg font-bold text-[var(--text-main)] mb-2">Email Support</h4>
                        <p className="text-xs text-[var(--text-muted)] mb-6">Drop us a line for any technical or order queries.</p>
                        <a href="mailto:j.n.g@bisonix.store" className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                          j.n.g@bisonix.store <ExternalLink size={14} />
                        </a>
                      </div>
                      <div className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10 group hover:border-blue-500/30 transition-all">
                        <Phone className="text-blue-500 mb-4" size={32} />
                        <h4 className="text-lg font-bold text-[var(--text-main)] mb-2">Direct Hotline</h4>
                        <p className="text-xs text-[var(--text-muted)] mb-6">Our experts are available Mon-Sat (9AM - 6PM).</p>
                        <a href="tel:+917995232673" className="inline-flex items-center gap-2 text-sm font-bold text-blue-500 group-hover:gap-3 transition-all">
                          +91 79952 32673 <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!['orders', 'coupons', 'address', 'help', 'wishlist'].includes(activeTab) && (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <Activity size={48} className="text-primary opacity-20 mb-4" />
                    <h3 className="text-xl font-bold text-[var(--text-main)] mb-2">{menuItems.find(m => m.id === activeTab)?.label} Section</h3>
                    <p className="text-[var(--text-muted)] text-sm">We are fine-tuning this section for you.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
