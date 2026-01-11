import { useMemo } from 'react';
import * as THREE from 'three';

interface BalconyModelProps {
  width: number;
  depth: number;
  platformHeight: number;
  railingHeight: number;
}

export const BalconyModel = ({ width, depth, platformHeight, railingHeight }: BalconyModelProps) => {
  // Platform material - concrete look
  const platformMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x808080,
    roughness: 0.8,
    metalness: 0.1,
  }), []);

  // Metal material for railings and supports
  const metalMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0xa0a0a0,
    roughness: 0.3,
    metalness: 0.8,
  }), []);

  // Support beam material
  const supportMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x606060,
    roughness: 0.6,
    metalness: 0.4,
  }), []);

  const platformThickness = 0.15;
  const railingPostRadius = 0.03;
  const railingBarRadius = 0.015;
  const supportBeamSize = 0.1;

  // Calculate railing post positions
  const railingPosts = useMemo(() => {
    const posts: { x: number; z: number }[] = [];
    const spacing = 0.8; // spacing between posts in meters

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

      {/* Support beams */}
      <mesh
        position={[-width / 2 + supportBeamSize / 2, platformHeight / 2, -depth / 2 + supportBeamSize / 2]}
        material={supportMaterial}
        castShadow
      >
        <boxGeometry args={[supportBeamSize, platformHeight, supportBeamSize]} />
      </mesh>
      <mesh
        position={[width / 2 - supportBeamSize / 2, platformHeight / 2, -depth / 2 + supportBeamSize / 2]}
        material={supportMaterial}
        castShadow
      >
        <boxGeometry args={[supportBeamSize, platformHeight, supportBeamSize]} />
      </mesh>

      {/* Diagonal support braces */}
      <mesh
        position={[-width / 4, platformHeight / 2, -depth / 2 + supportBeamSize / 2]}
        rotation={[0, 0, Math.PI / 6]}
        material={supportMaterial}
        castShadow
      >
        <boxGeometry args={[supportBeamSize * 0.6, platformHeight * 0.8, supportBeamSize * 0.6]} />
      </mesh>
      <mesh
        position={[width / 4, platformHeight / 2, -depth / 2 + supportBeamSize / 2]}
        rotation={[0, 0, -Math.PI / 6]}
        material={supportMaterial}
        castShadow
      >
        <boxGeometry args={[supportBeamSize * 0.6, platformHeight * 0.8, supportBeamSize * 0.6]} />
      </mesh>

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
