"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Edges } from "@react-three/drei";
import { useStore, CANVAS_SETTINGS, GRID_SETTINGS, FOG_SETTINGS, AXES_SETTINGS } from "../../store/useStore";
import { useEffect, useRef } from "react";
import NavigationToolbar from "./NavigationToolbar/NavigationToolbar";
import NavigationGizmo from "./NavigationGizmo/NavigationGizmo";

function SceneRegister() {
  const { scene, camera } = useThree();
  const { setScene, setCamera } = useStore();
  
  useEffect(() => {
    setScene(scene);
    setCamera(camera);
  }, [scene, camera, setScene, setCamera]);
  
  return null;
}

export default function Viewport() {
  const {
    lighting,
    showGrid,
    showCube
  } = useStore((state) => state.viewport);
  const { setControls } = useStore();
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      setControls(controlsRef.current);
    }
  }, [setControls]);

  return (
    <div className="relative w-full h-screen bg-[#282828] select-none">
      <NavigationToolbar />
      <Canvas {...CANVAS_SETTINGS}>
        <NavigationGizmo />
        <SceneRegister />
        <color attach="background" args={["#303030"]} />
        <fog attach="fog" args={[FOG_SETTINGS.color, FOG_SETTINGS.near, FOG_SETTINGS.far]} />

        <OrbitControls ref={controlsRef} makeDefault />

        {/* Basic lighting */}
        <ambientLight intensity={lighting.ambientIntensity} />
        <directionalLight position={lighting.directionalPosition} intensity={lighting.directionalIntensity} />
        <directionalLight position={lighting.secondaryDirectionalPosition} intensity={lighting.secondaryDirectionalIntensity} />

        {/* Blender-like Grid */}
        {showGrid && (
          <group>
            <Grid {...GRID_SETTINGS} />
            {/* Infinite colored axes lines on the floor (X and Z) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
              <planeGeometry args={[AXES_SETTINGS.length, AXES_SETTINGS.thickness]} />
              <meshBasicMaterial color={AXES_SETTINGS.colors.x} transparent opacity={AXES_SETTINGS.opacity} depthWrite={false} fog={true} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.001, 0]}>
              <planeGeometry args={[AXES_SETTINGS.length, AXES_SETTINGS.thickness]} />
              <meshBasicMaterial color={AXES_SETTINGS.colors.z} transparent opacity={AXES_SETTINGS.opacity} depthWrite={false} fog={true} />
            </mesh>
          </group>
        )}

        {/* Dummy Camera Wireframe - Yellow */}
        <group position={[-6, 3, 6]} rotation={[0.0, -0.8, 0]}>
          {/* Pyramid body */}
          <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
            <coneGeometry args={[1, 2, 4]} />
            <meshBasicMaterial color="#e5cc22" wireframe />
          </mesh>
          {/* Top indicator triangle */}
          <mesh position={[0, 1.2, -1]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.5, 0.8, 3]} />
            <meshBasicMaterial color="#e5cc22" wireframe />
          </mesh>
        </group>

        {/* Dummy Light Wireframe */}
        <group position={[3, 6, -2]}>
          {/* Horizontal Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.95, 1, 32]} />
            <meshBasicMaterial color="#000000" side={2} />
          </mesh>
          {/* Vertical Ring */}
          <mesh>
            <ringGeometry args={[0.95, 1, 32]} />
            <meshBasicMaterial color="#000000" side={2} />
          </mesh>
          {/* Pole connecting to grid */}
          <mesh position={[0, -3, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 6]} />
            <meshBasicMaterial color="#000000" />
          </mesh>
        </group>

        {/* 3D Cursor (Red/White circle with crosshair) */}
        <group position={[0, 0, 0]}>
          {/* Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.3, 0.35, 16]} />
            <meshBasicMaterial color="#ffffff" side={2} depthTest={false} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.25, 0.4, 4, 1]} />
            <meshBasicMaterial color="#ff0000" side={2} depthTest={false} />
          </mesh>
          {/* Crosshair lines (horizontal only to avoid sticking under cube) */}
          <mesh position={[0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.4]} />
            <meshBasicMaterial color="#000000" depthTest={false} />
          </mesh>
          <mesh position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.01, 0.01, 0.4]} />
            <meshBasicMaterial color="#000000" depthTest={false} />
          </mesh>
        </group>

        {/* Default Cube without outlines */}
        {showCube && (
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#8c8c8c" roughness={0.7} />
          </mesh>
        )}
      </Canvas>
    </div>
  );
}
