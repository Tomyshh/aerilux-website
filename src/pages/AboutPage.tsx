import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Hero = styled.section`
  text-align: center;
  padding: 4rem 0;
  margin-bottom: 4rem;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #999999 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: #999999;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
`;

const Section = styled.section`
  margin-bottom: 6rem;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionContent = styled(motion.div)``;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const SectionText = styled.p`
  font-size: 1.2rem;
  color: #cccccc;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const ImagePlaceholder = styled(motion.div)`
  aspect-ratio: 16/9;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #333333;
  font-weight: 600;
  overflow: hidden;
`;

const ImageWrapper = styled(motion.div)`
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.1) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.05) 100%
    );
    pointer-events: none;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
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
  color: #999999;
  font-size: 1rem;
`;

const Team = styled.div`
  text-align: center;
  margin: 6rem 0;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
  margin-top: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TeamMember = styled(motion.div)``;

const MemberImage = styled(motion.div)`
  width: 200px;
  height: 200px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.1);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(59, 158, 255, 0.1);
    pointer-events: none;
  }
`;

const MemberPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const MemberName = styled.h4`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const MemberRole = styled.p`
  color: #999999;
  font-size: 1rem;
`;

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const stats = [
    { number: '99.9%', label: 'Success Rate' },
    { number: '50K+', label: 'Happy Customers' },
    { number: '5', label: 'Patents Filed' },
    { number: '24/7', label: 'Support' },
  ];

  const team = [
    { name: 'Maalon Szuman', role: 'Founder', image: '/avatar/maalon.jpeg' },
    { name: 'Tom Jami', role: 'Founder', image: '/avatar/tom.jpeg' },
    { name: 'Gabriel Azaria', role: 'Founder', image: '/avatar/gabriel.jpeg' },
  ];

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
    <AboutContainer>
      <Container>
        <Hero>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {t('about.title')}
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('about.subtitle')}
          </Subtitle>
        </Hero>

        <Section id="mission" ref={ref}>
          <SectionGrid>
            <SectionContent
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <SectionTitle>{t('about.mission.title')}</SectionTitle>
              <SectionText>
                {t('about.mission.text1')}
              </SectionText>
              <SectionText>
                {t('about.mission.text2')}
              </SectionText>
            </SectionContent>
            <ImageWrapper
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <StyledImage src="/vision.jpeg" alt="Aerilux Vision - AI Technology" loading="lazy" />
            </ImageWrapper>
          </SectionGrid>
        </Section>

        <Stats>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </Stats>

        <Section>
          <SectionGrid>
            <ImageWrapper
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <StyledImage src="/algo.jpeg" alt="Aerilux AI Algorithm Technology" loading="lazy" />
            </ImageWrapper>
            <SectionContent
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <SectionTitle>Our Technology</SectionTitle>
              <SectionText>
                We've developed proprietary AI algorithms that can identify and deter pigeons 
                with unprecedented accuracy. Our systems learn and adapt to local bird behaviors, 
                ensuring maximum effectiveness.
              </SectionText>
              <SectionText>
                Every Aerilux device is equipped with advanced sensors, machine learning capabilities, 
                and environmentally friendly deterrent mechanisms that work 24/7 to keep your property clean.
              </SectionText>
            </SectionContent>
          </SectionGrid>
        </Section>

        <Team id="team">
          <SectionTitle>{t('about.team.title')}</SectionTitle>
          <TeamGrid>
            {team.map((member, index) => (
              <TeamMember
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -10 }}
              >
                <MemberImage
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <MemberPhoto src={member.image} alt={member.name} />
                </MemberImage>
                <MemberName>{member.name}</MemberName>
                <MemberRole>{member.role}</MemberRole>
              </TeamMember>
            ))}
          </TeamGrid>
        </Team>
      </Container>
    </AboutContainer>
  );
};

export default AboutPage; 