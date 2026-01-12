import { useMemo } from 'react';
import * as THREE from 'three';

export type MaterialPreset = 'douglasie' | 'wpc' | 'alu';

interface BalconyModelProps {
  width: number;
  depth: number;
  platformHeight: number;
  railingHeight: number;
  supportCount: 2 | 3 | 4 | 6;
  material: MaterialPreset;
}

const MATERIAL_CONFIGS = {
  douglasie: {
    platform: { color: 0xb5651d, roughness: 0.9, metalness: 0.0 },
    railing: { color: 0xa0522d, roughness: 0.85, metalness: 0.0 },
    support: { color: 0x8b4513, roughness: 0.9, metalness: 0.0 },
  },
  wpc: {
    platform: { color: 0x5c4033, roughness: 0.7, metalness: 0.1 },
    railing: { color: 0x4a3728, roughness: 0.6, metalness: 0.15 },
    support: { color: 0x3d2b1f, roughness: 0.65, metalness: 0.1 },
  },
  alu: {
    platform: { color: 0xd3d3d3, roughness: 0.3, metalness: 0.9 },
    railing: { color: 0xc0c0c0, roughness: 0.2, metalness: 0.95 },
    support: { color: 0xa9a9a9, roughness: 0.25, metalness: 0.9 },
  },
};

export const BalconyModel = ({ 
  width, 
  depth, 
  platformHeight, 
  railingHeight, 
  supportCount,
  material 
}: BalconyModelProps) => {
  const config = MATERIAL_CONFIGS[material];

  const platformMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.platform.color,
    roughness: config.platform.roughness,
    metalness: config.platform.metalness,
  }), [config.platform]);

  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.railing.color,
    roughness: config.railing.roughness,
    metalness: config.railing.metalness,
  }), [config.railing]);

  const supportMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: config.support.color,
    roughness: config.support.roughness,
    metalness: config.support.metalness,
  }), [config.support]);

  const platformThickness = 0.15;
  const railingPostRadius = 0.03;
  const railingBarRadius = 0.015;
  const supportBeamSize = 0.1;

  // Calculate support positions based on count
  const supportPositions = useMemo(() => {
    const positions: number[] = [];
    
    if (supportCount === 2) {
      positions.push(-width / 2 + supportBeamSize / 2, width / 2 - supportBeamSize / 2);
    } else if (supportCount === 3) {
      positions.push(-width / 2 + supportBeamSize / 2, 0, width / 2 - supportBeamSize / 2);
    } else if (supportCount === 4) {
      const spacing = width / 3;
      positions.push(
        -width / 2 + supportBeamSize / 2,
        -width / 2 + spacing,
        width / 2 - spacing,
        width / 2 - supportBeamSize / 2
      );
    } else if (supportCount === 6) {
      const spacing = width / 5;
      for (let i = 0; i < 6; i++) {
        positions.push(-width / 2 + supportBeamSize / 2 + i * spacing);
      }
    }
    
    return positions;
  }, [width, supportCount, supportBeamSize]);

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

  return (
    <group>
      {/* Platform */}
      <mesh
        position={[0, platformHeight - platformThickness / 2, 0]}
        material={platformMaterial}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, platformThickness, depth]} />
      </mesh>

      {/* Support beams - dynamic count */}
      {supportPositions.map((xPos, index) => (
        <mesh
          key={`support-${index}`}
          position={[xPos, platformHeight / 2, -depth / 2 + supportBeamSize / 2]}
          material={supportMaterial}
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
          material={metalMaterial}
          castShadow
        >
          <cylinderGeometry args={[railingPostRadius, railingPostRadius, railingHeight, 8]} />
        </mesh>
      ))}

      {/* Top railing - front */}
      <mesh
        position={[0, platformHeight + railingHeight, depth / 2]}
        rotation={[0, 0, Math.PI / 2]}
        material={metalMaterial}
        castShadow
      >
        <cylinderGeometry args={[railingBarRadius * 1.5, railingBarRadius * 1.5, width, 8]} />
      </mesh>

      {/* Top railing - left side */}
      <mesh
        position={[-width / 2, platformHeight + railingHeight, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={metalMaterial}
        castShadow
      >
        <cylinderGeometry args={[railingBarRadius * 1.5, railingBarRadius * 1.5, depth, 8]} />
      </mesh>

      {/* Top railing - right side */}
      <mesh
        position={[width / 2, platformHeight + railingHeight, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={metalMaterial}
        castShadow
      >
        <cylinderGeometry args={[railingBarRadius * 1.5, railingBarRadius * 1.5, depth, 8]} />
      </mesh>

      {/* Middle railing bars - front */}
      <mesh
        position={[0, platformHeight + railingHeight * 0.5, depth / 2]}
        rotation={[0, 0, Math.PI / 2]}
        material={metalMaterial}
        castShadow
      >
        <cylinderGeometry args={[railingBarRadius, railingBarRadius, width, 8]} />
      </mesh>

      {/* Middle railing bars - sides */}
      <mesh
        position={[-width / 2, platformHeight + railingHeight * 0.5, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={metalMaterial}
        castShadow
      >
        <cylinderGeometry args={[railingBarRadius, railingBarRadius, depth, 8]} />
      </mesh>
      <mesh
        position={[width / 2, platformHeight + railingHeight * 0.5, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={metalMaterial}
        castShadow
      >
        <cylinderGeometry args={[railingBarRadius, railingBarRadius, depth, 8]} />
      </mesh>
    </group>
  );
};
