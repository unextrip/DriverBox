import React from 'react';
import { PlatformId, PlatformRecord } from '../types';
import { PLATFORMS_CONFIG } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { Check, Edit2, Clock, MapPin, EyeOff, Plus } from 'lucide-react';
import { sounds } from '../utils/sound';

interface PlatformSwitchesProps {
  platforms: Record<PlatformId, PlatformRecord>;
  currencySymbol: string;
  onTogglePlatform: (id: PlatformId) => void;
  onEditPlatform: (id: PlatformId) => void;
}

export const PlatformSwitches: React.FC<PlatformSwitchesProps> = ({
  platforms,
  currencySymbol,
  onTogglePlatform,
  onEditPlatform,
}) => {
  const platformKeys: PlatformId[] = ['uber', 'didi', 'indrive', 'private'];

  const handleToggle = (id: PlatformId) => {
    sounds.playTap();
    onTogglePlatform(id);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <span>Plataformas Activas de Hoy</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Enciende solo las que manejas hoy; las apagadas no ensucian tus cuentas.
          </p>
        </div>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {Object.values(platforms).filter((p) => p.enabled).length} de 4 activas
        </span>
      </div>

      {/* Grid of Platform Switches */}
      <div className="grid grid-cols-2 gap-2.5">
        {platformKeys.map((pId) => {
          const config = PLATFORMS_CONFIG[pId];
          const record = platforms[pId] || { enabled: false, amount: 0, hours: 0, trips: 0 };
          const isActive = record.enabled;

          return (
            <div
              key={pId}
              className={`relative rounded-xl border transition-all duration-200 p-3 flex flex-col justify-between ${
                isActive
                  ? 'bg-[#161B2E] border-slate-700 shadow-md shadow-black/30'
                  : 'bg-[#0D1220]/60 border-slate-800/60 opacity-60'
              }`}
            >
              {/* Header with Switch */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      pId === 'uber'
                        ? 'bg-black text-white border border-zinc-700'
                        : pId === 'didi'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                        : pId === 'indrive'
                        ? 'bg-[#B2E234] text-zinc-950 font-black'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {pId === 'uber' ? 'U' : pId === 'didi' ? 'D' : pId === 'indrive' ? 'iN' : 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-white leading-tight">{config.name}</h3>
                    <p className="text-[10px] text-slate-400 truncate max-w-[80px]">
                      {isActive ? `${record.trips || 0} viajes` : 'Inactiva'}
                    </p>
                  </div>
                </div>

                {/* Switch Control */}
                <button
                  type="button"
                  onClick={() => handleToggle(pId)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                    isActive ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Activar o desactivar ${config.name}`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                      isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Amount and Stats or Inactive notice */}
              <div className="mt-3 pt-2 border-t border-slate-800/80">
                {isActive ? (
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Ingreso Neto</span>
                      <span className="text-sm font-extrabold text-emerald-400 font-mono">
                        {formatCurrency(record.amount, currencySymbol)}
                      </span>
                    </div>

                    <button
                      onClick={() => onEditPlatform(pId)}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Editar ingreso de plataforma"
                      aria-label={`Editar monto de ${config.name}`}
                    >
                      <Edit2 className="w-3 h-3 text-blue-400" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-slate-500 py-0.5">
                    <span className="flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      <span>Oculta hoy</span>
                    </span>
                    <button
                      onClick={() => handleToggle(pId)}
                      className="text-blue-400 hover:underline text-[10px] font-semibold"
                    >
                      Activar
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
