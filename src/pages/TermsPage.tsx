import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../hooks/usePageMeta';

const TermsContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: #000000;
  color: #ffffff;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #3B9EFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const LastUpdated = styled(motion.p)`
  text-align: center;
  color: #999999;
  margin-bottom: 3rem;
  font-size: 0.95rem;
`;

const Content = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  
  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #3B9EFF 0%, transparent 100%);
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #cccccc;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const List = styled.ul`
  margin-left: 2rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-left: 1.5rem;
  }
`;

const ListItem = styled.li`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #cccccc;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SubSection = styled.div`
  margin-left: 1.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const SubTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #ffffff;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TermsPage: React.FC = () => {
  const { t } = useTranslation();
  usePageMeta(
    'Terms of Service',
    'Aerilux terms of service: conditions for using our website and purchasing the AI-powered pigeon deterrent system.',
    { canonicalPath: '/terms' }
  );

  return (
    <TermsContainer>
      <Container>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('terms.title')}
        </Title>
        <LastUpdated
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {t('terms.lastUpdated')}
        </LastUpdated>

        <Content
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Section>
            <SectionTitle>{t('terms.section1.title')}</SectionTitle>
            <Paragraph>{t('terms.section1.content')}</Paragraph>
          </Section>

          <Section>
            <SectionTitle>{t('terms.section2.title')}</SectionTitle>
            <Paragraph>{t('terms.section2.content')}</Paragraph>
            <SubSection>
              <SubTitle>{t('terms.section2.subtitle1')}</SubTitle>
              <Paragraph>{t('terms.section2.subcontent1')}</Paragraph>
            </SubSection>
            <SubSection>
              <SubTitle>{t('terms.section2.subtitle2')}</SubTitle>
              <Paragraph>{t('terms.section2.subcontent2')}</Paragraph>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>{t('terms.section3.title')}</SectionTitle>
            <Paragraph>{t('terms.section3.intro')}</Paragraph>
            <List>
              <ListItem>{t('terms.section3.item1')}</ListItem>
              <ListItem>{t('terms.section3.item2')}</ListItem>
              <ListItem>{t('terms.section3.item3')}</ListItem>
              <ListItem>{t('terms.section3.item4')}</ListItem>
            </List>
            <Paragraph>{t('terms.section3.note')}</Paragraph>
          </Section>

          <Section>
            <SectionTitle>{t('terms.section4.title')}</SectionTitle>
            <Paragraph>{t('terms.section4.content')}</Paragraph>
            <List>
              <ListItem>{t('terms.section4.item1')}</ListItem>
              <ListItem>{t('terms.section4.item2')}</ListItem>
              <ListItem>{t('terms.section4.item3')}</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>{t('terms.section5.title')}</SectionTitle>
            <Paragraph>{t('terms.section5.intro')}</Paragraph>
            <List>
              <ListItem>{t('terms.section5.item1')}</ListItem>
              <ListItem>{t('terms.section5.item2')}</ListItem>
              <ListItem>{t('terms.section5.item3')}</ListItem>
              <ListItem>{t('terms.section5.item4')}</ListItem>
            </List>
            <SubSection>
              <SubTitle>{t('terms.section5.subtitle1')}</SubTitle>
              <Paragraph>{t('terms.section5.subcontent1')}</Paragraph>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>{t('terms.section6.title')}</SectionTitle>
            <Paragraph>{t('terms.section6.content')}</Paragraph>
          </Section>

          <Section>
            <SectionTitle>{t('terms.section7.title')}</SectionTitle>
            <Paragraph>{t('terms.section7.content')}</Paragraph>
            <SubSection>
              <SubTitle>{t('terms.section7.subtitle1')}</SubTitle>
              <Paragraph>{t('terms.section7.subcontent1')}</Paragraph>
            </SubSection>
          </Section>

          <Section>
            <SectionTitle>{t('terms.section8.title')}</SectionTitle>
            <Paragraph>{t('terms.section8.content')}</Paragraph>
          </Section>

          <Section>
            <SectionTitle>{t('terms.section9.title')}</SectionTitle>
            <Paragraph>{t('terms.section9.content')}</Paragraph>
          </Section>

          <Section>
            <SectionTitle>{t('terms.section10.title')}</SectionTitle>
            <Paragraph>{t('terms.section10.content')}</Paragraph>
            <Paragraph>
              <strong>{t('terms.section10.contact')}</strong><br />
              {t('terms.section10.email')}<br />
              {t('terms.section10.phone')}<br />
              {t('terms.section10.address')}
            </Paragraph>
          </Section>
        </Content>
      </Container>
    </TermsContainer>
  );
};

export default TermsPage; 