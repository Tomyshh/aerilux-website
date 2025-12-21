import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Code PIN: 1234
const CORRECT_PIN = '2655';
const PIN_LENGTH = 4;

interface PinLockProps {
  onSuccess: () => void;
}

const PinLockContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #ffffff;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #999999;
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PinDisplay = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PinDot = styled(motion.div)<{ $filled: boolean; $error: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.$error ? '#ff3b30' : props.$filled ? '#3B9EFF' : 'rgba(255, 255, 255, 0.3)'};
  background: ${props => props.$error ? '#ff3b30' : props.$filled ? '#3B9EFF' : 'transparent'};
  transition: all 0.2s ease;
`;

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 80px);
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 70px);
    gap: 12px;
  }
`;

const Key = styled(motion.button)<{ $isZero?: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  ${props => props.$isZero && `
    grid-column: 2;
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    font-size: 1.75rem;
  }
`;

const ActionKey = styled(Key)`
  font-size: 1rem;
  background: transparent;
  border-color: transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: transparent;
  }
`;

const Message = styled(motion.div)<{ $type: 'error' | 'success' }>`
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: ${props => props.$type === 'error' 
    ? 'rgba(255, 59, 48, 0.2)' 
    : 'rgba(59, 158, 255, 0.15)'};
  border: 1px solid ${props => props.$type === 'error' 
    ? 'rgba(255, 59, 48, 0.5)' 
    : 'rgba(59, 158, 255, 0.4)'};
  border-radius: 10px;
  color: ${props => props.$type === 'error' ? '#ff3b30' : '#3B9EFF'};
  font-size: 1rem;
  text-align: center;
`;

const PinLock: React.FC<PinLockProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleKeyPress = useCallback((digit: string) => {
    if (isLocked || pin.length >= PIN_LENGTH) return;
    
    const newPin = pin + digit;
    setPin(newPin);
    setError(false);
    
    // Vérifier automatiquement quand le PIN est complet
    if (newPin.length === PIN_LENGTH) {
      setIsLocked(true);
      
      setTimeout(() => {
        if (newPin === CORRECT_PIN) {
          setSuccess(true);
          setTimeout(() => {
            onSuccess();
          }, 500);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
            setIsLocked(false);
          }, 1000);
        }
      }, 200);
    }
  }, [pin, isLocked, onSuccess]);

  const handleDelete = useCallback(() => {
    if (isLocked) return;
    setPin(prev => prev.slice(0, -1));
    setError(false);
  }, [isLocked]);

  const handleClear = useCallback(() => {
    if (isLocked) return;
    setPin('');
    setError(false);
  }, [isLocked]);

  return (
    <PinLockContainer>
      <Title>Accès Sécurisé</Title>
      <Subtitle>Entrez le code PIN</Subtitle>
      
      <PinDisplay>
        {Array.from({ length: PIN_LENGTH }).map((_, index) => (
          <PinDot
            key={index}
            $filled={index < pin.length}
            $error={error}
            animate={error ? { x: [0, -5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.3 }}
          />
        ))}
      </PinDisplay>
      
      <Keypad>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <Key
            key={digit}
            onClick={() => handleKeyPress(String(digit))}
            whileTap={{ scale: 0.9 }}
            disabled={isLocked}
          >
            {digit}
          </Key>
        ))}
        
        <ActionKey onClick={handleClear} whileTap={{ scale: 0.9 }} disabled={isLocked}>
          C
        </ActionKey>
        
        <Key $isZero onClick={() => handleKeyPress('0')} whileTap={{ scale: 0.9 }} disabled={isLocked}>
          0
        </Key>
        
        <ActionKey onClick={handleDelete} whileTap={{ scale: 0.9 }} disabled={isLocked}>
          ⌫
        </ActionKey>
      </Keypad>
      
      <AnimatePresence>
        {error && (
          <Message
            $type="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Code incorrect
          </Message>
        )}
        {success && (
          <Message
            $type="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Accès autorisé...
          </Message>
        )}
      </AnimatePresence>
    </PinLockContainer>
  );
};

export default PinLock;
