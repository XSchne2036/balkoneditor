import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import { Suspense, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useConfigurator } from '@/store/mrermin';
import { GELAENDER, RAL_FARBEN, WANDSTRUKTUREN, WPC_FARBEN, BELAG_TYPEN } from '@/lib/mrermin-data';
import { makeDeckTexture } from '@/lib/deck-texture';
import { Staircase } from '@/components/three/Staircase';
import { RailSegment } from '@/components/three/RailSegment';


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
  stairPosition,
}: {
  width: number;
  depth: number;
  y: number;
  color: string;
  frameColor: string;
  art: 'stahl' | 'glas' | 'alublech';
  id: string;
  stairPosition?: 'vorn-links' | 'vorn-rechts' | 'seitlich-links' | 'seitlich-rechts';
}) => {
  const h = 1.1;
  const sides = useMemo(() => {
    const opening = Math.min(1.1, width - 0.3, depth - 0.3);
    const segments: { pos: readonly [number, number, number]; len: number; rot: number }[] = [];
    const addFront = (from: number, to: number) => {
      if (to - from > 0.1) segments.push({ pos: [(from + to) / 2, 0, depth / 2], len: to - from, rot: 0 });
    };
    const addSide = (x: number, from: number, to: number) => {
      if (to - from > 0.1) {
        // Lokale X-Achse zeigt bei +90° in Richtung -Z.
        segments.push({ pos: [x, 0, -(from + to) / 2], len: to - from, rot: Math.PI / 2 });
      }
    };

    if (stairPosition === 'vorn-links') addFront(-width / 2 + opening, width / 2);
    else if (stairPosition === 'vorn-rechts') addFront(-width / 2, width / 2 - opening);
    else addFront(-width / 2, width / 2);

    if (stairPosition === 'seitlich-links') addSide(-width / 2, -depth / 2 + opening, depth / 2);
    else addSide(-width / 2, -depth / 2, depth / 2);

    if (stairPosition === 'seitlich-rechts') addSide(width / 2, -depth / 2 + opening, depth / 2);
    else addSide(width / 2, -depth / 2, depth / 2);
    return segments;
  }, [width, depth, stairPosition]);

  return (
    <group position={[0, y, 0]}>
      {sides.map((s, i) => (
        <RailSegment
          key={i}
          len={s.len}
          art={art}
          id={id}
          frameColor={frameColor}
          color={color}
          height={h}
          position={[s.pos[0], 0, s.pos[2]]}
          rotation={[0, s.rot, 0]}
        />
      ))}
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
  const stairPosition = d.treppenPosition ?? 'vorn-rechts';
  const stairWidth = 1.1;
  const landingDepth = 0.9;

  const stairLayout = useMemo(() => {
    type Rail = { pos: [number, number, number]; len: number; rot: number };
    const frontX = stairPosition === 'vorn-links'
      ? -d.breite / 2 + stairWidth / 2
      : d.breite / 2 - stairWidth / 2;
    if (stairPosition === 'vorn-links' || stairPosition === 'vorn-rechts') {
      const lz = d.tiefe / 2 + landingDepth / 2;
      return {
        stair: [frontX, 0, d.tiefe / 2 + landingDepth] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        landing: [frontX, h, lz] as [number, number, number],
        landingSize: [stairWidth, 0.16, landingDepth] as [number, number, number],
        landingRails: [
          { pos: [frontX - stairWidth / 2, h, lz], len: landingDepth, rot: Math.PI / 2 },
          { pos: [frontX + stairWidth / 2, h, lz], len: landingDepth, rot: Math.PI / 2 },
        ] as Rail[],
      };
    }
    const dir = stairPosition === 'seitlich-links' ? -1 : 1;
    const sideX = dir * (d.breite / 2 + stairWidth / 2);
    const lz = -d.tiefe / 2 + landingDepth / 2;
    return {
      // Podest sitzt hinten (wandseitig) neben dem Balkon,
      // die Treppe läuft von dort parallel zur Wand seitlich nach außen.
      stair: [dir * (d.breite / 2 + stairWidth), 0, lz] as [number, number, number],
      rotation: [0, (dir * Math.PI) / 2, 0] as [number, number, number],
      landing: [sideX, h, lz] as [number, number, number],
      landingSize: [stairWidth, 0.16, landingDepth] as [number, number, number],
      landingRails: [
        { pos: [sideX, h, -d.tiefe / 2 + landingDepth], len: stairWidth, rot: 0 },
        { pos: [sideX, h, -d.tiefe / 2], len: stairWidth, rot: 0 },
      ] as Rail[],
    };
  }, [stairPosition, d.breite, d.tiefe, h]);


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
      <Railing
        width={d.breite}
        depth={d.tiefe}
        y={h}
        color={floor}
        frameColor={frame}
        art={gel.art}
        id={gel.id}
        stairPosition={d.treppe === 'erweitert' ? stairPosition : undefined}
      />

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
        <>
          <group position={stairLayout.landing}>
            <mesh position={[0, -0.08, 0]} castShadow receiveShadow>
              <boxGeometry args={stairLayout.landingSize} />
              <meshStandardMaterial color={steel} metalness={0.7} roughness={0.38} />
            </mesh>
            <mesh position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
              <planeGeometry args={[stairLayout.landingSize[0] - 0.04, stairLayout.landingSize[2] - 0.04]} />
              <meshStandardMaterial map={floorTexture} roughness={0.75} metalness={0.05} />
            </mesh>
          </group>
          <Staircase
            platformHeight={h}
            width={stairWidth}
            stepColor={floor}
            steelColor={steel}
            position={stairLayout.stair}
            rotation={stairLayout.rotation}
          />
        </>
      )}
    </group>
  );
};

const Effects = () => (
  <EffectComposer multisampling={4}>
    {/* Bloom auf Lichtspots / Highlights */}
    <Bloom intensity={0.55} luminanceThreshold={0.75} luminanceSmoothing={0.25} mipmapBlur />
    {/* Sanftes Depth-of-Field um den Balkon */}
    {/* Sehr dezente Tiefenschärfe – Balkon bleibt scharf */}
    <DepthOfField focusDistance={0.03} focalLength={0.35} bokehScale={1.1} height={480} />
    <Vignette eskil={false} offset={0.3} darkness={0.35} />
  </EffectComposer>
);

export const Stage3D = () => {
  const anim = useConfigurator((s) => s.data.montageAnimation);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speed = { aus: 0, langsam: 0.4, normal: 1, schnell: 2.2 }[anim];

  return (
    <div className="h-full w-full bg-background" role="region" aria-label="3D-Vorschau des Balkons">
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        dpr={[1, 2]}
        camera={{ position: [7, 4.5, 8], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          powerPreference: 'high-performance',
          alpha: true,
        }}
      >
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
