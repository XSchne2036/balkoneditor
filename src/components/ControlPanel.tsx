import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RotateCcw, Box, Ruler, ArrowUpDown, Columns, Palette } from 'lucide-react';
import type { MaterialPreset } from './BalconyModel';

interface ControlPanelProps {
  width: number;
  depth: number;
  platformHeight: number;
  railingHeight: number;
  supportCount: 2 | 3 | 4 | 6;
  material: MaterialPreset;
  onWidthChange: (value: number) => void;
  onDepthChange: (value: number) => void;
  onPlatformHeightChange: (value: number) => void;
  onRailingHeightChange: (value: number) => void;
  onSupportCountChange: (value: 2 | 3 | 4 | 6) => void;
  onMaterialChange: (value: MaterialPreset) => void;
  onResetCamera: () => void;
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

const MATERIAL_LABELS: Record<MaterialPreset, string> = {
  douglasie: 'Douglasie (Holz)',
  wpc: 'WPC-Dielen',
  alu: 'Aluminium',
};

export const ControlPanel = ({
  width,
  depth,
  platformHeight,
  railingHeight,
  supportCount,
  material,
  onWidthChange,
  onDepthChange,
  onPlatformHeightChange,
  onRailingHeightChange,
  onSupportCountChange,
  onMaterialChange,
  onResetCamera,
}: ControlPanelProps) => {
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
          min={1}
          max={6}
          step={0.1}
          unit="m"
          icon={<Ruler className="h-4 w-4" />}
          onChange={onWidthChange}
        />

        <ParameterControl
          label="Plattformtiefe"
          value={depth}
          min={0.8}
          max={3}
          step={0.1}
          unit="m"
          icon={<Box className="h-4 w-4" />}
          onChange={onDepthChange}
        />

        <ParameterControl
          label="Plattformhöhe"
          value={platformHeight}
          min={0.5}
          max={4}
          step={0.1}
          unit="m"
          icon={<ArrowUpDown className="h-4 w-4" />}
          onChange={onPlatformHeightChange}
        />

        <ParameterControl
          label="Geländerhöhe"
          value={railingHeight}
          min={0.8}
          max={1.5}
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
              <SelectItem value="2">2 Stützen</SelectItem>
              <SelectItem value="3">3 Stützen</SelectItem>
              <SelectItem value="4">4 Stützen</SelectItem>
              <SelectItem value="6">6 Stützen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Material selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-primary"><Palette className="h-4 w-4" /></span>
            <span className="control-label !mb-0">Material</span>
          </div>
          <Select
            value={material}
            onValueChange={(val) => onMaterialChange(val as MaterialPreset)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              {(Object.keys(MATERIAL_LABELS) as MaterialPreset[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {MATERIAL_LABELS[key]}
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
