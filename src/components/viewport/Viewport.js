"use client";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, FlyControls, OrthographicCamera, PerspectiveCamera, Grid, Edges, Environment, Sky, ContactShadows, SoftShadows, AccumulativeShadows, RandomizedLight, Backdrop } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import { Pixelation } from './effects/Pixelation';
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
import ViewportHeader from './ViewportHeader';

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
    
    // Set Shadow Map Type
    if (renderSettings.shadowType === 'Basic') gl.shadowMap.type = THREE.BasicShadowMap;
    else if (renderSettings.shadowType === 'PCF') gl.shadowMap.type = THREE.PCFShadowMap;
    else if (renderSettings.shadowType === 'PCFSoft') gl.shadowMap.type = THREE.PCFSoftShadowMap;
    else if (renderSettings.shadowType === 'VSM') gl.shadowMap.type = THREE.VSMShadowMap;
  }, [renderSettings, gl]);
  
  return null;
}

export default function Viewport() {
  const {
    lighting,
    showGrid,
    showCube
  } = useStore((state) => state.viewport);
  const { setControls, projection, isWalking, movementSpeed, isCameraView, setSelectedIds, activeTool, viewportShading, worldSettings, postProcessingSettings, renderSettings } = useStore();
  const controlsRef = useRef();
  const [contextMenuPos, setContextMenuPos] = useState(null);

  useEffect(() => {
    if (controlsRef.current) {
      setControls(controlsRef.current);
    }
  }, [setControls, projection, isWalking]);

  return (
    <div className="relative w-full h-full flex flex-col bg-[#282828] select-none overflow-hidden">
      
      {/* Viewport Header */}
      <ViewportHeader />

      <div className="flex-1 relative w-full h-full overflow-hidden">
        <NavigationToolbar />
        <TransformHUD />
        <ViewportHotkeys />
        
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
        dpr={renderSettings.dpr}
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
        
        {/* Background / Environment */}
        {worldSettings.backgroundType === 'color' && (
          <color attach="background" args={[worldSettings.backgroundColor]} />
        )}
        
        {worldSettings.backgroundType === 'sky' && (
          <Sky 
            distance={450000} 
            sunPosition={worldSettings.skySunPosition} 
            inclination={0} 
            azimuth={0.25} 
            turbidity={worldSettings.skyTurbidity}
            rayleigh={worldSettings.skyRayleigh}
            mieCoefficient={worldSettings.skyMieCoefficient}
            mieDirectionalG={worldSettings.skyMieDirectionalG}
          />
        )}

        {worldSettings.environment !== 'none' && (
          <Environment 
            preset={worldSettings.environment} 
            background={worldSettings.backgroundType === 'environment'} 
            blur={worldSettings.environmentBlur}
            environmentIntensity={worldSettings.environmentIntensity}
          />
        )}

        {/* Fog */}
        {worldSettings.fogEnabled && worldSettings.fogType === 'linear' && (
          <fog attach="fog" args={[worldSettings.fogColor, worldSettings.fogNear, worldSettings.fogFar]} />
        )}
        {worldSettings.fogEnabled && worldSettings.fogType === 'exponential' && (
          <fogExp2 attach="fog" args={[worldSettings.fogColor, worldSettings.fogDensity]} />
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

        {/* Drei Staging: Contact Shadows */}
        {worldSettings.contactShadowsEnabled && (
          <ContactShadows
            position={[0, worldSettings.backdropFloor, 0]}
            opacity={worldSettings.contactShadowsOpacity}
            blur={worldSettings.contactShadowsBlur}
            far={worldSettings.contactShadowsFar}
            resolution={256}
            scale={20}
          />
        )}

        {/* Drei Staging: Soft Shadows */}
        {worldSettings.softShadowsEnabled && (
          <SoftShadows
            focus={worldSettings.softShadowsFocus}
            size={worldSettings.softShadowsSize}
            samples={worldSettings.softShadowsSamples}
          />
        )}

        {/* Drei Staging: Accumulative Shadows */}
        {worldSettings.accumulativeShadowsEnabled && (
          <AccumulativeShadows
            temporal
            frames={worldSettings.accumulativeShadowsFrames}
            blend={worldSettings.accumulativeShadowsBlend}
            position={[0, -0.49, 0]}
            scale={10}
          >
            <RandomizedLight amount={8} radius={5} position={[5, 5, -10]} />
          </AccumulativeShadows>
        )}

        {/* Drei Staging: Backdrop */}
        {worldSettings.backdropEnabled && (
          <Backdrop
            floor={worldSettings.backdropFloor}
            segments={worldSettings.backdropSegments}
            receiveShadow
          >
            <meshStandardMaterial color={worldSettings.backdropColor} />
          </Backdrop>
        )}

        {/* Post Processing Pipeline */}
        {postProcessingSettings.enabled && (
          <EffectComposer disableNormalPass>
            {postProcessingSettings.bloomEnabled && (
              <Bloom 
                intensity={postProcessingSettings.bloomIntensity}
                luminanceThreshold={postProcessingSettings.bloomLuminanceThreshold}
                luminanceSmoothing={postProcessingSettings.bloomLuminanceSmoothing}
              />
            )}
            {postProcessingSettings.vignetteEnabled && (
              <Vignette 
                eskil={false} 
                offset={postProcessingSettings.vignetteOffset} 
                darkness={postProcessingSettings.vignetteDarkness} 
              />
            )}
            {postProcessingSettings.dofEnabled && (
              <DepthOfField 
                focusDistance={postProcessingSettings.dofFocusDistance}
                focalLength={postProcessingSettings.dofFocalLength}
                bokehScale={postProcessingSettings.dofBokehScale}
              />
            )}
            {postProcessingSettings.pixelationEnabled && (
              <Pixelation granularity={postProcessingSettings.pixelationGranularity} />
            )}
          </EffectComposer>
        )}
      </Canvas>
      </div>
    </div>
  );
}
