import React from 'react';
import { useStore } from '../../store/useStore';
import { X, AlertCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const toasts = useStore(state => state.toasts);
  const removeToast = useStore(state => state.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[99999] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className="flex items-center gap-3 bg-[#2d2d2d] border border-[#1d1d1d] shadow-lg rounded px-4 py-2 text-white font-sans text-sm pointer-events-auto min-w-[300px] animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {toast.type === 'error' ? <AlertCircle size={16} className="text-[#ff4a4a]" /> : <Info size={16} className="text-[#4aa5ff]" />}
          <div className="flex-1">{toast.message}</div>
          <button 
            onClick={() => removeToast(toast.id)}
            className="text-[#888] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
