import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Zap } from 'lucide-react';

const activities = [
  { user: "Rohan S.", location: "Vijayawada", action: "ordered a 3D Custom Print", time: "2 mins ago" },
  { user: "Priya M.", location: "Hyderabad", action: "added Swift-Blade Z1 to cart", time: "5 mins ago" },
  { user: "Dr. K. Rao", location: "Vizag", action: "requested a project quote", time: "Just now" },
  { user: "Tech Hub", location: "Bangalore", action: "bulk ordered 10 Robo Kits", time: "12 mins ago" },
];

export default function LiveActivity() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
      setIndex((prev) => (prev + 1) % activities.length);
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-8 left-8 z-[100] bg-[var(--bg-secondary)] border border-primary/20 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-4 max-w-[280px]"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Zap size={20} className="animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-main)] font-bold leading-tight">
              {activities[index].user} from <span className="text-primary">{activities[index].location}</span>
            </p>
            <p className="text-[9px] text-[var(--text-muted)] mt-1">
              {activities[index].action}
            </p>
            <p className="text-[8px] text-primary/60 font-bold uppercase tracking-tighter mt-1">
              {activities[index].time}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
