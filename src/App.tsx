import React, { useState, useEffect } from 'react';
import {
  Camera,
  Share2,
  Sparkles,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  Info,
  Car,
  CheckCircle,
  ShieldCheck,
  Fuel,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Header } from './components/Header';
import { WelcomeBanner } from './components/WelcomeBanner';
import { PlatformSwitches } from './components/PlatformSwitches';
import { DailyFinancialSummary } from './components/DailyFinancialSummary';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { DailyGoalTracker } from './components/DailyGoalTracker';
import { OcrUploadModal } from './components/OcrUploadModal';
import { PushNotificationModal } from './components/PushNotificationModal';
import { NotificationToast } from './components/NotificationToast';
import { ExpensesModal } from './components/ExpensesModal';
import { PlatformEditModal } from './components/PlatformEditModal';
import { SettingsModal } from './components/SettingsModal';
import { ShareReportModal } from './components/ShareReportModal';

import {
  DayRecord,
  PlatformId,
  PlatformRecord,
  UserSettings,
  OcrExtractedResult,
  DayExpenses,
} from './types';
import {
  loadSettings,
  saveSettings,
  loadAllRecords,
  saveDayRecord,
  getInitialDayRecord,
} from './services/storage';
import { calculateFinancials, formatCurrency, getTodayKey } from './utils/formatters';
import { triggerCelebration } from './utils/confetti';
import { sounds } from './utils/sound';

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [todayRecord, setTodayRecord] = useState<DayRecord>(() => {
    const todayKey = getTodayKey();
    const records = loadAllRecords();
    return records[todayKey] || getInitialDayRecord(todayKey);
  });

  // Modal states
  const [isOcrOpen, setIsOcrOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isExpensesOpen, setIsExpensesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [editingPlatformId, setEditingPlatformId] = useState<PlatformId | null>(null);

  // Push notification toast simulation state
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [hasCelebratedGoal, setHasCelebratedGoal] = useState(false);

  // Save changes automatically
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveDayRecord(todayRecord);
  }, [todayRecord]);

  // Financial calculations
  const fin = calculateFinancials(todayRecord);

  // Check goal achievement and trigger celebration
  useEffect(() => {
    if (fin.goalAchieved && !hasCelebratedGoal && fin.netProfit > 0) {
      triggerCelebration();
      sounds.playGoalSuccess();
      setHasCelebratedGoal(true);
    } else if (!fin.goalAchieved && hasCelebratedGoal) {
      setHasCelebratedGoal(false);
    }
  }, [fin.goalAchieved, fin.netProfit, hasCelebratedGoal]);

  // Platform Toggle handler
  const handleTogglePlatform = (id: PlatformId) => {
    setTodayRecord((prev) => {
      const current = prev.platforms[id] || { enabled: false, amount: 0, hours: 0, trips: 0 };
      const updatedRecord: PlatformRecord = {
        ...current,
        enabled: !current.enabled,
      };
      return {
        ...prev,
        platforms: {
          ...prev.platforms,
          [id]: updatedRecord,
        },
      };
    });
  };

  // Save specific platform edit
  const handleSavePlatformEdit = (id: PlatformId, updated: PlatformRecord) => {
    setTodayRecord((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [id]: updated,
      },
    }));
  };

  // Save updated expenses
  const handleSaveExpenses = (expenses: DayExpenses) => {
    setTodayRecord((prev) => ({
      ...prev,
      expenses,
    }));
  };

  // Update odometer
  const handleUpdateMileage = (startKm: number, endKm: number) => {
    setTodayRecord((prev) => ({
      ...prev,
      mileage: { startKm, endKm },
    }));
  };

  // Update daily goal
  const handleUpdateGoalTarget = (newGoal: number) => {
    setTodayRecord((prev) => ({
      ...prev,
      goalTarget: newGoal,
    }));
    setSettings((prev) => ({
      ...prev,
      dailyGoal: newGoal,
    }));
  };

  // OCR Application: Ingest scanned screenshots + expenses
  const handleApplyOcrData = (
    results: OcrExtractedResult[],
    expenses: { fuel: number; food: number }
  ) => {
    setTodayRecord((prev) => {
      const newPlatforms = { ...prev.platforms };

      results.forEach((item) => {
        newPlatforms[item.platformId] = {
          enabled: true,
          amount: item.amount,
          hours: item.hours,
          trips: item.trips,
          screenshotName: item.imageFileName,
          lastUpdated: new Date().toLocaleTimeString(),
        };
      });

      return {
        ...prev,
        platforms: newPlatforms,
        expenses: {
          ...prev.expenses,
          fuel: expenses.fuel > 0 ? expenses.fuel : prev.expenses.fuel,
          food: expenses.food > 0 ? expenses.food : prev.expenses.food,
        },
      };
    });
  };

  // Trigger celebration on demand
  const handleTriggerCelebration = () => {
    sounds.playGoalSuccess();
    triggerCelebration();
  };

  // Trigger simulated push notification
  const handleTriggerSimulatedNotification = () => {
    setShowNotificationToast(true);
    setIsNotificationsOpen(false);
  };

  // Reset today's box
  const handleResetToday = () => {
    const todayKey = getTodayKey();
    const fresh = getInitialDayRecord(todayKey);
    // Zero out
    (Object.keys(fresh.platforms) as PlatformId[]).forEach((k) => {
      fresh.platforms[k].amount = 0;
      fresh.platforms[k].hours = 0;
      fresh.platforms[k].trips = 0;
    });
    fresh.expenses.fuel = 0;
    fresh.expenses.food = 0;
    fresh.expenses.carWash = 0;
    fresh.expenses.tolls = 0;
    fresh.expenses.other = 0;
    fresh.mileage.endKm = fresh.mileage.startKm;
    setTodayRecord(fresh);
    setHasCelebratedGoal(false);
  };

  const activePlatformsCount = Object.values(todayRecord.platforms).filter((p) => p.enabled).length;

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-black pb-28">
      {/* 1. Header (Greeting, Date, Bell 9 PM, Settings) */}
      <Header
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onTriggerCelebration={handleTriggerCelebration}
        isGoalReached={fin.goalAchieved}
      />

      {/* Main Mobile-First Container */}
      <main className="max-w-md mx-auto w-full px-4 pt-3 space-y-4">
        {/* Welcome Slogan Banner */}
        <WelcomeBanner driverName={settings.driverName} />

        {/* 2. Resumen Financiero del Día (Tarjetas Clave: Ingresos, Gastos, Ganancia Neta Limpia) */}
        <DailyFinancialSummary
          grossIncome={fin.grossIncome}
          totalExpenses={fin.totalExpenses}
          netProfit={fin.netProfit}
          expenses={todayRecord.expenses}
          currencySymbol={settings.currencySymbol}
          onOpenExpensesModal={() => setIsExpensesOpen(true)}
          activePlatformsCount={activePlatformsCount}
        />

        {/* 📸 3. Botón Grande y Central para Subir Capturas del Día (OCR Simulation) */}
        <div className="pt-1">
          <button
            onClick={() => {
              sounds.playTap();
              setIsOcrOpen(true);
            }}
            className="w-full relative group overflow-hidden rounded-2xl p-[2px] bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 shadow-xl shadow-emerald-500/15 hover:shadow-emerald-500/30 transition-all duration-300 active:scale-[0.98]"
            aria-label="Subir Capturas del Día"
          >
            <div className="w-full bg-gradient-to-r from-[#161B2E] via-[#121A30] to-[#161B2E] rounded-[14px] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6 text-slate-950" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold text-white tracking-tight">
                      📸 Subir Capturas del Día
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      IA OCR
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Lee Uber, DiDi o InDrive con 1 toque y cuadra gastos
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-emerald-400 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        </div>

        {/* 4. Selector de Plataformas Activas (Switches: Uber, DiDi, InDrive, Privados) */}
        <PlatformSwitches
          platforms={todayRecord.platforms}
          currencySymbol={settings.currencySymbol}
          onTogglePlatform={handleTogglePlatform}
          onEditPlatform={(id) => setEditingPlatformId(id)}
        />

        {/* 5. Rendimiento & Kilómetros Recorridos ($/km, $/h) */}
        <PerformanceMetrics
          mileage={todayRecord.mileage}
          totalKm={fin.totalKm}
          profitPerKm={fin.profitPerKm}
          profitPerHour={fin.profitPerHour}
          totalHours={fin.totalHours}
          fuelCostPerKm={fin.fuelCostPerKm}
          currencySymbol={settings.currencySymbol}
          onUpdateMileage={handleUpdateMileage}
        />

        {/* 6. Meta Diaria y Gamificación (Ciclo Lunes-Domingo y Celebración) */}
        <DailyGoalTracker
          netProfit={fin.netProfit}
          goalTarget={todayRecord.goalTarget || settings.dailyGoal}
          currencySymbol={settings.currencySymbol}
          onUpdateGoalTarget={handleUpdateGoalTarget}
          onTriggerCelebration={handleTriggerCelebration}
        />

        {/* Extra Action Buttons (Export WhatsApp & Daily Notification info) */}
        <div className="grid grid-cols-2 gap-2.5 pt-2">
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-3 rounded-xl bg-[#161B2E] border border-slate-800 hover:border-slate-700 text-left flex items-center gap-2.5 transition-all hover:bg-slate-800/60 active:scale-98"
          >
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Reporte WhatsApp</span>
              <span className="text-[10px] text-slate-400 block">Enviar resumen</span>
            </div>
          </button>

          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="p-3 rounded-xl bg-[#161B2E] border border-slate-800 hover:border-slate-700 text-left flex items-center gap-2.5 transition-all hover:bg-slate-800/60 active:scale-98"
          >
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Alerta 9:00 PM</span>
              <span className="text-[10px] text-slate-400 block">Configurar recordatorio</span>
            </div>
          </button>
        </div>
      </main>

      {/* Floating Bottom Quick Action Bar (Designed for comfortable one-hand driving use) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0A0F1D]/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Ganancia Neta Hoy
            </span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono">
              {formatCurrency(fin.netProfit, settings.currencySymbol)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpensesOpen(true)}
              className="py-2.5 px-3 rounded-xl bg-[#161B2E] border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
              <span>Gastos</span>
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                setIsOcrOpen(true);
              }}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Subir Capturas</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {/* 1. OCR Upload & AI Scanner Modal */}
      <OcrUploadModal
        isOpen={isOcrOpen}
        onClose={() => setIsOcrOpen(false)}
        currencySymbol={settings.currencySymbol}
        currentExpenses={todayRecord.expenses}
        onApplyOcrData={handleApplyOcrData}
      />

      {/* 2. Notification Configuration Modal */}
      <PushNotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notificationSettings={settings.notification}
        onUpdateSettings={(newNotif) =>
          setSettings((prev) => ({ ...prev, notification: newNotif }))
        }
        onTriggerSimulatedNotification={handleTriggerSimulatedNotification}
      />

      {/* 3. Native Push Notification Toast Simulator */}
      <NotificationToast
        isOpen={showNotificationToast}
        onClose={() => setShowNotificationToast(false)}
        onOpenOcr={() => setIsOcrOpen(true)}
        message={settings.notification.customMessage}
        timeLabel="9:00 PM"
      />

      {/* 4. Expenses Modal */}
      <ExpensesModal
        isOpen={isExpensesOpen}
        onClose={() => setIsExpensesOpen(false)}
        expenses={todayRecord.expenses}
        currencySymbol={settings.currencySymbol}
        onSaveExpenses={handleSaveExpenses}
      />

      {/* 5. Single Platform Edit Modal */}
      {editingPlatformId && (
        <PlatformEditModal
          platformId={editingPlatformId}
          onClose={() => setEditingPlatformId(null)}
          record={
            todayRecord.platforms[editingPlatformId] || {
              enabled: true,
              amount: 0,
              hours: 0,
              trips: 0,
            }
          }
          currencySymbol={settings.currencySymbol}
          onSave={handleSavePlatformEdit}
        />
      )}

      {/* 6. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onResetToday={handleResetToday}
      />

      {/* 7. WhatsApp Share Report Modal */}
      <ShareReportModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        record={todayRecord}
        settings={settings}
      />
    </div>
  );
}
