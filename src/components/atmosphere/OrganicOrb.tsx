import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { Mesh } from 'three';

export interface OrganicOrbProps {
  color?: string;
  isFractured?: boolean;
  scale?: number;
  wireframe?: boolean;
}

function OrbMesh({ 
  color = '#ECFDF5', // Default Luminous Mint 
  isFractured = false, 
  scale = 1,
  wireframe = false
}: OrganicOrbProps) {
  const meshRef = useRef<Mesh>(null);

  // Organic, weightless continuous rotation
  useFrame((state) => {
    if (meshRef.current) {
      // The math here guarantees a smooth, non-repeating float
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      {/* 
        High-segment sphere creates a perfectly smooth, tensionless surface.
        If fractured, we drop the segments to create harsh, faceted crystal edges.
      */}
      {isFractured ? (
        <icosahedronGeometry args={[1, 1]} />
      ) : (
        <sphereGeometry args={[1, 64, 64]} />
      )}
      
      {/* 
        The core of the Organic Glass aesthetic. 
        High transmission and IOR (Index of Refraction) bend the background light 
        exactly like real architectural glass.
      */}
      <meshPhysicalMaterial 
        color={color} 
        transmission={0.95} 
        opacity={1} 
        metalness={0.15} 
        roughness={isFractured ? 0.4 : 0.05} 
        ior={1.52} // Real-world IOR of crown glass
        thickness={2.5}
        clearcoat={1}
        clearcoatRoughness={0.1}
        wireframe={wireframe}
      />
    </mesh>
  );
}

export default function OrganicOrb({ 
  color = '#ECFDF5', 
  isFractured = false, 
  scale = 1,
  wireframe = false
}: OrganicOrbProps) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
      {/* Ambient base removes harsh shadows */}
      <ambientLight intensity={0.6} />
      
      {/* Primary Key Light (Gallery White) for pristine highlights */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.5} 
        color="#FAFAFA" 
      />
      
      {/* Secondary Rim Light directly bound to the orb's state color */}
      <directionalLight 
        position={[-5, -10, -5]} 
        intensity={2.0} 
        color={color} 
      />
      
      {/* Core glow from within */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.5} 
        color="#FAFAFA" 
      />
      
      <OrbMesh 
        color={color} 
        isFractured={isFractured} 
        scale={scale} 
        wireframe={wireframe}
      />
    </Canvas>
  );
}

