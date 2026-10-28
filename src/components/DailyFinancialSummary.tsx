import React from 'react';
import { DollarSign, Fuel, Utensils, TrendingUp, AlertCircle, PlusCircle, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { DayExpenses, DayRecord } from '../types';

interface DailyFinancialSummaryProps {
  grossIncome: number;
  totalExpenses: number;
  netProfit: number;
  expenses: DayExpenses;
  currencySymbol: string;
  onOpenExpensesModal: () => void;
  activePlatformsCount: number;
}

export const DailyFinancialSummary: React.FC<DailyFinancialSummaryProps> = ({
  grossIncome,
  totalExpenses,
  netProfit,
  expenses,
  currencySymbol,
  onOpenExpensesModal,
  activePlatformsCount,
}) => {
  const marginPercent = grossIncome > 0 ? Math.round((netProfit / grossIncome) * 100) : 0;
  const isProfitable = netProfit > 0;

  return (
    <div className="space-y-3">
      {/* Ganancia Neta Limpia (Tarjeta Hero Principal) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1A223B] to-[#161B2E] border border-emerald-500/40 p-4 shadow-xl shadow-black/50 glow-emerald">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-400">
                Ganancia Neta Limpia
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Al bolsillo
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
                {formatCurrency(netProfit, currencySymbol)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium block">Margen Real</span>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{marginPercent}%</span>
            </div>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-blue-400" />
            <span>Fórmula: Ingresos - Gastos</span>
          </span>
          <span className="text-slate-300 font-mono text-[11px]">
            {formatCurrency(grossIncome, currencySymbol)} - {formatCurrency(totalExpenses, currencySymbol)}
          </span>
        </div>
      </div>

      {/* Grid: Ingresos Brutos vs. Gastos Totales */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Ingresos Totales */}
        <div className="rounded-xl bg-[#161B2E] border border-slate-800 p-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Ingresos Brutos
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>

          <div className="mt-1.5">
            <span className="text-xl font-bold text-white font-mono block">
              {formatCurrency(grossIncome, currencySymbol)}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
              {activePlatformsCount} {activePlatformsCount === 1 ? 'app activa' : 'apps activas'}
            </span>
          </div>
        </div>

        {/* Gastos Totales */}
        <div className="rounded-xl bg-[#161B2E] border border-slate-800 p-3 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                Gastos del Día
              </span>
              <div className="w-6 h-6 rounded-lg bg-rose-500/10 flex items-center justify-center">
                <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
              </div>
            </div>

            <div className="mt-1.5">
              <span className="text-xl font-bold text-rose-400 font-mono block">
                {formatCurrency(totalExpenses, currencySymbol)}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span className="flex items-center gap-0.5">
                  <Fuel className="w-3 h-3 text-amber-400" />
                  {formatCurrency(expenses.fuel, currencySymbol)}
                </span>
                <span className="flex items-center gap-0.5">
                  <Utensils className="w-3 h-3 text-cyan-400" />
                  {formatCurrency(expenses.food, currencySymbol)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenExpensesModal}
            className="mt-2 w-full py-1 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-[11px] font-semibold text-blue-400 flex items-center justify-center gap-1 transition-colors"
          >
            <PlusCircle className="w-3 h-3" />
            <span>Gestionar Gastos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
