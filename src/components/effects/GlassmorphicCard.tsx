import React, { ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface GlassmorphicCardProps {
  children: ReactNode;
  className?: string;
  tiltEnabled?: boolean;
  glowEnabled?: boolean;
  hoverEnabled?: boolean;
  shineEnabled?: boolean;
  intensity?: number;
}

const CardWrapper = styled(motion.div)`
  position: relative;
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const Card = styled(motion.div)<{ $intensity: number }>`
  position: relative;
  background: rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  padding: 0;
  overflow: hidden;
  transform-style: preserve-3d;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, ${props => props.$intensity * 0.06}) 0%,
      transparent 50%,
      rgba(255, 255, 255, ${props => props.$intensity * 0.03}) 100%
    );
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      1200px 500px at 50% -120px,
      rgba(59, 158, 255, 0.12),
      transparent 60%
    );
    pointer-events: none;
  }
`;

const Glow = styled(motion.div)`
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(59, 158, 255, 0.35) 0%,
    rgba(59, 158, 255, 0.12) 45%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(22px);
  mix-blend-mode: screen;
  opacity: 0.9;
  z-index: 0;
`;

const Shine = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgba(255, 255, 255, 0.06) 45%,
    rgba(255, 255, 255, 0.10) 50%,
    rgba(255, 255, 255, 0.06) 55%,
    transparent 60%
  );
  pointer-events: none;
  border-radius: 28px;
  opacity: 0.7;
`;

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className,
  tiltEnabled = true,
  glowEnabled = true,
  hoverEnabled = true,
  shineEnabled = true,
  intensity = 1,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);
  
  const shineX = useSpring(useTransform(x, [-0.5, 0.5], [-100, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || (!tiltEnabled && !glowEnabled)) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = (e.clientX - centerX) / (rect.width / 2);
    const mouseY = (e.clientY - centerY) / (rect.height / 2);
    
    if (tiltEnabled) {
      x.set(mouseX);
      y.set(mouseY);
    }
    
    if (glowEnabled) {
      glowX.set(e.clientX - rect.left - 100);
      glowY.set(e.clientY - rect.top - 100);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <CardWrapper className={className}>
      <Card
        ref={cardRef}
        $intensity={intensity}
        style={{
          rotateX: tiltEnabled ? rotateX : 0,
          rotateY: tiltEnabled ? rotateY : 0,
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={hoverEnabled ? { scale: 1.02 } : undefined}
        transition={hoverEnabled ? { duration: 0.3 } : undefined}
      >
        {glowEnabled && (
          <Glow
            style={{
              x: glowX,
              y: glowY,
            }}
          />
        )}
        {shineEnabled && (
          <Shine
            style={{
              x: shineX,
            }}
          />
        )}
        {children}
      </Card>
    </CardWrapper>
  );
};

export default GlassmorphicCard;
