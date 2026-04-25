import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Search, Package, Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface TrackOrderViewProps {
  onBack: () => void;
}

export default function TrackOrderView({ onBack }: TrackOrderViewProps) {
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const steps = [
    { label: 'Order Confirmed', status: 'completed', time: 'April 24, 10:30 AM' },
    { label: 'In Production', status: 'completed', time: 'April 25, 09:15 AM' },
    { label: 'Quality Check', status: 'current', time: 'In Progress' },
    { label: 'Dispatched', status: 'pending', time: 'Pending' },
    { label: 'Delivered', status: 'pending', time: 'Pending' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8 transition-colors duration-400"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-12">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
            Home
          </button>
          <ChevronRight size={12} />
          <span className="text-[var(--text-main)] font-bold">Track Your Order</span>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-7xl font-black font-display text-[var(--text-main)] mb-6 tracking-tighter leading-tight">
            Where is my <span className="text-primary italic">Robot</span>?
          </h1>
          <p className="text-[var(--text-muted)] text-lg mb-10 max-w-xl mx-auto">
            Enter your order ID to get real-time telemetry on your hardware shipment.
          </p>

          <div className="max-w-md mx-auto relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-hover:bg-primary/10 transition-all" />
            <div className="relative flex gap-2">
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Order ID (e.g. BSX-9921)" 
                className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl px-6 py-4 text-sm focus:border-primary outline-none text-[var(--text-main)]"
              />
              <button 
                onClick={() => setIsTracking(true)}
                className="bg-primary hover:bg-orange-600 text-white px-6 py-4 rounded-2xl transition-all flex items-center gap-2 font-bold shadow-xl shadow-primary/20"
              >
                <Search size={18} /> Track
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isTracking && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[3rem] p-8 md:p-12 shadow-2xl overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-[var(--border-subtle)]">
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Tracking Number</p>
                    <h3 className="text-2xl font-black text-primary font-display">{orderId || 'BSX-9921'}</h3>
                  </div>
                  <div className="flex gap-8">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Status</p>
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-blue-500/20">Quality Check</span>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Delivery</p>
                      <p className="text-[var(--text-main)] font-bold text-sm">28 April, 2024</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-6 relative group">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${
                        step.status === 'completed' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 
                        step.status === 'current' ? 'bg-[var(--bg-primary)] border-2 border-primary text-primary animate-pulse' : 
                        'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)]'
                      }`}>
                        {step.status === 'completed' ? <CheckCircle2 size={16} /> : i + 1}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-bold font-display ${step.status === 'pending' ? 'text-[var(--text-muted)]' : 'text-[var(--text-main)]'}`}>
                            {step.label}
                          </h4>
                          <span className="text-[10px] font-medium text-[var(--text-muted)]">{step.time}</span>
                        </div>
                        {step.status === 'current' && (
                          <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-3 items-center">
                            <Clock size={14} className="text-primary" />
                            <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                              Our engineers are performing a final 24-hour stress test on your drone's propulsion system.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Live Location</p>
                    <p className="text-[var(--text-main)] font-bold text-xs">Production Facility - Vijayawada Hub</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
