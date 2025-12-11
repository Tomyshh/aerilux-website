import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { RevealText } from './effects/AnimatedText';
import GlassmorphicCard from './effects/GlassmorphicCard';
import MagneticButton from './effects/MagneticButton';

const PricingSection = styled.section`
  padding: 10rem 2rem;
  background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
  color: #ffffff;
  position: relative;
  overflow: hidden;
`;

const AnimatedGradient = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 0%, rgba(0, 122, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 100%, rgba(52, 199, 89, 0.15) 0%, transparent 50%);
  z-index: 0;
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
  max-width: 600px;
  margin: 0 auto;
`;

const PricingCardWrapper = styled(motion.div)`
  width: 100%;
`;

const PricingCardInner = styled.div`
  padding: 3.5rem;
  text-align: center;
  position: relative;
`;

const PopularBadge = styled(motion.div)`
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #007AFF 0%, #34c759 100%);
  color: #ffffff;
  padding: 0.5rem 2rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-shadow: 0 10px 30px rgba(0, 122, 255, 0.4);
`;

const PlanName = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Price = styled(motion.div)`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PricingPeriod = styled.p`
  color: #666666;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin-bottom: 3rem;
  text-align: left;
`;

const Feature = styled(motion.li)`
  padding: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const FeatureIcon = styled(motion.span)`
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #34c759 0%, #32d74b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(52, 199, 89, 0.3);
`;

const FeatureText = styled.span`
  font-size: 1rem;
  color: #cccccc;
`;

const PurchaseButton = styled(motion.button)`
  width: 100%;
  padding: 1.2rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  color: #000000;
  position: relative;
  overflow: hidden;
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
  font-size: 1.5rem;
`;

const plans = [
  {
    name: 'Enterprise Solution',
    price: 'Custom',
    period: 'tailored to your business',
    featured: true,
    features: [
      'Custom Aerilux System Configuration',
      'Tailored AI Model for Your Industry',
      'Complete Installation & Setup',
      'Dedicated Account Manager',
      'Priority Technical Support',
      'Custom Integration & API Access',
      'Comprehensive Training Program',
      'Ongoing Maintenance & Updates',
      'Performance Analytics Dashboard',
      'Scalable Multi-Location Support',
    ],
  },
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

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
    navigate('/contact');
  };

  return (
    <PricingSection id="pricing">
      <AnimatedGradient
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <Container ref={ref}>
        <SectionHeader>
          <RevealText delay={0}>
            <SectionTitle>
              Enterprise Solution
            </SectionTitle>
          </RevealText>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            A fully customized cleaning solution designed specifically for your business needs
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
              <GlassmorphicCard tiltEnabled={true} glowEnabled={true}>
                <PricingCardInner>
                  {plan.featured && (
                    <PopularBadge
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      Most Popular
                    </PopularBadge>
                  )}
                  
                  <PlanName>{plan.name}</PlanName>
                  
                  <Price
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {plan.price}
                  </Price>
                  <PricingPeriod>{plan.period}</PricingPeriod>
                  
                  <FeatureList>
                    {plan.features.map((feature, idx) => (
                      <Feature
                        key={idx}
                        custom={idx}
                        variants={featureVariants}
                        initial="hidden"
                        animate={inView ? 'visible' : 'hidden'}
                      >
                        <FeatureIcon
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          ✓
                        </FeatureIcon>
                        <FeatureText>{feature}</FeatureText>
                      </Feature>
                    ))}
                  </FeatureList>
                  
                  <MagneticButton onClick={handleContact}>
                    <PurchaseButton
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Contact Sales
                    </PurchaseButton>
                  </MagneticButton>
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
            <TrustIcon>🔒</TrustIcon>
            <span>Secure Payment</span>
          </TrustItem>
          <TrustItem>
            <TrustIcon>🎯</TrustIcon>
            <span>30-Day Money Back</span>
          </TrustItem>
          <TrustItem>
            <TrustIcon>💬</TrustIcon>
            <span>24/7 Support</span>
          </TrustItem>
          <TrustItem>
            <TrustIcon>⚡</TrustIcon>
            <span>Fast Installation</span>
          </TrustItem>
        </TrustIndicators>
      </Container>
    </PricingSection>
  );
};

export default Pricing;
