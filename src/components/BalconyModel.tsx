import { useMemo } from 'react';
import * as THREE from 'three';

export type PlatformMaterial = 'douglasie' | 'wpc' | 'alu';
export type RailingStyle = 'glass' | 'glass-double' | 'bars';
export type FrameMaterial = 'pu-lackiert' | 'feuerverzinkt';

interface BalconyModelProps {
  width: number;
  depth: number;
  platformHeight: number;
  railingHeight: number;
  supportCount: 2 | 3 | 4 | 6;
  platformMaterial: PlatformMaterial;
  railingStyle: RailingStyle;
  frameMaterial: FrameMaterial;
}

const PLATFORM_MATERIAL_CONFIGS = {
  douglasie: { color: 0xb5651d, roughness: 0.9, metalness: 0.0 },
  wpc: { color: 0x5c4033, roughness: 0.7, metalness: 0.1 },
  alu: { color: 0xd3d3d3, roughness: 0.3, metalness: 0.9 },
};

// Frame materials: PU-Lackiert (dark painted steel) or Feuerverzinkt (galvanized silver)
const FRAME_MATERIAL_CONFIGS = {
  'pu-lackiert': { color: 0x2a2a2a, roughness: 0.4, metalness: 0.8 },
  'feuerverzinkt': { color: 0x9ca3af, roughness: 0.35, metalness: 0.9 },
};

// Stainless steel for railings
const STEEL_MATERIAL = { color: 0xc0c0c0, roughness: 0.2, metalness: 0.95 };
const GLASS_MATERIAL = { color: 0x88ccff, roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.3 };

