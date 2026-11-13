import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = 'bg-white border-[#26752C] text-[#14532D]';
        let IconComponent = CheckCircle2;
        let iconColor = 'text-[#26752C]';

        if (toast.type === 'error') {
          bgColor = 'bg-white border-red-500 text-red-900';
          IconComponent = AlertCircle;
          iconColor = 'text-red-500';
        } else if (toast.type === 'info') {
          bgColor = 'bg-white border-[#F4770B] text-[#171717]';
          IconComponent = Info;
          iconColor = 'text-[#F4770B]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border-l-4 ${bgColor} transition-all duration-300 animate-in slide-in-from-right`}
          >
            <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 pr-2">
              <h5 className="font-bold text-sm text-[#171717] leading-tight">{toast.title}</h5>
              <p className="text-xs text-[#666666] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
