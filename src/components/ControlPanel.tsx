import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw, Box, Ruler, ArrowUpDown } from 'lucide-react';

interface ControlPanelProps {
  width: number;
  depth: number;
  platformHeight: number;
  railingHeight: number;
  onWidthChange: (value: number) => void;
  onDepthChange: (value: number) => void;
  onPlatformHeightChange: (value: number) => void;
  onRailingHeightChange: (value: number) => void;
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

export const ControlPanel = ({
  width,
  depth,
  platformHeight,
  railingHeight,
  onWidthChange,
  onDepthChange,
  onPlatformHeightChange,
  onRailingHeightChange,
  onResetCamera,
}: ControlPanelProps) => {
  return (
    <div className="control-panel space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Balcony Parameters</h2>
          <p className="text-xs text-muted-foreground mt-1">Adjust dimensions in real-time</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onResetCamera}
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset View
        </Button>
      </div>

      <div className="space-y-5">
        <ParameterControl
          label="Platform Width"
          value={width}
          min={1}
          max={6}
          step={0.1}
          unit="m"
          icon={<Ruler className="h-4 w-4" />}
          onChange={onWidthChange}
        />

        <ParameterControl
          label="Platform Depth"
          value={depth}
          min={0.8}
          max={3}
          step={0.1}
          unit="m"
          icon={<Box className="h-4 w-4" />}
          onChange={onDepthChange}
        />

        <ParameterControl
          label="Platform Height"
          value={platformHeight}
          min={0.5}
          max={4}
          step={0.1}
          unit="m"
          icon={<ArrowUpDown className="h-4 w-4" />}
          onChange={onPlatformHeightChange}
        />

        <ParameterControl
          label="Railing Height"
          value={railingHeight}
          min={0.8}
          max={1.5}
          step={0.05}
          unit="m"
          icon={<ArrowUpDown className="h-4 w-4" />}
          onChange={onRailingHeightChange}
        />
      </div>

      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground font-mono">
          <div>
            <span className="block text-foreground/60">Total Height</span>
            <span className="text-foreground">{(platformHeight + railingHeight).toFixed(2)} m</span>
          </div>
          <div>
            <span className="block text-foreground/60">Floor Area</span>
            <span className="text-foreground">{(width * depth).toFixed(2)} m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};
