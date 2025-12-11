import React, { useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import AnimatedText from './effects/AnimatedText';
import MagneticButton from './effects/MagneticButton';

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 0 2rem;
  background-image: url('/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.6) 100%
    );
    z-index: 2;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  text-align: center;
  z-index: 3;
  position: relative;
`;

const Tagline = styled(motion.p)`
  font-size: 1.1rem;
  color: #999999;
  margin-bottom: 1rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
`;

const HeroTitleWrapper = styled.div`
  margin-bottom: 2rem;
`;

const HeroTitle = styled.h1`
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(180deg, #ffffff 0%, #666666 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: #cccccc;
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
`;

const GlowOrb = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.15) 0%, transparent 60%);
  filter: blur(60px);
  z-index: 1;
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
        delayChildren: 0.5,
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
          <Tagline variants={itemVariants}>
            Revolutionary AI Technology
          </Tagline>
          
          <HeroTitleWrapper>
            <HeroTitle>
              <AnimatedText text="KEEP IT CLEAN" type="letter" delay={5} />
            </HeroTitle>
          </HeroTitleWrapper>
          
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
