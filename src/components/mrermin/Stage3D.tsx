import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import { Suspense, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useConfigurator } from '@/store/mrermin';
import { GELAENDER, RAL_FARBEN, WANDSTRUKTUREN, WPC_FARBEN, BELAG_TYPEN } from '@/lib/mrermin-data';
import { makeDeckTexture } from '@/lib/deck-texture';
import { Staircase } from '@/components/three/Staircase';

const steelColor = (oberflaeche: string) => {
  if (oberflaeche === 'feuerverzinkt') return '#b9c0c4';
  return RAL_FARBEN.find((r) => r.code === oberflaeche)?.hex ?? '#b9c0c4';
};

const belagColor = (belag: ReturnType<typeof useConfigurator.getState>['data']['belag']) => {
  if (belag.typ === 'wpc') return WPC_FARBEN.find((f) => f.id === belag.wpcFarbe)?.color ?? '#5c554e';
  return BELAG_TYPEN.find((b) => b.id === belag.typ)!.color;
};

const Railing = ({
  width,
  depth,
  y,
  color,
  frameColor,
  art,
  id,
}: {
  width: number;
  depth: number;
  y: number;
  color: string;
  frameColor: string;
  art: 'stahl' | 'glas' | 'alublech';
  id: string;
}) => {
  const h = 1.1;
  const sides = useMemo(
    () => [
      { pos: [0, 0, depth / 2] as const, len: width, rot: 0 },
      { pos: [-width / 2, 0, 0] as const, len: depth, rot: Math.PI / 2 },
      { pos: [width / 2, 0, 0] as const, len: depth, rot: Math.PI / 2 },
    ],
    [width, depth]
  );

  return (
    <group position={[0, y, 0]}>
      {sides.map((s, i) => {
        const posts = Math.max(2, Math.ceil(s.len / 1.5) + 1);
        return (
          <group key={i} position={[s.pos[0], 0, s.pos[2]]} rotation={[0, s.rot, 0]}>
            {/* Handlauf */}
            <mesh position={[0, h, 0]} castShadow>
              <boxGeometry args={[s.len, 0.06, 0.06]} />
              <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.35} />
            </mesh>
            {/* Pfosten */}
            {Array.from({ length: posts }).map((_, p) => (
              <mesh
                key={p}
                position={[-s.len / 2 + (s.len / (posts - 1)) * p, h / 2, 0]}
                castShadow
              >
                <cylinderGeometry args={[0.04, 0.04, h, 12]} />
                <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.35} />
              </mesh>
            ))}
            {/* Füllung */}
            {art === 'glas' && (
              <mesh position={[0, h / 2, 0]} castShadow>
                <boxGeometry args={[s.len - 0.08, h - 0.12, 0.012]} />
                <meshPhysicalMaterial
                  color={id === '005' ? '#e6eef0' : '#dbeaf0'}
                  transparent
                  opacity={id === '005' ? 0.7 : 0.55}
                  roughness={id === '005' ? 0.35 : 0.05}
                  metalness={0}
                  transmission={0.9}
                  ior={1.45}
                  thickness={0.012}
                  clearcoat={1}
                  clearcoatRoughness={0.05}
                  envMapIntensity={1.2}
                />
              </mesh>
            )}
            {art === 'alublech' && (
              <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[s.len - 0.08, h - 0.12, 0.012]} />
                <meshStandardMaterial color={color} metalness={0.85} roughness={0.3} />
              </mesh>
            )}
            {art === 'stahl' &&
              (id === '002'
                ? Array.from({ length: 4 }).map((_, b) => (
                    <mesh key={b} position={[0, 0.22 + b * 0.28, 0]}>
                      <boxGeometry args={[s.len - 0.08, 0.05, 0.012]} />
                      <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
                    </mesh>
                  ))
                : Array.from({ length: Math.max(2, Math.floor(s.len / 0.12)) }).map((_, b, arr) => (
                    <mesh
                      key={b}
                      position={[-s.len / 2 + 0.06 + (b * (s.len - 0.12)) / (arr.length - 1), h / 2, 0]}
                    >
                      <cylinderGeometry args={[0.012, 0.012, h - 0.12, 8]} />
                      <meshStandardMaterial
                        color={id === '003' ? '#d3d8db' : frameColor}
                        metalness={0.9}
                        roughness={id === '003' ? 0.15 : 0.35}
                      />
                    </mesh>
                  )))}
          </group>
        );
      })}
    </group>
  );
};

const Deck = ({
  width,
  depth,
  y,
  steel,
  floorTexture,
}: {
  width: number;
  depth: number;
  y: number;
  steel: string;
  floorTexture: THREE.Texture;
}) => (
  <group position={[0, y, 0]}>
    <mesh castShadow receiveShadow position={[0, -0.09, 0]}>
      <boxGeometry args={[width, 0.18, depth]} />
      <meshStandardMaterial color={steel} metalness={0.65} roughness={0.4} />
    </mesh>
    <mesh receiveShadow position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width - 0.04, depth - 0.04]} />
      <meshStandardMaterial map={floorTexture} roughness={0.75} metalness={0.05} />
    </mesh>
  </group>
);

