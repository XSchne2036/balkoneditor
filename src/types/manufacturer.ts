import type { PlatformMaterial, RailingStyle, FrameMaterial } from '@/components/BalconyModel';

export interface Manufacturer {
  id: string;
  slug: string;
  name: string;
  logo?: string;
  presets: string[]; // Preset IDs
}

export interface PresetLimits {
  width: { min: number; max: number; default: number };
  depth: { min: number; max: number; default: number };
  platformHeight: { min: number; max: number; default: number };
  railingHeight: { min: number; max: number; default: number };
}

export interface Preset {
  id: string;
  manufacturerId: string;
  name: string;
  description?: string;
  
  // Erlaubte Optionen (nur diese werden im UI angezeigt)
  allowedSupportCounts: (2 | 3 | 4 | 6)[];
  allowedPlatformMaterials: PlatformMaterial[];
  allowedRailingStyles: RailingStyle[];
  allowedFrameMaterials: FrameMaterial[];
  
  // Default-Werte
  defaults: {
    supportCount: 2 | 3 | 4 | 6;
    platformMaterial: PlatformMaterial;
    railingStyle: RailingStyle;
    frameMaterial: FrameMaterial;
  };
  
  // Einschränkungen für Slider
  limits: PresetLimits;
}

export interface ManufacturerConfig {
  manufacturers: Record<string, Manufacturer>;
  presets: Record<string, Preset>;
}
