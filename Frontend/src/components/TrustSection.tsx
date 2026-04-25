import { motion } from 'framer-motion';
import { ShieldCheck, Award, Globe2, Lock, Zap } from 'lucide-react';

export default function TrustSection() {
  const badges = [
    { icon: <ShieldCheck size={32} />, label: "ISO 9001", sub: "Quality Certified", color: "text-blue-400", bg: "bg-blue-500/20", glow: "shadow-blue-500/20" },
    { icon: <Award size={32} />, label: "CE Mark", sub: "EU Standard", color: "text-amber-400", bg: "bg-amber-500/20", glow: "shadow-amber-500/20" },
    { icon: <Globe2 size={32} />, label: "Made in India", sub: "Local Engineering", color: "text-orange-400", bg: "bg-orange-500/20", glow: "shadow-orange-500/20" },
    { icon: <Lock size={32} />, label: "SSL Secure", sub: "Encrypted Payments", color: "text-emerald-400", bg: "bg-emerald-500/20", glow: "shadow-emerald-500/20" },
    { icon: <Zap size={32} />, label: "Tested & Verified", sub: "24h Stress Test", color: "text-purple-400", bg: "bg-purple-500/20", glow: "shadow-purple-500/20" },
  ];

  return (
    <section className="w-full bg-[var(--bg-secondary)] py-16 border-y border-[var(--border-subtle)] transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 items-center">
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`w-20 h-20 rounded-[2rem] ${badge.bg} flex items-center justify-center ${badge.color} group-hover:scale-110 transition-all duration-500 mb-4 border border-primary/10 shadow-2xl ${badge.glow} relative overflow-hidden`}>
                <div className="relative z-10 drop-shadow-[0_0_8px_rgba(255,106,0,0.3)]">{badge.icon}</div>
                <div className={`absolute inset-0 ${badge.bg} blur-2xl opacity-40 group-hover:opacity-100 transition-opacity`} />
              </div>
              <h4 className="text-[var(--text-main)] font-black text-[10px] uppercase tracking-[0.2em] mb-1">{badge.label}</h4>
              <p className="text-[var(--text-muted)] text-[8px] font-bold uppercase tracking-widest opacity-80">{badge.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
