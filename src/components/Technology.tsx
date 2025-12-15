import React, { useRef, useMemo } from 'react';
import styled from 'styled-components';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { RevealText } from './effects/AnimatedText';

const TechnologySection = styled.section`
  padding: 10rem 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f5f5f7 100%);
  color: #000000;
  position: relative;
  overflow: hidden;
`;

const AnimatedBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(0, 122, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(52, 199, 89, 0.05) 0%, transparent 50%);
  z-index: 0;
  will-change: opacity;
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
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: #666666;
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
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 50px,
        rgba(0, 122, 255, 0.03) 50px,
        rgba(0, 122, 255, 0.03) 51px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 50px,
        rgba(0, 122, 255, 0.03) 50px,
        rgba(0, 122, 255, 0.03) 51px
      );
  }
`;

const VisualizationContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
`;

const AIBrain = styled(motion.div)`
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #007AFF 0%, #34c759 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  box-shadow: 0 0 60px rgba(0, 122, 255, 0.5);
`;

const VisualizationText = styled.span`
  font-size: 1.2rem;
  color: #666666;
  font-weight: 600;
  letter-spacing: 0.1em;
`;

const NeuralNetwork = styled(motion.svg)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const TechContent = styled(motion.div)``;

const TechFeature = styled(motion.div)`
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #007AFF 0%, #34c759 100%);
  }
`;

const TechFeatureNumber = styled.span`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 3rem;
  font-weight: 900;
  color: rgba(0, 0, 0, 0.05);
`;

const TechFeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #000000;
`;

const TechFeatureDescription = styled.p`
  font-size: 1.05rem;
  color: #666666;
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
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #007AFF 0%, #34c759 100%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 122, 255, 0.02) 0%, rgba(52, 199, 89, 0.02) 100%);
    pointer-events: none;
  }
`;

const StatIconWrapper = styled(motion.div)`
  width: 70px;
  height: 70px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #007AFF 0%, #34c759 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 10px 30px rgba(0, 122, 255, 0.3);
`;

const StatNumber = styled(motion.h3)`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: #666666;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  { icon: '🎯', number: '99.9%', label: 'Accuracy' },
  { icon: '⚡', number: '<50ms', label: 'Response' },
  { icon: '👁️', number: '24/7', label: 'Monitoring' },
  { icon: '✅', number: '0', label: 'False Positives' },
];

const Technology: React.FC = React.memo(() => {
  const sectionRef = useRef<HTMLElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const smoothRotate = useSpring(rotate, { damping: 50, stiffness: 100 });

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
      <AnimatedBackground
        animate={inView ? {
          opacity: [0.5, 1, 0.5],
        } : { opacity: 0.5 }}
        transition={{
          duration: 10,
          repeat: inView ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      
      <Container ref={ref}>
        <SectionHeader>
          <RevealText delay={0}>
            <SectionTitle>
              Patented AI Technology
            </SectionTitle>
          </RevealText>
          <SectionSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Advanced machine learning meets practical pigeon control
          </SectionSubtitle>
        </SectionHeader>

        <TechShowcase>
          <TechVisualization
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <NeuralNetwork viewBox="0 0 400 300">
              {/* Animated neural network lines */}
              {[...Array(15)].map((_, i) => (
                <motion.line
                  key={i}
                  x1={50 + (i % 5) * 80}
                  y1={50 + Math.floor(i / 5) * 100}
                  x2={150 + ((i + 1) % 5) * 50}
                  y2={80 + Math.floor((i + 1) / 5) * 80}
                  stroke="rgba(0, 122, 255, 0.3)"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ 
                    duration: 2, 
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
              ))}
              {/* Nodes */}
              {[...Array(12)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={50 + (i % 4) * 100}
                  cy={50 + Math.floor(i / 4) * 80}
                  r="6"
                  fill="#007AFF"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0.8, 1] }}
                  transition={{
                    duration: 2,
                    delay: i * 0.15,
                    repeat: Infinity,
                  }}
                />
              ))}
            </NeuralNetwork>
            <VisualizationContent>
              <AIBrain
                style={{ rotate: smoothRotate }}
                animate={inView ? {
                  boxShadow: [
                    '0 0 60px rgba(0, 122, 255, 0.5)',
                    '0 0 100px rgba(0, 122, 255, 0.8)',
                    '0 0 60px rgba(0, 122, 255, 0.5)',
                  ],
                } : { boxShadow: '0 0 60px rgba(0, 122, 255, 0.5)' }}
                transition={{ duration: 3, repeat: inView ? Infinity : 0 }}
              >
                🧠
              </AIBrain>
              <VisualizationText>AI VISUALIZATION</VisualizationText>
            </VisualizationContent>
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
                whileHover={{ 
                  x: 10,
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                }}
                transition={{ duration: 0.3 }}
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
              whileHover={{ 
                y: -10,
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
              }}
            >
              <StatIconWrapper
                animate={inView ? { 
                  y: [0, -5, 0],
                  rotate: [0, 5, -5, 0],
                } : { y: 0, rotate: 0 }}
                transition={{ 
                  duration: 3,
                  delay: index * 0.2,
                  repeat: inView ? Infinity : 0,
                }}
              >
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
