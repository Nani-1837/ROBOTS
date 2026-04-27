import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
              className="pointer-events-auto"
            >
              <div className={`
                min-w-[280px] max-w-sm p-3 rounded-sm shadow-xl dark:shadow-none border flex items-center gap-4 backdrop-blur-2xl transition-all duration-500
                ${toast.type === 'success' ? 'border-green-500/30' : toast.type === 'error' ? 'border-red-500/30' : 'border-blue-500/30'}
                bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-white
              `}>
                <div className={`
                  w-8 h-8 rounded-sm flex items-center justify-center shrink-0 shadow-inner
                  ${toast.type === 'success' ? 'bg-green-500/10 text-green-500' : 
                    toast.type === 'error' ? 'bg-red-500/10 text-red-500' : 
                    'bg-blue-500/10 text-blue-500'}
                `}>
                  {toast.type === 'success' && <CheckCircle2 size={16} />}
                  {toast.type === 'error' && <AlertCircle size={16} />}
                  {toast.type === 'info' && <Info size={16} />}
                </div>
                
                <div className="flex-1">
                  <p className="text-[13px] font-black leading-snug tracking-tight uppercase opacity-50 mb-0.5">
                    {toast.type}
                  </p>
                  <p className="text-sm font-bold leading-tight">{toast.message}</p>
                </div>

                <button 
                  onClick={() => removeToast(toast.id)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400"
                >
                  <X size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
