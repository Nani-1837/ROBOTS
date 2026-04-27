import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Users, Zap, Shield, X, Cpu } from 'lucide-react';
import { useToast } from '../context/ToastContext';
const logo = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282208/bisonix_assets/logo.png";

// Custom Original Brand Icons (SVGs)
const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const MojIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L4 20h16L12 2zm0 14.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.486 3.24H4.298l13.31 17.41z"/>
  </svg>
);

const SnapchatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C7.268 0 3.864 3.414 3.864 8.28c0 1.25.13 2.056.242 2.766-.547.387-1.41.972-2.31 1.58-.916.621-1.393 1.258-1.393 1.895 0 .56.326 1.01.888 1.272.235.11.514.156.786.136-.02.434-.02 1.05.044 1.488.163 1.11.83 2.148 2.015 2.148 1.05 0 1.31-.77 1.888-.77.16 0 .343.085.545.21 1.168.733 2.668 1.116 4.43 1.116 1.764 0 3.264-.383 4.432-1.116.202-.125.385-.21.545-.21.578 0 .837.77 1.888.77 1.185 0 1.853-1.037 2.016-2.148.062-.438.064-1.054.043-1.488.272.02.551-.026.786-.136.562-.262.888-.712.888-1.272 0-.637-.477-1.274-1.393-1.895-.9-.608-1.763-1.193-2.31-1.58.113-.71.242-1.516.242-2.766C20.136 3.414 16.732 0 12 0z"/>
  </svg>
);

