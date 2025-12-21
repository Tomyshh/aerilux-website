import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { RevealText } from './effects/AnimatedText';
import { Target, Droplets, RotateCcw } from 'lucide-react';

const InActionSection = styled.section`
  padding: 6rem 2rem;
  background: #000000;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const SectionTag = styled(motion.span)`
  display: inline-block;
  font-size: 0.85rem;
  color: #3B9EFF;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 158, 255, 0.1);
  border-radius: 50px;
  border: 1px solid rgba(59, 158, 255, 0.3);
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #888888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: #666666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 
    0 40px 80px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  will-change: transform, opacity;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      transparent 60%,
      rgba(0, 0, 0, 0.7) 100%
    );
    z-index: 1;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    border-radius: 16px;
  }
`;

const ActionImage = styled(motion.img)`
  width: 100%;
  height: auto;
  display: block;
`;

const ImageOverlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-end;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: 1.25rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const OverlayTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  max-width: 400px;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
    width: 100%;
    justify-content: space-between;
  }
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const StatValue = styled.span`
  display: block;
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.15rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StatLabel = styled.span`
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.1em;
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

const FeaturesList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(59, 158, 255, 0.15);
  border: 1px solid rgba(59, 158, 255, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3B9EFF;
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 1.9;
  }
`;

const FeatureText = styled.div``;

const FeatureTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: #999999;
  line-height: 1.6;
`;

const InAction: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const actionFeatures = useMemo(() => [
    {
      icon: <Target aria-hidden="true" />,
      title: t('inAction.preciseTargeting.title'),
      description: t('inAction.preciseTargeting.description'),
    },
    {
      icon: <Droplets aria-hidden="true" />,
      title: t('inAction.ecological.title'),
      description: t('inAction.ecological.description'),
    },
    {
      icon: <RotateCcw aria-hidden="true" />,
      title: t('inAction.coverage.title'),
      description: t('inAction.coverage.description'),
    },
  ], [t]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <InActionSection id="in-action" ref={ref}>
      <GlowOrb
        style={{ top: '-15%', left: '-10%' }}
        animate={inView ? { x: [0, 90, 0], y: [0, 40, 0] } : {}}
        transition={{ duration: 18, repeat: inView ? Infinity : 0, ease: 'linear' }}
      />
      <GlowOrb
        style={{ bottom: '-25%', right: '-15%' }}
        animate={inView ? { x: [0, -70, 0], y: [0, -30, 0] } : {}}
        transition={{ duration: 16, repeat: inView ? Infinity : 0, ease: 'linear' }}
      />

      <Container>
        <SectionHeader>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <SectionTag variants={itemVariants}>{t('inAction.tag')}</SectionTag>
            <RevealText delay={0.2}>
              <SectionTitle>{t('inAction.title')}</SectionTitle>
            </RevealText>
            <SectionSubtitle variants={itemVariants}>
              {t('inAction.subtitle')}
            </SectionSubtitle>
          </motion.div>
        </SectionHeader>

        <ImageContainer
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
          whileHover={{ scale: 1.01 }}
        >
          <ActionImage
            src="/image_pres.jpeg"
            alt="Aerilux en action - Système de répulsion des pigeons par jet d'eau"
            loading="lazy"
          />
          <ImageOverlay
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <OverlayTitle>
              {t('inAction.instantDetection')}
            </OverlayTitle>
            <StatsContainer>
              <StatItem
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <StatValue>&lt;0.5s</StatValue>
                <StatLabel>{t('inAction.reactionTime')}</StatLabel>
              </StatItem>
              <StatItem
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <StatValue>99.9%</StatValue>
                <StatLabel>{t('inAction.accuracy')}</StatLabel>
              </StatItem>
              <StatItem
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <StatValue>15m</StatValue>
                <StatLabel>{t('inAction.range')}</StatLabel>
              </StatItem>
            </StatsContainer>
          </ImageOverlay>
        </ImageContainer>

        <FeaturesList
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {actionFeatures.map((feature, index) => (
            <FeatureItem
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02, 
                borderColor: 'rgba(59, 158, 255, 0.5)',
                transition: { duration: 0.2 }
              }}
            >
              <FeatureIcon>{feature.icon}</FeatureIcon>
              <FeatureText>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureText>
            </FeatureItem>
          ))}
        </FeaturesList>
      </Container>
    </InActionSection>
  );
});

InAction.displayName = 'InAction';

export default InAction;
