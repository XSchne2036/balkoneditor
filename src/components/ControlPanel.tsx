import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Box, Ruler, ArrowUpDown, Columns, Palette, Shield, Wrench } from 'lucide-react';
import type { PlatformMaterial, RailingStyle, FrameMaterial } from './BalconyModel';
import type { Preset } from '@/types/manufacturer';

interface ControlPanelProps {
  width: number;
  depth: number;
  platformHeight: number;
  railingHeight: number;
  supportCount: 2 | 3 | 4 | 6;
  platformMaterial: PlatformMaterial;
  railingStyle: RailingStyle;
  frameMaterial: FrameMaterial;
  onWidthChange: (value: number) => void;
  onDepthChange: (value: number) => void;
  onPlatformHeightChange: (value: number) => void;
  onRailingHeightChange: (value: number) => void;
  onSupportCountChange: (value: 2 | 3 | 4 | 6) => void;
  onPlatformMaterialChange: (value: PlatformMaterial) => void;
  onRailingStyleChange: (value: RailingStyle) => void;
  onFrameMaterialChange: (value: FrameMaterial) => void;
  onResetCamera: () => void;
  preset?: Preset; // Optional: Filtert Optionen basierend auf Preset
}

interface ParameterControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: React.ReactNode;
  onChange: (value: number) => void;
}

const ParameterControl = ({ label, value, min, max, step, unit, icon, onChange }: ParameterControlProps) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <span className="control-label !mb-0">{label}</span>
      </div>
      <span className="control-value">
        {value.toFixed(2)} {unit}
      </span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={([val]) => onChange(val)}
      className="w-full"
    />
  </div>
);

const PLATFORM_MATERIAL_LABELS: Record<PlatformMaterial, string> = {
  douglasie: 'Douglasie (Holz)',
  wpc: 'WPC-Dielen',
  alu: 'Aluschienen',
};

const RAILING_STYLE_LABELS: Record<RailingStyle, string> = {
  'glass': 'Edelstahl verglast',
  'glass-double': 'Edelstahl verglast (doppelter Handlauf)',
  'bars': 'Edelstahl mit Rundstäben',
};

const FRAME_MATERIAL_LABELS: Record<FrameMaterial, string> = {
  'pu-lackiert': 'Baustahl PU-Lackiert',
  'feuerverzinkt': 'Baustahl Feuerverzinkt',
};