export const BalconyModel = ({ 
  width, 
  depth, 
  platformHeight, 
  railingHeight, 
  supportCount,
  platformMaterial,
  railingStyle,
  frameMaterial
}: BalconyModelProps) => {
  const platformConfig = PLATFORM_MATERIAL_CONFIGS[platformMaterial];
  const frameConfig = FRAME_MATERIAL_CONFIGS[frameMaterial];

  const platformMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: platformConfig.color,
    roughness: platformConfig.roughness,
    metalness: platformConfig.metalness,
  }), [platformConfig]);

  const frameMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: frameConfig.color,
    roughness: frameConfig.roughness,
    metalness: frameConfig.metalness,
  }), [frameConfig]);

  const steelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: STEEL_MATERIAL.color,
    roughness: STEEL_MATERIAL.roughness,
    metalness: STEEL_MATERIAL.metalness,
  }), []);

  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: GLASS_MATERIAL.color,
    roughness: GLASS_MATERIAL.roughness,
    metalness: GLASS_MATERIAL.metalness,
    transparent: GLASS_MATERIAL.transparent,
    opacity: GLASS_MATERIAL.opacity,
    side: THREE.DoubleSide,
  }), []);

  const platformThickness = 0.15;
  const railingPostRadius = 0.03;
  const railingBarRadius = 0.015;
  const supportBeamSize = 0.1;

  // Calculate support positions based on count
  // 2-3 supports: only at front
  // 4-6 supports: distributed front and back
  const supportPositions = useMemo(() => {
    const positions: { x: number; z: number }[] = [];
    
    if (supportCount === 2) {
      // 2 supports at front corners
      positions.push({ x: -width / 2 + supportBeamSize / 2, z: depth / 2 - supportBeamSize / 2 });
      positions.push({ x: width / 2 - supportBeamSize / 2, z: depth / 2 - supportBeamSize / 2 });
    } else if (supportCount === 3) {
      // 3 supports at front (corners + middle)
      positions.push({ x: -width / 2 + supportBeamSize / 2, z: depth / 2 - supportBeamSize / 2 });
      positions.push({ x: 0, z: depth / 2 - supportBeamSize / 2 });
      positions.push({ x: width / 2 - supportBeamSize / 2, z: depth / 2 - supportBeamSize / 2 });
    } else if (supportCount === 4) {
      // 4 supports: 2 front, 2 back (corners)
      positions.push({ x: -width / 2 + supportBeamSize / 2, z: depth / 2 - supportBeamSize / 2 });
      positions.push({ x: width / 2 - supportBeamSize / 2, z: depth / 2 - supportBeamSize / 2 });
      positions.push({ x: -width / 2 + supportBeamSize / 2, z: -depth / 2 + supportBeamSize / 2 });
      positions.push({ x: width / 2 - supportBeamSize / 2, z: -depth / 2 + supportBeamSize / 2 });
    } else if (supportCount === 6) {
      // 6 supports: 3 front, 3 back
      positions.push({ x: -width / 2 + supportBeamSize / 2, z: depth / 2 - supportBeamSize / 2 });
      positions.push({ x: 0, z: depth / 2 - supportBeamSize / 2 });
      positions.push({ x: width / 2 - supportBeamSize / 2, z: depth / 2 - supportBeamSize / 2 });
      positions.push({ x: -width / 2 + supportBeamSize / 2, z: -depth / 2 + supportBeamSize / 2 });
      positions.push({ x: 0, z: -depth / 2 + supportBeamSize / 2 });
      positions.push({ x: width / 2 - supportBeamSize / 2, z: -depth / 2 + supportBeamSize / 2 });
    }
    
    return positions;
  }, [width, depth, supportCount, supportBeamSize]);

  // Calculate railing post positions
  const railingPosts = useMemo(() => {
    const posts: { x: number; z: number }[] = [];
    const spacing = 0.8;

    // Front posts
    const frontPostCount = Math.max(2, Math.ceil(width / spacing) + 1);
    for (let i = 0; i < frontPostCount; i++) {
      const x = -width / 2 + (i * width) / (frontPostCount - 1);
      posts.push({ x, z: depth / 2 });
    }

    // Side posts (left and right)
    const sidePostCount = Math.max(2, Math.ceil(depth / spacing) + 1);
    for (let i = 1; i < sidePostCount - 1; i++) {
      const z = -depth / 2 + (i * depth) / (sidePostCount - 1);
      posts.push({ x: -width / 2, z });
      posts.push({ x: width / 2, z });
    }

    return posts;
  }, [width, depth]);

  // Vertical bar positions for "bars" style
  const verticalBars = useMemo(() => {
    if (railingStyle !== 'bars') return [];
    
    const bars: { x: number; z: number }[] = [];
    const barSpacing = 0.12; // 12cm between bars

    // Front bars
    const frontBarCount = Math.floor(width / barSpacing);
    for (let i = 1; i < frontBarCount; i++) {
      const x = -width / 2 + i * barSpacing;
      bars.push({ x, z: depth / 2 });
    }

    // Left side bars
    const sideBarCount = Math.floor(depth / barSpacing);
    for (let i = 1; i < sideBarCount; i++) {
      const z = -depth / 2 + i * barSpacing;
      bars.push({ x: -width / 2, z });
      bars.push({ x: width / 2, z });
    }

    return bars;
  }, [width, depth, railingStyle]);

  const hasGlass = railingStyle === 'glass' || railingStyle === 'glass-double';
  const hasDoubleHandrail = railingStyle === 'glass-double';
  const hasBars = railingStyle === 'bars';

  return (
    <group>
      {/* Platform */}
      <mesh
        position={[0, platformHeight - platformThickness / 2, 0]}
        material={platformMat}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, platformThickness, depth]} />
      </mesh>

      {/* Support beams - dynamic count and positioning */}
      {supportPositions.map((pos, index) => (
        <mesh
          key={`support-${index}`}
          position={[pos.x, platformHeight / 2, pos.z]}
          material={frameMat}
          castShadow
        >
          <boxGeometry args={[supportBeamSize, platformHeight, supportBeamSize]} />
        </mesh>
      ))}

      {/* Railing posts */}
      {railingPosts.map((post, index) => (
        <mesh
          key={`post-${index}`}
          position={[post.x, platformHeight + railingHeight / 2, post.z]}
          material={steelMat}
          castShadow
        >
          <cylinderGeometry args={[railingPostRadius, railingPostRadius, railingHeight, 8]} />
        </mesh>
      ))}

      {/* Top handrail - front */}
      <mesh
        position={[0, platformHeight + railingHeight, depth / 2]}
        rotation={[0, 0, Math.PI / 2]}
        material={steelMat}
        castShadow
      >
        <cylinderGeometry args={[railingBarRadius * 1.5, railingBarRadius * 1.5, width, 8]} />
      </mesh>

      {/* Top handrail - left side */}
      <mesh
        position={[-width / 2, platformHeight + railingHeight, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={steelMat}
        castShadow
      >
        <cylinderGeometry args={[railingBarRadius * 1.5, railingBarRadius * 1.5, depth, 8]} />
      </mesh>

      {/* Top handrail - right side */}
      <mesh
        position={[width / 2, platformHeight + railingHeight, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={steelMat}
        castShadow
      >
        <cylinderGeometry args={[railingBarRadius * 1.5, railingBarRadius * 1.5, depth, 8]} />
      </mesh>

      {/* Double handrail (lower rail) for glass-double style */}
      {hasDoubleHandrail && (
        <>
          <mesh
            position={[0, platformHeight + railingHeight * 0.7, depth / 2]}
            rotation={[0, 0, Math.PI / 2]}
            material={steelMat}
            castShadow
          >
            <cylinderGeometry args={[railingBarRadius * 1.2, railingBarRadius * 1.2, width, 8]} />
          </mesh>
          <mesh
            position={[-width / 2, platformHeight + railingHeight * 0.7, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            material={steelMat}
            castShadow
          >
            <cylinderGeometry args={[railingBarRadius * 1.2, railingBarRadius * 1.2, depth, 8]} />
          </mesh>
          <mesh
            position={[width / 2, platformHeight + railingHeight * 0.7, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            material={steelMat}
            castShadow
          >
            <cylinderGeometry args={[railingBarRadius * 1.2, railingBarRadius * 1.2, depth, 8]} />
          </mesh>
        </>
      )}

      {/* Glass panels */}
      {hasGlass && (
        <>
          {/* Front glass */}
          <mesh
            position={[0, platformHeight + railingHeight * 0.45, depth / 2 - 0.01]}
            material={glassMat}
          >
            <boxGeometry args={[width - 0.1, railingHeight * 0.85, 0.01]} />
          </mesh>
          {/* Left glass */}
          <mesh
            position={[-width / 2 + 0.01, platformHeight + railingHeight * 0.45, 0]}
            material={glassMat}
          >
            <boxGeometry args={[0.01, railingHeight * 0.85, depth - 0.1]} />
          </mesh>
          {/* Right glass */}
          <mesh
            position={[width / 2 - 0.01, platformHeight + railingHeight * 0.45, 0]}
            material={glassMat}
          >
            <boxGeometry args={[0.01, railingHeight * 0.85, depth - 0.1]} />
          </mesh>
        </>
      )}

      {/* Vertical bars (Rundstäbe) for bars style */}
      {hasBars && verticalBars.map((bar, index) => (
        <mesh
          key={`bar-${index}`}
          position={[bar.x, platformHeight + railingHeight * 0.45, bar.z]}
          material={steelMat}
          castShadow
        >
          <cylinderGeometry args={[railingBarRadius * 0.8, railingBarRadius * 0.8, railingHeight * 0.85, 6]} />
        </mesh>
      ))}

      {/* Bottom rail for bars style */}
      {hasBars && (
        <>
          <mesh
            position={[0, platformHeight + 0.05, depth / 2]}
            rotation={[0, 0, Math.PI / 2]}
            material={steelMat}
            castShadow
          >
            <cylinderGeometry args={[railingBarRadius, railingBarRadius, width, 8]} />
          </mesh>
          <mesh
            position={[-width / 2, platformHeight + 0.05, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            material={steelMat}
            castShadow
          >
            <cylinderGeometry args={[railingBarRadius, railingBarRadius, depth, 8]} />
          </mesh>
          <mesh
            position={[width / 2, platformHeight + 0.05, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            material={steelMat}
            castShadow
          >
            <cylinderGeometry args={[railingBarRadius, railingBarRadius, depth, 8]} />
          </mesh>
        </>
      )}
    </group>
  );
};