export default function Footer({ setCurrentView, setActiveCategory }: { setCurrentView?: (view: any) => void, setActiveCategory?: (cat: any) => void }) {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/community/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        showToast(data.message || 'Welcome to the Hive!', 'success');
        setEmail('');
      } else {
        showToast(data.message || 'Subscription failed', 'error');
      }
    } catch (err) {
      showToast('Connection failed. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = [
    { name: 'YouTube', icon: YoutubeIcon, color: '#FF0000', href: '#' },
    { name: 'Instagram', icon: InstagramIcon, color: '#E4405F', href: '#' },
    { name: 'Moj', icon: MojIcon, color: '#FFD700', href: '#' },
    { name: 'Facebook', icon: FacebookIcon, color: '#1877F2', href: '#' },
    { name: 'X', icon: XIcon, color: '#FFFFFF', href: '#' },
    { name: 'Snapchat', icon: SnapchatIcon, color: '#FFFC00', href: '#' },
  ];


  return (
    <footer className="relative w-full bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] pt-24 pb-12 px-6 overflow-hidden transition-colors duration-400">
      {/* Background Gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20">
          
          {/* Brand Info */}
          <div className="flex flex-col items-start">
            <div 
              className="flex items-center gap-3 mb-6 cursor-pointer"
              onClick={() => {
                setCurrentView?.('home');
                setActiveCategory?.(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img src={logo} alt="BISONIX Logo" className="h-16 w-auto" />
            </div>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8 max-w-xs font-medium">
              Engineering intelligent systems for a smarter, autonomous future.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, i) => (
                <motion.a 
                  key={i}
                  href={social.href}
                  title={social.name}
                  whileHover={{ 
                    y: -5, 
                    backgroundColor: social.color + '40',
                    scale: 1.1
                  }}
                  style={{ 
                    color: social.color,
                    backgroundColor: social.color + '15',
                    borderColor: social.color + '30'
                  }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border shadow-lg"
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-[var(--text-main)] font-bold font-display mb-6 uppercase tracking-widest text-xs">Products</h4>
            <ul className="space-y-4">
              {[
                { name: 'Robots', cat: 'Robo Toys' },
                { name: 'Drones', cat: 'Drones' },
                { name: 'RC Vehicles', cat: 'RC Vehicles' },
                { name: '3D Models', cat: '3D Models' }
              ].map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => {
                      setCurrentView?.('category');
                      setActiveCategory?.(link.cat);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[var(--text-muted)] text-sm hover:text-primary transition-colors font-medium text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-[var(--text-main)] font-bold font-display mb-6 uppercase tracking-widest text-xs">Solutions</h4>
            <ul className="space-y-4">
              {[
                { name: 'Custom Engineering', view: 'model-upload' },
                { name: 'Prototyping', view: 'model-upload' },
                { name: 'Student Projects', view: 'college-projects' }
              ].map((link) => (
                <li key={link.name}>
                  <button 
                    onClick={() => {
                      setCurrentView?.(link.view);
                      setActiveCategory?.(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[var(--text-muted)] text-sm hover:text-primary transition-colors font-medium text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[var(--text-main)] font-bold font-display mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4">
              {['About', 'Technology', 'Careers', 'Contact'].map((link) => (
                <li key={link}>
                  <button 
                    onClick={() => {
                      if (link === 'Contact') {
                        setCurrentView?.('contact');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        setIsAboutOpen(true);
                        setTimeout(() => {
                          const id = link === 'About' ? 'our-story' : link.toLowerCase() + '-section';
                          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }
                    }} 
                    className="text-[var(--text-muted)] text-sm hover:text-primary transition-colors font-medium text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter - Centered at Bottom */}
        <div className="max-w-md mx-auto text-center mb-20 pt-12 border-t border-[var(--border-subtle)]">
          <h4 className="text-[var(--text-main)] font-bold font-display mb-4 uppercase tracking-widest text-xs">Connect</h4>
          <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed font-medium">
            Follow our journey and stay updated.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address" 
              required
              disabled={loading}
              className="flex-1 bg-[var(--text-main)]/5 border border-[var(--border-subtle)] rounded-xl py-3 px-6 text-[var(--text-main)] text-sm focus:outline-none focus:border-primary transition-colors font-medium text-center sm:text-left disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={loading}
              className="px-8 bg-primary text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors text-sm whitespace-nowrap disabled:opacity-50 flex items-center justify-center min-w-[120px]"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Subscribe'}
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--border-subtle)] pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest">
            © 2026 BISONIX Robotics
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors">Cookies</a>
          </div>
        </div>
      </div>

      {/* About Section Overlay */}
      <AnimatePresence>
        {isAboutOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[var(--bg-primary)] overflow-y-auto px-6 md:px-12"
          >
            {/* Background Accent */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <button 
              onClick={() => setIsAboutOpen(false)}
              className="fixed top-6 right-6 md:top-8 md:right-8 w-12 h-12 rounded-full bg-[var(--text-main)]/10 backdrop-blur-md flex items-center justify-center text-[var(--text-main)] hover:bg-primary hover:text-white transition-all z-[110]"
            >
              <X size={24} />
            </button>

            <div className="max-w-4xl mx-auto w-full pt-24 pb-20 relative z-[105]">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-20"
              >
                <div id="our-story" className="text-center pt-8">
                  <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Our Story</span>
                  <h2 className="text-5xl md:text-8xl font-black font-display text-[var(--text-main)] leading-[0.9] tracking-tighter">
                    Engineering <br /> the <span className="text-orange-500">Impossible.</span>
                  </h2>
                </div>

                {/* Who We Are */}
                <div className="space-y-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] border-l-4 border-primary pl-6">Who We Are</h3>
                  <div className="space-y-6 text-[var(--text-muted)] text-base md:text-lg leading-relaxed">
                    <p>
                      Founded in 2026 May-1, <span className="text-[var(--text-main)] font-bold">BISONIX</span> was built with a shared vision — to push the limits of autonomous robotics and intelligent systems.
                    </p>
                    <p>
                      Started by a team of passionate innovators — <span className="text-primary font-bold">Jayaveer, Nikhitha, and Girish</span> — BISONIX brings together creativity, engineering precision, and real-world problem solving.
                    </p>
                    <p>
                      We specialize in high-performance drones, intelligent RC systems, and precision 3D solutions designed for creators, students, and professionals.
                    </p>
                  </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">Our Mission</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      To empower the next generation of innovators with powerful, accessible technology that bridges hardware and artificial intelligence.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-main)]">Our Vision</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed">
                      To build a future where intelligent machines enhance human capability across industries, education, and everyday life.
                    </p>
                  </div>
                </div>

                {/* Core Values */}
                <div className="pt-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-10 text-center">Core Values</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { title: "Innovation First", desc: "We constantly experiment, build, and evolve." },
                      { title: "Precision Engineering", desc: "Every product is designed for performance and reliability." },
                      { title: "Community Driven", desc: "We grow with our users — builders, students, and creators." },
                      { title: "Real-World Impact", desc: "We focus on practical solutions, not just concepts." }
                    ].map((value, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-primary/30 transition-colors">
                        <h4 className="text-primary font-bold mb-2">• {value.title}</h4>
                        <p className="text-[var(--text-muted)] text-sm">{value.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Our Team */}
                <div className="pt-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-10 text-center">Our Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { name: "Jayaveer", role: "Founder & Product Vision" },
                      { name: "Nikhitha", role: "Co-Founder & Design / Operations" },
                      { name: "Girish", role: "Co-Founder & Engineering" }
                    ].map((member, i) => (
                      <div key={i} className="text-center p-8 rounded-3xl bg-[var(--text-main)]/5 border border-[var(--border-subtle)]">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 text-2xl font-black">
                          {member.name[0]}
                        </div>
                        <h4 className="text-[var(--text-main)] font-bold text-lg mb-1">{member.name}</h4>
                        <p className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-widest">{member.role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pt-12">
                  {[
                    { icon: Target, label: 'Precision', value: '0.001s Response' },
                    { icon: Users, label: 'Engineers', value: '50+ Contributors' },
                    { icon: Zap, label: 'Performance', value: '100% Tested' },
                    { icon: Shield, label: 'Security', value: 'Advanced Systems' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-[var(--bg-secondary)] p-6 rounded-3xl border border-[var(--border-subtle)] text-center group hover:border-primary/50 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <stat.icon size={20} />
                      </div>
                      <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-[var(--text-main)] text-sm md:text-base font-black">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Technology Section */}
                <div id="technology-section" className="pt-20 space-y-12">
                  <div className="text-center">
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Innovation</span>
                    <h3 className="text-3xl md:text-5xl font-black text-[var(--text-main)] font-display">Technology Stack</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <h4 className="text-xl font-bold text-primary">Neural Core Engine</h4>
                      <p className="text-[var(--text-muted)] leading-relaxed">
                        Our proprietary <span className="text-[var(--text-main)] font-bold">BBP-V1</span> (Bionic Bridge Processor) utilizes low-latency neural mapping to synchronize hardware response with AI-driven pathfinding.
                      </p>
                      <ul className="space-y-3">
                        {['Real-time SLAM Navigation', 'Zero-Latency Torque Control', 'Adaptive Environmental Learning'].map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-primary/5 border border-primary/20 p-8 rounded-[2.5rem] relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Cpu size={120} />
                      </div>
                      <h5 className="text-primary font-black text-4xl mb-2">BBP-V1</h5>
                      <p className="text-[var(--text-main)] font-bold text-xs uppercase tracking-widest opacity-60">Neural Processing Unit</p>
                      <div className="mt-8 space-y-4">
                        <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[85%]" />
                        </div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest text-right">85% Efficiency Optimization</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Careers Section */}
                <div className="pt-20 space-y-12 bg-primary/[0.02] -mx-6 md:-mx-12 px-6 md:px-12 py-20">
                  <div className="text-center">
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Join Us</span>
                    <h3 className="text-3xl md:text-5xl font-black text-[var(--text-main)] font-display">Careers</h3>
                    <p className="text-[var(--text-muted)] mt-4 max-w-xl mx-auto">We're looking for the boldest minds to help us build the future of autonomous machines.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: "AI/ML Engineer", dept: "Robotics Core" },
                      { title: "Hardware Architect", dept: "Physical Systems" },
                      { title: "Industrial Designer", dept: "Creative" }
                    ].map((job, i) => (
                      <div key={i} className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-primary transition-all group">
                        <h4 className="text-[var(--text-main)] font-bold text-lg mb-2 group-hover:text-primary transition-colors">{job.title}</h4>
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-6">{job.dept}</p>
                        <button className="text-xs font-bold text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                          Apply Now <span className="text-lg">→</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="text-center pt-8">
                    <p className="text-[var(--text-muted)] text-sm italic">Don't see your role? Email us at <span className="text-primary font-bold not-italic">careers@bisonix.com</span></p>
                  </div>
                </div>

                {/* Contact Section */}
                <div id="contact-section" className="pt-20 pb-12 space-y-12">
                  <div className="text-center">
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Get in Touch</span>
                    <h3 className="text-3xl md:text-5xl font-black text-[var(--text-main)] font-display">Contact Us</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-6">
                        <Target size={24} />
                      </div>
                      <h4 className="text-[var(--text-main)] font-bold mb-2">Global HQ</h4>
                      <p className="text-[var(--text-muted)] text-sm">Innovation Hub, Level 42<br />Tech Valley, CA 94043</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-6">
                        <Users size={24} />
                      </div>
                      <h4 className="text-[var(--text-main)] font-bold mb-2">Business Inquiries</h4>
                      <p className="text-[var(--text-muted)] text-sm">partners@bisonix.com<br />+1 (555) 0123 4567</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mx-auto mb-6">
                        <Zap size={24} />
                      </div>
                      <h4 className="text-[var(--text-main)] font-bold mb-2">Technical Support</h4>
                      <p className="text-[var(--text-muted)] text-sm">support@bisonix.com<br />Help Center: bisonix.co/help</p>
                    </div>
                  </div>
                </div>

                <div className="pt-12 text-center pb-20">
                  <button 
                    onClick={() => setIsAboutOpen(false)}
                    className="px-12 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-primary/20"
                  >
                    Back to Ecosystem
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
