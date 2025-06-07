import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ContactContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #999999 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageSubtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: #999999;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 4rem;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled(motion.form)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 3rem;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  color: #999999;
  margin-bottom: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1rem;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: #666666;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 1rem;
  color: #ffffff;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: #666666;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  background-color: #ffffff;
  color: #000000;
  padding: 1.25rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContactInfo = styled(motion.div)``;

const InfoSection = styled.div`
  margin-bottom: 3rem;
`;

const InfoTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #cccccc;
`;

const InfoIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const InfoText = styled.div``;

const InfoLabel = styled.p`
  font-size: 0.9rem;
  color: #999999;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.p`
  font-size: 1.1rem;
`;

const SupportHours = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
`;

const HoursGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const HourItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Day = styled.span`
  color: #999999;
`;

const Time = styled.span`
  font-weight: 600;
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(135deg, #34c759 0%, #30d158 100%);
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  text-align: center;
`;

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setShowSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <ContactContainer>
      <Container>
        <PageTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Get in Touch
        </PageTitle>
        <PageSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Have questions? We're here to help you keep your property clean
        </PageSubtitle>

        <ContactGrid>
          <ContactForm
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {showSuccess && (
              <SuccessMessage
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                Thank you! We'll get back to you within 24 hours.
              </SuccessMessage>
            )}

            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Subject</Label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Message</Label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your needs..."
                required
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </SubmitButton>
          </ContactForm>

          <ContactInfo
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <InfoSection>
              <InfoTitle>Contact Information</InfoTitle>
              <InfoItem>
                <InfoIcon>📧</InfoIcon>
                <InfoText>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>sales@aerilux.io</InfoValue>
                </InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon>📍</InfoIcon>
                <InfoText>
                  <InfoLabel>Address</InfoLabel>
                  <InfoValue>Chicago 136<br />Haifa, Israel</InfoValue>
                </InfoText>
              </InfoItem>
            </InfoSection>

            <SupportHours>
              <InfoTitle>Support Hours</InfoTitle>
              <HoursGrid>
                <HourItem>
                  <Day>Sunday - Thursday</Day>
                  <Time>9:00 AM - 6:00 PM</Time>
                </HourItem>
                <HourItem>
                  <Day>Emergency</Day>
                  <Time>24/7</Time>
                </HourItem>
              </HoursGrid>
            </SupportHours>
          </ContactInfo>
        </ContactGrid>
      </Container>
    </ContactContainer>
  );
};

export default ContactPage; 