export const ControlPanel = ({
  width,
  depth,
  platformHeight,
  railingHeight,
  supportCount,
  platformMaterial,
  railingStyle,
  frameMaterial,
  onWidthChange,
  onDepthChange,
  onPlatformHeightChange,
  onRailingHeightChange,
  onSupportCountChange,
  onPlatformMaterialChange,
  onRailingStyleChange,
  onFrameMaterialChange,
  onResetCamera,
  preset,
}: ControlPanelProps) => {
  // Helper: Filtere Optionen basierend auf Preset
  const filterByPreset = <T extends string | number>(
    allOptions: T[],
    allowedOptions?: T[]
  ): T[] => {
    if (!allowedOptions || allowedOptions.length === 0) return allOptions;
    return allOptions.filter((opt) => allowedOptions.includes(opt));
  };

  // Limits aus Preset oder Defaults
  const limits = preset?.limits ?? {
    width: { min: 1, max: 6 },
    depth: { min: 0.8, max: 3 },
    platformHeight: { min: 0.5, max: 4 },
    railingHeight: { min: 0.8, max: 1.5 },
  };

  // Gefilterte Optionen
  const availableSupportCounts = filterByPreset([2, 3, 4, 6] as const, preset?.allowedSupportCounts);
  const availablePlatformMaterials = filterByPreset(
    ['douglasie', 'wpc', 'alu'] as PlatformMaterial[],
    preset?.allowedPlatformMaterials
  );
  const availableRailingStyles = filterByPreset(
    ['glass', 'glass-double', 'bars'] as RailingStyle[],
    preset?.allowedRailingStyles
  );
  const availableFrameMaterials = filterByPreset(
    ['pu-lackiert', 'feuerverzinkt'] as FrameMaterial[],
    preset?.allowedFrameMaterials
  );
  return (
    <div className="control-panel space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Balkon-Parameter</h2>
          <p className="text-xs text-muted-foreground mt-1">Maße in Echtzeit anpassen</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onResetCamera}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Ansicht zurücksetzen
        </Button>
      </div>

      <div className="space-y-5">
        <ParameterControl
          label="Plattformbreite"
          value={width}
          min={limits.width.min}
          max={limits.width.max}
          step={0.1}
          unit="m"
          icon={<Ruler className="h-4 w-4" />}
          onChange={onWidthChange}
        />

        <ParameterControl
          label="Plattformtiefe"
          value={depth}
          min={limits.depth.min}
          max={limits.depth.max}
          step={0.1}
          unit="m"
          icon={<Box className="h-4 w-4" />}
          onChange={onDepthChange}
        />

        <ParameterControl
          label="Plattformhöhe"
          value={platformHeight}
          min={limits.platformHeight.min}
          max={limits.platformHeight.max}
          step={0.1}
          unit="m"
          icon={<ArrowUpDown className="h-4 w-4" />}
          onChange={onPlatformHeightChange}
        />

        <ParameterControl
          label="Geländerhöhe"
          value={railingHeight}
          min={limits.railingHeight.min}
          max={limits.railingHeight.max}
          step={0.05}
          unit="m"
          icon={<ArrowUpDown className="h-4 w-4" />}
          onChange={onRailingHeightChange}
        />

        {/* Support count selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-primary"><Columns className="h-4 w-4" /></span>
            <span className="control-label !mb-0">Anzahl Stützen</span>
          </div>
          <Select
            value={String(supportCount)}
            onValueChange={(val) => onSupportCountChange(Number(val) as 2 | 3 | 4 | 6)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {availableSupportCounts.includes(2) && (
                <SelectItem value="2">2 Stützen (nur vorne)</SelectItem>
              )}
              {availableSupportCounts.includes(3) && (
                <SelectItem value="3">3 Stützen (nur vorne)</SelectItem>
              )}
              {availableSupportCounts.includes(4) && (
                <SelectItem value="4">4 Stützen (vorne + hinten)</SelectItem>
              )}
              {availableSupportCounts.includes(6) && (
                <SelectItem value="6">6 Stützen (vorne + hinten)</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Platform material selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-primary"><Palette className="h-4 w-4" /></span>
            <span className="control-label !mb-0">Bodenbelag</span>
          </div>
          <Select
            value={platformMaterial}
            onValueChange={(val) => onPlatformMaterialChange(val as PlatformMaterial)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {availablePlatformMaterials.map((key) => (
                <SelectItem key={key} value={key}>
                  {PLATFORM_MATERIAL_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Railing style selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-primary"><Shield className="h-4 w-4" /></span>
            <span className="control-label !mb-0">Geländerart</span>
          </div>
          <Select
            value={railingStyle}
            onValueChange={(val) => onRailingStyleChange(val as RailingStyle)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {availableRailingStyles.map((key) => (
                <SelectItem key={key} value={key}>
                  {RAILING_STYLE_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Frame material selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-primary"><Wrench className="h-4 w-4" /></span>
            <span className="control-label !mb-0">Gestell</span>
          </div>
          <Select
            value={frameMaterial}
            onValueChange={(val) => onFrameMaterialChange(val as FrameMaterial)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {availableFrameMaterials.map((key) => (
                <SelectItem key={key} value={key}>
                  {FRAME_MATERIAL_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground font-mono">
          <div>
            <span className="block text-foreground/60">Gesamthöhe</span>
            <span className="text-foreground">{(platformHeight + railingHeight).toFixed(2)} m</span>
          </div>
          <div>
            <span className="block text-foreground/60">Grundfläche</span>
            <span className="text-foreground">{(width * depth).toFixed(2)} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};
