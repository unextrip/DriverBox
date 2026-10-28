import React, { useState } from 'react';
import { X, CheckCircle2, User, Car, DollarSign, Target, RotateCcw } from 'lucide-react';
import { UserSettings } from '../types';
import { sounds } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  onResetToday: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetToday,
}) => {
  const [form, setForm] = useState<UserSettings>({ ...settings });

  if (!isOpen) return null;

  const handleSave = () => {
    sounds.playTap();
    onSaveSettings(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0A0F1D] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161B2E]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white">Configuración Rápida</h2>
              <p className="text-xs text-slate-400">Personaliza tu perfil y preferencias</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Driver Name */}
          <div className="p-3.5 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Nombre del Conductor</span>
            </label>
            <input
              type="text"
              value={form.driverName}
              onChange={(e) => setForm({ ...form, driverName: e.target.value })}
              className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Vehicle info */}
          <div className="p-3.5 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-blue-400" />
              <span>Vehículo / Modelo</span>
            </label>
            <input
              type="text"
              value={form.vehicleModel}
              onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })}
              className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Currency and Daily Goal */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Símbolo Moneda</span>
              </label>
              <select
                value={form.currencySymbol}
                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="$">$ (MXN / USD / Pesos)</option>
                <option value="S/.">S/. (Soles Perú)</option>
                <option value="COP $">COP $ (Pesos Col.)</option>
                <option value="ARS $">ARS $ (Pesos Arg.)</option>
                <option value="€">€ (Euros España)</option>
                <option value="R$">R$ (Reales Brasil)</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>Meta Diaria</span>
              </label>
              <input
                type="number"
                value={form.dailyGoal}
                onChange={(e) => setForm({ ...form, dailyGoal: Number(e.target.value) || 1500 })}
                className="w-full bg-[#0A0F1D] border border-slate-700 rounded-xl px-2.5 py-2 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Reset Today's Box Danger Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (window.confirm('¿Reiniciar los números de la caja de hoy a cero?')) {
                  onResetToday();
                  onClose();
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-400 hover:bg-rose-900/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Números de Hoy</span>
            </button>
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
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
};
