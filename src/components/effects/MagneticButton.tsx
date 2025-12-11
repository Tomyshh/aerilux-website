import React, { useRef, ReactNode } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

const ButtonWrapper = styled(motion.div)`
  position: relative;
  display: inline-block;
`;

const ButtonContent = styled(motion.div)`
  position: relative;
  z-index: 1;
`;

const ButtonBackground = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
`;

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  onClick,
  strength = 0.3,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);
  
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distX = (e.clientX - centerX) * strength;
    const distY = (e.clientY - centerY) * strength;
    
    x.set(distX);
    y.set(distY);
  };

  const handleMouseEnter = () => {
    scale.set(1.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <ButtonWrapper
      ref={buttonRef}
      className={className}
      style={{
        x: xSpring,
        y: ySpring,
        scale,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      <ButtonContent>
        {children}
      </ButtonContent>
      <ButtonBackground
        initial={{ opacity: 0, scale: 0 }}
        whileHover={{ opacity: 1, scale: 1.5 }}
        transition={{ duration: 0.3 }}
      />
    </ButtonWrapper>
  );
};

export default MagneticButton;
