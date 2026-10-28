import { DayRecord, PlatformId, UserSettings } from '../types';
import { DEFAULT_USER_SETTINGS, PLATFORMS_CONFIG } from '../utils/constants';
import { getTodayKey } from '../utils/formatters';

const STORAGE_KEY_SETTINGS = 'driverbox_settings_v1';
const STORAGE_KEY_RECORDS = 'driverbox_records_v1';

export function getInitialDayRecord(dateKey: string = getTodayKey()): DayRecord {
  return {
    id: dateKey,
    date: dateKey,
    platforms: {
      uber: {
        enabled: PLATFORMS_CONFIG.uber.defaultActive,
        amount: 1350,
        hours: 7.5,
        trips: 15,
      },
      didi: {
        enabled: PLATFORMS_CONFIG.didi.defaultActive,
        amount: 820,
        hours: 5.0,
        trips: 11,
      },
      indrive: {
        enabled: PLATFORMS_CONFIG.indrive.defaultActive,
        amount: 450,
        hours: 3.0,
        trips: 6,
      },
      private: {
        enabled: PLATFORMS_CONFIG.private.defaultActive,
        amount: 0,
        hours: 0,
        trips: 0,
      },
    },
    expenses: {
      fuel: 450,
      food: 120,
      carWash: 0,
      tolls: 65,
      other: 0,
      notes: 'Carga de gasolina Magna + Almuerzo',
    },
    mileage: {
      startKm: 78420,
      endKm: 78615,
    },
    goalTarget: 1500,
    closed: false,
    notes: '',
  };
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_USER_SETTINGS;
    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadAllRecords(): Record<string, DayRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!raw) {
      // Seed with current day
      const todayKey = getTodayKey();
      const initial = { [todayKey]: getInitialDayRecord(todayKey) };
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    const todayKey = getTodayKey();
    return { [todayKey]: getInitialDayRecord(todayKey) };
  }
}

export function saveDayRecord(record: DayRecord): void {
  try {
    const all = loadAllRecords();
    all[record.id] = record;
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save record:', e);
  }
}
