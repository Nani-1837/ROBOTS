import { motion } from 'framer-motion';
import { ChevronRight, GraduationCap, ArrowUpRight, Star, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CollegeProjectsViewProps {
  onBack: () => void;
  onProjectClick: (project: any) => void;
}


const ProjectCard = ({ project, delay, onProjectClick }: { project: any, delay: number, onProjectClick: (project: any) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[var(--bg-primary)] rounded-[2.5rem] border border-[var(--border-subtle)] overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] bg-[var(--bg-secondary)]/30 overflow-hidden flex items-center justify-center">
        <img 
          src={project.images?.[0] || project.image} 
          alt={project.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-primary/10 flex items-center gap-1">
          <Star size={10} className="text-orange-500 fill-orange-500" />
          <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Academic Grade</p>
        </div>
      </div>

      <div className="p-6 sm:p-8 flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-primary/5 text-primary rounded text-[9px] font-bold uppercase tracking-widest border border-primary/10">
              {project.category || 'Engineering'}
            </span>
            <span className="w-1 h-1 bg-[var(--text-muted)] rounded-full opacity-30" />
            <span className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-widest">{project.difficultyLevel || 'Intermediate'}</span>
          </div>
          <h3 className="text-2xl font-black text-[var(--text-main)] font-display leading-tight group-hover:text-primary transition-colors">
            {project.name}
          </h3>
          <p className="text-[var(--text-muted)] text-sm line-clamp-2 italic">
            "{project.tagline || 'Innovative robotics solution for academic research.'}"
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-[var(--text-main)] font-display tracking-tight">₹{project.price.toLocaleString()}</span>
            {project.originalPrice && (
              <span className="text-[var(--text-muted)] line-through text-xs font-medium mb-1.5">₹{project.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => onProjectClick(project)}
              className="flex-[1.5] py-4 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
            >
              Explore Project <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
            {project.demoLink && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(project.demoLink, '_blank');
                }}
                className="flex-1 py-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-main)] font-black text-[10px] uppercase tracking-widest hover:bg-[var(--bg-primary)] transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Real-Time Demo
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function CollegeProjectsView({ onBack, onProjectClick }: CollegeProjectsViewProps) {

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/college-projects');
        const data = await response.json();
        if (response.ok) {
          setProjects(data);
        }
      } catch (error) {
        console.error('Error fetching college projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8 transition-colors duration-400"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-12">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1 font-bold">
            Home
          </button>
          <ChevronRight size={12} />
          <span className="text-[var(--text-main)] font-black uppercase tracking-widest text-[10px]">Academic Catalog</span>
        </div>

        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <GraduationCap size={14} /> University Support Program
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black font-display text-[var(--text-main)] mb-6 leading-[0.85] tracking-tighter">
            College <span className="text-primary italic">Projects</span> Support.
          </h1>
          <p className="text-[var(--text-muted)] max-w-2xl text-xl font-medium leading-relaxed">
            Premium hardware kits and expert guidance designed specifically for engineering excellence and research breakthroughs.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <RefreshCcw className="animate-spin text-primary" size={40} />
            <p className="text-[var(--text-muted)] font-bold animate-pulse">Loading Academic Catalog...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <ProjectCard 
                key={project._id} 
                project={project} 
                delay={i * 0.1} 
                onProjectClick={onProjectClick}
              />
            ))}
          </div>
        ) : (
          <div className="p-20 text-center border-2 border-dashed border-[var(--border-subtle)] rounded-[3rem] bg-[var(--bg-secondary)]/30">
            <GraduationCap size={64} className="mx-auto text-[var(--text-muted)] mb-6 opacity-20" />
            <h3 className="text-2xl font-black mb-2">No Projects Listed Yet</h3>
            <p className="text-[var(--text-muted)]">Check back soon for our latest academic research kits.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

