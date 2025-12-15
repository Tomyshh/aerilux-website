import React, { useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import AnimatedText from './effects/AnimatedText';
import MagneticButton from './effects/MagneticButton';
import logoSolid from '../utils/IconOnly_Transparent_NoBuffer.png';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 0 2rem;
  background: #000000;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  text-align: center;
  z-index: 3;
  position: relative;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const HeroLogo = styled(motion.img)`
  width: 80px;
  height: 80px;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const HeroTitleWrapper = styled.div`
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h1`
  font-size: clamp(4rem, 12vw, 10rem);
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(180deg, #ffffff 0%, #888888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.05em;
`;

const Slogan = styled(motion.p)`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #666666;
  margin-bottom: 2rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: #999999;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  color: #000000;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 10px 40px rgba(255, 255, 255, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 60px rgba(255, 255, 255, 0.3);
  }
`;

const SecondaryButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #ffffff;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-3px);
  }
`;

const FloatingElement = styled(motion.div)<{ $size: number; $left: string; $top: string }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  left: ${props => props.$left};
  top: ${props => props.$top};
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.3) 0%, transparent 70%);
  filter: blur(40px);
  z-index: 1;
  will-change: transform;
`;

const GlowOrb = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.15) 0%, transparent 60%);
  filter: blur(60px);
  z-index: 1;
  will-change: transform;
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 3;
`;

const ScrollLine = styled(motion.div)`
  width: 1px;
  height: 60px;
  background: linear-gradient(180deg, #ffffff 0%, transparent 100%);
`;

const ScrollText = styled.span`
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #666666;
`;

const Hero: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  
  const smoothY = useSpring(y, { damping: 50, stiffness: 100 });
  const smoothOpacity = useSpring(opacity, { damping: 50, stiffness: 100 });
  const smoothScale = useSpring(scale, { damping: 50, stiffness: 100 });

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }), []);

  const logoVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }), []);

  const handleNavigateToProduct = useCallback(() => {
    navigate('/product');
  }, [navigate]);

  const handleNavigateToAbout = useCallback(() => {
    navigate('/about');
  }, [navigate]);

  return (
    <HeroSection ref={sectionRef}>
      {/* Floating glow elements */}
      <GlowOrb
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ top: '10%', left: '10%' }}
      />
      <GlowOrb
        animate={{
          x: [0, -80, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ bottom: '10%', right: '10%' }}
      />
      
      <FloatingElement
        $size={200}
        $left="20%"
        $top="30%"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <FloatingElement
        $size={150}
        $left="70%"
        $top="60%"
        animate={{
          y: [0, 20, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <HeroContent ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ y: smoothY, opacity: smoothOpacity, scale: smoothScale }}
        >
          <LogoContainer variants={logoVariants}>
            <HeroLogo 
              src={logoSolid} 
              alt="Aerilux Logo"
              animate={{
                filter: ['drop-shadow(0 0 20px rgba(255,255,255,0.3))', 'drop-shadow(0 0 40px rgba(255,255,255,0.6))', 'drop-shadow(0 0 20px rgba(255,255,255,0.3))'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </LogoContainer>
          
          <HeroTitleWrapper>
            <HeroTitle>
              <AnimatedText text="AERILUX" type="letter" delay={3} />
            </HeroTitle>
          </HeroTitleWrapper>
          
          <Slogan variants={itemVariants}>
            Keep It Clean
          </Slogan>
          
          <HeroSubtitle variants={itemVariants}>
            The world's first AI-powered pigeon deterrent system. 
            Protect your property with cutting-edge technology.
          </HeroSubtitle>
          
          <CTAContainer variants={itemVariants}>
            <MagneticButton onClick={handleNavigateToProduct}>
              <PrimaryButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Order Now
              </PrimaryButton>
            </MagneticButton>
            <MagneticButton onClick={handleNavigateToAbout}>
              <SecondaryButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </SecondaryButton>
            </MagneticButton>
          </CTAContainer>
        </motion.div>
      </HeroContent>
      
      <ScrollIndicator
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <ScrollText>Scroll</ScrollText>
        <ScrollLine
          animate={{ scaleY: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </ScrollIndicator>
    </HeroSection>
  );
});

Hero.displayName = 'Hero';

export default Hero;
