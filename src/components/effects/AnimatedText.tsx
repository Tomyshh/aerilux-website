import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerChildren?: number;
  type?: 'letter' | 'word' | 'line';
  once?: boolean;
}

const TextWrapper = styled(motion.span)`
  display: inline-block;
  direction: ltr; /* Force LTR pour éviter l'inversion en RTL */
  unicode-bidi: embed; /* Préserve la direction LTR même en contexte RTL */
`;

const CharacterSpan = styled(motion.span)`
  display: inline-block;
  white-space: pre;
`;

const WordSpan = styled(motion.span)`
  display: inline-block;
  margin-right: 0.25em;
  
  &:last-child {
    margin-right: 0;
  }
`;

const letterVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -90,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.5,
      delay: custom * 0.03,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

const wordVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9,
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: custom * 0.08,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  delay = 0,
  type = 'letter',
  once = true,
}) => {
  if (type === 'word') {
    const words = text.split(' ');
    return (
      <TextWrapper
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-50px' }}
      >
        {words.map((word, index) => (
          <WordSpan
            key={`${word}-${index}`}
            custom={index + delay}
            variants={wordVariants}
          >
            {word}
          </WordSpan>
        ))}
      </TextWrapper>
    );
  }

  const characters = text.split('');
  return (
    <TextWrapper
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
    >
      {characters.map((char, index) => (
        <CharacterSpan
          key={`${char}-${index}`}
          custom={index + delay}
          variants={letterVariants}
        >
          {char}
        </CharacterSpan>
      ))}
    </TextWrapper>
  );
};

// Composant pour révéler une ligne avec un effet de masque
interface RevealTextProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const RevealWrapper = styled(motion.div)`
  overflow: hidden;
  position: relative;
`;

const RevealContent = styled(motion.div)``;

const RevealMask = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #3B9EFF;
  transform-origin: left;
`;

export const RevealText: React.FC<RevealTextProps> = ({ children, delay = 0, className }) => {
  return (
    <RevealWrapper className={className}>
      <RevealContent
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.3, duration: 0.6 }}
      >
        {children}
      </RevealContent>
      <RevealMask
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: [0, 1, 1, 0] }}
        viewport={{ once: true }}
        transition={{ 
          delay,
          duration: 1,
          times: [0, 0.4, 0.6, 1],
          ease: 'easeInOut',
        }}
      />
    </RevealWrapper>
  );
};

// Effet de texte qui se remplit
interface FillTextProps {
  text: string;
  className?: string;
}

const FillTextWrapper = styled(motion.span)`
  position: relative;
  display: inline-block;
`;

const FillTextBackground = styled.span`
  color: rgba(255, 255, 255, 0.2);
`;

const FillTextForeground = styled(motion.span)`
  position: absolute;
  top: 0;
  left: 0;
  color: #ffffff;
  overflow: hidden;
  white-space: nowrap;
`;

export const FillText: React.FC<FillTextProps> = ({ text, className }) => {
  return (
    <FillTextWrapper className={className}>
      <FillTextBackground>{text}</FillTextBackground>
      <FillTextForeground
        initial={{ width: '0%' }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        {text}
      </FillTextForeground>
    </FillTextWrapper>
  );
};

export default AnimatedText;
