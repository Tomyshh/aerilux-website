import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const Spinner = styled(motion.div)`
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 3px solid rgba(255, 255, 255, 0.18);
  border-top-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 35px rgba(255, 255, 255, 0.18);
`;

export const AppLoader: React.FC<{ size?: number }> = ({ size = 56 }) => {
  return (
    <Wrap role="status" aria-live="polite" aria-label="Chargement">
      <Spinner
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
    </Wrap>
  );
};

