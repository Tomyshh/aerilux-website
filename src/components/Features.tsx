import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { RevealText } from './effects/AnimatedText';
import { Brain, Shield, Zap, Smartphone, CloudRain, BadgeDollarSign } from 'lucide-react';

const FeaturesSection = styled.section`
  padding: 10rem 2rem;
  background: #000000;
  color: #ffffff;
  position: relative;
  overflow: hidden;
`;

// Même "tache floue" que la section Hero (même couleur & opacité)
const GlowOrb = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 158, 255, 0.12) 0%, transparent 60%);
  filter: blur(60px);
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
  background: linear-gradient(135deg, #ffffff 0%, #888888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: #999999;
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
`;

const FeatureCard = styled(motion.div)`
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2.5rem 2rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
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
  background: rgba(59, 158, 255, 0.15);
  border: 1px solid rgba(59, 158, 255, 0.3);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3B9EFF;
  box-shadow: 0 20px 40px rgba(59, 158, 255, 0.15);
  position: relative;
  overflow: hidden;
  z-index: 1;

  svg {
    width: 34px;
    height: 34px;
    stroke-width: 1.8;
  }
  
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
      rgba(59, 158, 255, 0.3),
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
  color: #ffffff;
  position: relative;
  z-index: 1;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #999999;
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
  color: rgba(255, 255, 255, 0.03);
  line-height: 1;
  pointer-events: none;
  transform: translate(15%, -15%);
  white-space: nowrap;
  z-index: 0;
`;

const Features: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const features = useMemo(() => [
    {
      icon: <Brain aria-hidden="true" />,
      title: t('features.aiDetection.title'),
      description: t('features.aiDetection.description'),
    },
    {
      icon: <Shield aria-hidden="true" />,
      title: t('features.humane.title'),
      description: t('features.humane.description'),
    },
    {
      icon: <Zap aria-hidden="true" />,
      title: t('features.energyEfficient.title'),
      description: t('features.energyEfficient.description'),
    },
    {
      icon: <Smartphone aria-hidden="true" />,
      title: t('features.smartControl.title'),
      description: t('features.smartControl.description'),
    },
    {
      icon: <CloudRain aria-hidden="true" />,
      title: t('features.weatherResistant.title'),
      description: t('features.weatherResistant.description'),
    },
    {
      icon: <BadgeDollarSign aria-hidden="true" />,
      title: t('features.costEffective.title'),
      description: t('features.costEffective.description'),
    },
  ], [t]);

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
      <GlowOrb
        style={{ top: '-25%', left: '-10%' }}
        animate={{
          x: [0, 70, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <GlowOrb
        style={{ bottom: '-30%', right: '-15%' }}
        animate={{
          x: [0, -60, 0],
          y: [0, -30, 0],
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
              {t('features.title')}
            </SectionTitle>
          </RevealText>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('features.subtitle')}
          </SectionSubtitle>
        </SectionHeader>

        <FeaturesGrid
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => (
            <FeatureCardWrapper key={index} variants={itemVariants}>
              <FeatureCard>
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
              </FeatureCard>
            </FeatureCardWrapper>
          ))}
        </FeaturesGrid>
      </Container>
    </FeaturesSection>
  );
});

Features.displayName = 'Features';

export default Features;
