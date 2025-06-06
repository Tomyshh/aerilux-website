import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TechnologySection = styled.section`
  padding: 8rem 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%);
  color: #000000;
  position: relative;
  overflow: hidden;
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

const TechShowcase = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TechVisualization = styled(motion.div)`
  position: relative;
  aspect-ratio: 16/9;
  background: #000000;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: 'AI VISUALIZATION';
    font-size: 1.5rem;
    color: #333333;
    font-weight: 800;
    letter-spacing: 0.1em;
  }
`;

const TechContent = styled(motion.div)``;

const TechFeature = styled(motion.div)`
  margin-bottom: 2rem;
`;

const TechFeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const TechFeatureDescription = styled.p`
  font-size: 1.1rem;
  color: #666666;
  line-height: 1.6;
`;

const StatsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 3rem;
  background: #000000;
  border-radius: 20px;
`;

const StatCard = styled(motion.div)`
  text-align: center;
  color: #ffffff;
`;

const StatNumber = styled.h3`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #999999 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: #999999;
`;

const techFeatures = [
  {
    title: 'Deep Learning Neural Network',
    description: 'Our proprietary AI model has been trained on millions of pigeon images and behaviors to ensure accurate detection and effective deterrence.',
  },
  {
    title: 'Real-Time Processing',
    description: 'Process visual and audio data in milliseconds, enabling instant response to pigeon activity without false alarms.',
  },
  {
    title: 'Adaptive Learning',
    description: 'The system continuously learns and adapts to local pigeon behavior patterns, improving effectiveness over time.',
  },
];

const stats = [
  { number: '99.9%', label: 'Detection Accuracy' },
  { number: '<50ms', label: 'Response Time' },
  { number: '24/7', label: 'Monitoring' },
  { number: '0', label: 'False Positives' },
];

const Technology: React.FC = () => {
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
    <TechnologySection id="technology" ref={ref}>
      <Container>
        <SectionHeader>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Patented AI Technology
          </SectionTitle>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Advanced machine learning meets practical pigeon control
          </SectionSubtitle>
        </SectionHeader>

        <TechShowcase>
          <TechVisualization
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          />
          
          <TechContent
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {techFeatures.map((feature, index) => (
              <TechFeature key={index} variants={itemVariants}>
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
            <StatCard key={index} variants={itemVariants}>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </Container>
    </TechnologySection>
  );
};

export default Technology; 