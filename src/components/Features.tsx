import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import GlassmorphicCard from './effects/GlassmorphicCard';
import { RevealText } from './effects/AnimatedText';

const FeaturesSection = styled.section`
  padding: 10rem 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f0f0f5 100%);
  color: #000000;
  position: relative;
  overflow: hidden;
`;

const BackgroundGradient = styled(motion.div)`
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.3;
  z-index: 0;
  will-change: transform;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 6rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: #666666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
`;

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  overflow: visible;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCardWrapper = styled(motion.div)`
  height: 100%;
  overflow: visible;
  padding: 1rem;
`;

const StyledGlassmorphicCard = styled(GlassmorphicCard)`
  height: 100%;
  overflow: visible;
  
  > div {
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 0, 0, 0.05);
    overflow: visible;
    padding: 2rem;
    
    &::before {
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.02) 0%,
        transparent 50%,
        rgba(0, 0, 0, 0.02) 100%
      );
    }
  }
`;

const FeatureContent = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: visible;
`;

const IconWrapper = styled(motion.div)`
  width: 90px;
  height: 90px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: iconShine 3s infinite;
  }
  
  @keyframes iconShine {
    0% { left: -100%; }
    50%, 100% { left: 100%; }
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #000000;
  position: relative;
  z-index: 1;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #666666;
  line-height: 1.7;
  flex: 1;
  position: relative;
  z-index: 1;
`;

const FeatureNumber = styled(motion.span)`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 5.5rem;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.03);
  line-height: 1;
  pointer-events: none;
  transform: translate(15%, -15%);
  white-space: nowrap;
  z-index: 0;
`;

const features = [
  {
    icon: '🧠',
    title: 'AI-Powered Detection',
    description: 'Advanced machine learning algorithms detect and deter pigeons with 99.9% accuracy.',
  },
  {
    icon: '🛡️',
    title: 'Humane Solution',
    description: 'Completely harmless to birds and humans. Uses sound and light patterns to discourage nesting.',
  },
  {
    icon: '⚡',
    title: 'Energy Efficient',
    description: 'Solar-powered with battery backup. Zero electricity costs and environmentally friendly.',
  },
  {
    icon: '📱',
    title: 'Smart Control',
    description: 'Monitor and control your device remotely via our mobile app. Real-time notifications.',
  },
  {
    icon: '🌧️',
    title: 'Weather Resistant',
    description: 'IP67 rated for all weather conditions. Built to last with premium materials.',
  },
  {
    icon: '💰',
    title: 'Cost Effective',
    description: 'Save thousands on cleaning costs. ROI in less than 6 months for most properties.',
  },
];

const Features: React.FC = React.memo(() => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }), []);

  return (
    <FeaturesSection id="features">
      <BackgroundGradient
        style={{ top: '-20%', left: '-10%', background: 'linear-gradient(135deg, #007AFF 0%, #34c759 100%)' }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <BackgroundGradient
        style={{ bottom: '-20%', right: '-10%', background: 'linear-gradient(135deg, #34c759 0%, #007AFF 100%)' }}
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <Container ref={ref}>
        <SectionHeader>
          <RevealText delay={0}>
            <SectionTitle>
              Why Choose Aerilux?
            </SectionTitle>
          </RevealText>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Experience the future of pigeon control with our patented AI technology
          </SectionSubtitle>
        </SectionHeader>

        <FeaturesGrid
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => (
            <FeatureCardWrapper key={index} variants={itemVariants}>
              <StyledGlassmorphicCard tiltEnabled={true} glowEnabled={false} intensity={0.5}>
                <FeatureContent>
                  <FeatureNumber>{String(index + 1).padStart(2, '0')}</FeatureNumber>
                  <IconWrapper
                    whileHover={{ 
                      scale: 1.1, 
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.4 }
                    }}
                  >
                    {feature.icon}
                  </IconWrapper>
                  <FeatureTitle>{feature.title}</FeatureTitle>
                  <FeatureDescription>{feature.description}</FeatureDescription>
                </FeatureContent>
              </StyledGlassmorphicCard>
            </FeatureCardWrapper>
          ))}
        </FeaturesGrid>
      </Container>
    </FeaturesSection>
  );
});

Features.displayName = 'Features';

export default Features;
