import { motion } from 'framer-motion';
import { ExternalLink, Cpu, HardDrive, Rocket } from 'lucide-react';

const projects = [
  {
    title: "Autonomous Warehouse Swarm",
    client: "Logistics Pro Systems",
    desc: "Engineered a fleet of 50 custom-printed robotic bases with integrated SLAM navigation.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600",
    video: "https://cdn.pixabay.com/vimeo/459033324/factory-50601.mp4?width=1280&hash=889f53e6b8c8d8b8e8d8b8e8d8b8e8d8b8e8d8b8",
    stats: "40% Efficiency Increase"
  },
  {
    title: "Precision Bio-Tech Manipulator",
    client: "Auro Lab Research",
    desc: "Developed a 6-axis carbon fiber arm with sub-0.5mm precision for automated lab testing.",
    image: "https://images.unsplash.com/photo-1558444479-2706fa58b8c6?auto=format&fit=crop&q=80&w=600",
    video: "https://cdn.pixabay.com/vimeo/345155998/robot-24838.mp4?width=1280&hash=b8e8d8b8e8d8b8e8d8b8e8d8b8e8d8b8e8d8b8e8",
    stats: "0.1mm Accuracy"
  }
];

export default function Portfolio() {
  return (
    <section className="relative w-full bg-[var(--bg-primary)] py-32 px-6 overflow-hidden transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-4"
            >
              Industrial Solutions
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black font-display text-[var(--text-main)] tracking-tighter leading-tight"
            >
              Proven <span className="text-primary italic">Expertise</span>.
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[var(--text-muted)] text-lg max-w-sm"
          >
            Real-world deployments of Bisonix technology across diverse industrial sectors.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto px-4">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="w-full sm:w-[260px] group cursor-pointer"
            >
              <div className="relative aspect-[9/16] rounded-[2.5rem] overflow-hidden mb-6 border border-[var(--border-subtle)] shadow-xl bg-black">
                {/* Fallback Image */}
                <img src={p.image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                
                {/* Hover Video */}
                <video 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  src={p.video}
                  muted
                  loop
                  autoPlay
                  playsInline
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
                  <div className="bg-primary/20 backdrop-blur-xl px-2 py-1 rounded-md border border-primary/20 text-primary text-[7px] font-bold uppercase tracking-widest w-fit mb-2">
                    {p.stats}
                  </div>
                  <p className="text-primary text-[7px] font-bold uppercase tracking-widest mb-1">{p.client}</p>
                  <h3 className="text-base font-black text-white font-display leading-tight">
                    {p.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
