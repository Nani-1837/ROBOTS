import { motion } from 'framer-motion';
import { Gift, Share2, Coins, Users, ArrowRight } from 'lucide-react';

export default function ReferralSection() {
  return (
    <section className="relative w-full bg-[var(--bg-primary)] py-32 px-6 overflow-hidden transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[4rem] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border-subtle)] p-8 md:p-20 overflow-hidden shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-primary mb-8"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Gift size={20} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em]">Referral Program</span>
              </motion.div>

              <h2 className="text-4xl md:text-7xl font-black font-display text-[var(--text-main)] mb-8 tracking-tighter leading-[0.9]">
                Earn <span className="text-primary italic">Robo-Points</span>.
              </h2>
              <p className="text-[var(--text-muted)] text-lg mb-12 max-w-xl leading-relaxed">
                Invite fellow engineers to the Bisonix ecosystem and earn credits for your next 3D print or robotic kit purchase.
              </p>

              <div className="space-y-6 mb-12">
                {[
                  { icon: <Share2 size={18} />, text: "Share your unique referral link" },
                  { icon: <Users size={18} />, text: "Friends get 15% off their first order" },
                  { icon: <Coins size={18} />, text: "You earn 500 Robo-Points per referral" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="text-primary">{item.icon}</div>
                    <span className="text-[var(--text-main)] font-bold text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <button className="bg-primary hover:bg-orange-600 text-white font-black px-10 py-5 rounded-2xl transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-primary/20">
                Join Program <ArrowRight size={20} />
              </button>
            </div>

            <div className="relative">
              <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-10 rounded-[3rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6 relative">
                    <Coins size={48} className="animate-bounce" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  </div>
                  <h3 className="text-3xl font-black text-[var(--text-main)] font-display mb-2">1,500</h3>
                  <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-8">Your Points Balance</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)]">
                      <p className="text-primary font-black text-xl">₹500</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Voucher Ready</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-subtle)]">
                      <p className="text-blue-500 font-black text-xl">3</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">Successful Refers</p>
                    </div>
                  </div>
                </div>

                {/* Decorative glow */}
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              </div>
              
              {/* Floating element */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 z-20"
              >
                <Gift size={40} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
