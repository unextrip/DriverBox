import { DayExpenses, DayMileage, DayRecord, PlatformId } from '../types';

export function formatCurrency(amount: number, symbol = '$'): string {
  const rounded = Math.round(amount * 100) / 100;
  return `${symbol}${rounded.toLocaleString('es-MX', {
    minimumFractionDigits: rounded % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(val: number): string {
  return val.toLocaleString('es-MX');
}

export function getCurrentDateFormatted(): { full: string; short: string; dayName: string } {
  const now = new Date();
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  const dayOfWeek = dayNames[now.getDay()];
  const dayOfMonth = now.getDate();
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();

  return {
    full: `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}`,
    short: `${dayOfMonth} ${month.slice(0, 3)}`,
    dayName: dayOfWeek,
  };
}

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateFinancials(record: DayRecord) {
  // Sum only enabled platforms
  let grossIncome = 0;
  let totalHours = 0;
  let totalTrips = 0;

  (Object.keys(record.platforms) as PlatformId[]).forEach((pId) => {
    const p = record.platforms[pId];
    if (p && p.enabled) {
      grossIncome += Number(p.amount || 0);
      totalHours += Number(p.hours || 0);
      totalTrips += Number(p.trips || 0);
    }
  });

  const { fuel, food, carWash, tolls, other } = record.expenses;
  const totalExpenses = Number(fuel || 0) + Number(food || 0) + Number(carWash || 0) + Number(tolls || 0) + Number(other || 0);
  const netProfit = grossIncome - totalExpenses;

  // Kilometers
  const startKm = Number(record.mileage.startKm || 0);
  const endKm = Number(record.mileage.endKm || 0);
  const totalKm = endKm > startKm ? endKm - startKm : 0;

  // Performance metrics
  const profitPerKm = totalKm > 0 ? netProfit / totalKm : 0;
  const grossPerKm = totalKm > 0 ? grossIncome / totalKm : 0;
  const profitPerHour = totalHours > 0 ? netProfit / totalHours : 0;
  const fuelCostPerKm = totalKm > 0 ? Number(fuel || 0) / totalKm : 0;

  // Goal percentage
  const goalTarget = record.goalTarget > 0 ? record.goalTarget : 1500;
  const goalProgress = Math.min(Math.round((netProfit / goalTarget) * 100), 300);
  const goalAchieved = netProfit >= goalTarget && netProfit > 0;

  return {
    grossIncome,
    totalExpenses,
    netProfit,
    totalKm,
    totalHours,
    totalTrips,
    profitPerKm,
    grossPerKm,
    profitPerHour,
    fuelCostPerKm,
    goalTarget,
    goalProgress,
    goalAchieved,
  };
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return '¡Buenos días';
  if (hour >= 12 && hour < 19) return '¡Buenas tardes';
  return '¡Buenas noches';
}
