"use client";

import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

export default function ToolbarButton({ icon: Icon, onClick, onPointerDown, onPointerUp, onPointerLeave, title }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const style = useSpring({
    backgroundColor: isActive ? '#4f4f4f' : isHovered ? '#3a3a3a' : '#282828',
    scale: isActive ? 0.95 : isHovered ? 1.05 : 1,
    config: { tension: 400, friction: 20 }
  });

  return (
    <animated.button
      style={{
        ...style,
        width: 36,
        height: 36,
        borderRadius: '50%',
        border: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#ffffff',
        outline: 'none',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        marginBottom: 8
      }}
      title={title}
      onClick={onClick}
      onPointerDown={(e) => {
        setIsActive(true);
        if (onPointerDown) onPointerDown(e);
      }}
      onPointerUp={(e) => {
        setIsActive(false);
        if (onPointerUp) onPointerUp(e);
      }}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={(e) => {
        setIsHovered(false);
        setIsActive(false);
        if (onPointerLeave) onPointerLeave(e);
      }}
    >
      <Icon size={20} strokeWidth={2} />
    </animated.button>
  );
}
