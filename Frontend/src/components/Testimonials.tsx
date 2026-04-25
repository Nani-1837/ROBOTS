import { motion } from 'framer-motion';
import { Star, Quote, User } from 'lucide-react';

const testimonials = [
  {
    name: "Dr. Arjun Mehta",
    role: "Robotics Professor, IIT",
    content: "The precision of Bisonix 3D models is unparalleled. We've used their parts for three major research projects and the results were flawless.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
  },
  {
    name: "Sanya Kapoor",
    role: "Drone Enthusiast",
    content: "Swift-Blade Z1 is a beast! The speed and stability are exactly what I needed for professional racing. Highly recommend their service.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
  },
  {
    name: "Vikram Singh",
    role: "Final Year Student",
    content: "Their college project support saved my final year. The documentation and hardware were top-notch. Truly a student's best friend.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
  }
];

export default function Testimonials() {
  return (
    <section className="relative w-full bg-[var(--bg-primary)] py-32 px-6 overflow-hidden transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6"
          >
            <Quote size={24} />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black font-display text-[var(--text-main)] mb-6 tracking-tighter"
          >
            Trusted by the <span className="text-primary italic">Community</span>.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[var(--text-muted)] max-w-xl mx-auto text-lg"
          >
            Don't just take our word for it. Hear from the innovators, students, and professionals using Bisonix.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-8 rounded-[2.5rem] relative group hover:border-primary/30 transition-all duration-500"
            >
              <div className="flex gap-1 mb-6 text-orange-500">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              
              <p className="text-[var(--text-main)] text-lg italic leading-relaxed mb-8 relative z-10">
                "{t.content}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-[var(--border-subtle)] pt-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                  <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-[var(--text-main)] font-bold text-sm font-display">{t.name}</h4>
                  <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{t.role}</p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-8 right-8 opacity-5 text-primary group-hover:opacity-10 transition-opacity">
                <Quote size={64} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
