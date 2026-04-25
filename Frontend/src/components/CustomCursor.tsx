import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('.cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <>
      <motion.div
        style={{
          translateX: cursorX,
          translateY: cursorY,
        }}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary z-[9999] pointer-events-none hidden lg:block transition-transform duration-300 ${
          isHovering ? 'scale-150 bg-primary/10' : 'scale-100'
        }`}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full" />
        
        {/* Crosshair lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-2 bg-primary/50" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px w-2 bg-primary/50" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-2 bg-primary/50" />
      </motion.div>

      <motion.div
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.5 }}
        className="fixed top-0 left-0 w-2 h-2 bg-primary rounded-full z-[9999] pointer-events-none hidden lg:block"
      />
    </>
  );
}
