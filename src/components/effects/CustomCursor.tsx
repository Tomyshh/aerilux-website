import React, { useEffect, useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CursorOuter = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  will-change: transform;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CursorInner = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background-color: #ffffff;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  will-change: transform;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CursorTrail = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  will-change: transform;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Check if device is mobile/tablet
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

const CustomCursor: React.FC = React.memo(() => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  
  const rafRef = useRef<number | null>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const trailSpringConfig = { damping: 40, stiffness: 150 };
  const trailXSpring = useSpring(cursorX, trailSpringConfig);
  const trailYSpring = useSpring(cursorY, trailSpringConfig);

  // Use RAF to batch cursor updates
  const updateCursorPosition = useCallback(() => {
    cursorX.set(targetPos.current.x);
    cursorY.set(targetPos.current.y);
    rafRef.current = null;
  }, [cursorX, cursorY]);

  useEffect(() => {
    // Don't enable on touch devices
    if (isTouchDevice()) {
      return;
    }
    
    setIsEnabled(true);

    const moveCursor = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      
      // Use RAF to batch updates and reduce jank
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateCursorPosition);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'auto';
      
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateCursorPosition]);

  // Don't render anything on touch devices
  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <CursorTrail
        style={{
          x: trailXSpring,
          y: trailYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <CursorOuter
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
          borderColor: isHovering ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)',
        }}
        transition={{ duration: 0.15 }}
      />
      <CursorInner
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovering ? 2 : isClicking ? 0.5 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
