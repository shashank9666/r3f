/* eslint-disable */
"use client";

import React, { Suspense, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { TransformControls, Select } from '@react-three/drei';
import * as THREE from 'three';
import ModalTransformHandler from './ModalTransformHandler';
import { wrapWithModifiers, ModifierChildren } from './drei/Modifiers';
import DreiObject from './drei/DreiObject';
import DreiMaterial from './drei/DreiMaterial';
import { isDreiObject } from '../../lib/drei/objectCatalog';

/**
 * Keeps one broken object (bad URL, failed decode, unsupported file) from taking
 * down the whole canvas. Falls back to a wireframe marker.
 */
class ObjectErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.failed) {
      this.setState({ failed: false });
    }
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <mesh>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshBasicMaterial color="#ff4444" wireframe />
      </mesh>
    );
  }
}

function SceneObjectItem({ obj, isSelected, isActive, isVisible, transformState, updateObject, renderObjectBody, objectRefs, selectedIds }) {
  const [groupEl, setGroupEl] = useState(null);
  const resetKey = JSON.stringify(obj.params || {});

  return (
    <React.Fragment>
      <group
        userData={{ id: obj.id }}
        ref={(el) => {
          setGroupEl(el);
          if (el) objectRefs.current[obj.id] = el;
          else delete objectRefs.current[obj.id];
        }}
        visible={isVisible}
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
      >
        {/* `Select` feeds the post-processing Outline / SelectiveBloom passes */}
        <Select enabled={isSelected}>
          <ObjectErrorBoundary resetKey={resetKey}>
            <Suspense fallback={null}>
              {wrapWithModifiers(obj.modifiers, renderObjectBody(obj, isSelected))}
            </Suspense>
          </ObjectErrorBoundary>
        </Select>
        <ModifierChildren modifiers={obj.modifiers} />
      </group>

      {isVisible && isActive && transformState.mode !== 'idle' && groupEl && selectedIds.length <= 1 && (
        <TransformControls
          object={groupEl}
          mode={transformState.mode}
          showX={transformState.axisConstraint === null || transformState.axisConstraint === 'X'}
          showY={transformState.axisConstraint === null || transformState.axisConstraint === 'Y'}
          showZ={transformState.axisConstraint === null || transformState.axisConstraint === 'Z'}
          onDraggingChanged={(e) => {
            if (!e.value) {
              updateObject(obj.id, {
                position: [groupEl.position.x, groupEl.position.y, groupEl.position.z],
                rotation: [groupEl.rotation.x, groupEl.rotation.y, groupEl.rotation.z],
                scale: [groupEl.scale.x, groupEl.scale.y, groupEl.scale.z]
              });
            }
          }}
        />
      )}
    </React.Fragment>
  );
}

// A collection hides everything under it, so walk up to the root before deciding.
function isCollectionChainVisible(collections, collectionId, forRender) {
  let current = collections.find((c) => c.id === (collectionId || 'root'));
  while (current) {
    if (current.visible === false) return false;
    if (forRender && current.renderable === false) return false;
    if (!current.parentId) break;
    current = collections.find((c) => c.id === current.parentId);
  }
  return true;
}

