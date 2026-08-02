/* eslint-disable */
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import ModalTransformHandler from './ModalTransformHandler';
import TransformProxy from './TransformProxy';

function SceneObjectItem({ obj, isSelected, isActive, transformState, updateObject, renderObjectBody, objectRefs, selectedIds }) {
  const [groupEl, setGroupEl] = useState(null);

  return (
    <React.Fragment>
      <group 
        userData={{ id: obj.id }}
        ref={(el) => {
          setGroupEl(el);
          if (el) objectRefs.current[obj.id] = el;
          else delete objectRefs.current[obj.id];
        }}
        position={obj.position} 
        rotation={obj.rotation} 
        scale={obj.scale}
      >
        {renderObjectBody(obj, isSelected)}
      </group>
      
      {isActive && transformState.mode !== 'idle' && groupEl && selectedIds.length <= 1 && (
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
              setTransformState({ mode: 'idle', axisConstraint: null, planeConstraint: null });
            }
          }}
        />
      )}
    </React.Fragment>
  );
}

export default function SceneObjects() {
  const objects = useStore((state) => state.objects);
  const selectedIds = useStore((state) => state.selectedIds);
  const setSelectedIds = useStore((state) => state.setSelectedIds);
  const activeId = useStore((state) => state.activeId);
  const transformState = useStore((state) => state.transformState);
  const setTransformState = useStore((state) => state.setTransformState);
  const updateObject = useStore((state) => state.updateObject);
  
  const objectRefs = useRef({});

  const handlePointerDown = (e, id) => {
    e.stopPropagation(); // Prevent clicking on things behind
    
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

  const renderLight = (type, color) => {
    switch(type) {
      case 'AmbientLight': return <ambientLight intensity={1} color={color} />;
      case 'DirectionalLight': return <directionalLight intensity={2} color={color} castShadow />;
      case 'PointLight': return <pointLight intensity={10} distance={50} color={color} castShadow />;
      case 'SpotLight': return <spotLight intensity={10} distance={50} angle={Math.PI/6} color={color} castShadow />;
      case 'HemisphereLight': return <hemisphereLight intensity={1} color={color} groundColor="#444444" />;
      case 'RectAreaLight': return <rectAreaLight intensity={10} width={2} height={2} color={color} />;
      default: return <pointLight intensity={10} color={color} />;
    }
  };

  const renderMaterial = (obj, isSelected) => {
    const emissiveProps = {
      emissive: isSelected ? "#ffaa00" : "#000000",
      emissiveIntensity: isSelected ? 0.2 : 0
    };

    switch (obj.materialType) {
      case 'basic': 
        return <meshBasicMaterial color={obj.color} wireframe={false} />;
      case 'physical': 
        return <meshPhysicalMaterial color={obj.color} roughness={0.7} metalness={0.1} clearcoat={1} {...emissiveProps} />;
      case 'phong': 
        return <meshPhongMaterial color={obj.color} shininess={30} {...emissiveProps} />;
      case 'lambert': 
        return <meshLambertMaterial color={obj.color} {...emissiveProps} />;
      case 'standard':
      default: 
        return <meshStandardMaterial color={obj.color} roughness={0.7} {...emissiveProps} />;
    }
  };

  const renderObjectBody = (obj, isSelected) => {
    if (obj.category === 'mesh' || obj.type === 'cube') {
      return (
        <mesh onPointerDown={(e) => handlePointerDown(e, obj.id)}>
          {renderGeometry(obj.type)}
          {renderMaterial(obj, isSelected)}
        </mesh>
      );
    } else if (obj.category === 'light') {
      return (
        <mesh onPointerDown={(e) => handlePointerDown(e, obj.id)}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshBasicMaterial 
            color={isSelected ? "#ffaa00" : obj.color} 
            wireframe={true} 
          />
          {renderLight(obj.type, obj.color)}
        </mesh>
      );
    } else if (obj.category === 'camera') {
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
