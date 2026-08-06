import { useMemo } from 'react';
import * as THREE from 'three';
import { RailSegment, type RailArt } from '@/components/three/RailSegment';

/** 5 mm — oberste Stufe wird um diesen Betrag angehoben, damit sie das Podest berührt. */
export const TOP_GAP_TO_PLATFORM = 0.005;

export interface StaircaseProps {
  /** Höhe der Podest-Oberkante über OKFF (m) */
  platformHeight: number;
  /** Nutzbare Treppenbreite (m) */
  width?: number;
  /** Angestrebte Steigung pro Stufe (m) */
  targetRiser?: number;
  /** Auftritt (m) */
  tread?: number;
  /** Dicke der Stufenplatte (m) */
  stepThickness?: number;
  /** Farbe der Stufen (Bodenbelag) */
  stepColor?: string;
  /** Farbe der Wangen / Handlauf (Stahl) */
  steelColor?: string;
  /** Geländer-Art wie am Balkon */
  railArt?: RailArt;
  /** Geländer-Variante (ID) wie am Balkon */
  railId?: string;
  /** Farbe des Treppengeländers (wie Balkongeländer) */
  railFrameColor?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Parametrische Außentreppe: Stufen, durchgehende Stahl-Wangen (überlappend,
 * keine Spalte) und ein Geländer identisch zum Balkongeländer.
 */
export const Staircase = ({
  platformHeight,
  width = 1.1,
  targetRiser = 0.18,
  tread = 0.29,
  stepThickness = 0.05,
  stepColor = '#8a8378',
  steelColor = '#b9c0c4',
  railArt = 'stahl',
  railId = '001',
  railFrameColor,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: StaircaseProps) => {

  // Podesthöhe inkl. 5 mm Zuschlag, damit die oberste Stufe das Podest berührt
  const totalRise = platformHeight + TOP_GAP_TO_PLATFORM;

  const { steps, riser, run } = useMemo(() => {
    const count = Math.max(2, Math.round(totalRise / targetRiser));
    const r = totalRise / count;
    return { steps: count, riser: r, run: count * tread };
  }, [totalRise, targetRiser, tread]);

  const stepMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: stepColor, roughness: 0.8, metalness: 0.05 }),
    [stepColor]
  );
  const steelMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: steelColor, roughness: 0.35, metalness: 0.85 }),
    [steelColor]
  );

  // Stufenpositionen: z = 0 an der Podestkante, Treppe läuft in +z
  const stepPositions = useMemo(
    () =>
      Array.from({ length: steps }, (_, i) => {
        const y = totalRise - i * riser - stepThickness / 2;
        const z = i * tread + tread / 2;
        return [y, z] as const;
      }),
    [steps, riser, tread, stepThickness, totalRise]
  );

  // Die lokale Treppe fällt in +z ab. Deshalb muss die Wange positiv um X
  // gedreht werden: ihr +z-Ende liegt dadurch tiefer statt höher.
  const stringer = useMemo(() => {
    const angle = Math.atan2(totalRise, run);
    const length = Math.hypot(totalRise, run) + tread;
    const height = 0.24; // Wangenhöhe, überlappt die Stufenplatten
    const thickness = 0.05;
    return {
      angle,
      length,
      height,
      thickness,
      // Mittelpunkt der Wange
      y: totalRise / 2 - height / 2 + stepThickness,
      z: run / 2,
    };
  }, [totalRise, run, tread, stepThickness]);

  return (
    <group position={position} rotation={rotation}>
      {/* Stufen */}
      {stepPositions.map(([y, z], i) => (
        <mesh key={`step-${i}`} position={[0, y, z]} material={stepMat} castShadow receiveShadow>
          <boxGeometry args={[width, stepThickness, tread]} />
        </mesh>
      ))}

      {/* Stahl-Wangen links/rechts — überlappen die Stufen */}
      {[-1, 1].map((sx) => (
        <mesh
          key={`stringer-${sx}`}
          position={[(sx * (width + stringer.thickness)) / 2, stringer.y, stringer.z]}
          rotation={[stringer.angle, 0, 0]}
          material={steelMat}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[stringer.thickness, stringer.height, stringer.length]} />
        </mesh>
      ))}

      {/* Geländer — identisch zum Balkongeländer, entlang der Treppensteigung */}
      {[-1, 1].map((sx) => (
        <RailSegment
          key={`rail-${sx}`}
          len={run}
          slope={-stringer.angle}
          art={railArt}
          id={railId}
          frameColor={railFrameColor ?? steelColor}
          color={stepColor}
          position={[(sx * (width + stringer.thickness)) / 2, totalRise / 2, run / 2]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      ))}
    </group>
  );

};

export default Staircase;
