import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PricingSection = styled.section`
  padding: 8rem 2rem;
  background-color: #000000;
  color: #ffffff;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 5rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #999999;
  max-width: 600px;
  margin: 0 auto;
`;

const PricingGrid = styled(motion.div)`
  display: flex;
  justify-content: center;
  max-width: 500px;
  margin: 0 auto;
`;

const PricingCard = styled(motion.div)<{ featured?: boolean }>`
  background: ${props => props.featured ? 
    'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' : 
    'rgba(255, 255, 255, 0.05)'};
  border: ${props => props.featured ? 
    '2px solid #ffffff' : 
    '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 20px;
  padding: 3rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  transform: ${props => props.featured ? 'scale(1.05)' : 'scale(1)'};
  
  ${props => props.featured && `
    &::before {
      content: 'MOST POPULAR';
      position: absolute;
      top: 20px;
      right: -30px;
      background: #ffffff;
      color: #000000;
      padding: 0.5rem 3rem;
      font-size: 0.8rem;
      font-weight: 700;
      transform: rotate(45deg);
    }
  `}
`;

const PlanName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Price = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  
  span {
    font-size: 1.5rem;
    color: #999999;
  }
`;

const PricingPeriod = styled.p`
  color: #999999;
  margin-bottom: 2rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  margin-bottom: 3rem;
  text-align: left;
`;

const Feature = styled.li`
  padding: 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '✓';
    color: #34c759;
    font-weight: 700;
  }
`;

const PurchaseButton = styled(motion.button)<{ featured?: boolean }>`
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  background: ${props => props.featured ? '#ffffff' : 'transparent'};
  color: ${props => props.featured ? '#000000' : '#ffffff'};
  border: ${props => props.featured ? 'none' : '2px solid #ffffff'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
  }
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
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const handlePurchase = (planName: string) => {
    // This will be connected to the backend
    console.log(`Purchasing ${planName} plan`);
    // TODO: Implement purchase logic
  };

  return (
    <PricingSection id="pricing" ref={ref}>
      <Container>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Enterprise Solution
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
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
            <PricingCard
              key={index}
              featured={plan.featured}
              variants={cardVariants}
              whileHover={{ y: -10 }}
            >
              <PlanName>{plan.name}</PlanName>
              <Price>
                {plan.price}
              </Price>
              <PricingPeriod>{plan.period}</PricingPeriod>
              
              <FeatureList>
                {plan.features.map((feature, idx) => (
                  <Feature key={idx}>{feature}</Feature>
                ))}
              </FeatureList>
              
              <PurchaseButton
                featured={plan.featured}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePurchase(plan.name)}
              >
                {plan.price === 'Custom' ? 'Contact Sales' : 'Purchase Now'}
              </PurchaseButton>
            </PricingCard>
          ))}
        </PricingGrid>
      </Container>
    </PricingSection>
  );
};

export default Pricing; 