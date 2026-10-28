import { PlatformInfo, PlatformId } from '../types';

export const PLATFORMS_CONFIG: Record<PlatformId, PlatformInfo> = {
  uber: {
    id: 'uber',
    name: 'Uber',
    tagline: 'Viajes & Entregas',
    brandColor: '#000000',
    accentBg: 'bg-zinc-900',
    accentBorder: 'border-zinc-700',
    badgeBg: 'bg-white',
    badgeText: 'text-black font-black',
    defaultActive: true,
  },
  didi: {
    id: 'didi',
    name: 'DiDi',
    tagline: 'Conductor & Express',
    brandColor: '#FF7D41',
    accentBg: 'bg-amber-950/40',
    accentBorder: 'border-amber-600/40',
    badgeBg: 'bg-gradient-to-r from-amber-500 to-orange-500',
    badgeText: 'text-white font-black',
    defaultActive: true,
  },
  indrive: {
    id: 'indrive',
    name: 'InDrive',
    tagline: 'Tu Precio, Tu Trato',
    brandColor: '#B2E234',
    accentBg: 'bg-lime-950/30',
    accentBorder: 'border-lime-500/40',
    badgeBg: 'bg-lime-400',
    badgeText: 'text-zinc-950 font-black',
    defaultActive: true,
  },
  private: {
    id: 'private',
    name: 'Servicios Privados',
    tagline: 'Clientes Fijos & Fletes',
    brandColor: '#3B82F6',
    accentBg: 'bg-blue-950/40',
    accentBorder: 'border-blue-500/40',
    badgeBg: 'bg-blue-600',
    badgeText: 'text-white font-black',
    defaultActive: false,
  },
};

export const DEFAULT_USER_SETTINGS = {
  driverName: 'Carlos M.',
  vehicleModel: 'Nissan Versa 2022',
  vehiclePlate: 'ABC-1234',
  currencySymbol: '$',
  dailyGoal: 1500,
  notification: {
    enabled: true,
    time: '21:00',
    sound: true,
    vibrate: true,
    customMessage: '¡Hola! Es hora de hacer caja, registra tus números de hoy cuando llegues a casa.',
  },
};
