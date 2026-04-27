import { motion } from 'framer-motion';
import { Plane, Car, Cuboid, Zap, Cpu, ShieldCheck } from 'lucide-react';



// Import images
const aiDroneImg = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282489/bisonix_assets/AI-Powered_Drones.jpg";
const highPerfCarImg = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282490/bisonix_assets/High-Performance_RC_Vehicles.jpg";
const precision3DImg = "https://res.cloudinary.com/dqp0zkagb/image/upload/f_auto,q_auto/v1777282491/bisonix_assets/Precision_3D_Models.jpg";

export default function Features() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  } as const;

  return (
    <section id="about" className="relative w-full bg-[var(--bg-primary)] py-20 px-6 overflow-hidden transition-colors duration-400">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[var(--text-main)]/10 to-transparent" />
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Trusted By Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-32 px-4"
        >
          <p className="text-center text-[10px] font-black tracking-[0.3em] text-[var(--text-muted)] uppercase mb-12 opacity-80">
            Trusted by innovative teams worldwide
          </p>
          
          <div className="relative">
            {/* Gradient Overlays for smooth fade */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
            
            <div className="flex overflow-hidden py-10 border-y border-[var(--border-subtle)] relative">
              <motion.div 
                animate={{ x: [0, -1035] }}
                transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                className="flex items-center gap-24 min-w-max pr-24 transition-all duration-500"
              >
                {/* Duplicated list for seamless scrolling */}
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-24">
                    <span className="text-xl font-display font-black flex items-center gap-3 tracking-tighter"><Cpu size={24} className="text-primary"/> TECHNOVA</span>
                    <span className="text-xl font-display font-black flex items-center gap-3 tracking-tighter"><Zap size={24} className="text-blue-500"/> AERODYN</span>
                    <span className="text-xl font-display font-black flex items-center gap-3 tracking-tighter"><Cuboid size={24} className="text-purple-500"/> POLYGEN</span>
                    <span className="text-xl font-display font-black flex items-center gap-3 tracking-tighter"><ShieldCheck size={24} className="text-green-500"/> SECURE-R</span>
                    <span className="text-xl font-display font-black flex items-center gap-3 tracking-tighter"><Plane size={24} className="text-orange-500"/> SKYTECH</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-[var(--text-main)] mb-6"
          >
            Build the Future of <span className="text-orange-500">Autonomous Machines</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[var(--text-muted)] max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
          >
            High-performance drones, intelligent RC systems, and precision 3D models — powered by next-gen AI.
          </motion.p>
        </div>

        {/* Feature Grid - Side by Side */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {/* Card 1: Drones */}
          <motion.div variants={itemVariants}>
            <div className="bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-subtle)] overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
              {/* Image Section */}
              <div className="relative aspect-[1920/1080] bg-[var(--bg-secondary)]/30 overflow-hidden flex items-center justify-center">
                <img 
                  src={aiDroneImg} 
                  alt="AI Drone" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Content Section */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col space-y-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Plane size={16} />
                    </div>
                    <span className="px-2 py-0.5 bg-primary/5 text-primary rounded text-[9px] font-bold uppercase tracking-widest border border-primary/10">
                      Fast. Precise. Autonomous.
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-main)] font-display leading-tight group-hover:text-primary transition-colors">
                    AI-Powered Drones
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mt-3">
                    Built for high-speed aerial intelligence and real-time tracking.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1.5 rounded-full bg-primary/5 text-[9px] font-bold text-primary border border-primary/10">30-40 km/h Speed</span>
                  <span className="px-3 py-1.5 rounded-full bg-[var(--text-main)]/5 text-[9px] font-bold text-[var(--text-muted)] border border-[var(--border-subtle)]">AI Tracking</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: RC Vehicles */}
          <motion.div variants={itemVariants}>
            <div className="bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-subtle)] overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
              {/* Image Section */}
              <div className="relative aspect-[1920/1080] bg-[var(--bg-secondary)]/30 overflow-hidden flex items-center justify-center">
                <img 
                  src={highPerfCarImg} 
                  alt="Smart RC Vehicle" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content Section */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col space-y-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Car size={16} />
                    </div>
                    <span className="px-2 py-0.5 bg-blue-500/5 text-blue-500 rounded text-[9px] font-bold uppercase tracking-widest border border-blue-500/10">
                      Ground Systems
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-main)] font-display leading-tight group-hover:text-blue-500 transition-colors">
                    High-Performance RC Vehicles
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mt-3">
                    Engineered for extreme terrain with advanced control systems.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1.5 rounded-full bg-blue-500/5 text-[9px] font-bold text-blue-500 border border-blue-500/10">All-Terrain Capability</span>
                  <span className="px-3 py-1.5 rounded-full bg-[var(--text-main)]/5 text-[9px] font-bold text-[var(--text-muted)] border border-[var(--border-subtle)]">Torque Vectoring</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: 3D Models */}
          <motion.div variants={itemVariants}>
            <div className="bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-subtle)] overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
              {/* Image Section */}
              <div className="relative aspect-[1920/1080] bg-[var(--bg-secondary)]/30 overflow-hidden flex items-center justify-center">
                <img 
                  src={precision3DImg} 
                  alt="3D Models" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content Section */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col space-y-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Cuboid size={16} />
                    </div>
                    <span className="px-2 py-0.5 bg-purple-500/5 text-purple-500 rounded text-[9px] font-bold uppercase tracking-widest border border-purple-500/10">
                      3D Design
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-main)] font-display leading-tight group-hover:text-purple-500 transition-colors">
                    Precision 3D Models
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mt-3">
                    Industry-grade designs for customization, prototyping, and repairs.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-3 py-1.5 rounded-full bg-purple-500/5 text-[9px] font-bold text-purple-500 border border-purple-500/10">STL / OBJ Formats</span>
                  <span className="px-3 py-1.5 rounded-full bg-[var(--text-main)]/5 text-[9px] font-bold text-[var(--text-muted)] border border-[var(--border-subtle)]">Industry Grade Quality</span>
                </div>
              </div>
            </div>
          </motion.div>

          
        </motion.div>



      </div>
    </section>
  );
}
