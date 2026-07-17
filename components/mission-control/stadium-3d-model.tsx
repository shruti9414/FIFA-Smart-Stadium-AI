"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import type { StadiumSection, StadiumGate } from "@/lib/types/db";

interface Stadium3DProps {
  sections: StadiumSection[];
  gates: StadiumGate[];
  crowd: Array<{ location_type: string; location_id: number; density_pct: number }>;
  incidents: Array<{ location_id?: number }>;
  selectedSectionId: number | null;
  onSelectSection: (id: number) => void;
}

function StadiumMesh({
  sections,
  gates,
  crowd,
  incidents,
  selectedSectionId,
  onSelectSection,
}: Stadium3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [sectionMeshes, setSectionMeshes] = useState<Map<number, THREE.Mesh>>(new Map());
  const { camera, raycaster, mouse } = useThree();

  useEffect(() => {
    if (!groupRef.current) return;

    // Clear existing meshes
    groupRef.current.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
    groupRef.current.clear();

    const meshMap = new Map<number, THREE.Mesh>();
    const segmentRadius = 60;
    const innerRadius = 40;

    // Stadium field (center)
    const fieldGeometry = new THREE.CylinderGeometry(segmentRadius * 0.6, segmentRadius * 0.6, 1, 64);
    const fieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a5d3a,
      metalness: 0.1,
      roughness: 0.8,
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.position.y = 0.5;
    groupRef.current.add(field);

    // Stadium seating tiers (multiple rings)
    sections.forEach((section, idx) => {
      const angle = (idx / sections.length) * Math.PI * 2;
      const tierCount = 3;

      tierCount > 0 &&
        Array.from({ length: tierCount }).forEach((_, tierIdx) => {
          const tierRadius = innerRadius + (tierIdx + 1) * 15;
          const tierHeight = 3 + tierIdx * 2;
          const tierY = tierIdx * 2.5;

          // Segment width
          const segmentAngle = (Math.PI * 2) / sections.length;

          // Create seating section
          const geometry = new THREE.CylinderGeometry(
            tierRadius,
            tierRadius - 8,
            tierHeight,
            Math.ceil(segmentAngle * 50),
            1,
            false,
            angle - segmentAngle / 2,
            segmentAngle
          );

          const density = crowd.find(
            c => c.location_type === "section" && c.location_id === section.id
          )?.density_pct ?? 0;
          const hasIncident = incidents.some(i => i.location_id === section.id);

          let color: number;
          if (hasIncident) {
            color = 0xff3333; // Red for incidents
          } else if (density > 90) {
            color = 0xff6b6b; // Critical
          } else if (density > 70) {
            color = 0xffa500; // Warning
          } else if (density > 50) {
            color = 0x3b82f6; // Normal
          } else {
            color = 0x10b981; // Low
          }

          const material = new THREE.MeshStandardMaterial({
            color,
            metalness: 0.2,
            roughness: 0.7,
            emissive: selectedSectionId === section.id ? color : 0x000000,
            emissiveIntensity: selectedSectionId === section.id ? 0.8 : 0,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.y = tierY;
          mesh.userData = { sectionId: section.id, density, hasIncident };
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          groupRef.current?.add(mesh);
          if (tierIdx === 0) meshMap.set(section.id, mesh);
        });
    });

    // Gates visualization
    gates.forEach(gate => {
      const angle = (Math.random() * Math.PI * 2);
      const gateRadius = innerRadius - 15;

      const gateGeometry = new THREE.BoxGeometry(8, 6, 2);
      const gateMaterial = new THREE.MeshStandardMaterial({
        color: gate.status === "open" ? 0x10b981 : gate.status === "closed" ? 0xff3333 : 0xffa500,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0x10b981,
        emissiveIntensity: gate.status === "open" ? 0.5 : 0,
      });

      const gateMesh = new THREE.Mesh(gateGeometry, gateMaterial);
      gateMesh.position.set(Math.cos(angle) * gateRadius, 3, Math.sin(angle) * gateRadius);
      gateMesh.castShadow = true;
      gateMesh.receiveShadow = true;
      groupRef.current?.add(gateMesh);
    });

    setSectionMeshes(meshMap);
  }, [sections, gates, crowd, incidents, selectedSectionId]);

  // Mouse interaction
  useEffect(() => {
    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);

      if (!groupRef.current) return;
      const intersects = raycaster.intersectObjects(groupRef.current.children);

      if (intersects.length > 0) {
        const firstObject = intersects[0].object as THREE.Mesh;
        if (firstObject.userData.sectionId) {
          onSelectSection(firstObject.userData.sectionId);
        }
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [camera, raycaster, mouse, onSelectSection]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Parking areas */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={`parking-${i}`}
            position={[Math.cos(angle) * 110, 0, Math.sin(angle) * 110]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[20, 0.5, 25]} />
            <meshStandardMaterial color={0x4b5563} metalness={0.3} roughness={0.8} />
          </mesh>
        );
      })}

      {/* Emergency routes (animated lines) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <line key={`route-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  Math.cos(angle) * 40,
                  0.1,
                  Math.sin(angle) * 40,
                  Math.cos(angle) * 80,
                  0.1,
                  Math.sin(angle) * 80,
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color={0x06b6d4} linewidth={2} />
          </line>
        );
      })}
    </group>
  );
}

export function Stadium3DModel(props: Stadium3DProps) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 80, 120], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[100, 100, 50]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
      />
      <pointLight position={[-100, 50, 100]} intensity={0.5} />

      <StadiumMesh {...props} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={1}
        enableZoom
        enablePan
        minDistance={50}
        maxDistance={300}
      />

      <Environment preset="night" />
      </Canvas>
    </div>
  );
}
