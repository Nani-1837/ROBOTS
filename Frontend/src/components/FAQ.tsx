import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: "How long does a custom 3D print take?",
    a: "Standard production takes 2-3 business days. Shipping usually takes another 2-5 days depending on your location in India."
  },
  {
    q: "Do you offer international shipping?",
    a: "Yes, we ship our robotics kits and 3D models worldwide. Shipping rates and delivery times vary by country."
  },
  {
    q: "Is there a warranty on electronic components?",
    a: "Yes, all our high-performance electronic modules and motors come with a 6-month manufacturer warranty."
  },
  {
    q: "Can I get a bulk discount for my college batch?",
    a: "Absolutely! We offer special institutional pricing for bulk orders of 10 or more kits. Contact us on WhatsApp for a custom quote."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full bg-[var(--bg-primary)] py-32 px-6 overflow-hidden transition-colors duration-400">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6"
          >
            <HelpCircle size={24} />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black font-display text-[var(--text-main)] mb-6 tracking-tighter leading-tight">
            Common <span className="text-primary italic">Queries</span>.
          </h2>
          <p className="text-[var(--text-muted)] text-lg">
            Quick answers to help you navigate the Bisonix ecosystem.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-8 text-left flex justify-between items-center group"
              >
                <span className="font-bold font-display text-[var(--text-main)] group-hover:text-primary transition-colors pr-8">
                  {faq.q}
                </span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-primary text-white rotate-180' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'}`}>
                  {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[var(--border-subtle)]"
                  >
                    <div className="p-8 text-[var(--text-muted)] text-sm leading-relaxed bg-[var(--bg-primary)]/30">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
