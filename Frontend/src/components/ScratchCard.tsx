import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ScratchCardProps {
  code: string;
  amount: number;
  onReveal: () => void;
  initialIsRevealed?: boolean;
}

export default function ScratchCard({ code, amount, onReveal, initialIsRevealed = false }: ScratchCardProps) {
  const [isRevealed, setIsRevealed] = useState(initialIsRevealed);
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with silver scratch layer
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some "scratch" texture
    ctx.fillStyle = '#A0A0A0';
    for (let i = 0; i < 100; i++) {
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    ctx.font = 'bold 14px Inter';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2 + 5);
  }, []);

  const getPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const scratch = (e: any) => {
    if (!isDrawing || isRevealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Check if enough is scratched
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparent++;
    }
    
    if (transparent > (pixels.length / 4) * 0.5) {
      setIsRevealed(true);
      onReveal();
    }
  };

  return (
    <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-orange-600 flex flex-col items-center justify-center border-4 border-white/20 shadow-xl">
      <div className="text-center">
        <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Coupon Unlocked</p>
        <h4 className="text-2xl font-black text-white font-display">{code}</h4>
        <p className="text-sm font-bold text-white/90 mt-1">₹{amount} OFF</p>
        
        {isRevealed && (
          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              navigator.clipboard.writeText(code);
              showToast('Coupon code copied!', 'success');
            }}
            className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-tighter transition-all flex items-center gap-1.5 mx-auto"
          >
            <Copy size={12} />
            Copy Code
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {!isRevealed && (
          <motion.canvas
            ref={canvasRef}
            exit={{ opacity: 0, scale: 1.1 }}
            width={300}
            height={150}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            onMouseDown={() => setIsDrawing(true)}
            onMouseUp={() => setIsDrawing(false)}
            onMouseMove={scratch}
            onTouchStart={() => setIsDrawing(true)}
            onTouchEnd={() => setIsDrawing(false)}
            onTouchMove={scratch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
