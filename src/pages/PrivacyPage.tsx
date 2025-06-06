import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PrivacyContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
`;

const LastUpdated = styled(motion.p)`
  text-align: center;
  color: #999999;
  margin-bottom: 3rem;
`;

const Content = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 3rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #ffffff;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #cccccc;
  margin-bottom: 1.5rem;
`;

const List = styled.ul`
  margin-left: 2rem;
  margin-bottom: 1.5rem;
`;

const ListItem = styled.li`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #cccccc;
  margin-bottom: 0.5rem;
`;

const PrivacyPage: React.FC = () => {
  return (
    <PrivacyContainer>
      <Container>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Privacy Policy
        </Title>
        <LastUpdated
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Last updated: January 1, 2024
        </LastUpdated>

        <Content
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Section>
            <SectionTitle>1. Introduction</SectionTitle>
            <Paragraph>
              At Aerilux, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website or use our products.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>2. Information We Collect</SectionTitle>
            <Paragraph>
              We collect information you provide directly to us, such as:
            </Paragraph>
            <List>
              <ListItem>Name and contact information</ListItem>
              <ListItem>Payment and billing information</ListItem>
              <ListItem>Device usage data and analytics</ListItem>
              <ListItem>Customer support communications</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>3. How We Use Your Information</SectionTitle>
            <Paragraph>
              We use the information we collect to:
            </Paragraph>
            <List>
              <ListItem>Process your orders and payments</ListItem>
              <ListItem>Provide customer support</ListItem>
              <ListItem>Improve our products and services</ListItem>
              <ListItem>Send you updates and marketing communications</ListItem>
              <ListItem>Comply with legal obligations</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>4. Data Security</SectionTitle>
            <Paragraph>
              We implement appropriate technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>5. Your Rights</SectionTitle>
            <Paragraph>
              You have the right to:
            </Paragraph>
            <List>
              <ListItem>Access your personal information</ListItem>
              <ListItem>Correct inaccurate data</ListItem>
              <ListItem>Request deletion of your data</ListItem>
              <ListItem>Opt-out of marketing communications</ListItem>
              <ListItem>Data portability</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>6. Contact Us</SectionTitle>
            <Paragraph>
              If you have any questions about this Privacy Policy, please contact us at:
            </Paragraph>
            <Paragraph>
              Email: privacy@aerilux.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Innovation Drive, San Francisco, CA 94105
            </Paragraph>
          </Section>
        </Content>
      </Container>
    </PrivacyContainer>
  );
};

export default PrivacyPage; 