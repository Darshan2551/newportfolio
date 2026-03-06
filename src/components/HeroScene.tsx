import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";

function OrbitalCore() {
  const torusRef = useRef<Mesh>(null);
  const sphereRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.25;
      torusRef.current.rotation.y = state.clock.elapsedTime * 0.33;
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.18;
    }
  });

  return (
    <group>
      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={1.5}>
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <icosahedronGeometry args={[1.18, 2]} />
          <MeshTransmissionMaterial
            roughness={0.2}
            thickness={0.25}
            chromaticAberration={0.08}
            anisotropy={0.25}
            color="#5fd5ff"
            ior={1.2}
          />
        </mesh>
      </Float>
      <mesh ref={torusRef}>
        <torusKnotGeometry args={[1.55, 0.1, 240, 24]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#7c3aed"
          emissiveIntensity={0.25}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 2.8, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <div className="hero-scene-wrap">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#060816"]} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 3, 5]} intensity={1.2} color="#a855f7" />
        <pointLight position={[-4, -3, 2]} intensity={1.1} color="#22d3ee" />
        <OrbitalCore />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}
