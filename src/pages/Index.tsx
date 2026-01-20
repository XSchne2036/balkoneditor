import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Scene } from '@/components/Scene';
import { ControlPanel } from '@/components/ControlPanel';
import { getAllManufacturers, getPresetsForManufacturer } from '@/data/manufacturers';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { PlatformMaterial, RailingStyle, FrameMaterial } from '@/components/BalconyModel';
import { Settings, Building2, Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [width, setWidth] = useState(3);
  const [depth, setDepth] = useState(1.5);
  const [platformHeight, setPlatformHeight] = useState(2.5);
  const [railingHeight, setRailingHeight] = useState(1.1);
  const [supportCount, setSupportCount] = useState<2 | 3 | 4 | 6>(2);
  const [platformMaterial, setPlatformMaterial] = useState<PlatformMaterial>('douglasie');
  const [railingStyle, setRailingStyle] = useState<RailingStyle>('glass');
  const [frameMaterial, setFrameMaterial] = useState<FrameMaterial>('pu-lackiert');

  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const handleControlsRef = useCallback((ref: OrbitControlsImpl | null) => {
    controlsRef.current = ref;
  }, []);

  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  const manufacturers = getAllManufacturers();

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
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">
            Balkon-<span className="text-gradient">Konfigurator</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Echtzeit 3D-Modell</p>
        </div>

        {/* Admin link */}
        <Link
          to="/admin"
          className="absolute top-4 right-4 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <Settings className="h-3 w-3" />
          Admin
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
        />

        {/* Manufacturer Presets Section */}
        <div className="mt-6 pt-6 border-t border-border space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Balkonbauer-Konfigurationen
          </h3>
          <p className="text-xs text-muted-foreground">
            Wähle einen Balkonbauer für spezifische Produktlinien:
          </p>
          <div className="space-y-3">
            {manufacturers.map((manufacturer) => {
              const presets = getPresetsForManufacturer(manufacturer.slug);
              return (
                <Card key={manufacturer.id} className="border-border">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm">{manufacturer.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3 pt-0">
                    <div className="space-y-1">
                      {presets.map((preset) => (
                        <Link
                          key={preset!.id}
                          to={`/c/${manufacturer.slug}/${preset!.id}`}
                          className="flex items-center justify-between p-2 rounded-md text-xs hover:bg-primary/10 transition-colors group"
                        >
                          <div>
                            <div className="font-medium">{preset!.name}</div>
                            <div className="text-muted-foreground">{preset!.description}</div>
                          </div>
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
