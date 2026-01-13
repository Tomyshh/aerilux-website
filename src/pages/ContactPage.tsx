import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { addContactMessage } from '../lib/firebase';
import { addContactLeadToSupabase } from '../lib/supabase';

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
  background: rgba(59, 158, 255, 0.15);
  border: 1px solid rgba(59, 158, 255, 0.4);
  color: #3B9EFF;
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
    color: #3B9EFF;
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

    const contactData = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      // Envoyer le message à Firebase Firestore ET Supabase en parallèle
      const [firebaseResult, supabaseResult] = await Promise.allSettled([
        addContactMessage(contactData),
        addContactLeadToSupabase(contactData)
      ]);

      // Log des résultats
      if (firebaseResult.status === 'fulfilled') {
        console.log('Message envoyé avec succès sur Firebase');
      } else {
        console.error('Erreur Firebase:', firebaseResult.reason);
      }

      if (supabaseResult.status === 'fulfilled') {
        console.log('Message envoyé avec succès sur Supabase');
      } else {
        console.error('Erreur Supabase:', supabaseResult.reason);
      }

      // Considérer comme succès si au moins un des deux a fonctionné
      if (firebaseResult.status === 'fulfilled' || supabaseResult.status === 'fulfilled') {
        setShowSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        
        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        throw new Error('Échec de l\'envoi sur les deux plateformes');
      }
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

            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('contact.form.sending') : t('contact.form.send')}
            </SubmitButton>
          </ContactForm>

          <ContactInfo
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <InfoSection>
              <InfoTitle>{t('contact.info.title')}</InfoTitle>
              <InfoItem>
                <InfoIcon>📧</InfoIcon>
                <InfoText>
                  <InfoLabel>{t('contact.info.email')}</InfoLabel>
                  <InfoValue dangerouslySetInnerHTML={{ __html: t('contact.info.emailValue') }} />
                </InfoText>
              </InfoItem>
              <InfoItem>
                <InfoIcon>📍</InfoIcon>
                <InfoText>
                  <InfoLabel>{t('contact.info.address')}</InfoLabel>
                  <InfoValue dangerouslySetInnerHTML={{ __html: t('contact.info.addressValue') }} />
                </InfoText>
              </InfoItem>
            </InfoSection>

            <SupportHours>
              <InfoTitle>{t('contact.hours.title')}</InfoTitle>
              <HoursGrid>
                <HourItem>
                  <Day>{t('contact.hours.weekdays')}</Day>
                  <Time>{t('contact.hours.weekdaysTime')}</Time>
                </HourItem>
                <HourItem>
                  <Day>{t('contact.hours.emergency')}</Day>
                  <Time>{t('contact.hours.emergencyTime')}</Time>
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
            {t('contact.faq.title')}
          </SectionTitle>
          <SectionContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <FAQItem>
              <FAQQuestion>{t('contact.faq.detection.question')}</FAQQuestion>
              <FAQAnswer>
                {t('contact.faq.detection.answer')}
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>{t('contact.faq.harmful.question')}</FAQQuestion>
              <FAQAnswer>
                {t('contact.faq.harmful.answer')}
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>{t('contact.faq.coverage.question')}</FAQQuestion>
              <FAQAnswer>
                {t('contact.faq.coverage.answer')}
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>{t('contact.faq.battery.question')}</FAQQuestion>
              <FAQAnswer>
                {t('contact.faq.battery.answer')}
              </FAQAnswer>
            </FAQItem>
            <FAQItem>
              <FAQQuestion>{t('contact.faq.remote.question')}</FAQQuestion>
              <FAQAnswer>
                {t('contact.faq.remote.answer')}
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
            {t('contact.installation.title')}
          </SectionTitle>
          <SectionContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              {t('contact.installation.intro')}
            </p>
            <List>
              <ListItem>{t('contact.installation.steps.location')}</ListItem>
              <ListItem>{t('contact.installation.steps.mount')}</ListItem>
              <ListItem>{t('contact.installation.steps.solar')}</ListItem>
              <ListItem>{t('contact.installation.steps.app')}</ListItem>
              <ListItem>{t('contact.installation.steps.configure')}</ListItem>
              <ListItem>{t('contact.installation.steps.test')}</ListItem>
            </List>
            <p style={{ marginTop: '2rem' }}>
              {t('contact.installation.professional')}
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
            {t('contact.warranty.title')}
          </SectionTitle>
          <SectionContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              {t('contact.warranty.intro')}
            </p>
            <List>
              <ListItem>{t('contact.warranty.items.defects')}</ListItem>
              <ListItem>{t('contact.warranty.items.weather')}</ListItem>
              <ListItem>{t('contact.warranty.items.software')}</ListItem>
              <ListItem>{t('contact.warranty.items.parts')}</ListItem>
            </List>
            <p style={{ marginTop: '2rem' }}>
              {t('contact.warranty.support')}
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
            {t('contact.careers.title')}
          </SectionTitle>
          <SectionContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p>
              {t('contact.careers.intro')}
            </p>
            <p style={{ marginTop: '1.5rem' }}>
              {t('contact.careers.hiring')}
            </p>
            <List>
              <ListItem>{t('contact.careers.positions.ai')}</ListItem>
              <ListItem>{t('contact.careers.positions.dev')}</ListItem>
              <ListItem>{t('contact.careers.positions.sales')}</ListItem>
              <ListItem>{t('contact.careers.positions.success')}</ListItem>
              <ListItem>{t('contact.careers.positions.design')}</ListItem>
            </List>
            <p style={{ marginTop: '2rem' }}>
              {t('contact.careers.apply')}
            </p>
          </SectionContent>
        </Section>
      </Container>
    </ContactContainer>
  );
};

export default ContactPage; 