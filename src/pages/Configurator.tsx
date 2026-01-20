import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Scene } from '@/components/Scene';
import { ControlPanel } from '@/components/ControlPanel';
import { getManufacturer, getPreset } from '@/data/manufacturers';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { PlatformMaterial, RailingStyle, FrameMaterial } from '@/components/BalconyModel';
import type { Preset } from '@/types/manufacturer';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConfiguratorPage = () => {
  const { manufacturer: manufacturerSlug, preset: presetId } = useParams<{
    manufacturer: string;
    preset: string;
  }>();

  const [activePreset, setActivePreset] = useState<Preset | null>(null);
  const [manufacturerName, setManufacturerName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // State mit Defaults - wird durch Preset überschrieben
  const [width, setWidth] = useState(3);
  const [depth, setDepth] = useState(1.5);
  const [platformHeight, setPlatformHeight] = useState(2.5);
  const [railingHeight, setRailingHeight] = useState(1.1);
  const [supportCount, setSupportCount] = useState<2 | 3 | 4 | 6>(2);
  const [platformMaterial, setPlatformMaterial] = useState<PlatformMaterial>('douglasie');
  const [railingStyle, setRailingStyle] = useState<RailingStyle>('glass');
  const [frameMaterial, setFrameMaterial] = useState<FrameMaterial>('pu-lackiert');

  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  // Lade Manufacturer und Preset beim Mount
  useEffect(() => {
    if (!manufacturerSlug || !presetId) {
      setError('Ungültige URL: Manufacturer und Preset erforderlich');
      return;
    }

    const manufacturer = getManufacturer(manufacturerSlug);
    if (!manufacturer) {
      setError(`Balkonbauer "${manufacturerSlug}" nicht gefunden`);
      return;
    }

    const preset = getPreset(presetId);
    if (!preset || preset.manufacturerId !== manufacturer.id) {
      setError(`Produktlinie "${presetId}" nicht gefunden oder gehört nicht zu ${manufacturer.name}`);
      return;
    }

    // Preset gefunden - initialisiere Werte
    setManufacturerName(manufacturer.name);
    setActivePreset(preset);
    setError(null);

    // Setze Defaults aus Preset
    setWidth(preset.limits.width.default);
    setDepth(preset.limits.depth.default);
    setPlatformHeight(preset.limits.platformHeight.default);
    setRailingHeight(preset.limits.railingHeight.default);
    setSupportCount(preset.defaults.supportCount);
    setPlatformMaterial(preset.defaults.platformMaterial);
    setRailingStyle(preset.defaults.railingStyle);
    setFrameMaterial(preset.defaults.frameMaterial);
  }, [manufacturerSlug, presetId]);

  const handleControlsRef = useCallback((ref: OrbitControlsImpl | null) => {
    controlsRef.current = ref;
  }, []);

  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="text-center space-y-4 p-8">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">Konfigurationsfehler</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zur Startseite
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Loading State
  if (!activePreset) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Konfiguration wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-background">
      {/* 3D Canvas */}
      <div className="flex-1 relative min-h-[50vh] lg:min-h-0">
        <Scene
          width={width}
          depth={depth}
          platformHeight={platformHeight}
          railingHeight={railingHeight}
          supportCount={supportCount}
          platformMaterial={platformMaterial}
          railingStyle={railingStyle}
          frameMaterial={frameMaterial}
          onControlsRef={handleControlsRef}
        />

        {/* Canvas overlay info */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground font-mono bg-card/80 backdrop-blur-sm px-3 py-2 rounded-md border border-border">
          <span className="text-primary">●</span> Ziehen zum Drehen • Scrollen zum Zoomen • Rechtsklick zum Verschieben
        </div>

        {/* Title overlay */}
        <div className="absolute top-4 left-4">
          <p className="text-xs text-muted-foreground mb-1">{manufacturerName}</p>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">
            {activePreset.name}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{activePreset.description}</p>
        </div>

        {/* Back link */}
        <Link
          to="/"
          className="absolute top-4 right-4 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          Übersicht
        </Link>
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-80 xl:w-96 p-4 lg:p-6 bg-card/50 border-t lg:border-t-0 lg:border-l border-border overflow-y-auto">
        <ControlPanel
          width={width}
          depth={depth}
          platformHeight={platformHeight}
          railingHeight={railingHeight}
          supportCount={supportCount}
          platformMaterial={platformMaterial}
          railingStyle={railingStyle}
          frameMaterial={frameMaterial}
          onWidthChange={setWidth}
          onDepthChange={setDepth}
          onPlatformHeightChange={setPlatformHeight}
          onRailingHeightChange={setRailingHeight}
          onSupportCountChange={setSupportCount}
          onPlatformMaterialChange={setPlatformMaterial}
          onRailingStyleChange={setRailingStyle}
          onFrameMaterialChange={setFrameMaterial}
          onResetCamera={handleResetCamera}
          preset={activePreset}
        />
      </div>
    </div>
  );
};

export default ConfiguratorPage;
