'use client';

import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Night Earth texture component
function NightEarth() {
  const meshRef = useRef();
  const [textureLoaded, setTextureLoaded] = useState(false);
  
  // Load the night Earth texture
  const nightTexture = useLoader(THREE.TextureLoader, '/textures/earth-texture8k.jpg');
  
  // Set texture properties when loaded
  React.useEffect(() => {
    if (nightTexture) {
      nightTexture.wrapS = THREE.ClampToEdgeWrapping;
      nightTexture.wrapT = THREE.ClampToEdgeWrapping;
      setTextureLoaded(true);
    }
  }, [nightTexture]);
  
  useFrame(() => {
    if (meshRef.current) {
      // Gentle rotation to keep India visible
      meshRef.current.rotation.y += 0.00025;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2.8, 0]} rotation={[-0.8, 3.26, 0]}>
      <sphereGeometry args={[4.5, 64, 64]} />
      <meshStandardMaterial
        map={textureLoaded ? nightTexture : null}
        color={textureLoaded ? "#ffffff" : "#1a1a2e"}
        metalness={0.1}
        roughness={0.8}
        transparent={false}
        opacity={1}
      />
    </mesh>
  );
}

// Simple India marker - positioned on the surface of the globe
function IndiaMarker() {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      // Revolve around the globe's center at the same speed as the globe rotates
      // This keeps the marker positioned over India as the globe turns
      meshRef.current.position.x = Math.sin(Date.now() * 0.00025) * 4.5;
      meshRef.current.position.z = Math.cos(Date.now() * 0.00025) * 4.5;
      meshRef.current.position.y = 1; // Keep the same Y position as the globe
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2.8, 4.5]} rotation={[-0.8, 1.36, 0]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color="#FF0000"
        emissive="#FF0000"
        emissiveIntensity={1}
      />
    </mesh>
  );
}

// Debug marker at origin to help troubleshoot
function DebugMarker() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial
        color="#00FF00"
        emissive="#00FF00"
        emissiveIntensity={1}
      />
    </mesh>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh position={[0, -2.8, 0]} rotation={[-0.8, 1.36, 0]}>
      <sphereGeometry args={[4.5, 32, 32]} />
      <meshStandardMaterial color="#1a1a2e" />
    </mesh>
  );
}

// Main Globe2 component
function Globe2() {
  return (
    <div className="w-full h-[70dvh] relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 2.5, 4], fov: 45 }}
        style={{ background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)' }}
      >
        {/* Lighting for night view */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#4A90E2" />
        <directionalLight position={[3, 3, 3]} intensity={0.6} />
        
        {/* Stars background */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        {/* Globe components */}
        <Suspense fallback={<LoadingFallback />}>
          <NightEarth />
          <IndiaMarker />
          <DebugMarker />
        </Suspense>
        
        {/* Controls with restricted movement */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.5}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI * 0.4}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

export default Globe2; 