const Model = () => {
  const d = useConfigurator((s) => s.data);
  const steel = steelColor(d.oberflaeche);
  const gel = GELAENDER.find((g) => g.id === d.gelaender)!;
  const frame = d.gelaenderFarbe ? steelColor(d.gelaenderFarbe) : steel;
  const floor = belagColor(d.belag);
  const wand = WANDSTRUKTUREN.find((w) => w.id === d.wand)!;
  const h = d.podesthoehe;
  const etage2 = h + 2.7;

  // Nahtlos kachelnde Belagstextur (RepeatWrapping), Kachelung folgt den Maßen
  const floorTexture = useMemo(() => {
    const tex = makeDeckTexture(floor, Math.max(1, Math.round(d.breite)), Math.max(1, Math.round(d.tiefe)));
    return tex;
  }, [floor, d.breite, d.tiefe]);

  useEffect(() => () => floorTexture.dispose(), [floorTexture]);

  return (
    <group position={[0, 0, 0]}>
      {/* Wand-Hintergrund */}
      <mesh position={[0, 3.2, -d.tiefe / 2 - 0.15]} receiveShadow>
        <planeGeometry args={[Math.max(8, d.breite * 1.9), Math.max(7, d.podesthoehe + 4)]} />
        <meshStandardMaterial color={wand.color} roughness={0.95} />
      </mesh>

      <Deck width={d.breite} depth={d.tiefe} y={h} steel={steel} floorTexture={floorTexture} />
      <Railing width={d.breite} depth={d.tiefe} y={h} color={floor} frameColor={frame} art={gel.art} id={gel.id} />

      {d.etagen === 2 && (
        <>
          <Deck width={d.breite} depth={d.tiefe} y={etage2} steel={steel} floorTexture={floorTexture} />
          <Railing
            width={d.breite}
            depth={d.tiefe}
            y={etage2}
            color={floor}
            frameColor={frame}
            art={gel.art}
            id={gel.id}
          />
        </>
      )}

      {/* Stützen */}
      {d.tragvariante === 'wandseitig'
        ? [-1, 1].map((sx) => (
            <mesh
              key={sx}
              position={[(sx * (d.breite - 0.2)) / 2, (d.etagen === 2 ? etage2 : h) / 2, -d.tiefe / 2 + 0.12]}
              castShadow
            >
              <boxGeometry args={[0.12, d.etagen === 2 ? etage2 : h, 0.12]} />
              <meshStandardMaterial color={steel} metalness={0.7} roughness={0.4} />
            </mesh>
          ))
        : [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sz], i) => (
            <mesh
              key={i}
              position={[
                (sx * (d.breite - 0.2)) / 2,
                (d.etagen === 2 ? etage2 : h) / 2,
                (sz * (d.tiefe - 0.2)) / 2,
              ]}
              castShadow
            >
              <boxGeometry args={[0.1, d.etagen === 2 ? etage2 : h, 0.1]} />
              <meshStandardMaterial color={steel} metalness={0.7} roughness={0.4} />
            </mesh>
          ))}

      {/* Treppe */}
      {d.treppe === 'erweitert' && (
        <Staircase
          platformHeight={h}
          width={1.1}
          stepColor={floor}
          steelColor={steel}
          position={[d.breite / 2 + 0.75, 0, d.tiefe / 2 - 0.2]}
          rotation={[0, Math.PI / 2, 0]}
        />
      )}
    </group>
  );
};

const Effects = () => (
  <EffectComposer multisampling={4}>
    {/* Bloom auf Lichtspots / Highlights */}
    <Bloom intensity={0.55} luminanceThreshold={0.75} luminanceSmoothing={0.25} mipmapBlur />
    {/* Sanftes Depth-of-Field um den Balkon */}
    <DepthOfField focusDistance={0.014} focalLength={0.05} bokehScale={2.4} height={720} />
    <Vignette eskil={false} offset={0.18} darkness={0.55} />
  </EffectComposer>
);

export const Stage3D = () => {
  const anim = useConfigurator((s) => s.data.montageAnimation);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speed = { aus: 0, langsam: 0.4, normal: 1, schnell: 2.2 }[anim];

  return (
    <div className="h-full w-full" role="region" aria-label="3D-Vorschau des Balkons">
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        dpr={[1, 2]}
        camera={{ position: [7, 4.5, 8], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#EEF2F1']} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[4096, 4096]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        {/* Lichtspots für Bloom-Akzente */}
        <spotLight position={[-6, 8, 5]} angle={0.5} penumbra={0.8} intensity={40} distance={30} castShadow />
        <spotLight position={[5, 6, -6]} angle={0.6} penumbra={0.9} intensity={18} distance={30} color="#ffe9c4" />
        <Suspense fallback={null}>
          <Model />
          {/* 4K HDR Environment */}
          <Environment preset="city" resolution={4096} background={false} />
          <ContactShadows position={[0, 0, 0]} opacity={0.45} scale={22} blur={2.6} far={14} resolution={1024} />
          <Effects />
        </Suspense>
        <OrbitControls
          enableDamping
          autoRotate={!reduced && speed > 0}
          autoRotateSpeed={speed}
          minPolarAngle={0.3}
          maxPolarAngle={1.4}
          target={[0, 2, 0]}
        />
      </Canvas>
    </div>
  );
};
