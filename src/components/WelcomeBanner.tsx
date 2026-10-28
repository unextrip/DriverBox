import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Zap, ChevronUp, ChevronDown } from 'lucide-react';

interface WelcomeBannerProps {
  driverName: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ driverName }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#161B2E] via-[#111728] to-[#0D1220] border border-blue-500/20 p-4 shadow-xl shadow-black/40">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-[11px] font-semibold text-blue-400">
              <Zap className="w-3 h-3 text-blue-400 animate-pulse" />
              <span>Gestión Inteligente de Turno</span>
            </div>
            
            {/* Required Slogan */}
            <h1 className="text-lg font-extrabold text-white leading-snug tracking-tight">
              "Tu Negocio Sobre Ruedas: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">Controla, Suma y Gasta Inteligente</span>"
            </h1>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white transition-colors"
            title={isExpanded ? 'Contraer' : 'Ver más'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#0A0F1D]/60 border border-slate-800/60">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">Suma automática de plataformas activas</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#0A0F1D]/60 border border-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-slate-300">Deducción de combustible y alimentos</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
