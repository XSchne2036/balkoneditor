import { useMemo } from 'react';
import * as THREE from 'three';

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
  position?: [number, number, number];
  rotation?: [number, number, number];
}

/**
 * Parametrische Außentreppe: Stufen, durchgehende Stahl-Wangen (überlappend,
 * keine Spalte) und ein Handlauf entlang einer CatmullRom-Kurve.
 */
export const Staircase = ({
  platformHeight,
  width = 1.1,
  targetRiser = 0.18,
  tread = 0.29,
  stepThickness = 0.05,
  stepColor = '#8a8378',
  steelColor = '#b9c0c4',
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

  // Schräge Wange: Länge und Neigung aus Steigung/Auftritt.
  // Extra-Länge + Dicke sorgen für Überlappung der Stufen (kein Spalt).
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
      y: totalRise / 2 - height * 0.1,
      z: run / 2,
    };
  }, [totalRise, run, tread]);

  // Handlauf als CatmullRom-Kurve über die Stufen-Vorderkanten
  const handrailGeometry = useMemo(() => {
    const railHeight = 0.95;
    const points = stepPositions.map(
      ([y, z]) => new THREE.Vector3(0, y + stepThickness / 2 + railHeight, z)
    );
    points.unshift(new THREE.Vector3(0, totalRise + railHeight, -tread * 0.6));
    points.push(
      new THREE.Vector3(0, stepPositions[stepPositions.length - 1][0] + railHeight, run + tread * 0.4)
    );
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    return new THREE.TubeGeometry(curve, Math.max(24, steps * 6), 0.022, 12, false);
  }, [stepPositions, stepThickness, totalRise, run, tread, steps]);

  const postCount = Math.max(2, Math.ceil(steps / 3));

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
          rotation={[-stringer.angle, 0, 0]}
          material={steelMat}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[stringer.thickness, stringer.height, stringer.length]} />
        </mesh>
      ))}

      {/* Handlauf (CatmullRom) inkl. Pfosten */}
      {[-1, 1].map((sx) => (
        <group key={`rail-${sx}`} position={[(sx * (width + stringer.thickness)) / 2, 0, 0]}>
          <mesh geometry={handrailGeometry} material={steelMat} castShadow />
          {Array.from({ length: postCount }).map((_, p) => {
            const idx = Math.min(
              stepPositions.length - 1,
              Math.round((p * (stepPositions.length - 1)) / (postCount - 1 || 1))
            );
            const [y, z] = stepPositions[idx];
            const top = y + stepThickness / 2 + 0.95;
            return (
              <mesh key={p} position={[0, (y + top) / 2, z]} material={steelMat} castShadow>
                <cylinderGeometry args={[0.02, 0.02, top - y, 10]} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
};

export default Staircase;
