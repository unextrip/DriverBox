import React from 'react';
import { Bell, Settings, Gauge, Sparkles, Calendar } from 'lucide-react';
import { getCurrentDateFormatted, getGreeting } from '../utils/formatters';
import { UserSettings } from '../types';

interface HeaderProps {
  settings: UserSettings;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onTriggerCelebration: () => void;
  isGoalReached: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenSettings,
  onOpenNotifications,
  onTriggerCelebration,
  isGoalReached,
}) => {
  const dateInfo = getCurrentDateFormatted();
  const greeting = getGreeting();

  return (
    <header className="sticky top-0 z-30 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Branding & Driver Saludo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 p-[1.5px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#0A0F1D] rounded-[10px] flex items-center justify-center">
                <Gauge className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            {isGoalReached && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">DriverBox</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate max-w-[170px]">
              {greeting}, <strong className="text-slate-200">{settings.driverName.split(' ')[0]}</strong> 🚗
            </p>
          </div>
        </div>

        {/* Quick Actions (Notifications, Goal Test, Settings) */}
        <div className="flex items-center gap-2">
          {/* Quick celebration trigger */}
          <button
            onClick={onTriggerCelebration}
            title="Celebrar meta"
            className="p-2 rounded-xl bg-[#161B2E] border border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800/80 transition-all active:scale-95"
            aria-label="Celebrar meta"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Daily 9 PM Notification Button */}
          <button
            onClick={onOpenNotifications}
            title="Recordatorio diario 9:00 PM"
            className="relative p-2 rounded-xl bg-[#161B2E] border border-slate-800 text-blue-400 hover:text-blue-300 hover:bg-slate-800/80 transition-all active:scale-95"
            aria-label="Recordatorio diario 9:00 PM"
          >
            <Bell className="w-4 h-4" />
            {settings.notification.enabled && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            )}
          </button>

          {/* Quick Settings */}
          <button
            onClick={onOpenSettings}
            title="Configuración rápida"
            className="p-2 rounded-xl bg-[#161B2E] border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all active:scale-95"
            aria-label="Configuración rápida"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date badge */}
      <div className="max-w-md mx-auto mt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-1 text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{dateInfo.full}</span>
        </div>
        <span className="text-slate-500">{settings.vehicleModel}</span>
      </div>
    </header>
  );
};
