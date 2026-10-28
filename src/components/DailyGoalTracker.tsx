import React, { useState } from 'react';
import { Target, Trophy, Sparkles, Calendar, ChevronRight, Edit3, Flame } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { triggerCelebration } from '../utils/confetti';
import { sounds } from '../utils/sound';

interface DailyGoalTrackerProps {
  netProfit: number;
  goalTarget: number;
  currencySymbol: string;
  onUpdateGoalTarget: (newGoal: number) => void;
  onTriggerCelebration: () => void;
}

export const DailyGoalTracker: React.FC<DailyGoalTrackerProps> = ({
  netProfit,
  goalTarget,
  currencySymbol,
  onUpdateGoalTarget,
  onTriggerCelebration,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(goalTarget);

  const percentage = goalTarget > 0 ? Math.min(Math.round((netProfit / goalTarget) * 100), 200) : 0;
  const isGoalReached = netProfit >= goalTarget && netProfit > 0;

  // Lunes a Domingo - Weekly Rideshare Settlement Cycle
  const currentDayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const daysOfWeek = [
    { label: 'Lun', dayNum: 1, full: 'Lunes' },
    { label: 'Mar', dayNum: 2, full: 'Martes' },
    { label: 'Mié', dayNum: 3, full: 'Miércoles' },
    { label: 'Jue', dayNum: 4, full: 'Jueves' },
    { label: 'Vie', dayNum: 5, full: 'Viernes' },
    { label: 'Sáb', dayNum: 6, full: 'Sábado' },
    { label: 'Dom', dayNum: 0, full: 'Domingo' },
  ];

  const handleManualCelebration = () => {
    sounds.playGoalSuccess();
    triggerCelebration();
  };

  const handleSaveGoal = () => {
    onUpdateGoalTarget(Number(tempGoal) || 1500);
    setIsEditingGoal(false);
  };

  return (
    <div className={`rounded-2xl border transition-all duration-300 p-4 shadow-lg space-y-3.5 ${
      isGoalReached
        ? 'bg-gradient-to-b from-[#16233B] via-[#161B2E] to-[#111628] border-emerald-500/50 shadow-emerald-500/10'
        : 'bg-[#161B2E] border-slate-800'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${
            isGoalReached ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400'
          }`}>
            {isGoalReached ? <Trophy className="w-4 h-4 animate-bounce" /> : <Target className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Meta Diaria</span>
              {isGoalReached && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 text-black shadow-sm">
                  ¡Superada!
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isGoalReached
                ? '¡Excelente jornada! Has cumplido la cuota de ganancia limpia'
                : `Faltan ${formatCurrency(Math.max(0, goalTarget - netProfit), currencySymbol)} para tu meta`}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setTempGoal(goalTarget);
            setIsEditingGoal(!isEditingGoal);
          }}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/80 transition-colors"
          title="Editar meta"
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
        </button>
      </div>

      {/* Goal Edit inline form */}
      {isEditingGoal && (
        <div className="p-3 rounded-xl bg-[#0A0F1D] border border-blue-500/30 flex items-center justify-between gap-2 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-bold text-slate-400">Objetivo {currencySymbol}:</span>
            <input
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(Number(e.target.value))}
              className="w-28 bg-[#161B2E] border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSaveGoal}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Guardar
          </button>
        </div>
      )}

      {/* Progress Bar & Percentage */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-bold text-white font-mono">
            {formatCurrency(netProfit, currencySymbol)}{' '}
            <span className="font-normal text-slate-400">
              de {formatCurrency(goalTarget, currencySymbol)}
            </span>
          </span>
          <span className={`font-mono font-black text-sm ${
            isGoalReached ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {percentage}%
          </span>
        </div>

        {/* The Track */}
        <div className="w-full bg-[#0A0F1D] h-3.5 rounded-full p-0.5 border border-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isGoalReached
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 shadow-md shadow-emerald-500/30'
                : 'bg-gradient-to-r from-blue-600 to-emerald-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Goal Reached Celebration Banner */}
      {isGoalReached && (
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-blue-500/15 border border-amber-500/40 flex items-center justify-between gap-2 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <div>
              <span className="text-xs font-extrabold text-amber-300 block">
                ¡Objetivo Diario Completado!
              </span>
              <span className="text-[10px] text-slate-300">
                Tu negocio sobre ruedas sigue creciendo con ganancia real.
              </span>
            </div>
          </div>

          <button
            onClick={handleManualCelebration}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs shadow-md shadow-amber-500/30 flex items-center gap-1 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Festejar</span>
          </button>
        </div>
      )}

      {/* Weekly Cycle (Lunes a Domingo) */}
      <div className="pt-2 border-t border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Ciclo de Cobro Semanal (Lun - Dom)</span>
          </span>
          <span className="text-[10px] text-slate-400">Corte de plataformas</span>
        </div>

        {/* Days Nodes */}
        <div className="grid grid-cols-7 gap-1.5">
          {daysOfWeek.map((day) => {
            const isToday = day.dayNum === currentDayIndex;
            return (
              <div
                key={day.label}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center border transition-all ${
                  isToday
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm shadow-blue-500/20 ring-1 ring-blue-500/50'
                    : 'bg-[#0A0F1D]/60 border-slate-800 text-slate-400'
                }`}
              >
                <span className={`text-[10px] font-bold ${isToday ? 'text-blue-300' : 'text-slate-400'}`}>
                  {day.label}
                </span>
                <span className="mt-1">
                  {isToday ? (
                    <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-700" />
                  )}
                </span>
                <span className="text-[9px] font-mono mt-1 text-slate-400 font-medium">
                  {isToday ? 'Hoy' : '-'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
