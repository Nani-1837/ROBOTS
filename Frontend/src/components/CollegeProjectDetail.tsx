import { motion } from 'framer-motion';
import { 
  ChevronRight, ShoppingCart, CheckCircle2, Cpu, 
  BookOpen, Video, MessageSquare, Star, ArrowLeft,
  Trophy, Zap, ShieldCheck, Clock
} from 'lucide-react';
import { useState } from 'react';

import { useCartStore } from '../lib/store';

interface CollegeProjectDetailProps {
  project: any;
  onBack: () => void;
}

export default function CollegeProjectDetail({ project, onBack }: CollegeProjectDetailProps) {
  const [activeImage, setActiveImage] = useState(project.images?.[0] || project.image);
  const { addItem } = useCartStore();

  const addToCart = () => {
    addItem({
      id: project._id,
      name: project.name,
      price: project.price,
      image: project.images?.[0] || project.image,
      qty: 1
    });
  };

  const openWhatsApp = () => {
    const message = `Hi Bisonix, I'm interested in the project: ${project.name}. Can I get more details?`;
    window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-20 px-4 sm:px-8 transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm mb-12">
          <button onClick={onBack} className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Projects
          </button>
          <ChevronRight size={12} />
          <span className="text-[var(--text-main)] font-bold">{project.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left Side: Images */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-2xl relative"
            >
              <img 
                src={activeImage} 
                alt={project.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-xl border border-primary/10">
                   Academic Grade A+
                </span>
              </div>
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {project.images?.map((img: string, i: number) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Support Highlight */}
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/10 to-orange-500/5 border border-primary/10">
              <h4 className="flex items-center gap-2 text-primary font-bold mb-4">
                <MessageSquare size={20} /> 1:1 Project Support
              </h4>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Stuck with code? Need help with connections? Our experts are available on WhatsApp for instant debugging and viva preparation.
              </p>
              <button 
                onClick={openWhatsApp}
                className="mt-6 text-sm font-bold text-primary hover:underline flex items-center gap-1"
              >
                Talk to Expert <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Side: Information */}
          <div className="space-y-10">
            {/* Hero Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-primary font-bold text-sm uppercase tracking-[0.2em]">{project.category || 'Engineering Project'}</span>
                <h1 className="text-4xl md:text-6xl font-black font-display text-[var(--text-main)] leading-[1.1] tracking-tighter">
                  {project.name}
                </h1>
                <p className="text-xl text-[var(--text-muted)] font-medium italic">
                  "{project.tagline || 'Innovation begins with small steps.'}"
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="px-4 py-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span className="text-sm font-bold">Time: {project.estimatedTime || '3-5 Days'}</span>
                </div>
                <div className="px-4 py-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] flex items-center gap-2">
                  <Trophy size={16} className="text-orange-500" />
                  <span className="text-sm font-bold">Difficulty: {project.difficultyLevel || 'Intermediate'}</span>
                </div>
              </div>

              <div className="flex items-end gap-4">
                <span className="text-5xl font-black text-[var(--text-main)] font-display">₹{project.price.toLocaleString()}</span>
                {project.originalPrice && (
                  <span className="text-xl text-[var(--text-muted)] line-through mb-1">₹{project.originalPrice.toLocaleString()}</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={addToCart}
                  className="flex-1 py-5 rounded-2xl bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-bold text-lg shadow-2xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <Zap size={20} /> Get Full Kit
                </button>
                <button 
                  onClick={openWhatsApp}
                  className="px-8 py-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-main)] font-bold hover:bg-white transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <MessageSquare size={20} className="text-green-500" /> WhatsApp Support
                </button>
              </div>
            </motion.div>

            {/* What You Will Build */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black font-display text-[var(--text-main)]">What You Will <span className="text-primary">Build</span></h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(project.whatYouWillBuild || [
                  'Autonomous Navigation System',
                  'Obstacle Avoidance Logic',
                  'Gesture Recognition Control',
                  'Integrated Sensor Suite'
                ]).map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)]">
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                    <span className="text-sm font-medium text-[var(--text-main)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black font-display text-[var(--text-main)] flex items-center gap-2">
                <Cpu size={24} className="text-primary" /> Technical Core
              </h3>
              <div className="p-6 rounded-[2rem] bg-slate-900 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  {Object.entries(project.techStack || {
                    'Microcontroller': 'Arduino / ESP32',
                    'Sensors': 'Ultrasonic / IR / MPU6050',
                    'Actuators': 'High-Torque DC Motors',
                    'Power': 'Li-ion Rechargeable Pack'
                  }).map(([key, value]: any, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{key}</p>
                      <p className="text-sm font-medium opacity-90">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections Tabs/Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-20 border-t border-[var(--border-subtle)]">
          {/* What You Get */}
          <div className="space-y-6">
            <div className="p-3 bg-primary/10 rounded-2xl w-fit">
              <BookOpen size={32} className="text-primary" />
            </div>
            <h3 className="text-3xl font-black font-display">What's in the <span className="text-primary">Box?</span></h3>
            <ul className="space-y-4">
              {(project.whatYouWillGet || [
                'Complete Hardware Kit',
                'Source Code (Ready to Upload)',
                'Circuit Diagram & Schematics',
                'Documentation Report (PDF)',
                'Presentation Slides (PPT)',
                'Step-by-Step Setup Video'
              ]).map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[var(--text-main)] font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Use Cases */}
          <div className="space-y-6">
            <div className="p-3 bg-orange-500/10 rounded-2xl w-fit">
              <Trophy size={32} className="text-orange-500" />
            </div>
            <h3 className="text-3xl font-black font-display">Perfect <span className="text-orange-500">For</span></h3>
            <div className="space-y-3">
              {(project.useCases || [
                'Final Year Engineering Project',
                'Research & Lab Prototypes',
                'Robotics Competitions',
                'Personal Skill Development'
              ]).map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <Star size={16} className="text-orange-400 fill-orange-400" />
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Section */}
          <div className="space-y-6">
            <div className="p-3 bg-blue-500/10 rounded-2xl w-fit">
              <Video size={32} className="text-blue-500" />
            </div>
            <h3 className="text-3xl font-black font-display">Real-Time <span className="text-blue-500">Demo</span></h3>
            <div className="aspect-video rounded-[2rem] bg-slate-900 flex items-center justify-center group cursor-pointer overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-all">
                  <Video size={24} className="text-white fill-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white text-xs font-bold uppercase tracking-widest">Watch Project in Action</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus / Urgency Section */}
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-950 p-12 text-center text-white mb-20">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
          </div>
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <Zap size={12} className="fill-current" /> Limited Support Slots
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-display leading-tight">
              Only 20 Students per batch for <span className="text-primary italic">Personal Guidance.</span>
            </h2>
            <p className="text-slate-400 text-lg">
              We ensure every student gets enough time for doubt clearing and viva preparation. Book your slot now!
            </p>
            <div className="pt-4">
              <button 
                onClick={openWhatsApp}
                className="px-12 py-5 bg-primary hover:bg-orange-600 text-white rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20"
              >
                Reserve Your Project Slot
              </button>
            </div>
          </div>
        </div>

        {/* Final CTA Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-12 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[3rem]">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-100">
               <ShieldCheck size={40} className="text-primary" />
            </div>
            <div>
              <h4 className="text-2xl font-black">Ready to Excel?</h4>
              <p className="text-[var(--text-muted)]">Get everything you need to boost your academic scores.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <p className="text-xs font-bold text-[var(--text-muted)] uppercase">Starts from</p>
               <p className="text-2xl font-black text-primary">₹{project.price.toLocaleString()}</p>
             </div>
             <button 
              onClick={addToCart}
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-primary transition-all flex items-center gap-2"
             >
               <ShoppingCart size={18} /> Buy Kit Now
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
