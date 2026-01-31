import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  denyAnalyticsConsent,
  grantAnalyticsConsent,
  shouldShowConsentPrompt,
} from '../services/analytics';

const Wrapper = styled.div<{ $visible: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  padding: 1rem;
  display: ${p => (p.$visible ? 'block' : 'none')};
`;

const Card = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 1.25rem 1.25rem;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Text = styled.div``;

const Title = styled.div`
  font-weight: 800;
  font-size: 1.05rem;
  margin-bottom: 0.25rem;
`;

const Description = styled.div`
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.95rem;
  line-height: 1.45;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  background: ${p =>
    p.$variant === 'primary'
      ? 'linear-gradient(135deg, #3B9EFF 0%, #5AB8FF 100%)'
      : 'rgba(255, 255, 255, 0.08)'};

  &:hover {
    filter: brightness(1.05);
  }
`;

const LinkButton = styled.button`
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.9);
  background: transparent;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const canPrompt = useMemo(() => {
    if (process.env.NODE_ENV !== 'production') return false;
    return shouldShowConsentPrompt();
  }, []);

  useEffect(() => {
    setVisible(canPrompt);
  }, [canPrompt]);

  useEffect(() => {
    const onOpen = () => setVisible(true);
    window.addEventListener('aerilux:cookie-preferences:open', onOpen as EventListener);
    return () => window.removeEventListener('aerilux:cookie-preferences:open', onOpen as EventListener);
  }, []);

  const handleAccept = () => {
    grantAnalyticsConsent();
    setVisible(false);
  };

  const handleReject = () => {
    denyAnalyticsConsent();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Wrapper $visible={visible} role="dialog" aria-live="polite" aria-label={t('cookieConsent.aria')}>
      <Card>
        <Row>
          <Text>
            <Title>{t('cookieConsent.title')}</Title>
            <Description>{t('cookieConsent.description')}</Description>
          </Text>
          <Actions>
            <LinkButton onClick={handleReject} type="button">
              {t('cookieConsent.reject')}
            </LinkButton>
            <Button onClick={handleAccept} $variant="primary" type="button">
              {t('cookieConsent.accept')}
            </Button>
          </Actions>
        </Row>
      </Card>
    </Wrapper>
  );
};

export default CookieConsent;

