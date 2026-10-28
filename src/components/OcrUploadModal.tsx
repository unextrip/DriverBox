import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Edit2,
  Clock,
  Fuel,
  Utensils,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { OcrExtractedResult, PlatformId, DayExpenses } from '../types';
import { SAMPLE_SCREENSHOTS, simulateOcrAnalysis } from '../services/ocrEngine';
import { formatCurrency } from '../utils/formatters';
import { PLATFORMS_CONFIG } from '../utils/constants';
import { sounds } from '../utils/sound';

interface OcrUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol: string;
  currentExpenses: DayExpenses;
  onApplyOcrData: (
    results: OcrExtractedResult[],
    expenses: { fuel: number; food: number }
  ) => void;
}

export const OcrUploadModal: React.FC<OcrUploadModalProps> = ({
  isOpen,
  onClose,
  currencySymbol,
  currentExpenses,
  onApplyOcrData,
}) => {
  const [stage, setStage] = useState<'upload' | 'scanning' | 'review'>('upload');
  const [scanStep, setScanStep] = useState<string>('Iniciando...');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [extractedItems, setExtractedItems] = useState<OcrExtractedResult[]>([]);
  const [fuelExpense, setFuelExpense] = useState<number>(currentExpenses.fuel || 0);
  const [foodExpense, setFoodExpense] = useState<number>(currentExpenses.food || 0);
  const [activePresetPreview, setActivePresetPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSelectFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setStage('scanning');
    setScanProgress(5);
    setScanStep('Cargando imágenes de capturas...');

    const results: OcrExtractedResult[] = [];
    const fileArray = Array.from(files);

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const res = await simulateOcrAnalysis(file, (step, p) => {
        const overall = Math.round(((i * 100) + p) / fileArray.length);
        setScanStep(`${step} (${i + 1}/${fileArray.length})`);
        setScanProgress(overall);
      });
      results.push(res);
    }

    setExtractedItems(results);
    sounds.playTap();
    setStage('review');
  };

  const handleTriggerPreset = async (presetId: string) => {
    setStage('scanning');
    setScanProgress(10);
    setActivePresetPreview(presetId);

    const preset = SAMPLE_SCREENSHOTS.find((p) => p.id === presetId);
    if (!preset) return;

    const res = await simulateOcrAnalysis(
      { name: `${preset.label}.jpg`, presetId: preset.id },
      (step, p) => {
        setScanStep(step);
        setScanProgress(p);
      }
    );

    setExtractedItems([res]);
    sounds.playTap();
    setStage('review');
  };

  const handleTriggerAllPresets = async () => {
    setStage('scanning');
    setScanProgress(5);

    const results: OcrExtractedResult[] = [];
    for (let i = 0; i < SAMPLE_SCREENSHOTS.length; i++) {
      const preset = SAMPLE_SCREENSHOTS[i];
      const res = await simulateOcrAnalysis(
        { name: `${preset.label}.jpg`, presetId: preset.id },
        (step, p) => {
          const overall = Math.round(((i * 100) + p) / SAMPLE_SCREENSHOTS.length);
          setScanStep(`${preset.label}: ${step}`);
          setScanProgress(overall);
        }
      );
      results.push(res);
    }

    setExtractedItems(results);
    sounds.playTap();
    setStage('review');
  };

  const handleUpdateItem = (index: number, field: 'amount' | 'hours' | 'trips', value: number) => {
    const updated = [...extractedItems];
    updated[index] = {
      ...updated[index],
      [field]: Number(value) || 0,
    };
    setExtractedItems(updated);
  };

  const handleConfirmAndSave = () => {
    sounds.playGoalSuccess();
    onApplyOcrData(extractedItems, {
      fuel: Number(fuelExpense) || 0,
      food: Number(foodExpense) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0A0F1D] border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#161B2E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <Camera className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Lectura IA de Capturas (OCR)
              </h2>
              <p className="text-xs text-slate-400">
                Extrae ganancias y horas de tus resúmenes diarios
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* STAGE 1: UPLOAD & PRESETS */}
          {stage === 'upload' && (
            <div className="space-y-4">
              {/* Big Ergonomic Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative cursor-pointer border-2 border-dashed border-blue-500/40 hover:border-emerald-500/60 rounded-2xl p-6 text-center bg-[#161B2E]/60 hover:bg-[#161B2E] transition-all"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleSelectFiles(e.target.files)}
                />

                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-7 h-7 text-white" />
                </div>

                <div className="mt-3">
                  <span className="text-sm font-bold text-white block">
                    Toca para seleccionar o tomar capturas
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">
                    Sube una o varias capturas de Uber, DiDi o InDrive
                  </span>
                </div>

                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] font-medium text-emerald-400 border border-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Detección automática de montos y horas</span>
                </div>
              </div>

              {/* Instant Try-It Presets */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    ¿No tienes capturas a mano? Prueba un demo:
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SAMPLE_SCREENSHOTS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleTriggerPreset(preset.id)}
                      className="p-3 rounded-xl bg-[#161B2E] border border-slate-800 hover:border-slate-700 text-left transition-all active:scale-98 hover:bg-slate-800/60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{preset.platformId.toUpperCase()}</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {formatCurrency(preset.mockAmount, currencySymbol)}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block truncate">
                        {preset.mockTrips} viajes • {preset.mockHours}h
                      </span>
                    </button>
                  ))}
                </div>

                {/* Batch multi-app button */}
                <button
                  onClick={handleTriggerAllPresets}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-emerald-900/40 border border-blue-500/30 hover:border-blue-400 text-xs font-bold text-blue-300 flex items-center justify-center gap-2 transition-all"
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Probar Lote Multiapp (Uber + DiDi + InDrive a la vez)</span>
                </button>
              </div>

              {/* Quick Expenses Inputs */}
              <div className="pt-2 border-t border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Gastos del Día (Rápido)
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#161B2E] border border-slate-800">
                    <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                      <Fuel className="w-3.5 h-3.5 text-amber-400" />
                      <span>Gasolina ({currencySymbol})</span>
                    </label>
                    <input
                      type="number"
                      value={fuelExpense === 0 ? '' : fuelExpense}
                      placeholder="0.00"
                      onChange={(e) => setFuelExpense(Number(e.target.value))}
                      className="w-full bg-[#0A0F1D] border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#161B2E] border border-slate-800">
                    <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
                      <Utensils className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Comida ({currencySymbol})</span>
                    </label>
                    <input
                      type="number"
                      value={foodExpense === 0 ? '' : foodExpense}
                      placeholder="0.00"
                      onChange={(e) => setFoodExpense(Number(e.target.value))}
                      className="w-full bg-[#0A0F1D] border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: SCANNING HUD ANIMATION */}
          {stage === 'scanning' && (
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-6">
              {/* Cyber Scanner HUD */}
              <div className="relative w-48 h-48 rounded-2xl bg-[#161B2E] border-2 border-emerald-500/60 overflow-hidden flex flex-col items-center justify-center p-4 shadow-2xl shadow-emerald-500/20">
                {/* Glowing Laser Scanline */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-scan z-20" />

                {/* Simulated receipt lines */}
                <div className="w-full space-y-2 opacity-40 z-10">
                  <div className="h-3 bg-emerald-400/40 rounded w-3/4 mx-auto" />
                  <div className="h-2 bg-blue-400/30 rounded w-1/2 mx-auto" />
                  <div className="h-5 bg-emerald-400/20 rounded w-full mt-4" />
                  <div className="h-3 bg-slate-400/30 rounded w-2/3 mx-auto" />
                  <div className="h-3 bg-slate-400/30 rounded w-4/5 mx-auto" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-emerald-500/10 to-blue-500/5 pointer-events-none" />

                {/* Center Badge */}
                <div className="relative z-20 mt-2 px-2.5 py-1 rounded-full bg-black/80 border border-emerald-400 text-[10px] font-mono text-emerald-300 font-bold">
                  OCR IA • {scanProgress}%
                </div>
              </div>

              <div className="space-y-2 max-w-xs">
                <h3 className="text-sm font-extrabold text-white flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Procesando Capturas...</span>
                </h3>
                <p className="text-xs text-emerald-400 font-medium h-6">
                  {scanStep}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: REVIEW & 1-TAP EDIT */}
          {stage === 'review' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Lectura de IA completada con éxito</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {extractedItems.length} {extractedItems.length === 1 ? 'app detectada' : 'apps detectadas'}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                💡 <strong className="text-white">Edición en 1 toque:</strong> Si algún número necesita ajuste, cámbialo directamente en la casilla antes de aplicar.
              </p>

              {/* List of Extracted Cards */}
              <div className="space-y-3">
                {extractedItems.map((item, idx) => {
                  const config = PLATFORMS_CONFIG[item.platformId];
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#161B2E] border border-slate-700 shadow-md space-y-3"
                    >
                      {/* Platform header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-xs font-black ${
                              item.platformId === 'uber'
                                ? 'bg-black text-white border border-zinc-700'
                                : item.platformId === 'didi'
                                ? 'bg-amber-500 text-white'
                                : 'bg-[#B2E234] text-zinc-950'
                            }`}
                          >
                            {config ? config.name : item.platformName}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Confianza: <strong className="text-emerald-400">{item.confidence}%</strong>
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.imageFileName}
                        </span>
                      </div>

                      {/* 1-Tap Editable Inputs */}
                      <div className="grid grid-cols-3 gap-2">
                        {/* Amount */}
                        <div className="col-span-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                            Ganancia ({currencySymbol})
                          </label>
                          <input
                            type="number"
                            step="0.5"
                            value={item.amount}
                            onChange={(e) =>
                              handleUpdateItem(idx, 'amount', Number(e.target.value))
                            }
                            className="w-full bg-[#0A0F1D] border border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                          />
                        </div>

                        {/* Hours */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                            Horas en Línea
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            value={item.hours}
                            onChange={(e) =>
                              handleUpdateItem(idx, 'hours', Number(e.target.value))
                            }
                            className="w-full bg-[#0A0F1D] border border-blue-500/40 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-blue-400"
                          />
                        </div>

                        {/* Trips */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                            Viajes
                          </label>
                          <input
                            type="number"
                            value={item.trips}
                            onChange={(e) =>
                              handleUpdateItem(idx, 'trips', Number(e.target.value))
                            }
                            className="w-full bg-[#0A0F1D] border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-slate-500"
                          />
                        </div>
                      </div>

                      {/* Detected snippets preview */}
                      {item.detectedTextSnippets && item.detectedTextSnippets.length > 0 && (
                        <div className="text-[10px] text-slate-400 bg-[#0A0F1D]/60 p-2 rounded-lg border border-slate-800/80">
                          <span className="text-slate-500 block font-semibold mb-0.5">Texto detectado por IA:</span>
                          <span className="italic">{item.detectedTextSnippets.slice(0, 2).join(' • ')}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Fast Expenses Summary */}
              <div className="p-3 rounded-2xl bg-[#161B2E] border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Gastos a deducir en este turno
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Gasolina</label>
                    <input
                      type="number"
                      value={fuelExpense}
                      onChange={(e) => setFuelExpense(Number(e.target.value))}
                      className="w-full bg-[#0A0F1D] border border-slate-700 rounded-lg px-2 py-1.5 text-sm font-mono text-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Comida</label>
                    <input
                      type="number"
                      value={foodExpense}
                      onChange={(e) => setFoodExpense(Number(e.target.value))}
                      className="w-full bg-[#0A0F1D] border border-slate-700 rounded-lg px-2 py-1.5 text-sm font-mono text-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#161B2E] flex items-center justify-between gap-3">
          {stage === 'review' ? (
            <>
              <button
                onClick={() => setStage('upload')}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={handleConfirmAndSave}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Aplicar a Mi Caja de Hoy</span>
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
