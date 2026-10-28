import React, { useState } from 'react';
import { X, CheckCircle2, Clock, MapPin, DollarSign } from 'lucide-react';
import { PlatformId, PlatformRecord } from '../types';
import { PLATFORMS_CONFIG } from '../utils/constants';
import { formatCurrency } from '../utils/formatters';
import { sounds } from '../utils/sound';

interface PlatformEditModalProps {
  platformId: PlatformId | null;
  onClose: () => void;
  record: PlatformRecord;
  currencySymbol: string;
  onSave: (platformId: PlatformId, updated: PlatformRecord) => void;
}

export const PlatformEditModal: React.FC<PlatformEditModalProps> = ({
  platformId,
  onClose,
  record,
  currencySymbol,
  onSave,
}) => {
  if (!platformId) return null;
  const config = PLATFORMS_CONFIG[platformId];

  const [amount, setAmount] = useState(record.amount);
  const [hours, setHours] = useState(record.hours);
  const [trips, setTrips] = useState(record.trips);

  const handleSave = () => {
    sounds.playTap();
    onSave(platformId, {
      ...record,
      amount: Number(amount) || 0,
      hours: Number(hours) || 0,
      trips: Number(trips) || 0,
      lastUpdated: new Date().toLocaleTimeString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0A0F1D] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161B2E]">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                platformId === 'uber'
                  ? 'bg-black text-white border border-zinc-700'
                  : platformId === 'didi'
                  ? 'bg-amber-500 text-white'
                  : platformId === 'indrive'
                  ? 'bg-[#B2E234] text-zinc-950'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {config.name}
            </span>
            <span className="text-xs text-slate-300 font-semibold">Editar Cuentas</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-3.5">
          {/* Amount */}
          <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
              Monto Ganado Neto ({currencySymbol})
            </label>
            <input
              type="number"
              step="1"
              value={amount === 0 ? '' : amount}
              placeholder="0.00"
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="w-full bg-[#0A0F1D] border border-emerald-500/50 rounded-xl px-3 py-2 text-lg font-mono font-black text-emerald-400 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Hours & Trips */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                Horas Conectado
              </label>
              <input
                type="number"
                step="0.1"
                value={hours === 0 ? '' : hours}
                placeholder="0"
                onChange={(e) => setHours(Number(e.target.value) || 0)}
                className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3 py-2 text-base font-mono text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
                Viajes Hechos
              </label>
              <input
                type="number"
                value={trips === 0 ? '' : trips}
                placeholder="0"
                onChange={(e) => setTrips(Number(e.target.value) || 0)}
                className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3 py-2 text-base font-mono text-white focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#161B2E] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Guardar {config.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
