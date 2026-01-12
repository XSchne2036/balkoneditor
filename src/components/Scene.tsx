import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { BalconyModel, type PlatformMaterial, type RailingStyle, type FrameMaterial } from './BalconyModel';
import { Suspense, useRef, useEffect } from 'react';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

interface SceneProps {
  width: number;
  depth: number;
  platformHeight: number;
  railingHeight: number;
  supportCount: 2 | 3 | 4 | 6;
  platformMaterial: PlatformMaterial;
  railingStyle: RailingStyle;
  frameMaterial: FrameMaterial;
  onControlsRef: (ref: OrbitControlsImpl | null) => void;
}

interface SceneContentProps {
  width: number;
  depth: number;
  platformHeight: number;
  railingHeight: number;
  supportCount: 2 | 3 | 4 | 6;
  platformMaterial: PlatformMaterial;
  railingStyle: RailingStyle;
  frameMaterial: FrameMaterial;
}

const SceneContent = ({ width, depth, platformHeight, railingHeight, supportCount, platformMaterial, railingStyle, frameMaterial }: SceneContentProps) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 8, -5]} intensity={0.4} />
      <hemisphereLight args={[0x87ceeb, 0x362d1f, 0.3]} />

      {/* Ground grid */}
      <Grid
        position={[0, 0, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#404050"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#606070"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />

      {/* Ground plane for shadows */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1d24" />
      </mesh>

      {/* Balcony model */}
      <BalconyModel
        width={width}
        depth={depth}
        platformHeight={platformHeight}
        railingHeight={railingHeight}
        supportCount={supportCount}
        platformMaterial={platformMaterial}
        railingStyle={railingStyle}
        frameMaterial={frameMaterial}
      />
    </>
  );
};

export const Scene = ({ width, depth, platformHeight, railingHeight, supportCount, platformMaterial, railingStyle, frameMaterial, onControlsRef }: SceneProps) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    if (controlsRef.current) {
      onControlsRef(controlsRef.current);
    }
  }, [onControlsRef]);

  return (
    <Canvas
      shadows
      camera={{
        position: [6, 5, 8],
        fov: 45,
        near: 0.1,
        far: 100,
      }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      className="canvas-container"
      style={{ background: '#12151a' }}
    >
      <fog attach="fog" args={['#12151a', 15, 30]} />
      
      <Suspense fallback={null}>
        <SceneContent
          width={width}
          depth={depth}
          platformHeight={platformHeight}
          railingHeight={railingHeight}
          supportCount={supportCount}
          platformMaterial={platformMaterial}
          railingStyle={railingStyle}
          frameMaterial={frameMaterial}
        />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 - 0.05}
        target={[0, 1.5, 0]}
      />
    </Canvas>
  );
};
