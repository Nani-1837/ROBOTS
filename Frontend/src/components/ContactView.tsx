import { motion } from 'framer-motion';
import { ChevronRight, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

interface ContactViewProps {
  onBack: () => void;
}

export default function ContactView({ onBack }: ContactViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8 transition-colors duration-400"
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-12">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
            Home
          </button>
          <ChevronRight size={12} />
          <span className="text-[var(--text-main)] font-bold">Contact Us</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <h1 className="text-4xl md:text-7xl font-black font-display text-[var(--text-main)] mb-8 leading-[0.9] tracking-tighter">
              Get in <span className="text-primary italic">Touch</span>.
            </h1>
            <p className="text-[var(--text-muted)] text-lg mb-12 max-w-xl leading-relaxed">
              Have questions about our robotics ecosystem or need technical support? Our team is here to help you engineer the future.
            </p>

            <div className="space-y-10">
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Email Us</p>
                  <p className="text-[var(--text-main)] font-bold text-lg font-display">hello@bisonix.com</p>
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/10">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Call Us</p>
                  <p className="text-[var(--text-main)] font-bold text-lg font-display">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/10">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Visit Us</p>
                  <p className="text-[var(--text-main)] font-bold text-lg font-display">Benz Circle, Vijayawada, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[var(--text-main)] mb-8 font-display flex items-center gap-3">
                <MessageSquare className="text-primary" size={24} />
                Send a Message
              </h3>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Name</label>
                    <input type="text" placeholder="Your Name" className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Subject</label>
                    <input type="text" placeholder="Topic" className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Email Address</label>
                  <input type="email" placeholder="email@example.com" className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Message</label>
                  <textarea rows={4} placeholder="How can we help?" className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors resize-none" />
                </div>

                <button 
                  className="w-full bg-gradient-to-r from-primary to-orange-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:from-orange-600 hover:to-orange-500 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Send Message
                </button>
              </form>
            </div>

            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
          </div>
        </div>

        {/* Google Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 relative group"
        >
          <div className="absolute -inset-4 bg-primary/10 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative aspect-video w-full rounded-[3rem] overflow-hidden border border-[var(--border-subtle)] shadow-2xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122410.23190861113!2d80.5748443314051!3d16.506174246969543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35eff9482d9441%3A0x66d3e0b56863d40!2sVijayawada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1714051000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
            />
          </div>
          
          <div className="absolute top-8 left-8 bg-[var(--bg-secondary)]/90 backdrop-blur-xl p-6 rounded-2xl border border-primary/20 shadow-2xl pointer-events-none">
            <h4 className="text-primary font-black text-xs uppercase tracking-widest mb-1">Our HQ</h4>
            <p className="text-[var(--text-main)] font-bold text-lg font-display">Vijayawada, India</p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
