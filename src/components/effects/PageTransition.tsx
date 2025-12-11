import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

interface PageTransitionProps {
  children: ReactNode;
}

const PageWrapper = styled(motion.div)`
  width: 100%;
  min-height: 100vh;
`;

const SlideIn = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  transform-origin: bottom;
  z-index: 10000;
`;

const SlideOut = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
  transform-origin: top;
  z-index: 10000;
`;

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const slideInVariants = {
  initial: { scaleY: 1 },
  animate: { 
    scaleY: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: { 
    scaleY: 0,
  },
};

const slideOutVariants = {
  initial: { scaleY: 0 },
  animate: { 
    scaleY: 0,
  },
  exit: { 
    scaleY: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageWrapper
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <SlideIn
          variants={slideInVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
        <SlideOut
          variants={slideOutVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
        {children}
      </PageWrapper>
    </AnimatePresence>
  );
};

export default PageTransition;
