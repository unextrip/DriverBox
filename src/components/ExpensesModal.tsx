import React, { useState } from 'react';
import { X, Fuel, Utensils, Sparkles, Car, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { DayExpenses } from '../types';
import { formatCurrency } from '../utils/formatters';
import { sounds } from '../utils/sound';

interface ExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: DayExpenses;
  currencySymbol: string;
  onSaveExpenses: (expenses: DayExpenses) => void;
}

export const ExpensesModal: React.FC<ExpensesModalProps> = ({
  isOpen,
  onClose,
  expenses,
  currencySymbol,
  onSaveExpenses,
}) => {
  const [form, setForm] = useState<DayExpenses>({ ...expenses });

  if (!isOpen) return null;

  const total =
    Number(form.fuel || 0) +
    Number(form.food || 0) +
    Number(form.carWash || 0) +
    Number(form.tolls || 0) +
    Number(form.other || 0);

  const handleSave = () => {
    sounds.playTap();
    onSaveExpenses(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0A0F1D] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161B2E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Control de Gastos del Turno
              </h2>
              <p className="text-xs text-slate-400">
                Todo lo que sale del bolsillo hoy
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

        {/* Total Banner */}
        <div className="px-5 py-3 bg-[#161B2E]/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Total Gastos a Deducir:
          </span>
          <span className="text-lg font-black text-rose-400 font-mono">
            {formatCurrency(total, currencySymbol)}
          </span>
        </div>

        {/* Fields */}
        <div className="p-5 space-y-3.5 overflow-y-auto">
          {/* Gasolina */}
          <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Fuel className="w-4 h-4" />
                <span>Gasolina / Combustible</span>
              </label>
              <div className="flex gap-1">
                {[200, 350, 500].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setForm({ ...form, fuel: quick })}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    +{quick}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              value={form.fuel === 0 ? '' : form.fuel}
              placeholder="0.00"
              onChange={(e) => setForm({ ...form, fuel: Number(e.target.value) || 0 })}
              className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Comida */}
          <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Utensils className="w-4 h-4" />
                <span>Comida / Hidratación</span>
              </label>
              <div className="flex gap-1">
                {[60, 100, 150].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setForm({ ...form, food: quick })}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                  >
                    +{quick}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              value={form.food === 0 ? '' : form.food}
              placeholder="0.00"
              onChange={(e) => setForm({ ...form, food: Number(e.target.value) || 0 })}
              className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Grid: Lavado y Casetas */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-blue-400" />
                <span>Lavado Auto</span>
              </label>
              <input
                type="number"
                value={form.carWash === 0 ? '' : form.carWash}
                placeholder="0.00"
                onChange={(e) => setForm({ ...form, carWash: Number(e.target.value) || 0 })}
                className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                <span>Casetas / Peajes</span>
              </label>
              <input
                type="number"
                value={form.tolls === 0 ? '' : form.tolls}
                placeholder="0.00"
                onChange={(e) => setForm({ ...form, tolls: Number(e.target.value) || 0 })}
                className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          {/* Varios / Mantenimiento */}
          <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1">
            <label className="text-xs font-bold text-slate-300 block">
              Otros Gastos (Pinchazos, Aceite, Propinas)
            </label>
            <input
              type="number"
              value={form.other === 0 ? '' : form.other}
              placeholder="0.00"
              onChange={(e) => setForm({ ...form, other: Number(e.target.value) || 0 })}
              className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-slate-500"
            />
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
            <span>Actualizar Gastos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
