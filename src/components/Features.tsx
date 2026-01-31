import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { RevealText } from './effects/AnimatedText';
import { Brain, Shield, Zap, Smartphone, CloudRain, BadgeDollarSign } from 'lucide-react';

const FeaturesSection = styled.section`
  padding: 8rem 2rem 12rem;
  background: #000000;
  color: #ffffff;
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
  margin-bottom: 5rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  letter-spacing: -0.04em;
  color: #ffffff;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.5);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 400;
`;

// Bento Grid Layout
const BentoGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: auto;
  gap: 1rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(6, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

interface BentoItemProps {
  $gridColumn?: string;
  $gridColumnTablet?: string;
  $isLarge?: boolean;
  $accentColor?: string;
}

const BentoItem = styled(motion.div)<BentoItemProps>`
  grid-column: ${props => props.$gridColumn || 'span 4'};
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: ${props => props.$isLarge ? '2.5rem' : '2rem'};
  position: relative;
  overflow: hidden;
  min-height: ${props => props.$isLarge ? '280px' : '220px'};
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      ellipse at 50% 0%,
      ${props => props.$accentColor || 'rgba(59, 158, 255, 0.08)'} 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-2px);
    
    &::before {
      opacity: 1;
    }
  }
  
  @media (max-width: 900px) {
    grid-column: ${props => props.$gridColumnTablet || 'span 3'};
    min-height: 200px;
  }
  
  @media (max-width: 600px) {
    grid-column: span 1;
    min-height: 180px;
  }
`;

const IconContainer = styled(motion.div)<{ $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${props => props.$color || 'rgba(59, 158, 255, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  position: relative;
  
  svg {
    width: 22px;
    height: 22px;
    color: ${props => {
      if (props.$color?.includes('255, 158')) return '#FFB347';
      if (props.$color?.includes('158, 255')) return '#6EE7B7';
      if (props.$color?.includes('168, 85')) return '#A855F7';
      if (props.$color?.includes('251, 113')) return '#FB7185';
      if (props.$color?.includes('56, 189')) return '#38BDF8';
      return '#3B9EFF';
    }};
    stroke-width: 1.5;
  }
`;

const FeatureLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 0.75rem;
`;

const FeatureTitle = styled.h3<{ $isLarge?: boolean }>`
  font-size: ${props => props.$isLarge ? '1.5rem' : '1.2rem'};
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
  line-height: 1.3;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
  flex: 1;
`;

const Stat = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-top: auto;
  padding-top: 1.5rem;
`;

const StatNumber = styled.span`
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.03em;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
`;

const FloatingOrb = styled(motion.div)<{ $color: string; $size: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background: ${props => props.$color};
  filter: blur(${props => props.$size * 0.6}px);
  opacity: 0.4;
  pointer-events: none;
`;

const Features: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }), []);

  return (
    <FeaturesSection id="features">
      <Container ref={ref}>
        <SectionHeader>
          <RevealText delay={0}>
            <SectionTitle>
              {t('features.title')}
            </SectionTitle>
          </RevealText>
          <SectionSubtitle
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {t('features.subtitle')}
          </SectionSubtitle>
        </SectionHeader>

        <BentoGrid
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* AI Detection - Large card */}
          <BentoItem 
            variants={itemVariants}
            $gridColumn="span 5"
            $gridColumnTablet="span 4"
            $isLarge
            $accentColor="rgba(59, 158, 255, 0.1)"
          >
            <FloatingOrb 
              $color="rgba(59, 158, 255, 0.3)" 
              $size={120}
              style={{ top: -40, right: -30 }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <IconContainer $color="rgba(59, 158, 255, 0.12)">
              <Brain aria-hidden="true" />
            </IconContainer>
            <FeatureLabel>Intelligence</FeatureLabel>
            <FeatureTitle $isLarge>{t('features.aiDetection.title')}</FeatureTitle>
            <FeatureDescription>{t('features.aiDetection.description')}</FeatureDescription>
            <Stat>
              <StatNumber>99.9</StatNumber>
              <StatLabel>% précision</StatLabel>
            </Stat>
          </BentoItem>

          {/* Humane Solution */}
          <BentoItem 
            variants={itemVariants}
            $gridColumn="span 4"
            $gridColumnTablet="span 4"
            $accentColor="rgba(110, 231, 183, 0.1)"
          >
            <IconContainer $color="rgba(158, 255, 158, 0.12)">
              <Shield aria-hidden="true" />
            </IconContainer>
            <FeatureLabel>Éthique</FeatureLabel>
            <FeatureTitle>{t('features.humane.title')}</FeatureTitle>
            <FeatureDescription>{t('features.humane.description')}</FeatureDescription>
          </BentoItem>

          {/* Energy Efficient */}
          <BentoItem 
            variants={itemVariants}
            $gridColumn="span 3"
            $gridColumnTablet="span 4"
            $accentColor="rgba(255, 179, 71, 0.1)"
          >
            <FloatingOrb 
              $color="rgba(255, 179, 71, 0.25)" 
              $size={80}
              style={{ bottom: -20, left: -20 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <IconContainer $color="rgba(255, 158, 68, 0.12)">
              <Zap aria-hidden="true" />
            </IconContainer>
            <FeatureLabel>Autonome</FeatureLabel>
            <FeatureTitle>{t('features.energyEfficient.title')}</FeatureTitle>
            <FeatureDescription>{t('features.energyEfficient.description')}</FeatureDescription>
          </BentoItem>

          {/* Smart Control */}
          <BentoItem 
            variants={itemVariants}
            $gridColumn="span 4"
            $gridColumnTablet="span 6"
            $accentColor="rgba(168, 85, 247, 0.1)"
          >
            <IconContainer $color="rgba(168, 85, 247, 0.12)">
              <Smartphone aria-hidden="true" />
            </IconContainer>
            <FeatureLabel>Connecté</FeatureLabel>
            <FeatureTitle>{t('features.smartControl.title')}</FeatureTitle>
            <FeatureDescription>{t('features.smartControl.description')}</FeatureDescription>
          </BentoItem>

          {/* Weather Resistant */}
          <BentoItem 
            variants={itemVariants}
            $gridColumn="span 4"
            $gridColumnTablet="span 6"
            $accentColor="rgba(56, 189, 248, 0.1)"
          >
            <IconContainer $color="rgba(56, 189, 248, 0.12)">
              <CloudRain aria-hidden="true" />
            </IconContainer>
            <FeatureLabel>Robuste</FeatureLabel>
            <FeatureTitle>{t('features.weatherResistant.title')}</FeatureTitle>
            <FeatureDescription>{t('features.weatherResistant.description')}</FeatureDescription>
            <Stat>
              <StatNumber>IP67</StatNumber>
              <StatLabel>certifié</StatLabel>
            </Stat>
          </BentoItem>

          {/* Cost Effective - Wide card */}
          <BentoItem 
            variants={itemVariants}
            $gridColumn="span 4"
            $gridColumnTablet="span 6"
            $accentColor="rgba(251, 113, 133, 0.1)"
          >
            <FloatingOrb 
              $color="rgba(251, 113, 133, 0.2)" 
              $size={100}
              style={{ top: 20, right: -30 }}
              animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <IconContainer $color="rgba(251, 113, 133, 0.12)">
              <BadgeDollarSign aria-hidden="true" />
            </IconContainer>
            <FeatureLabel>Économique</FeatureLabel>
            <FeatureTitle>{t('features.costEffective.title')}</FeatureTitle>
            <FeatureDescription>{t('features.costEffective.description')}</FeatureDescription>
            <Stat>
              <StatNumber>&lt;6</StatNumber>
              <StatLabel>mois de ROI</StatLabel>
            </Stat>
          </BentoItem>
        </BentoGrid>
      </Container>
    </FeaturesSection>
  );
});

Features.displayName = 'Features';

export default Features;
