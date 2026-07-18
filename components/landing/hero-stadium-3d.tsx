"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroStadium3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070d);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x22d3ee, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Create stadium
    const stadiumGroup = new THREE.Group();
    scene.add(stadiumGroup);

    // Stadium base (oval)
    const baseGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 64);
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: 0x0b0f19,
      roughness: 0.8,
      metalness: 0.1,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.receiveShadow = true;
    stadiumGroup.add(base);

    // Stadium structure (bleachers)
    const createBleacher = (x: number, z: number, rotationY: number) => {
      const group = new THREE.Group();

      for (let i = 0; i < 5; i++) {
        const bleacherGeometry = new THREE.BoxGeometry(0.8, 0.4, 2);
        const bleacherMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x22d3ee).getHex(),
          roughness: 0.6,
          metalness: 0.2,
          emissive: new THREE.Color(0x22d3ee),
          emissiveIntensity: 0.3 + i * 0.1,
        });
        const bleacher = new THREE.Mesh(bleacherGeometry, bleacherMaterial);
        bleacher.position.y = i * 0.5 + 0.5;
        bleacher.castShadow = true;
        bleacher.receiveShadow = true;
        group.add(bleacher);
      }

      group.position.set(x, 0, z);
      group.rotation.y = rotationY;
      stadiumGroup.add(group);
    };

    // Create bleachers around the stadium
    createBleacher(3.5, 0, 0);
    createBleacher(-3.5, 0, Math.PI);
    createBleacher(0, 3.5, Math.PI / 2);
    createBleacher(0, -3.5, -Math.PI / 2);

    // Stadium roof/crown
    const roofGeometry = new THREE.TorusGeometry(3.2, 0.3, 16, 32);
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.5,
      metalness: 0.3,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.4,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 3;
    roof.rotation.x = Math.PI / 2;
    roof.castShadow = true;
    stadiumGroup.add(roof);

    // Field (grass)
    const fieldGeometry = new THREE.CircleGeometry(2.5, 32);
    const fieldMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f472d,
      roughness: 0.8,
      metalness: 0,
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.position.y = 0.01;
    field.receiveShadow = true;
    stadiumGroup.add(field);

    // Center circle marking
    const centerCircleGeometry = new THREE.TorusGeometry(0.6, 0.05, 16, 32);
    const centerCircleMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.5,
    });
    const centerCircle = new THREE.Mesh(centerCircleGeometry, centerCircleMaterial);
    centerCircle.position.y = 0.02;
    centerCircle.rotation.x = Math.PI / 2;
    stadiumGroup.add(centerCircle);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate stadium
      stadiumGroup.rotation.y += 0.0005;

      // Gentle camera orbit
      const time = Date.now() * 0.0001;
      camera.position.x = Math.sin(time) * 8;
      camera.position.z = Math.cos(time) * 8;
      camera.lookAt(0, 2, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 -z-10" style={{ width: "100%", height: "100%" }} />;
}
