import { motion } from 'framer-motion';
import { Rocket, Globe, Zap } from 'lucide-react';



export default function Roadmap() {
  return (
    <section className="relative w-full bg-[var(--bg-primary)] py-32 px-6 overflow-hidden transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20"
          >
            <Rocket size={32} />
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-black font-display text-[var(--text-main)] mb-6 tracking-tighter leading-tight">
            The Future <span className="text-primary italic">Coming Soon</span>.
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            We are engineering the next generation of autonomous systems. Stay tuned for the evolution.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Neural Architecture", 
              desc: "Deep learning models optimized for real-time edge computing on robotic platforms.",
              icon: <Zap size={24} />,
              image: "/images/roadmap/neural.png"
            },
            { 
              title: "Swarm Intelligence", 
              desc: "Cooperative multi-agent systems for complex industrial and logistics operations.",
              icon: <Globe size={24} />,
              image: "/images/roadmap/swarm.png"
            },
            { 
              title: "Quantum Actuators", 
              desc: "Next-gen motor systems with unprecedented precision and energy efficiency.",
              icon: <Rocket size={24} />,
              image: "/images/roadmap/quantum.png"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              {/* Glowing Background Effect */}
              <div className="absolute inset-0 bg-primary/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full -z-10" />
              
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-0 rounded-[2.5rem] relative z-10 hover:border-primary/50 transition-all duration-500 h-full flex flex-col overflow-hidden shadow-2xl group-hover:-translate-y-2">
                {/* 1920x1080 Image Container */}
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] via-transparent to-transparent" />
                  
                  <div className="absolute top-6 right-6 w-12 h-12 bg-primary/10 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-primary shadow-xl">
                    {item.icon}
                  </div>
                </div>

                <div className="p-8 pt-2 text-center flex flex-col items-center flex-1">
                  <h3 className="text-2xl font-black text-[var(--text-main)] font-display mb-4">{item.title}</h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">
                    {item.desc}
                  </p>

                  <div className="mt-auto">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
                      <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
