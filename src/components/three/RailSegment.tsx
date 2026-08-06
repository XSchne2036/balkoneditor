import * as THREE from 'three';

export type RailArt = 'stahl' | 'glas' | 'alublech';

export interface RailSegmentProps {
  /** Horizontale Länge des Segments (m) */
  len: number;
  art: RailArt;
  /** Geländer-ID (Variante) */
  id: string;
  frameColor: string;
  color?: string;
  /** Geländerhöhe (m) */
  height?: number;
  /** Steigung in rad (0 = waagerecht, negativ = fällt in +X) */
  slope?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Ein Geländer-Segment (Handlauf, Pfosten, Füllung) — wird sowohl für das
 * Balkongeländer als auch für die Treppe verwendet, damit beide identisch aussehen.
 */
export const RailSegment = ({
  len,
  art,
  id,
  frameColor,
  color = '#8a8378',
  height = 1.1,
  slope = 0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: RailSegmentProps) => {
  const h = height;
  const tan = Math.tan(slope);
  const railLen = len / Math.cos(slope);
  const baseY = (x: number) => tan * x;
  const posts = Math.max(2, Math.ceil(len / 1.5) + 1);
  const barCount = Math.max(2, Math.floor(len / 0.12));

  return (
    <group position={position} rotation={rotation}>
      {/* Handlauf */}
      <mesh position={[0, h, 0]} rotation={[0, 0, slope]} castShadow>
        <boxGeometry args={[railLen, 0.06, 0.06]} />
        <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.35} />
      </mesh>

      {/* Pfosten */}
      {Array.from({ length: posts }).map((_, p) => {
        const x = -len / 2 + (len / (posts - 1)) * p;
        return (
          <mesh key={p} position={[x, baseY(x) + h / 2, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, h, 12]} />
            <meshStandardMaterial color={frameColor} metalness={0.7} roughness={0.35} />
          </mesh>
        );
      })}

      {/* Füllung */}
      {art === 'glas' && (
        <mesh position={[0, h / 2, 0]} rotation={[0, 0, slope]} castShadow>
          <boxGeometry args={[railLen - 0.08, h - 0.12, 0.012]} />
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
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {art === 'alublech' && (
        <mesh position={[0, h / 2, 0]} rotation={[0, 0, slope]}>
          <boxGeometry args={[railLen - 0.08, h - 0.12, 0.012]} />
          <meshStandardMaterial color={color} metalness={0.85} roughness={0.3} />
        </mesh>
      )}

      {art === 'stahl' &&
        (id === '002'
          ? Array.from({ length: 4 }).map((_, b) => (
              <mesh key={b} position={[0, 0.22 + b * 0.28, 0]} rotation={[0, 0, slope]}>
                <boxGeometry args={[railLen - 0.08, 0.05, 0.012]} />
                <meshStandardMaterial color={frameColor} metalness={0.8} roughness={0.3} />
              </mesh>
            ))
          : Array.from({ length: barCount }).map((_, b, arr) => {
              const x = -len / 2 + 0.06 + (b * (len - 0.12)) / (arr.length - 1);
              return (
                <mesh key={b} position={[x, baseY(x) + h / 2, 0]}>
                  <cylinderGeometry args={[0.012, 0.012, h - 0.12, 8]} />
                  <meshStandardMaterial
                    color={id === '003' ? '#d3d8db' : frameColor}
                    metalness={0.9}
                    roughness={id === '003' ? 0.15 : 0.35}
                  />
                </mesh>
              );
            }))}
    </group>
  );
};

export default RailSegment;
