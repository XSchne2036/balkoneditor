import { useState, useCallback, useRef } from 'react';
import { Scene } from '@/components/Scene';
import { ControlPanel } from '@/components/ControlPanel';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const Index = () => {
  const [width, setWidth] = useState(3);
  const [depth, setDepth] = useState(1.5);
  const [platformHeight, setPlatformHeight] = useState(2.5);
  const [railingHeight, setRailingHeight] = useState(1.1);
  
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  const handleControlsRef = useCallback((ref: OrbitControlsImpl | null) => {
    controlsRef.current = ref;
  }, []);

  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden bg-background">
      {/* 3D Canvas */}
      <div className="flex-1 relative min-h-[50vh] lg:min-h-0">
        <Scene
          width={width}
          depth={depth}
          platformHeight={platformHeight}
          railingHeight={railingHeight}
          onControlsRef={handleControlsRef}
        />
        
        {/* Canvas overlay info */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground font-mono bg-card/80 backdrop-blur-sm px-3 py-2 rounded-md border border-border">
          <span className="text-primary">●</span> Drag to rotate • Scroll to zoom • Right-click to pan
        </div>

        {/* Title overlay */}
        <div className="absolute top-4 left-4">
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">
            Balcony <span className="text-gradient">Configurator</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Real-time 3D parametric model</p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full lg:w-80 xl:w-96 p-4 lg:p-6 bg-card/50 border-t lg:border-t-0 lg:border-l border-border overflow-y-auto">
        <ControlPanel
          width={width}
          depth={depth}
          platformHeight={platformHeight}
          railingHeight={railingHeight}
          onWidthChange={setWidth}
          onDepthChange={setDepth}
          onPlatformHeightChange={setPlatformHeight}
          onRailingHeightChange={setRailingHeight}
          onResetCamera={handleResetCamera}
        />
      </div>
    </div>
  );
};

export default Index;
