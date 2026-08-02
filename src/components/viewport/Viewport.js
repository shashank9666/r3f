"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, FlyControls, OrthographicCamera, PerspectiveCamera, Grid, Edges } from "@react-three/drei";
import { useStore, CANVAS_SETTINGS, GRID_SETTINGS, FOG_SETTINGS, AXES_SETTINGS } from "../../store/useStore";
import { useEffect, useRef } from "react";
import NavigationToolbar from "./ViewportNavigation/NavigationToolbar";
import NavigationGizmo from "./NavigationGizmo/NavigationGizmo";
import SceneObjects from "./SceneObjects";
import ViewportNavigationHandler from "./ViewportNavigationHandler";
import TransformHUD from "./TransformHUD";

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
  const { setControls, projection, isWalking, movementSpeed, isCameraView, setSelectedIds, activeTool } = useStore();
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      setControls(controlsRef.current);
    }
  }, [setControls, projection, isWalking]);

  return (
    <div className="relative w-full h-screen bg-[#282828] select-none overflow-hidden">
      <NavigationToolbar />
      <TransformHUD />
      
      {/* Camera View Overlay */}
      {isCameraView && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
          <div 
            className="border-2 border-dashed border-[#ffffff66] rounded-[1px]"
            style={{
              width: '70%', 
              height: '70%', 
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)'
            }}
          ></div>
        </div>
      )}
      
      <Canvas 
        {...CANVAS_SETTINGS} 
        camera={undefined}
        onPointerMissed={() => setSelectedIds([])}
      >
        {projection === 'orthographic' ? (
          <OrthographicCamera makeDefault position={[12, 9, 12]} zoom={40} near={0.1} far={1000} />
        ) : (
          <PerspectiveCamera makeDefault position={[12, 9, 12]} fov={45} near={0.1} far={1000} />
        )}
        
        <NavigationGizmo />
        <ViewportNavigationHandler />
        <SceneRegister />
        <color attach="background" args={["#303030"]} />
        <fog attach="fog" args={[FOG_SETTINGS.color, FOG_SETTINGS.near, FOG_SETTINGS.far]} />

        {isWalking ? (
          <FlyControls ref={controlsRef} makeDefault movementSpeed={movementSpeed} rollSpeed={0.5} dragToLook={false} />
        ) : (
          <OrbitControls ref={controlsRef} makeDefault enabled={activeTool === 'select'} />
        )}

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

        {/* Render interactive objects from the store */}
        <SceneObjects />
      </Canvas>
    </div>
  );
}
