import React, { useRef, useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { Target, Zap, Eye, CheckCircle } from 'lucide-react';
import { RevealText } from './effects/AnimatedText';
import Lottie from 'lottie-react';

const TechnologySection = styled.section`
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
  pointer-events: none;
  will-change: transform;
`;

const Container = styled.div`
  max-width: 1400px;
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

const TechShowcase = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  margin-bottom: 6rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const TechVisualization = styled(motion.div)`
  position: relative;
  aspect-ratio: 16/10;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LottieContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TechContent = styled(motion.div)``;

const TechFeature = styled(motion.div)`
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #3B9EFF;
  }
`;

const TechFeatureNumber = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 3rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
`;

const TechFeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #ffffff;
`;

const TechFeatureDescription = styled.p`
  font-size: 1.05rem;
  color: #999999;
  line-height: 1.7;
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: #3B9EFF;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(59, 158, 255, 0.03);
    pointer-events: none;
  }
`;

const StatIconWrapper = styled(motion.div)`
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  background: rgba(59, 158, 255, 0.15);
  border: 1px solid rgba(59, 158, 255, 0.3);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 10px 30px rgba(59, 158, 255, 0.15);

  svg {
    width: 22px;
    height: 22px;
    stroke-width: 1.9;
  }
`;

const StatNumber = styled(motion.h3)`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: #999999;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Technology: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [waveAnimation, setWaveAnimation] = useState<any>(null);

  useEffect(() => {
    fetch('/lottie/Wave Loop.json')
      .then(res => res.json())
      .then(data => setWaveAnimation(data))
      .catch(err => console.error('Error loading Lottie animation:', err));
  }, []);

  const techFeatures = useMemo(() => [
    {
      title: t('technology.neuralNetwork.title'),
      description: t('technology.neuralNetwork.description'),
    },
    {
      title: t('technology.realTime.title'),
      description: t('technology.realTime.description'),
    },
    {
      title: t('technology.adaptive.title'),
      description: t('technology.adaptive.description'),
    },
  ], [t]);

  const stats = useMemo(() => [
    { icon: <Target aria-hidden="true" />, number: t('technology.stats.accuracy'), label: t('technology.stats.accuracyLabel') },
    { icon: <Zap aria-hidden="true" />, number: t('technology.stats.response'), label: t('technology.stats.responseLabel') },
    { icon: <Eye aria-hidden="true" />, number: t('technology.stats.monitoring'), label: t('technology.stats.monitoringLabel') },
    { icon: <CheckCircle aria-hidden="true" />, number: t('technology.stats.falsePositives'), label: t('technology.stats.falsePositivesLabel') },
  ], [t]);


  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }), []);

  return (
    <TechnologySection id="technology" ref={sectionRef}>
      <GlowOrb
        style={{ top: '-20%', left: '-15%' }}
        animate={inView ? { x: [0, 100, 0], y: [0, 60, 0] } : {}}
        transition={{ duration: 22, repeat: inView ? Infinity : 0, ease: 'linear' }}
      />
      <GlowOrb
        style={{ bottom: '-25%', right: '-10%' }}
        animate={inView ? { x: [0, -80, 0], y: [0, -50, 0] } : {}}
        transition={{ duration: 18, repeat: inView ? Infinity : 0, ease: 'linear' }}
      />
      
      <Container ref={ref}>
        <SectionHeader>
          <RevealText delay={0}>
            <SectionTitle>
              {t('technology.title')}
            </SectionTitle>
          </RevealText>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t('technology.subtitle')}
          </SectionSubtitle>
        </SectionHeader>

        <TechShowcase>
          <TechVisualization
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {waveAnimation && (
              <LottieContainer>
                <Lottie
                  animationData={waveAnimation}
                  loop={true}
                  style={{ width: '100%', height: '100%' }}
                />
              </LottieContainer>
            )}
          </TechVisualization>
          
          <TechContent
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {techFeatures.map((feature, index) => (
              <TechFeature
                key={index}
                variants={itemVariants}
              >
                <TechFeatureNumber>0{index + 1}</TechFeatureNumber>
                <TechFeatureTitle>{feature.title}</TechFeatureTitle>
                <TechFeatureDescription>{feature.description}</TechFeatureDescription>
              </TechFeature>
            ))}
          </TechContent>
        </TechShowcase>

        <StatsGrid
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              variants={itemVariants}
            >
              <StatIconWrapper>
                {stat.icon}
              </StatIconWrapper>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </Container>
    </TechnologySection>
  );
});

Technology.displayName = 'Technology';

export default Technology;
