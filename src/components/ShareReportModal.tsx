import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageSquare, Car, DollarSign } from 'lucide-react';
import { DayRecord, UserSettings } from '../types';
import { calculateFinancials, formatCurrency, getCurrentDateFormatted } from '../utils/formatters';
import { PLATFORMS_CONFIG } from '../utils/constants';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DayRecord;
  settings: UserSettings;
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({
  isOpen,
  onClose,
  record,
  settings,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fin = calculateFinancials(record);
  const dateInfo = getCurrentDateFormatted();

  // Generate WhatsApp-formatted markdown text
  const platformLines = (Object.keys(record.platforms) as Array<keyof typeof record.platforms>)
    .filter((id) => record.platforms[id]?.enabled && record.platforms[id]?.amount > 0)
    .map((id) => {
      const p = record.platforms[id];
      const cfg = PLATFORMS_CONFIG[id];
      return `• ${cfg.name}: ${formatCurrency(p.amount, settings.currencySymbol)} (${p.trips || 0} viajes, ${p.hours || 0}h)`;
    })
    .join('\n');

  const reportText = `🚕 *REPORTE DE CAJA DIARIA - DRIVERBOX*
📅 *Fecha:* ${dateInfo.full}
👤 *Conductor:* ${settings.driverName}
🚗 *Vehículo:* ${settings.vehicleModel}

💰 *INGRESOS POR PLATAFORMA:*
${platformLines || '• Sin plataformas registradas hoy'}

📈 *Ingreso Bruto Total:* ${formatCurrency(fin.grossIncome, settings.currencySymbol)}

⛽ *GASTOS DEL TURNO:*
• Gasolina: ${formatCurrency(record.expenses.fuel, settings.currencySymbol)}
• Comida: ${formatCurrency(record.expenses.food, settings.currencySymbol)}
• Otros / Casetas: ${formatCurrency(record.expenses.tolls + record.expenses.carWash + record.expenses.other, settings.currencySymbol)}
📉 *Total Gastos:* ${formatCurrency(fin.totalExpenses, settings.currencySymbol)}

━━━━━━━━━━━━━━━━━
🟢 *GANANCIA NETA LIMPIA:* ${formatCurrency(fin.netProfit, settings.currencySymbol)}
━━━━━━━━━━━━━━━━━

📊 *MÉTRICAS DE RENDIMIENTO:*
• Kilómetros rodados: ${fin.totalKm} km
• Ganancia por Km: ${formatCurrency(fin.profitPerKm, settings.currencySymbol)}/km
• Horas trabajadas: ${fin.totalHours.toFixed(1)} hrs
• Ganancia por Hora: ${formatCurrency(fin.profitPerHour, settings.currencySymbol)}/h
${fin.goalAchieved ? '🏆 ¡Meta diaria superada con éxito!' : ''}

_Generado con DriverBox: Tu Negocio Sobre Ruedas_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0A0F1D] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161B2E]">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-white">Exportar Reporte de Caja</h2>
              <p className="text-xs text-slate-400">Listo para compartir por WhatsApp o notas</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Text Preview */}
        <div className="p-5 overflow-y-auto space-y-3">
          <pre className="p-3.5 rounded-2xl bg-[#161B2E] border border-slate-800 text-[11px] font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-emerald-500/30">
            {reportText}
          </pre>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#161B2E] flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-98"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enviar WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
