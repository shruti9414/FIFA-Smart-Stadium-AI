"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";

function SimpleTestScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useThree();

  useEffect(() => {
    console.log("✅ Scene mounted");
    console.log("Scene background color:", (scene.background as THREE.Color | null)?.getHex());
  }, [scene]);

  useEffect(() => {
    if (!groupRef.current) return;

    console.log("🏗️ Creating test geometry...");

    // Create a simple box
    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.3,
      roughness: 0.6,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    groupRef.current.add(mesh);

    console.log("✅ Test box created");
    console.log("Group children:", groupRef.current.children.length);

    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.005;
      groupRef.current.rotation.y += 0.008;
    }
  });

  return <group ref={groupRef} />;
}

export function DebugCanvasClient() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [40, 40, 40], fov: 75 }}
        shadows
        gl={{
          antialias: true,
          alpha: false,
        }}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        {/* Set scene background to dark */}
        <color attach="background" args={["#000000"]} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[50, 50, 50]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Test geometry */}
        <SimpleTestScene />

        {/* Camera controls */}
        <OrbitControls autoRotate autoRotateSpeed={4} />
      </Canvas>

      {/* Debug overlay */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0, 0, 0, 0.9)",
          border: "1px solid #0ff",
          color: "#0ff",
          padding: "10px",
          fontSize: "11px",
          fontFamily: "monospace",
          zIndex: 1000,
          maxWidth: "300px",
          lineHeight: "1.5",
        }}
      >
        <div>🔍 DEBUG MODE</div>
        <div>Expected: Rotating green box</div>
        <div>Check console (F12)</div>
        <div style={{ marginTop: "5px", borderTop: "1px solid #0ff", paddingTop: "5px" }}>
          <div>Camera: [40, 40, 40]</div>
          <div>Lighting: Ambient + Directional</div>
          <div>Geometry: Box</div>
        </div>
      </div>
    </div>
  );
}
