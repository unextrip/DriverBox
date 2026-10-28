import React from 'react';
import { X, Bell, Clock, Info, CheckCircle, Volume2, Sparkles, Send } from 'lucide-react';
import { NotificationSettings } from '../types';
import { sounds } from '../utils/sound';

interface PushNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationSettings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
  onTriggerSimulatedNotification: () => void;
}

export const PushNotificationModal: React.FC<PushNotificationModalProps> = ({
  isOpen,
  onClose,
  notificationSettings,
  onUpdateSettings,
  onTriggerSimulatedNotification,
}) => {
  if (!isOpen) return null;

  const handleToggle = () => {
    sounds.playTap();
    onUpdateSettings({
      ...notificationSettings,
      enabled: !notificationSettings.enabled,
    });
  };

  const handleTestNow = () => {
    sounds.playNotificationPing();
    onTriggerSimulatedNotification();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0A0F1D] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161B2E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Recordatorio Diario de Caja
              </h2>
              <p className="text-xs text-slate-400">
                Alerta push configurada a las 9:00 PM
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Active Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#161B2E] border border-slate-800">
            <div>
              <span className="text-sm font-bold text-white block">
                Notificación Push Diaria
              </span>
              <span className="text-xs text-slate-400">
                Programada diariamente a las {notificationSettings.time || '21:00'}
              </span>
            </div>

            <button
              onClick={handleToggle}
              className={`w-12 h-7 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                notificationSettings.enabled ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`block w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                  notificationSettings.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Time Selector */}
          <div className="p-3.5 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Hora de la Alerta (Por defecto 9:00 PM / 21:00)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={notificationSettings.time}
                onChange={(e) =>
                  onUpdateSettings({ ...notificationSettings, time: e.target.value })
                }
                className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Message Preview Card */}
          <div className="p-3.5 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              Texto del Mensaje:
            </span>
            <div className="p-3 rounded-xl bg-[#0A0F1D] border border-slate-700/80 text-xs text-slate-200 italic leading-relaxed">
              "{notificationSettings.customMessage}"
            </div>

            {/* Friendly Non-Obligatory Clarification */}
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-300 leading-normal">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Aclaración importante:</strong> Esta notificación no cierra caja por obligación. Es únicamente un recordatorio amigable para que cuadres tus ingresos cuando llegues tranquilo a casa.
              </span>
            </div>
          </div>

          {/* Simulate Action Button */}
          <button
            onClick={handleTestNow}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>Simular Notificación Push (Probar Banner 9:00 PM)</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#161B2E]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
