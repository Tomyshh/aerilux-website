import React, { ReactNode, useRef } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

const Section = styled(motion.div)`
  position: relative;
  overflow: hidden;
`;

const ParallaxContent = styled(motion.div)`
  position: relative;
  z-index: 1;
`;

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className,
  speed = 0.5,
  direction = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const multiplier = direction === 'up' ? -1 : 1;
  const yRange = speed * 100 * multiplier;
  
  const y = useTransform(scrollYProgress, [0, 1], [0, yRange]);
  const smoothY = useSpring(y, { damping: 50, stiffness: 100 });

  return (
    <Section ref={ref} className={className}>
      <ParallaxContent style={{ y: smoothY }}>
        {children}
      </ParallaxContent>
    </Section>
  );
};

// Composant pour un élément parallax individuel
interface ParallaxElementProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  rotate?: boolean;
  scale?: boolean;
}

const ElementWrapper = styled(motion.div)`
  will-change: transform;
`;

export const ParallaxElement: React.FC<ParallaxElementProps> = ({
  children,
  className,
  speed = 0.3,
  rotate = false,
  scale = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 200]);
  const rotation = useTransform(scrollYProgress, [0, 1], [0, rotate ? 360 : 0]);
  const scaleValue = useTransform(scrollYProgress, [0, 0.5, 1], scale ? [0.8, 1, 0.8] : [1, 1, 1]);
  
  const smoothY = useSpring(y, { damping: 50, stiffness: 100 });
  const smoothRotate = useSpring(rotation, { damping: 50, stiffness: 100 });
  const smoothScale = useSpring(scaleValue, { damping: 50, stiffness: 100 });

  return (
    <ElementWrapper
      ref={ref}
      className={className}
      style={{
        y: smoothY,
        rotate: smoothRotate,
        scale: smoothScale,
      }}
    >
      {children}
    </ElementWrapper>
  );
};

// Composant pour un fond parallax
interface ParallaxBackgroundProps {
  imageUrl?: string;
  className?: string;
  speed?: number;
  overlay?: boolean;
}

const BackgroundWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
`;

const BackgroundImage = styled(motion.div)<{ $imageUrl?: string }>`
  position: absolute;
  top: -20%;
  left: 0;
  width: 100%;
  height: 140%;
  background-image: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.5) 100%
  );
`;

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  imageUrl,
  className,
  speed = 0.3,
  overlay = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 30}%`]);
  const smoothY = useSpring(y, { damping: 50, stiffness: 100 });

  return (
    <BackgroundWrapper ref={ref} className={className}>
      <BackgroundImage
        $imageUrl={imageUrl}
        style={{ y: smoothY }}
      />
      {overlay && <Overlay />}
    </BackgroundWrapper>
  );
};

export default ParallaxSection;
