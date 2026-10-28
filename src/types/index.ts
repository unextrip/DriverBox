export type PlatformId = 'uber' | 'didi' | 'indrive' | 'private';

export interface PlatformInfo {
  id: PlatformId;
  name: string;
  tagline: string;
  brandColor: string;
  accentBg: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  defaultActive: boolean;
}

export interface PlatformRecord {
  enabled: boolean;
  amount: number;
  hours: number;
  trips: number;
  screenshotName?: string;
  lastUpdated?: string;
}

export interface DayExpenses {
  fuel: number;        // Gasolina
  food: number;        // Comida
  carWash: number;     // Lavado de auto
  tolls: number;       // Casetas / Peajes
  other: number;       // Varios / Mantenimiento
  notes?: string;
}

export interface DayMileage {
  startKm: number;
  endKm: number;
}

export interface DayRecord {
  id: string; // YYYY-MM-DD
  date: string;
  platforms: Record<PlatformId, PlatformRecord>;
  expenses: DayExpenses;
  mileage: DayMileage;
  goalTarget: number;
  closed: boolean;
  notes?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  time: string; // '21:00' default
  sound: boolean;
  vibrate: boolean;
  customMessage: string;
}

export interface UserSettings {
  driverName: string;
  vehicleModel: string;
  vehiclePlate: string;
  currencySymbol: string;
  dailyGoal: number;
  notification: NotificationSettings;
}

export interface OcrExtractedResult {
  platformId: PlatformId;
  platformName: string;
  amount: number;
  hours: number;
  trips: number;
  confidence: number;
  detectedTextSnippets: string[];
  imageUrl?: string;
  imageFileName: string;
}
