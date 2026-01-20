import type { ManufacturerConfig } from '@/types/manufacturer';

// JSON-basierte Konfiguration - später einfach durch API ersetzbar
export const manufacturerConfig: ManufacturerConfig = {
  manufacturers: {
    'balkonpro': {
      id: 'balkonpro',
      slug: 'balkonpro',
      name: 'BalkonPro GmbH',
      presets: ['balkonpro-standard', 'balkonpro-premium'],
    },
    'terrassenbau': {
      id: 'terrassenbau',
      slug: 'terrassenbau',
      name: 'Terrassenbau Müller',
      presets: ['terrassenbau-eco', 'terrassenbau-glas'],
    },
  },
  presets: {
    'balkonpro-standard': {
      id: 'balkonpro-standard',
      manufacturerId: 'balkonpro',
      name: 'Standard-Linie',
      description: 'Klassischer Balkon mit Holzboden',
      allowedSupportCounts: [2, 3, 4],
      allowedPlatformMaterials: ['douglasie', 'wpc'],
      allowedRailingStyles: ['bars', 'glass'],
      allowedFrameMaterials: ['feuerverzinkt'],
      defaults: {
        supportCount: 2,
        platformMaterial: 'douglasie',
        railingStyle: 'bars',
        frameMaterial: 'feuerverzinkt',
      },
      limits: {
        width: { min: 2, max: 5, default: 3 },
        depth: { min: 1, max: 2, default: 1.5 },
        platformHeight: { min: 1, max: 3, default: 2.5 },
        railingHeight: { min: 0.9, max: 1.2, default: 1.1 },
      },
    },
    'balkonpro-premium': {
      id: 'balkonpro-premium',
      manufacturerId: 'balkonpro',
      name: 'Premium-Linie',
      description: 'Hochwertig mit Glasgeländer',
      allowedSupportCounts: [4, 6],
      allowedPlatformMaterials: ['wpc', 'alu'],
      allowedRailingStyles: ['glass', 'glass-double'],
      allowedFrameMaterials: ['pu-lackiert', 'feuerverzinkt'],
      defaults: {
        supportCount: 4,
        platformMaterial: 'wpc',
        railingStyle: 'glass',
        frameMaterial: 'pu-lackiert',
      },
      limits: {
        width: { min: 2, max: 6, default: 4 },
        depth: { min: 1.2, max: 3, default: 2 },
        platformHeight: { min: 1, max: 4, default: 2.5 },
        railingHeight: { min: 1, max: 1.3, default: 1.1 },
      },
    },
    'terrassenbau-eco': {
      id: 'terrassenbau-eco',
      manufacturerId: 'terrassenbau',
      name: 'Eco-Linie',
      description: 'Preiswert und funktional',
      allowedSupportCounts: [2, 4],
      allowedPlatformMaterials: ['douglasie'],
      allowedRailingStyles: ['bars'],
      allowedFrameMaterials: ['feuerverzinkt'],
      defaults: {
        supportCount: 2,
        platformMaterial: 'douglasie',
        railingStyle: 'bars',
        frameMaterial: 'feuerverzinkt',
      },
      limits: {
        width: { min: 1.5, max: 4, default: 2.5 },
        depth: { min: 0.8, max: 1.5, default: 1.2 },
        platformHeight: { min: 0.5, max: 2.5, default: 2 },
        railingHeight: { min: 0.9, max: 1.1, default: 1 },
      },
    },
    'terrassenbau-glas': {
      id: 'terrassenbau-glas',
      manufacturerId: 'terrassenbau',
      name: 'Glas-Linie',
      description: 'Modern mit Glasgeländer',
      allowedSupportCounts: [2, 3, 4, 6],
      allowedPlatformMaterials: ['wpc', 'alu'],
      allowedRailingStyles: ['glass', 'glass-double'],
      allowedFrameMaterials: ['pu-lackiert'],
      defaults: {
        supportCount: 3,
        platformMaterial: 'alu',
        railingStyle: 'glass-double',
        frameMaterial: 'pu-lackiert',
      },
      limits: {
        width: { min: 2, max: 6, default: 3.5 },
        depth: { min: 1, max: 2.5, default: 1.8 },
        platformHeight: { min: 1, max: 4, default: 3 },
        railingHeight: { min: 1, max: 1.4, default: 1.2 },
      },
    },
  },
};

// Helper-Funktionen
export function getManufacturer(slug: string) {
  return manufacturerConfig.manufacturers[slug] || null;
}

export function getPreset(id: string) {
  return manufacturerConfig.presets[id] || null;
}

export function getPresetsForManufacturer(manufacturerSlug: string) {
  const manufacturer = getManufacturer(manufacturerSlug);
  if (!manufacturer) return [];
  return manufacturer.presets.map(id => getPreset(id)).filter(Boolean);
}

export function getAllManufacturers() {
  return Object.values(manufacturerConfig.manufacturers);
}

export function getAllPresets() {
  return Object.values(manufacturerConfig.presets);
}
