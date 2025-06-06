import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FeaturesSection = styled.section`
  padding: 8rem 2rem;
  background-color: #ffffff;
  color: #000000;
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
  color: #666666;
  max-width: 600px;
  margin: 0 auto;
`;

const FeaturesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
`;

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: #666666;
  line-height: 1.6;
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

const Features: React.FC = () => {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <FeaturesSection id="features">
      <Container ref={ref}>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Why Choose Aerilux?
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
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
            <FeatureCard key={index} variants={itemVariants}>
              <IconWrapper>{feature.icon}</IconWrapper>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Container>
    </FeaturesSection>
  );
};

export default Features; 