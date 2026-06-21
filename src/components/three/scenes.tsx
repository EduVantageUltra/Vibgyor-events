"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

function geometryFor(shape: string) {
  switch (shape) {
    case "sphere": return <icosahedronGeometry args={[1.3, 4]} />;
    case "box": return <boxGeometry args={[1.7, 1.7, 1.7]} />;
    case "dodecahedron": return <dodecahedronGeometry args={[1.5, 0]} />;
    case "torus": return <torusGeometry args={[1.1, 0.42, 24, 80]} />;
    default: return <torusKnotGeometry args={[1, 0.34, 160, 24]} />;
  }
}

function SpinMesh({ shape, color, metalness, autoRotate }: { shape: string; color: string; metalness: number; autoRotate: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (autoRotate && ref.current) { ref.current.rotation.x += d * 0.3; ref.current.rotation.y += d * 0.45; } });
  return (
    <mesh ref={ref}>
      {geometryFor(shape)}
      <meshStandardMaterial color={color || "#7c5cff"} metalness={metalness ?? 0.6} roughness={0.25} />
    </mesh>
  );
}

export function ThreeShapeScene({ shape, color, metalness, autoRotate }: { shape: string; color: string; metalness: number; autoRotate: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <directionalLight position={[-5, -2, -3]} intensity={0.6} color="#39e6ff" />
      <SpinMesh shape={shape} color={color} metalness={metalness} autoRotate={autoRotate} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </Canvas>
  );
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.4} />;
}

export function Model3DScene({ url, autoRotate }: { url: string; autoRotate: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        {url ? <Model url={url} /> : <SpinMesh shape="torusKnot" color="#7c5cff" metalness={0.6} autoRotate={autoRotate} />}
      </Suspense>
      <OrbitControls enableZoom autoRotate={autoRotate} autoRotateSpeed={2} />
    </Canvas>
  );
}

function Particles({ count, color }: { count: number; color: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 12;
    return arr;
  }, [count]);
  useFrame((_, d) => { if (ref.current) { ref.current.rotation.y += d * 0.05; ref.current.rotation.x += d * 0.02; } });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={color || "#7c5cff"} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

export function WebGLBgScene({ color, count }: { color: string; count: number }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <Particles count={count || 800} color={color} />
    </Canvas>
  );
}
