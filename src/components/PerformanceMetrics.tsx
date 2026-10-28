import React, { useState } from 'react';
import { Navigation, Gauge, Clock, Fuel, Sparkles, ChevronRight, Edit3 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { DayMileage } from '../types';

interface PerformanceMetricsProps {
  mileage: DayMileage;
  totalKm: number;
  profitPerKm: number;
  profitPerHour: number;
  totalHours: number;
  fuelCostPerKm: number;
  currencySymbol: string;
  onUpdateMileage: (startKm: number, endKm: number) => void;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  mileage,
  totalKm,
  profitPerKm,
  profitPerHour,
  totalHours,
  fuelCostPerKm,
  currencySymbol,
  onUpdateMileage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempStart, setTempStart] = useState(mileage.startKm);
  const [tempEnd, setTempEnd] = useState(mileage.endKm);

  const handleSaveMileage = () => {
    onUpdateMileage(Number(tempStart) || 0, Number(tempEnd) || 0);
    setIsEditing(false);
  };

  const handleQuickAddKm = (addedKm: number) => {
    const newEnd = Number(mileage.endKm || mileage.startKm) + addedKm;
    onUpdateMileage(mileage.startKm, newEnd);
  };

  return (
    <div className="rounded-2xl bg-[#161B2E] border border-slate-800 p-4 shadow-md space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Rendimiento & Kilometraje</h3>
            <p className="text-[11px] text-slate-400">Control de odómetro y ganancia por km</p>
          </div>
        </div>

        <button
          onClick={() => {
            setTempStart(mileage.startKm);
            setTempEnd(mileage.endKm);
            setIsEditing(!isEditing);
          }}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
        >
          <Edit3 className="w-3 h-3" />
          <span>{isEditing ? 'Cerrar' : 'Ajustar Km'}</span>
        </button>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <div className="p-3 rounded-xl bg-[#0A0F1D] border border-blue-500/30 space-y-2 animate-in fade-in duration-150">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Km Inicial (Turno)
              </label>
              <input
                type="number"
                value={tempStart}
                onChange={(e) => setTempStart(Number(e.target.value))}
                className="w-full bg-[#161B2E] border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Km Final (Actual)
              </label>
              <input
                type="number"
                value={tempEnd}
                onChange={(e) => setTempEnd(Number(e.target.value))}
                className="w-full bg-[#161B2E] border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              Recorrido: <strong className="text-emerald-400 font-mono">{tempEnd > tempStart ? tempEnd - tempStart : 0} km</strong>
            </span>
            <button
              onClick={handleSaveMileage}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
            >
              Guardar Odómetro
            </button>
          </div>
        </div>
      )}

      {/* Primary KPI: Kilómetros Recorridos */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#0A0F1D]/80 border border-slate-800">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Distancia Rodada Hoy
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-2xl font-black text-white font-mono">{totalKm}</span>
            <span className="text-xs font-semibold text-slate-400">kilómetros</span>
          </div>
        </div>

        {/* Quick Add pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleQuickAddKm(10)}
            className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            +10 km
          </button>
          <button
            onClick={() => handleQuickAddKm(25)}
            className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            +25 km
          </button>
        </div>
      </div>

      {/* Secondary Metrics: Ganancia / Km and Ganancia / Hora */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Ganancia por Km */}
        <div className="p-2.5 rounded-xl bg-[#0A0F1D]/60 border border-slate-800/80">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">Ganancia x Km</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-extrabold text-emerald-400 font-mono">
              {formatCurrency(profitPerKm, currencySymbol)}
              <span className="text-[10px] font-normal text-slate-400">/km</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            {fuelCostPerKm > 0 ? `Costo gas: ${formatCurrency(fuelCostPerKm, currencySymbol)}/km` : 'Óptimo'}
          </span>
        </div>

        {/* Ganancia por Hora */}
        <div className="p-2.5 rounded-xl bg-[#0A0F1D]/60 border border-slate-800/80">
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">Ganancia x Hora</span>
          </div>
          <div className="mt-1">
            <span className="text-base font-extrabold text-blue-400 font-mono">
              {formatCurrency(profitPerHour, currencySymbol)}
              <span className="text-[10px] font-normal text-slate-400">/h</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block truncate">
            {totalHours > 0 ? `${totalHours.toFixed(1)} hrs conectadas` : 'Sin tiempo reg.'}
          </span>
        </div>
      </div>
    </div>
  );
};
