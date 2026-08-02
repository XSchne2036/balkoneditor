import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useConfigurator } from '@/store/novodach';
import { GELAENDER, RAL_FARBEN, WANDSTRUKTUREN, WPC_FARBEN, BELAG_TYPEN } from '@/lib/novodach-data';

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
              <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[s.len - 0.08, h - 0.12, 0.008]} />
                <meshPhysicalMaterial
                  color={id === '005' ? '#dfe8ea' : '#cfe4ea'}
                  transparent
                  opacity={id === '005' ? 0.55 : 0.32}
                  roughness={id === '005' ? 0.6 : 0.05}
                  metalness={0}
                  transmission={id === '005' ? 0.4 : 0.85}
                  thickness={0.01}
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
  floor,
}: {
  width: number;
  depth: number;
  y: number;
  steel: string;
  floor: string;
}) => (
  <group position={[0, y, 0]}>
    <mesh castShadow receiveShadow position={[0, -0.09, 0]}>
      <boxGeometry args={[width, 0.18, depth]} />
      <meshStandardMaterial color={steel} metalness={0.65} roughness={0.4} />
    </mesh>
    <mesh receiveShadow position={[0, 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width - 0.04, depth - 0.04]} />
      <meshStandardMaterial color={floor} roughness={0.75} metalness={0.05} />
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

  return (
    <group position={[0, 0, 0]}>
      {/* Wand-Hintergrund */}
      <mesh position={[0, 3.2, -d.tiefe / 2 - 0.15]} receiveShadow>
        <planeGeometry args={[Math.max(8, d.breite * 1.9), Math.max(7, d.podesthoehe + 4)]} />
        <meshStandardMaterial color={wand.color} roughness={0.95} />
      </mesh>

      <Deck width={d.breite} depth={d.tiefe} y={h} steel={steel} floor={floor} />
      <Railing width={d.breite} depth={d.tiefe} y={h} color={floor} frameColor={frame} art={gel.art} id={gel.id} />

      {d.etagen === 2 && (
        <>
          <Deck width={d.breite} depth={d.tiefe} y={etage2} steel={steel} floor={floor} />
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
      {d.treppe === 'erweitert' &&
        Array.from({ length: 4 }).map((_, i) => {
          const stepH = h / 5;
          return (
            <mesh
              key={i}
              castShadow
              receiveShadow
              position={[
                d.breite / 2 + 0.6,
                stepH * (i + 1) - stepH / 2,
                d.tiefe / 2 - 0.4 - i * 0.34,
              ]}
            >
              <boxGeometry args={[d.tiefe * 0.6, stepH, 0.32]} />
              <meshStandardMaterial color={floor} roughness={0.8} />
            </mesh>
          );
        })}
    </group>
  );
};

export const Stage3D = () => {
  const anim = useConfigurator((s) => s.data.montageAnimation);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const speed = { aus: 0, langsam: 0.4, normal: 1, schnell: 2.2 }[anim];

  return (
    <div className="h-full w-full" role="region" aria-label="3D-Vorschau des Balkons">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [7, 4.5, 8], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={['#EEF2F1']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[8, 12, 6]} intensity={1.4} castShadow shadow-mapSize={[2048, 2048]} />
        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
          <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={20} blur={2.4} far={12} />
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
