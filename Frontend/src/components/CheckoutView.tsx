import { API_URL } from '../config';
import React, { useState } from 'react';
import { 
  ChevronRight, MapPin, CreditCard, Tag,
  ShoppingBag, Truck, CheckCircle2,
  Loader2, X
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface CheckoutViewProps {
  cartItems: any[];
  onBack: () => void;
  onSuccess: (orderId: string) => void;
  user: any;
}

export default function CheckoutView({ cartItems, onBack, onSuccess, user }: CheckoutViewProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: user?.addresses?.[0]?.address || '',
    city: user?.addresses?.[0]?.city || '',
    pincode: user?.addresses?.[0]?.pincode || '',
    country: 'India',
    email: user?.email || '',
    coordinates: { lat: 0, lng: 0 }
  });

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = appliedCoupon?.discountAmount || 0;
  const total = Math.max(0, subtotal - discount);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFormData(prev => ({ 
            ...prev, 
            coordinates: { lat: pos.coords.latitude, lng: pos.coords.longitude } 
          }));
          showToast('Live location captured!', 'success');
        },
        () => showToast('Location access denied.', 'error')
      );
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    try {
      const token = localStorage.getItem('insforgeToken');
      const res = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (res.ok && data.discountAmount) {
        setAppliedCoupon({ code: data.code || code, discountAmount: data.discountAmount });
        showToast(`Coupon applied! ₹${data.discountAmount} OFF`, 'success');
      } else {
        showToast(data.message || 'Invalid or expired coupon', 'error');
      }
    } catch {
      showToast('Could not validate coupon. Check connection.', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    showToast('Coupon removed', 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('insforgeToken');

      // Place order
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          subtotal,
          discount,
          total,
          couponCode: appliedCoupon?.code || null,
          shippingAddress: formData,
          paymentMethod: 'COD'
        })
      });

      // Sync user profile in background
      fetch(`${API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ phone: formData.phone, addresses: [formData] })
      }).catch(() => {});

      const data = await response.json();
      if (response.ok) {
        showToast(`Order #${data.orderId} placed successfully! 🎉`, 'success');
        onSuccess(data.orderId);
      } else {
        showToast(data.message || 'Failed to place order', 'error');
      }
    } catch {
      showToast('Connection error. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-12">
          <button onClick={onBack} className="hover:text-primary transition-colors font-medium">Cart</button>
          <ChevronRight size={12} />
          <span className="text-[var(--text-main)] font-bold">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* ──── Left: Delivery Form ──── */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-7xl font-black font-display text-[var(--text-main)] leading-[0.9] tracking-tighter mb-2">
                Secure <span className="text-primary italic">Checkout</span>.
              </h1>
              <p className="text-[var(--text-muted)] text-sm">Fill in your delivery details below.</p>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Full Name *</label>
                    <input 
                      type="text" required 
                      placeholder="e.g. Jayaveer N G"
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl px-5 py-4 text-sm placeholder:text-[var(--text-muted)]/40 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Email Address *</label>
                    <input 
                      type="email" required 
                      placeholder="e.g. you@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl px-5 py-4 text-sm placeholder:text-[var(--text-muted)]/40 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Phone + Live Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Phone Number *</label>
                    <input 
                      type="tel" required 
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl px-5 py-4 text-sm placeholder:text-[var(--text-muted)]/40 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      type="button"
                      onClick={handleGetLocation}
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border flex items-center justify-center gap-2 ${
                        formData.coordinates.lat !== 0
                          ? 'bg-green-500/10 text-green-500 border-green-500/20'
                          : 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20'
                      }`}
                    >
                      {formData.coordinates.lat !== 0
                        ? <><CheckCircle2 size={14} /> Location Captured</>
                        : <><MapPin size={14} /> Get Live Location</>
                      }
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Street Address *</label>
                  <textarea 
                    required rows={2}
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder="House No., Street, Landmark, Apartment..."
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl px-5 py-4 text-sm placeholder:text-[var(--text-muted)]/40 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none"
                  />
                </div>

                {/* City + PIN */}
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">City *</label>
                    <input 
                      type="text" required 
                      placeholder="e.g. Hyderabad"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl px-5 py-4 text-sm placeholder:text-[var(--text-muted)]/40 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">PIN Code *</label>
                    <input 
                      type="text" required 
                      placeholder="e.g. 500001"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl px-5 py-4 text-sm placeholder:text-[var(--text-muted)]/40 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button 
                  type="submit"
                  disabled={isLoading || cartItems.length === 0}
                  className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-primary/20 hover:from-orange-600 hover:to-orange-500 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 mt-2"
                >
                  {isLoading 
                    ? <><Loader2 className="animate-spin" size={20} /> Placing Order...</>
                    : <><CreditCard size={20} /> Confirm Order & Pay COD</>
                  }
                </button>
              </form>
            </div>
          </div>

          {/* ──── Right: Order Summary ──── */}
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-8 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-8 flex items-center gap-3">
                <ShoppingBag className="text-primary" /> Order Summary
              </h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-8 max-h-64 overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-[var(--text-muted)] text-sm text-center py-8">No items in cart.</p>
                ) : cartItems.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-hidden shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-[var(--text-main)] truncate">{item.name}</h4>
                      <p className="text-xs text-[var(--text-muted)]">Qty: {item.qty} × ₹{item.price.toLocaleString()}</p>
                    </div>
                    <p className="font-black text-sm text-[var(--text-main)] shrink-0">₹{(item.price * item.qty).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              {/* Coupon Code */}
              <div className="mb-6 pb-6 border-b border-[var(--border-subtle)]">
                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Tag size={12} /> Promo / Coupon Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center gap-3 px-5 py-3.5 bg-green-500/10 border border-green-500/20 rounded-2xl">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-[11px] font-black text-green-500 uppercase tracking-widest">{appliedCoupon.code}</p>
                      <p className="text-[10px] text-green-500/70">₹{appliedCoupon.discountAmount.toLocaleString()} OFF applied</p>
                    </div>
                    <button onClick={handleRemoveCoupon} className="p-1 text-green-500/60 hover:text-red-400 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Enter promo code (e.g. SAVE100)"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                      className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl px-4 py-3 text-sm font-bold focus:border-primary outline-none transition-all uppercase tracking-widest placeholder:normal-case placeholder:font-normal placeholder:text-[var(--text-muted)]/40"
                    />
                    <button 
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-5 py-3 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                    >
                      {couponLoading ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[var(--text-main)]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-[var(--text-muted)]">
                  <span>Shipping</span>
                  <span className="font-bold text-green-500 text-[10px] uppercase tracking-widest">Free</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm font-bold text-green-500">
                    <span>Coupon Discount ({appliedCoupon.code})</span>
                    <span>– ₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-black text-[var(--text-main)] pt-4 border-t border-[var(--border-subtle)]">
                  <span className="font-display uppercase tracking-tight">Total Payable</span>
                  <span className="text-primary italic">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery info only */}
            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4">
              <Truck className="text-blue-500 shrink-0" size={20} />
              <div>
                <p className="text-xs font-bold text-[var(--text-main)]">Estimated Delivery</p>
                <p className="text-[10px] text-[var(--text-muted)]">3-5 Business Days across India · Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

