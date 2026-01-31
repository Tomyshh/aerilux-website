import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Lock, Target, MessageCircle, Zap } from 'lucide-react';
import { RevealText } from './effects/AnimatedText';
import GlassmorphicCard from './effects/GlassmorphicCard';
import { trackSelectContent } from '../services/analytics';

const PricingSection = styled.section`
  padding: 10rem 2rem;
  background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
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
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #ffffff 0%, #666666 100%);
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
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.8;
`;

const PricingGrid = styled(motion.div)`
  display: flex;
  justify-content: center;
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
`;

const PricingCardWrapper = styled(motion.div)`
  width: 100%;
`;

const PricingCardInner = styled.div`
  padding: 3rem 3rem 2.5rem;
  text-align: left;
  position: relative;

  @media (max-width: 768px) {
    padding: 2.25rem 1.75rem 2rem;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
`;

const TitleBlock = styled.div`
  min-width: 0;
`;

const CardBody = styled.div`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 2.25rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const LeftCol = styled.div`
  min-width: 0;
`;

const RightCol = styled.div`
  min-width: 0;
  padding-left: 2.25rem;
  border-left: 1px solid rgba(255, 255, 255, 0.06);

  @media (max-width: 900px) {
    padding-left: 0;
    border-left: none;
  }
`;

const PopularBadge = styled(motion.div)`
  background: rgba(59, 158, 255, 0.16);
  color: #ffffff;
  border: 1px solid rgba(59, 158, 255, 0.35);
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
`;

const PlanName = styled.h3`
  font-size: 1.35rem;
  margin: 0 0 0.35rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(255, 255, 255, 0.95);
`;

const PlanSubtitle = styled.p`
  margin: 0;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.4;
`;

const Price = styled(motion.div)`
  font-size: clamp(3.1rem, 6vw, 4.2rem);
  font-weight: 900;
  margin: 1.75rem 0 0.35rem;
  letter-spacing: -0.04em;
  color: #ffffff;
  line-height: 1.05;
`;

const PricingPeriod = styled.p`
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 1.75rem;
  font-size: 1.05rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin: 0;
  text-align: left;
  padding: 1.25rem 0 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const Feature = styled(motion.li)`
  padding: 0.85rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  
  &:last-child {
    border-bottom: none;
  }
`;

const FeatureIcon = styled(motion.span)`
  width: 28px;
  height: 28px;
  background: rgba(59, 158, 255, 0.2);
  border: 1px solid rgba(59, 158, 255, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
  color: #3B9EFF;
  box-shadow: 0 4px 15px rgba(59, 158, 255, 0.15);

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2.2;
  }
`;

const FeatureText = styled.span`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.45;
`;

const PurchaseButton = styled(motion.button)`
  width: 100%;
  padding: 1.2rem 2rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.1rem;
  background: #3B9EFF;
  color: #06101a;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 18px 55px rgba(59, 158, 255, 0.28),
    0 0 0 1px rgba(255, 255, 255, 0.08) inset;

  &:hover {
    filter: brightness(1.02);
  }

  &:active {
    filter: brightness(0.98);
  }
`;

const TrustIndicators = styled(motion.div)`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 4rem;
  flex-wrap: wrap;
`;

const TrustItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #666666;
  font-size: 0.95rem;
`;

const TrustIcon = styled.span`
  color: #3B9EFF;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 1.9;
  }
`;

const Pricing: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const plans = useMemo(() => [
    {
      name: t('pricing.title'),
      price: t('pricing.custom'),
      period: t('pricing.tailored'),
      featured: true,
      features: [
        t('pricing.features.customSystem'),
        t('pricing.features.tailoredAI'),
        t('pricing.features.installation'),
        t('pricing.features.accountManager'),
        t('pricing.features.support'),
        t('pricing.features.integration'),
        t('pricing.features.training'),
        t('pricing.features.maintenance'),
        t('pricing.features.analytics'),
        t('pricing.features.multiLocation'),
      ],
    },
  ], [t]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.05,
      },
    }),
  };

  const handleContact = () => {
    void trackSelectContent({ contentType: 'pricing_contact_sales_click', location: 'pricing' });
    navigate('/contact');
  };

  return (
    <PricingSection id="pricing">
      <GlowOrb
        style={{ top: '-25%', left: '-10%' }}
        animate={inView ? { x: [0, 90, 0], y: [0, 50, 0] } : {}}
        transition={{ duration: 20, repeat: inView ? Infinity : 0, ease: 'linear' }}
      />
      <GlowOrb
        style={{ bottom: '-30%', right: '-15%' }}
        animate={inView ? { x: [0, -70, 0], y: [0, -40, 0] } : {}}
        transition={{ duration: 17, repeat: inView ? Infinity : 0, ease: 'linear' }}
      />
      
      <Container ref={ref}>
        <SectionHeader>
          <RevealText delay={0}>
            <SectionTitle>
              {t('pricing.title')}
            </SectionTitle>
          </RevealText>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t('pricing.subtitle')}
          </SectionSubtitle>
        </SectionHeader>

        <PricingGrid
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {plans.map((plan, index) => (
            <PricingCardWrapper
              key={index}
              variants={itemVariants}
            >
              <GlassmorphicCard
                tiltEnabled={false}
                glowEnabled={false}
                shineEnabled={false}
                intensity={0.9}
              >
                <PricingCardInner>
                  <CardHeader>
                    <TitleBlock>
                      <PlanName>{plan.name}</PlanName>
                      <PlanSubtitle>{plan.period}</PlanSubtitle>
                    </TitleBlock>

                    {plan.featured && (
                      <PopularBadge
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, duration: 0.4 }}
                      >
                        {t('pricing.mostPopular')}
                      </PopularBadge>
                    )}
                  </CardHeader>

                  <CardBody>
                    <LeftCol>
                      <Price>{plan.price}</Price>

                      <PricingPeriod>
                        {t('pricing.tailored')}
                      </PricingPeriod>

                      <PurchaseButton onClick={handleContact}>
                        {t('pricing.contactSales')}
                      </PurchaseButton>
                    </LeftCol>

                    <RightCol>
                      <FeatureList>
                        {plan.features.map((feature, idx) => (
                          <Feature
                            key={idx}
                            custom={idx}
                            variants={featureVariants}
                            initial="hidden"
                            animate={inView ? 'visible' : 'hidden'}
                          >
                            <FeatureIcon>
                              <Check aria-hidden="true" />
                            </FeatureIcon>
                            <FeatureText>{feature}</FeatureText>
                          </Feature>
                        ))}
                      </FeatureList>
                    </RightCol>
                  </CardBody>
                </PricingCardInner>
              </GlassmorphicCard>
            </PricingCardWrapper>
          ))}
        </PricingGrid>

        <TrustIndicators
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <TrustItem>
            <TrustIcon><Lock aria-hidden="true" /></TrustIcon>
            <span>{t('pricing.security.securePayment')}</span>
          </TrustItem>
          <TrustItem>
            <TrustIcon><Target aria-hidden="true" /></TrustIcon>
            <span>{t('pricing.security.moneyBack')}</span>
          </TrustItem>
          <TrustItem>
            <TrustIcon><MessageCircle aria-hidden="true" /></TrustIcon>
            <span>{t('pricing.security.support')}</span>
          </TrustItem>
          <TrustItem>
            <TrustIcon><Zap aria-hidden="true" /></TrustIcon>
            <span>{t('pricing.security.fastInstallation')}</span>
          </TrustItem>
        </TrustIndicators>
      </Container>
    </PricingSection>
  );
};

export default Pricing;
