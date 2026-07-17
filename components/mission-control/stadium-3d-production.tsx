"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import type { StadiumSection, StadiumGate } from "@/lib/types/db";

interface StadiumProps {
  sections: StadiumSection[];
  gates: StadiumGate[];
  crowd: Array<{ location_type: string; location_id: number; density_pct: number }>;
  incidents: Array<{ location_id?: number }>;
}

function StadiumGeometry({ sections, gates, crowd, incidents }: StadiumProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // Clear existing
    groupRef.current.clear();

    const innerRadius = 40;
    const outerRadius = 100;

    // Field (center)
    const fieldGeo = new THREE.CylinderGeometry(innerRadius * 0.7, innerRadius * 0.7, 1, 64);
    const fieldMat = new THREE.MeshStandardMaterial({
      color: 0x1a5d3a,
      metalness: 0.05,
      roughness: 0.9,
    });
    const field = new THREE.Mesh(fieldGeo, fieldMat);
    field.position.y = 0.5;
    field.castShadow = true;
    groupRef.current.add(field);

    // Stadium seating rings
    sections.forEach((section, idx) => {
      const angle = (idx / Math.max(1, sections.length)) * Math.PI * 2;
      const density = crowd.find(
        c => c.location_type === "section" && c.location_id === section.id
      )?.density_pct ?? 0;
      const hasIncident = incidents.some(i => i.location_id === section.id);

      // Determine color based on density/incidents
      let color = 0x10b981;
      if (hasIncident) color = 0xff3333;
      else if (density > 90) color = 0xff6b6b;
      else if (density > 70) color = 0xffa500;
      else if (density > 50) color = 0x3b82f6;

      // Create seating section (wedge shape)
      const segmentAngle = (Math.PI * 2) / Math.max(1, sections.length);
      const tierRadius = innerRadius + 20;

      const geometry = new THREE.CylinderGeometry(
        tierRadius,
        tierRadius - 8,
        8,
        Math.ceil(segmentAngle * 40),
        1,
        false,
        angle - segmentAngle / 2,
        segmentAngle
      );

      const material = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.15,
        roughness: 0.8,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      groupRef.current.add(mesh);
    });

    // Gates around perimeter
    gates.forEach((gate, idx) => {
      const angle = (idx / Math.max(1, gates.length)) * Math.PI * 2;
      const gateRadius = innerRadius - 8;

      const gateGeo = new THREE.BoxGeometry(6, 5, 1.5);
      const gateMat = new THREE.MeshStandardMaterial({
        color:
          gate.status === "open"
            ? 0x10b981
            : gate.status === "closed"
              ? 0xff3333
              : 0xffa500,
        metalness: 0.8,
        roughness: 0.2,
        emissive:
          gate.status === "open"
            ? 0x10b981
            : gate.status === "closed"
              ? 0xff3333
              : 0xffa500,
        emissiveIntensity: 0.4,
      });

      const gateMesh = new THREE.Mesh(gateGeo, gateMat);
      gateMesh.position.set(
        Math.cos(angle) * gateRadius,
        2.5,
        Math.sin(angle) * gateRadius
      );
      gateMesh.castShadow = true;
      gateMesh.receiveShadow = true;
      groupRef.current.add(gateMesh);
    });

    // Parking areas (outer rings)
    Array.from({ length: 8 }).forEach((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const parkGeo = new THREE.BoxGeometry(18, 0.5, 20);
      const parkMat = new THREE.MeshStandardMaterial({
        color: 0x4b5563,
        metalness: 0.3,
        roughness: 0.8,
      });

      const parkMesh = new THREE.Mesh(parkGeo, parkMat);
      parkMesh.position.set(
        Math.cos(angle) * (outerRadius + 10),
        0.25,
        Math.sin(angle) * (outerRadius + 10)
      );
      parkMesh.castShadow = true;
      parkMesh.receiveShadow = true;
      groupRef.current.add(parkMesh);
    });
  }, [sections, gates, crowd, incidents]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0001;
    }
  });

  return <group ref={groupRef} />;
}

export function Stadium3DProduction({ sections, gates, crowd, incidents }: StadiumProps) {
  return (
    <Canvas
      camera={{ position: [0, 70, 100], fov: 50 }}
      shadows
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#000000"]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[80, 80, 40]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={150}
        shadow-camera-bottom={-150}
        shadow-camera-far={400}
      />
      <pointLight position={[-80, 40, 80]} intensity={0.6} color={0x0099ff} />

      {/* Stadium */}
      <StadiumGeometry sections={sections} gates={gates} crowd={crowd} incidents={incidents} />

      {/* Controls */}
      <OrbitControls autoRotate autoRotateSpeed={0.5} minDistance={60} maxDistance={250} />
    </Canvas>
  );
}
