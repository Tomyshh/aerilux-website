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

const StatsRow = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin: 2.25rem auto 0;
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
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(14px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
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

const VisionShowcase = styled(motion.div)`
  width: 100%;
  max-width: 960px;
  margin: 3rem auto 0;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const VisionRow = styled(motion.div)<{ $reverse?: boolean }>`
  display: flex;
  align-items: center;
  gap: 3rem;
  flex-direction: ${p => p.$reverse ? 'row-reverse' : 'row'};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const VisionImageWrap = styled(motion.div)`
  flex: 0 0 auto;
  width: 450px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: -20px;
    background: radial-gradient(circle at center, rgba(59, 158, 255, 0.12), transparent 70%);
    z-index: -1;
    filter: blur(30px);
  }

  @media (max-width: 768px) {
    width: 320px;
  }
`;

const VisionImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
`;

const VisionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const VisionKicker = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #3B9EFF;
  font-weight: 500;
`;

const VisionTitle = styled.h3`
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
`;

const VisionDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.6);
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

        <StatsRow
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <StatsContainer>
            <StatItem>
              <StatValue>&lt;0.5s</StatValue>
              <StatLabel>{t('inAction.reactionTime')}</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>99.9%</StatValue>
              <StatLabel>{t('inAction.accuracy')}</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>15m</StatValue>
              <StatLabel>{t('inAction.range')}</StatLabel>
            </StatItem>
          </StatsContainer>
        </StatsRow>

        <VisionShowcase
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <VisionRow
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <VisionImageWrap
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <VisionImage
                src="/aerilux-vision.png"
                alt="Aerilux Vision — design esthétique"
                loading="lazy"
              />
            </VisionImageWrap>
            <VisionContent>
              <VisionKicker>{t('inAction.visionShowcase.design.kicker')}</VisionKicker>
              <VisionTitle>{t('inAction.visionShowcase.design.title')}</VisionTitle>
              <VisionDescription>{t('inAction.visionShowcase.design.description')}</VisionDescription>
            </VisionContent>
          </VisionRow>

          <VisionRow
            $reverse
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55 }}
          >
            <VisionImageWrap
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <VisionImage
                src="/aerilux-vision-exploded.png"
                alt="Aerilux Vision — vue éclatée technologique"
                loading="lazy"
              />
            </VisionImageWrap>
            <VisionContent>
              <VisionKicker>{t('inAction.visionShowcase.exploded.kicker')}</VisionKicker>
              <VisionTitle>{t('inAction.visionShowcase.exploded.title')}</VisionTitle>
              <VisionDescription>{t('inAction.visionShowcase.exploded.description')}</VisionDescription>
            </VisionContent>
          </VisionRow>
        </VisionShowcase>

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
