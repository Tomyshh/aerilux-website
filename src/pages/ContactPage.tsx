import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { addContactMessage } from '../lib/firebase';

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

const Section = styled.section`
  margin: 6rem 0;
  padding: 4rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #999999 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionContent = styled(motion.div)`
  color: #cccccc;
  line-height: 1.8;
  font-size: 1.1rem;
`;

const FAQItem = styled(motion.div)`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
`;

const FAQQuestion = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const FAQAnswer = styled.p`
  color: #cccccc;
  line-height: 1.8;
`;

const List = styled.ul`
  list-style: none;
  padding-left: 0;
  margin: 1.5rem 0;
`;

const ListItem = styled.li`
  padding: 0.75rem 0;
  padding-left: 2rem;
  position: relative;
  color: #cccccc;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #34c759;
    font-weight: 700;
  }
`;

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
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

    try {
      // Envoyer le message à Firebase Firestore
      await addContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      console.log('Message envoyé avec succès sur Firebase');
      setShowSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer>
      <Container>
        <PageTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {t('contact.title')}
        </PageTitle>
        <PageSubtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {t('contact.subtitle')}
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
                {t('contact.form.success')}
              </SuccessMessage>
            )}

            <FormGroup>
              <Label>{t('contact.form.name')}</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('contact.form.namePlaceholder')}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>{t('contact.form.email')}</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('contact.form.emailPlaceholder')}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>{t('contact.form.subject')}</Label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder={t('contact.form.subjectPlaceholder')}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>{t('contact.form.message')}</Label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contact.form.messagePlaceholder')}
                required
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
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

        {/* FAQ Section */}
        <Section id="faq">
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Frequently Asked Questions
          </SectionTitle>
          <SectionContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <FAQItem>
              <FAQQuestion>How does the Aerilux Pro detect pigeons?</FAQQuestion>
              <FAQAnswer>
                The Aerilux Pro uses advanced AI algorithms and computer vision to identify pigeons with 99.9% accuracy. 
                The system continuously learns and adapts to local bird behaviors for maximum effectiveness.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>Is the system harmful to birds?</FAQQuestion>
              <FAQAnswer>
                No, the Aerilux Pro is completely humane. It uses sound and light patterns to deter pigeons without 
                causing any harm to birds or humans.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>What is the coverage area of one unit?</FAQQuestion>
              <FAQAnswer>
                Each Aerilux Pro unit provides 360° coverage with a 50ft (15m) radius, making it ideal for most 
                commercial and residential properties.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>How long does the battery last?</FAQQuestion>
              <FAQAnswer>
                The system is solar-powered with a 30-day battery backup. In most conditions, the solar panel 
                provides sufficient power for continuous operation.
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>Can I control the system remotely?</FAQQuestion>
              <FAQAnswer>
                Yes, the Aerilux Pro comes with a mobile app that allows you to monitor and control your device 
                remotely, receive real-time notifications, and adjust settings from anywhere.
              </FAQAnswer>
            </FAQItem>
          </SectionContent>
        </Section>

        {/* Installation Guide Section */}
        <Section id="installation">
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Installation Guide
          </SectionTitle>
          <SectionContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              Installing your Aerilux Pro is simple and requires no wiring. Follow these steps:
            </p>
            <List>
              <ListItem>Choose an optimal location with good visibility and sunlight exposure</ListItem>
              <ListItem>Mount the device using the included mounting bracket (screws provided)</ListItem>
              <ListItem>Ensure the solar panel faces south (in Northern Hemisphere) for maximum efficiency</ListItem>
              <ListItem>Download the Aerilux mobile app and pair your device</ListItem>
              <ListItem>Configure detection zones and sensitivity settings via the app</ListItem>
              <ListItem>Test the system to ensure proper operation</ListItem>
            </List>
            <p style={{ marginTop: '2rem' }}>
              For professional installation services, please contact our support team. We offer installation 
              services for commercial properties and can provide custom mounting solutions for unique requirements.
            </p>
          </SectionContent>
        </Section>

        {/* Warranty Section */}
        <Section id="warranty">
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Warranty & Support
          </SectionTitle>
          <SectionContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              Every Aerilux Pro comes with a comprehensive 2-year warranty covering:
            </p>
            <List>
              <ListItem>Manufacturing defects and component failures</ListItem>
              <ListItem>Weather-related damage (IP67 rated for all conditions)</ListItem>
              <ListItem>Software updates and technical support</ListItem>
              <ListItem>Replacement parts and repair services</ListItem>
            </List>
            <p style={{ marginTop: '2rem' }}>
              Our warranty includes 24/7 technical support and remote diagnostics. Extended warranty options 
              are available for commercial installations. For warranty claims or support, contact our team 
              through the form above or email support@aerilux.io.
            </p>
          </SectionContent>
        </Section>

        {/* Careers Section */}
        <Section id="careers">
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Join Our Team
          </SectionTitle>
          <SectionContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              At Aerilux, we're building the future of urban cleanliness through innovative AI technology. 
              We're always looking for talented individuals to join our mission.
            </p>
            <p style={{ marginTop: '1.5rem' }}>
              We're currently hiring for positions in:
            </p>
            <List>
              <ListItem>AI/ML Engineers</ListItem>
              <ListItem>Software Developers</ListItem>
              <ListItem>Sales & Business Development</ListItem>
              <ListItem>Customer Success Specialists</ListItem>
              <ListItem>Product Designers</ListItem>
            </List>
            <p style={{ marginTop: '2rem' }}>
              To apply, please send your resume and cover letter to careers@aerilux.io or use the contact 
              form above with the subject "Career Application". We review all applications and will reach 
              out to qualified candidates.
            </p>
          </SectionContent>
        </Section>
      </Container>
    </ContactContainer>
  );
};

export default ContactPage; 