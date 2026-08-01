"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera, Edges } from "@react-three/drei";
import { useStore } from "../../store/useStore";

export default function Viewport() {
  const { 
    camera, 
    lighting, 
    showGrid, 
    showCube 
  } = useStore((state) => state.viewport);

  return (
    <div className="w-full h-screen bg-[#282828] select-none">
      <Canvas>
        <color attach="background" args={["#303030"]} />
        
        <PerspectiveCamera makeDefault position={camera.position} fov={camera.fov} />
        <OrbitControls makeDefault />

        {/* Basic lighting */}
        <ambientLight intensity={lighting.ambientIntensity} />
        <directionalLight position={lighting.directionalPosition} intensity={lighting.directionalIntensity} />
        <directionalLight position={lighting.secondaryDirectionalPosition} intensity={lighting.secondaryDirectionalIntensity} />
        
        {/* Blender-like Grid */}
        {showGrid && (
          <Grid 
            infiniteGrid
            fadeDistance={50}
            sectionColor="#5a5a5a"
            cellColor="#3b3b3b"
            cellSize={1}
            sectionSize={10}
            position={[0, 0, 0]}
          />
        )}
        
        {/* Axes */}
        <axesHelper args={[50]} />

        {/* Default Cube */}
        {showCube && (
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#8c8c8c" roughness={0.7} />
            <Edges scale={1} threshold={15} color="#000000" />
          </mesh>
        )}
      </Canvas>
    </div>
  );
}
