"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Edges } from "@react-three/drei";
import { useStore, CANVAS_SETTINGS } from "../../store/useStore";
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
        
        <OrbitControls makeDefault />

        {/* Basic lighting */}
        <ambientLight intensity={lighting.ambientIntensity} />
        <directionalLight position={lighting.directionalPosition} intensity={lighting.directionalIntensity} />
        <directionalLight position={lighting.secondaryDirectionalPosition} intensity={lighting.secondaryDirectionalIntensity} />
        
        {/* Blender-like Grid */}
        {showGrid && (
          <group>
            <Grid 
              infiniteGrid
              fadeDistance={50}
              sectionColor="#5a5a5a"
              cellColor="#3b3b3b"
              cellSize={1}
              sectionSize={10}
              position={[0, 0, 0]}
            />
            {/* Infinite colored axes lines on the floor (X and Z) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
              <planeGeometry args={[100, 0.04]} />
              <meshBasicMaterial color="#ff4444" transparent opacity={0.6} depthWrite={false} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.001, 0]}>
              <planeGeometry args={[100, 0.04]} />
              <meshBasicMaterial color="#88ff44" transparent opacity={0.6} depthWrite={false} />
            </mesh>
          </group>
        )}

        {/* Dummy Camera Wireframe - Yellow */}
        <group position={[-5, 3, 5]} rotation={[-0.3, -0.6, 0]}>
          <mesh>
            <coneGeometry args={[1, 2, 4]} />
            <meshBasicMaterial color="#e5cc22" wireframe />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[1.2, 0.5, 1.2]} />
            <meshBasicMaterial color="#e5cc22" wireframe />
          </mesh>
        </group>

        {/* Dummy Light Wireframe - Black circle */}
        <group position={[3, 6, -2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.95, 1, 32]} />
            <meshBasicMaterial color="#000000" side={2} />
          </mesh>
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2]} />
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
