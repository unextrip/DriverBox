import React from 'react';
import { Bell, Gauge, X, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/sound';

interface NotificationToastProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOcr: () => void;
  message?: string;
  timeLabel?: string;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  isOpen,
  onClose,
  onOpenOcr,
  message = '¡Hola! Es hora de hacer caja, registra tus números de hoy cuando llegues a casa.',
  timeLabel = '9:00 PM',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-4 inset-x-3 sm:inset-x-auto sm:right-4 sm:w-96 z-50 animate-in slide-in-from-top-6 duration-300">
      <div className="rounded-2xl bg-[#161B2E]/95 border-2 border-blue-500/50 shadow-2xl shadow-black/80 backdrop-blur-md p-3.5 text-white">
        {/* Native mobile notification header */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-md bg-blue-600 flex items-center justify-center">
              <Gauge className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="font-bold text-slate-200">DriverBox</span>
            <span>•</span>
            <span className="text-blue-400 font-semibold">{timeLabel} (Programada)</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message Content */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-white leading-relaxed">
            {message}
          </p>
          <p className="text-[10px] text-slate-400 leading-normal">
            💡 Recordatorio amigable. No cierra tu caja por obligación; hazlo a tu ritmo.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            Recordar luego
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenOcr();
            }}
            className="px-3 py-1 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
          >
            <span>Hacer Caja Ahora</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
