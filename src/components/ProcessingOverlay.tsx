import React from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Card = styled(motion.div)`
  width: min(520px, 92vw);
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(10, 10, 10, 0.72);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.6);
  padding: 22px 22px;
  position: relative;
  overflow: hidden;
`;

const Glow = styled.div`
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 158, 255, 0.15) 0%, transparent 60%);
  filter: blur(70px);
  top: -260px;
  left: -200px;
  pointer-events: none;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Spinner = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 3px solid rgba(255, 255, 255, 0.18);
  border-top-color: rgba(59, 158, 255, 1);
  animation: spin 0.9s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const Title = styled.div`
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  color: #ffffff;
`;

const Subtitle = styled.div`
  margin-top: 2px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.35;
`;

export const ProcessingOverlay: React.FC<{
  open: boolean;
  title?: string;
  subtitle?: string;
}> = ({ open, title = 'Traitement du paiement', subtitle = 'Merci de patienter…' }) => {
  return (
    <AnimatePresence>
      {open && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          role="alert"
          aria-busy="true"
        >
          <Card
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Glow />
            <Row>
              <Spinner />
              <div>
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
              </div>
            </Row>
          </Card>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

