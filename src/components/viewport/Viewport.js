"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, PerspectiveCamera, Edges } from "@react-three/drei";

export default function Viewport() {
  return (
    <div className="w-full h-screen bg-[#282828] select-none">
      <Canvas>
        <color attach="background" args={["#303030"]} />
        
        <PerspectiveCamera makeDefault position={[7, 5, 7]} fov={45} />
        <OrbitControls makeDefault />

        {/* Basic lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} />
        
        {/* Blender-like Grid */}
        <Grid 
          infiniteGrid
          fadeDistance={50}
          sectionColor="#5a5a5a"
          cellColor="#3b3b3b"
          cellSize={1}
          sectionSize={10}
          position={[0, 0, 0]}
        />
        
        {/* Axes (Red=X, Green=Y, Blue=Z) - We use Z-up for Blender feel, but R3F is Y-up. 
            Standard R3F axes helper */}
        <axesHelper args={[50]} />

        {/* Default Cube */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color="#8c8c8c" roughness={0.7} />
          <Edges scale={1} threshold={15} color="#000000" />
        </mesh>
      </Canvas>
    </div>
  );
}
