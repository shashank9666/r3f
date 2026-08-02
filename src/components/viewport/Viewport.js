"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, FlyControls, OrthographicCamera, PerspectiveCamera, Grid, Edges, Environment } from "@react-three/drei";
import { useStore, CANVAS_SETTINGS, GRID_SETTINGS, FOG_SETTINGS, AXES_SETTINGS } from "../../store/useStore";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import NavigationToolbar from "./ViewportNavigation/NavigationToolbar";
import NavigationGizmo from "./NavigationGizmo/NavigationGizmo";
import SceneObjects from "./SceneObjects";
import ViewportNavigationHandler from "./ViewportNavigationHandler";
import TransformHUD from "./TransformHUD";
import ViewportHotkeys from "./ViewportHotkeys";
import BoxSelectionTool from './ViewportNavigation/BoxSelectionTool';
import ViewportContextMenu from './ViewportContextMenu';
import ViewportShadingMenu from './ViewportNavigation/ViewportShadingMenu';

function SceneRegister() {
  const { scene, camera } = useThree();
  const setScene = useStore((state) => state.setScene);
  const setCamera = useStore((state) => state.setCamera);
  
  useEffect(() => {
    setScene(scene);
    setCamera(camera);
  }, [scene, camera, setScene, setCamera]);
  
  return (
    <>
      <ViewportNavigationHandler />
      <BoxSelectionTool />
    </>
  );
}

function RenderSettingsApplier() {
  const { gl } = useThree();
  const renderSettings = useStore((state) => state.renderSettings);
  
  useEffect(() => {
    gl.toneMapping = THREE[renderSettings.toneMapping] || THREE.NoToneMapping;
    gl.toneMappingExposure = renderSettings.exposure;
    gl.shadowMap.enabled = renderSettings.shadows;
  }, [renderSettings, gl]);
  
  return null;
}

export default function Viewport() {
  const {
    lighting,
    showGrid,
    showCube
  } = useStore((state) => state.viewport);
  const { setControls, projection, isWalking, movementSpeed, isCameraView, setSelectedIds, activeTool, viewportShading, worldSettings } = useStore();
  const controlsRef = useRef();
  const [contextMenuPos, setContextMenuPos] = useState(null);

  useEffect(() => {
    if (controlsRef.current) {
      setControls(controlsRef.current);
    }
  }, [setControls, projection, isWalking]);

  return (
    <div className="relative w-full h-screen bg-[#282828] select-none overflow-hidden">
      <NavigationToolbar />
      <TransformHUD />
      <ViewportHotkeys />
      <ViewportShadingMenu />
      
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
        <RenderSettingsApplier />
        
        <color attach="background" args={[worldSettings.backgroundColor]} />
        {worldSettings.fogEnabled && (
          <fog attach="fog" args={[worldSettings.fogColor, worldSettings.fogNear, worldSettings.fogFar]} />
        )}
        {worldSettings.environment !== 'none' && (
          <Environment preset={worldSettings.environment} background={false} />
        )}

        {isWalking ? (
          <FlyControls 
            ref={(node) => {
              controlsRef.current = node;
              if (node) setControls(node);
            }} 
            makeDefault movementSpeed={movementSpeed} rollSpeed={0.5} dragToLook={false} 
          />
        ) : (
          <OrbitControls 
            ref={(node) => {
              controlsRef.current = node;
              if (node) setControls(node);
            }} 
            makeDefault 
            enabled={activeTool !== 'box-select'} 
            mouseButtons={{
              LEFT: activeTool === 'pan' ? 2 : activeTool === 'zoom' ? 1 : 99,
              MIDDLE: 0,
              RIGHT: 99
            }}
            onChange={(e) => {
              const state = useStore.getState();
              if (state.isCameraView && state.activeSceneCameraId) {
                const camera = e.target.object;
                state.updateObject(state.activeSceneCameraId, {
                  position: [camera.position.x, camera.position.y, camera.position.z],
                  rotation: [camera.rotation.x, camera.rotation.y, camera.rotation.z]
                });
              }
            }}
          />
        )}

        {/* Basic lighting */}
        <ambientLight intensity={worldSettings.ambientIntensity} color={worldSettings.ambientColor} />
        {worldSettings.environment === 'none' && (
          <>
            <directionalLight position={lighting.directionalPosition} intensity={lighting.directionalIntensity} castShadow />
            <directionalLight position={lighting.secondaryDirectionalPosition} intensity={lighting.secondaryDirectionalIntensity} castShadow />
          </>
        )}

        {/* Blender-like Grid or Infinite Stage */}
        {worldSettings.showGrid && viewportShading !== 'rendered' && (
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

        {/* Infinite Stage for Rendered Mode */}
        {viewportShading === 'rendered' && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[1000, 1000]} />
            <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
          </mesh>
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
