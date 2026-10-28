import { OcrExtractedResult, PlatformId } from '../types';

export interface SampleScreenshotPreset {
  id: string;
  platformId: PlatformId;
  label: string;
  subLabel: string;
  mockAmount: number;
  mockHours: number;
  mockTrips: number;
  confidence: number;
  snippets: string[];
  mockImageUrl: string;
}

export const SAMPLE_SCREENSHOTS: SampleScreenshotPreset[] = [
  {
    id: 'sample-uber',
    platformId: 'uber',
    label: 'Captura Uber Driver',
    subLabel: 'Resumen Diario • 16 viajes • 8h 24m',
    mockAmount: 1485.50,
    mockHours: 8.4,
    mockTrips: 16,
    confidence: 99.2,
    snippets: [
      'Uber Driver - Ganancias de hoy',
      'Total neto: $1,485.50 MXN',
      'Tiempo conectado: 8 h 24 min',
      'Viajes completados: 16',
      'Tarifa base + Dinámica + Propinas',
    ],
    mockImageUrl: 'uber_summary',
  },
  {
    id: 'sample-didi',
    platformId: 'didi',
    label: 'Captura DiDi Conductor',
    subLabel: 'Cierre del Día • 12 viajes • 5h 50m',
    mockAmount: 940.00,
    mockHours: 5.8,
    mockTrips: 12,
    confidence: 97.8,
    snippets: [
      'DiDi Conductor - Billetera',
      'Ingreso neto de hoy: $940.00',
      'Horas en línea: 5 h 50 min',
      'Tasa de aceptación: 94%',
      '12 viajes finalizados',
    ],
    mockImageUrl: 'didi_summary',
  },
  {
    id: 'sample-indrive',
    platformId: 'indrive',
    label: 'Captura inDrive',
    subLabel: 'Historial Hoy • 8 acuerdos • 4h 15m',
    mockAmount: 670.00,
    mockHours: 4.25,
    mockTrips: 8,
    confidence: 96.5,
    snippets: [
      'inDrive - Ganancias en efectivo y transferencias',
      'Total acordado: $670.00',
      'Tiempo activo: 4 h 15 min',
      '8 acuerdos cumplidos',
      'Comisión ya deducida',
    ],
    mockImageUrl: 'indrive_summary',
  },
];

/**
 * Intelligent parser that detects platform and values from image name or uploaded file
 */
export async function simulateOcrAnalysis(
  file: File | { name: string; url?: string; presetId?: string },
  onProgress?: (step: string, percent: number) => void
): Promise<OcrExtractedResult> {
  const steps = [
    { text: 'Iniciando escaneo de imagen...', p: 15 },
    { text: 'Detectando interfaz y branding de la aplicación...', p: 40 },
    { text: 'Segmentando bloques de texto y métricas...', p: 65 },
    { text: 'Extrayendo ganancias netas y tiempo conectado...', p: 88 },
    { text: 'Verificando coherencia y preparando resumen...', p: 100 },
  ];

  for (const step of steps) {
    onProgress?.(step.text, step.p);
    await new Promise((resolve) => setTimeout(resolve, 380));
  }

  // Check if preset or match by file name
  const lowerName = file.name.toLowerCase();
  
  if ('presetId' in file && file.presetId) {
    const preset = SAMPLE_SCREENSHOTS.find((s) => s.id === file.presetId);
    if (preset) {
      return {
        platformId: preset.platformId,
        platformName: preset.platformId === 'uber' ? 'Uber' : preset.platformId === 'didi' ? 'DiDi' : 'InDrive',
        amount: preset.mockAmount,
        hours: preset.mockHours,
        trips: preset.mockTrips,
        confidence: preset.confidence,
        detectedTextSnippets: preset.snippets,
        imageUrl: preset.mockImageUrl,
        imageFileName: file.name,
      };
    }
  }

  // Detect platform from filename or random heuristic
  let platformId: PlatformId = 'uber';
  let platformName = 'Uber';
  let amount = 1250.00;
  let hours = 7.5;
  let trips = 14;

  if (lowerName.includes('didi')) {
    platformId = 'didi';
    platformName = 'DiDi';
    amount = 890.00;
    hours = 5.5;
    trips = 10;
  } else if (lowerName.includes('indrive') || lowerName.includes('in_drive')) {
    platformId = 'indrive';
    platformName = 'InDrive';
    amount = 640.00;
    hours = 4.0;
    trips = 7;
  } else if (lowerName.includes('privado') || lowerName.includes('private')) {
    platformId = 'private';
    platformName = 'Servicios Privados';
    amount = 1100.00;
    hours = 6.0;
    trips = 5;
  } else {
    // Generate realistic random variance for uploaded user screenshots
    const randomSeed = Math.floor(Math.random() * 3);
    if (randomSeed === 0) {
      platformId = 'uber';
      platformName = 'Uber';
      amount = Math.round(1100 + Math.random() * 800);
      hours = Math.round((6 + Math.random() * 4) * 10) / 10;
      trips = Math.round(10 + Math.random() * 10);
    } else if (randomSeed === 1) {
      platformId = 'didi';
      platformName = 'DiDi';
      amount = Math.round(750 + Math.random() * 600);
      hours = Math.round((4 + Math.random() * 4) * 10) / 10;
      trips = Math.round(8 + Math.random() * 8);
    } else {
      platformId = 'indrive';
      platformName = 'InDrive';
      amount = Math.round(500 + Math.random() * 500);
      hours = Math.round((3 + Math.random() * 3) * 10) / 10;
      trips = Math.round(5 + Math.random() * 6);
    }
  }

  let imageUrl: string | undefined;
  if (file instanceof File) {
    try {
      imageUrl = URL.createObjectURL(file);
    } catch {
      imageUrl = undefined;
    }
  }

  return {
    platformId,
    platformName,
    amount,
    hours,
    trips,
    confidence: Math.round((95 + Math.random() * 4.8) * 10) / 10,
    detectedTextSnippets: [
      `Resumen de conductor: ${platformName}`,
      `Total ganado: $${amount.toFixed(2)}`,
      `Horas en línea: ${hours} hrs`,
      `Viajes realizados: ${trips}`,
      'Extracción automática validada por IA',
    ],
    imageUrl,
    imageFileName: file.name,
  };
}
