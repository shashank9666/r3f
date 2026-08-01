"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Edges } from "@react-three/drei";
import { useStore, CANVAS_SETTINGS, GRID_SETTINGS, FOG_SETTINGS, AXES_SETTINGS } from "../../store/useStore";
import { useEffect } from "react";

function SceneRegister() {
  const { scene } = useThree();
  const setScene = useStore((state) => state.setScene);
  
  useEffect(() => {
    setScene(scene);
  }, [scene, setScene]);
  
  return null;
}

export default function Viewport() {
  const { 
    lighting, 
    showGrid, 
    showCube 
  } = useStore((state) => state.viewport);

  return (
    <div className="w-full h-screen bg-[#282828] select-none">
      <Canvas {...CANVAS_SETTINGS}>
        <SceneRegister />
        <color attach="background" args={["#303030"]} />
        <fog attach="fog" args={[FOG_SETTINGS.color, FOG_SETTINGS.near, FOG_SETTINGS.far]} />
        
        <OrbitControls makeDefault />

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
        <group position={[-6, 3, 6]} rotation={[0.2, -0.8, 0]}>
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
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.95, 1, 32]} />
            <meshBasicMaterial color="#000000" side={2} />
          </mesh>
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
          {/* Crosshair lines */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.4]} />
            <meshBasicMaterial color="#000000" depthTest={false} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.4]} />
            <meshBasicMaterial color="#000000" depthTest={false} />
          </mesh>
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
