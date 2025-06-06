import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TermsContainer = styled.div`
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

const TermsPage: React.FC = () => {
  return (
    <TermsContainer>
      <Container>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Terms of Service
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
            <SectionTitle>1. Acceptance of Terms</SectionTitle>
            <Paragraph>
              By accessing and using the Aerilux website and purchasing our products, you accept and 
              agree to be bound by the terms and provision of this agreement.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>2. Use License</SectionTitle>
            <Paragraph>
              Permission is granted to temporarily download one copy of the materials on Aerilux's 
              website for personal, non-commercial transitory viewing only. This is the grant of a 
              license, not a transfer of title.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>3. Product Warranty</SectionTitle>
            <Paragraph>
              All Aerilux products come with a limited warranty:
            </Paragraph>
            <List>
              <ListItem>2-year warranty on hardware defects</ListItem>
              <ListItem>1-year warranty on battery performance</ListItem>
              <ListItem>90-day warranty on accessories</ListItem>
              <ListItem>Warranty void if product is modified or misused</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>4. Limitations</SectionTitle>
            <Paragraph>
              In no event shall Aerilux or its suppliers be liable for any damages (including, without 
              limitation, damages for loss of data or profit, or due to business interruption) arising 
              out of the use or inability to use Aerilux products.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>5. Shipping and Returns</SectionTitle>
            <List>
              <ListItem>Free shipping on all orders over $100</ListItem>
              <ListItem>30-day return policy for unopened products</ListItem>
              <ListItem>Customer responsible for return shipping costs</ListItem>
              <ListItem>Refunds processed within 5-7 business days</ListItem>
            </List>
          </Section>

          <Section>
            <SectionTitle>6. Privacy</SectionTitle>
            <Paragraph>
              Your use of our website is also governed by our Privacy Policy. Please review our 
              Privacy Policy, which also governs the Site and informs users of our data collection practices.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>7. Governing Law</SectionTitle>
            <Paragraph>
              These terms and conditions are governed by and construed in accordance with the laws 
              of the United States and you irrevocably submit to the exclusive jurisdiction of the 
              courts in that State or location.
            </Paragraph>
          </Section>

          <Section>
            <SectionTitle>8. Contact Information</SectionTitle>
            <Paragraph>
              If you have any questions about these Terms of Service, please contact us at:
            </Paragraph>
            <Paragraph>
              Email: legal@aerilux.com<br />
              Phone: +1 (555) 123-4567<br />
              Address: 123 Innovation Drive, San Francisco, CA 94105
            </Paragraph>
          </Section>
        </Content>
      </Container>
    </TermsContainer>
  );
};

export default TermsPage; 