export default function SceneObjects() {
  const objects = useStore((state) => state.objects);
  const collections = useStore((state) => state.collections);
  const selectedIds = useStore((state) => state.selectedIds);
  const setSelectedIds = useStore((state) => state.setSelectedIds);
  const activeId = useStore((state) => state.activeId);
  const transformState = useStore((state) => state.transformState);
  const setTransformState = useStore((state) => state.setTransformState);
  const updateObject = useStore((state) => state.updateObject);
  const isCameraView = useStore((state) => state.isCameraView);
  const viewportShading = useStore((state) => state.viewportShading);
  
  const objectRefs = useRef({});

  const [dragState, setDragState] = useState({ active: false, objId: null, startY: 0, startDistance: 0 });

  const handleRingPointerDown = (e, obj, distance) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setDragState({ active: true, objId: obj.id, startY: e.clientY, startDistance: distance });
  };

  const handleRingPointerMove = (e) => {
    if (dragState.active && dragState.objId) {
      e.stopPropagation();
      const deltaY = e.clientY - dragState.startY;
      const newDistance = Math.max(0.1, dragState.startDistance - deltaY * 0.2);
      const obj = objects.find(o => o.id === dragState.objId);
      if (obj) {
        updateObject(dragState.objId, { properties: { ...obj.properties, distance: newDistance } });
      }
    }
  };

  const handleRingPointerUp = (e) => {
    if (dragState.active) {
      e.stopPropagation();
      e.target.releasePointerCapture(e.pointerId);
      setDragState({ active: false, objId: null, startY: 0, startDistance: 0 });
      document.body.style.cursor = 'auto';
    }
  };

  const handlePointerDown = (e, id) => {
    e.stopPropagation(); // Prevent clicking on things behind

    if (objects.find((o) => o.id === id)?.selectable === false) return;

    if (e.ctrlKey || e.metaKey) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      setSelectedIds([id]);
    }
  };

  const renderGeometry = (type) => {
    switch(type) {
      case 'Cube': return <boxGeometry args={[2, 2, 2]} />;
      case 'Sphere': return <sphereGeometry args={[1, 32, 32]} />;
      case 'Plane': return <planeGeometry args={[2, 2]} />;
      case 'Cylinder': return <cylinderGeometry args={[1, 1, 2, 32]} />;
      case 'Cone': return <coneGeometry args={[1, 2, 32]} />;
      case 'Torus': return <torusGeometry args={[1, 0.4, 16, 100]} />;
      case 'TorusKnot': return <torusKnotGeometry args={[1, 0.4, 100, 16]} />;
      case 'Ring': return <ringGeometry args={[0.5, 1, 32]} />;
      case 'Tube': return <tubeGeometry args={[new THREE.LineCurve3(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1, 0, 0)), 20, 0.2, 8, false]} />;
      case 'Icosahedron': return <icosahedronGeometry args={[1, 0]} />;
      case 'Octahedron': return <octahedronGeometry args={[1, 0]} />;
      case 'Dodecahedron': return <dodecahedronGeometry args={[1, 0]} />;
      case 'Tetrahedron': return <tetrahedronGeometry args={[1, 0]} />;
      case 'Polyhedron': return <icosahedronGeometry args={[1, 0]} />;
      case 'Lathe': return <cylinderGeometry args={[1, 1, 2, 32]} />;
      case 'Extrude': return <boxGeometry args={[2, 2, 2]} />;
      case 'Circle': return <circleGeometry args={[1, 32]} />;
      case 'cube': return <boxGeometry args={[2, 2, 2]} />; // fallback for legacy
      default: return <boxGeometry args={[2, 2, 2]} />;
    }
  };

  const renderLight = (type, color, distance = 50) => {
    switch(type) {
      case 'AmbientLight': return <ambientLight intensity={1} color={color} />;
      case 'DirectionalLight': return <directionalLight intensity={2} color={color} castShadow />;
      case 'PointLight': return <pointLight intensity={10} distance={distance} color={color} castShadow />;
      case 'SpotLight': return <spotLight intensity={10} distance={distance} angle={Math.PI/6} color={color} castShadow />;
      case 'HemisphereLight': return <hemisphereLight intensity={1} color={color} groundColor="#444444" />;
      case 'RectAreaLight': return <rectAreaLight intensity={10} width={2} height={2} color={color} />;
      default: return <pointLight intensity={10} distance={distance} color={color} />;
    }
  };

  const renderMaterial = (obj, isSelected) => (
    <DreiMaterial obj={obj} isSelected={isSelected} viewportShading={viewportShading} />
  );

  const renderObjectBody = (obj, isSelected) => {
    // Anything in the drei catalog renders through the catalog-driven renderer
    if (isDreiObject(obj.type)) {
      return (
        <DreiObject
          obj={obj}
          isSelected={isSelected}
          onPointerDown={(e) => handlePointerDown(e, obj.id)}
        />
      );
    }

    if (obj.category === 'mesh' || obj.type === 'cube') {
      const castsShadow = viewportShading === 'rendered';
      return (
        <mesh 
          onPointerDown={(e) => handlePointerDown(e, obj.id)}
          castShadow={castsShadow}
          receiveShadow={castsShadow}
        >
          {renderGeometry(obj.type)}
          {renderMaterial(obj, isSelected)}
        </mesh>
      );
    } else if (obj.category === 'light') {
      const distance = obj.properties?.distance || 5; // Default distance
      return (
        <mesh onPointerDown={(e) => handlePointerDown(e, obj.id)}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial 
            color={isSelected ? "#ffaa00" : obj.color} 
            wireframe={true} 
          />
          {isSelected && (
            <group>
              <mesh 
                rotation={[Math.PI / 2, 0, 0]}
                onPointerDown={(e) => handleRingPointerDown(e, obj, distance)}
                onPointerMove={handleRingPointerMove}
                onPointerUp={handleRingPointerUp}
                onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'col-resize'; }}
                onPointerOut={(e) => { if (!dragState.active) document.body.style.cursor = 'auto'; }}
              >
                <ringGeometry args={[distance, distance + 0.1, 64]} />
                <meshBasicMaterial color="#ffffff" side={2} transparent opacity={0.5} depthTest={false} />
              </mesh>
              <mesh
                onPointerDown={(e) => handleRingPointerDown(e, obj, distance)}
                onPointerMove={handleRingPointerMove}
                onPointerUp={handleRingPointerUp}
                onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'col-resize'; }}
                onPointerOut={(e) => { if (!dragState.active) document.body.style.cursor = 'auto'; }}
              >
                <ringGeometry args={[distance, distance + 0.1, 64]} />
                <meshBasicMaterial color="#ffffff" side={2} transparent opacity={0.5} depthTest={false} />
              </mesh>
            </group>
          )}
          {renderLight(obj.type, obj.color, distance)}
        </mesh>
      );
    } else if (obj.category === 'camera') {
      // If we are looking through the camera, hide its physical representation
      if (isCameraView) {
        return null;
      }
      return (
        <mesh onPointerDown={(e) => handlePointerDown(e, obj.id)}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial 
            color={isSelected ? "#ffaa00" : "#ffffff"} 
            wireframe={true} 
          />
        </mesh>
      );
    } else {
      // Empty or other
      return (
        <mesh onPointerDown={(e) => handlePointerDown(e, obj.id)}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshBasicMaterial color={isSelected ? "#ffaa00" : "#ffffff"} wireframe={true} />
          <axesHelper args={[1]} />
        </mesh>
      );
    }
  };

  return (
    <>
      <ModalTransformHandler objectRefs={objectRefs} />
      {objects.map((obj) => (
        <SceneObjectItem
          key={obj.id}
          obj={obj}
          isSelected={selectedIds.includes(obj.id)}
          isActive={activeId === obj.id}
          isVisible={
            obj.visible !== false &&
            // The camera toggle only culls in rendered shading, like Blender's render visibility
            (viewportShading !== 'rendered' || obj.renderable !== false) &&
            isCollectionChainVisible(collections, obj.collectionId, viewportShading === 'rendered')
          }
          transformState={transformState}
          updateObject={updateObject}
          renderObjectBody={renderObjectBody}
          objectRefs={objectRefs}
          selectedIds={selectedIds}
        />
      ))}
    </>
  );
}
