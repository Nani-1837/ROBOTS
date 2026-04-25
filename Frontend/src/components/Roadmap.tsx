import { motion } from 'framer-motion';
import { Target, Flag, Rocket, Globe, Zap } from 'lucide-react';

const roadmap = [
  {
    year: "2024 Q3",
    title: "AI Integration",
    desc: "Launch of BISON-AI for real-time model analysis and automated custom quoting.",
    icon: <Zap size={20} />,
    status: "ongoing"
  },
  {
    year: "2024 Q4",
    title: "Eco-Print Materials",
    desc: "Introducing 100% biodegradable carbon-fiber filaments and recycled metal printing.",
    icon: <Flag size={20} />,
    status: "upcoming"
  },
  {
    year: "2025 Q1",
    title: "Swarm Hub Launch",
    desc: "A decentralized cloud platform for controlling multi-robot swarm fleets remotely.",
    icon: <Rocket size={20} />,
    status: "upcoming"
  },
  {
    year: "2025 Q3",
    title: "Global Manufacturing",
    desc: "Opening automated micro-factories in Germany and USA for faster worldwide shipping.",
    icon: <Globe size={20} />,
    status: "upcoming"
  }
];

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
            <Target size={32} />
          </motion.div>
          <h2 className="text-4xl md:text-7xl font-black font-display text-[var(--text-main)] mb-6 tracking-tighter leading-tight">
            The Future <span className="text-primary italic">Roadmap</span>.
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-2xl mx-auto">
            Our strategic vision for the next era of robotics and industrial 3D manufacturing.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent hidden md:block" />

          {roadmap.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group"
            >
              <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-8 rounded-[2.5rem] relative z-10 hover:border-primary/40 transition-all duration-500 h-full flex flex-col shadow-xl">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 ${
                  item.status === 'ongoing' ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-[var(--bg-primary)] text-[var(--text-muted)] group-hover:text-primary'
                }`}>
                  {item.icon}
                </div>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-2">{item.year}</p>
                <h3 className="text-xl font-black text-[var(--text-main)] font-display mb-4">{item.title}</h3>
                <p className="text-[var(--text-muted)] text-xs leading-relaxed">
                  {item.desc}
                </p>

                {/* Status Indicator */}
                <div className="mt-8 flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'ongoing' ? 'bg-primary animate-pulse' : 'bg-[var(--text-muted)] opacity-30'}`} />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                    {item.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
