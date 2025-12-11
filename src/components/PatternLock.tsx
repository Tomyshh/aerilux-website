import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Pattern par défaut: 1-2-3-6-9 (L inversé)
const CORRECT_PATTERN = [1, 2, 3, 6, 9];

interface PatternLockProps {
  onSuccess: () => void;
}

const PatternLockContainer = styled.div`
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
  margin-bottom: 1rem;
  text-align: center;
  color: #ffffff;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #999999;
  margin-bottom: 3rem;
  text-align: center;
`;

const PatternGrid = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  height: 100%;
`;

const Point = styled(motion.div)<{ active: boolean; visited: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid ${props => props.active ? '#ffffff' : props.visited ? '#34c759' : 'rgba(255, 255, 255, 0.3)'};
  background: ${props => props.active ? '#ffffff' : props.visited ? 'rgba(52, 199, 89, 0.2)' : 'transparent'};
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &::after {
    content: '';
    width: ${props => props.active || props.visited ? '20px' : '12px'};
    height: ${props => props.active || props.visited ? '20px' : '12px'};
    border-radius: 50%;
    background: ${props => props.active ? '#000000' : props.visited ? '#34c759' : 'rgba(255, 255, 255, 0.5)'};
    transition: all 0.2s ease;
  }
`;

const Line = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const ErrorMessage = styled(motion.div)`
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: rgba(255, 59, 48, 0.2);
  border: 1px solid rgba(255, 59, 48, 0.5);
  border-radius: 10px;
  color: #ff3b30;
  font-size: 1rem;
  text-align: center;
`;

const SuccessMessage = styled(motion.div)`
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: rgba(52, 199, 89, 0.2);
  border: 1px solid rgba(52, 199, 89, 0.5);
  border-radius: 10px;
  color: #34c759;
  font-size: 1rem;
  text-align: center;
`;

const PatternLock: React.FC<PatternLockProps> = ({ onSuccess }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getPointPosition = useCallback((index: number) => {
    const row = Math.floor((index - 1) / 3);
    const col = (index - 1) % 3;
    const pointSize = 60;
    const gap = 20;
    const startX = pointSize / 2;
    const startY = pointSize / 2;
    
    return {
      x: startX + col * (pointSize + gap),
      y: startY + row * (pointSize + gap),
    };
  }, []);

  const getPointFromPosition = useCallback((x: number, y: number): number | null => {
    if (!gridRef.current) return null;
    
    const rect = gridRef.current.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    
    const pointSize = 60;
    const gap = 20;
    const cellSize = pointSize + gap;
    
    const col = Math.round((relativeX - pointSize / 2) / cellSize);
    const row = Math.round((relativeY - pointSize / 2) / cellSize);
    
    if (col >= 0 && col < 3 && row >= 0 && row < 3) {
      const index = row * 3 + col + 1;
      return index;
    }
    
    return null;
  }, []);

  const drawLine = useCallback(() => {
    if (!svgRef.current || pattern.length < 2) return;
    
    const svg = svgRef.current;
    svg.innerHTML = '';
    
    const path = pattern.map((point, index) => {
      const pos = getPointPosition(point);
      return `${index === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`;
    }).join(' ');
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    line.setAttribute('d', path);
    line.setAttribute('stroke', '#34c759');
    line.setAttribute('stroke-width', '3');
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-linejoin', 'round');
    svg.appendChild(line);
  }, [pattern, getPointPosition]);

  useEffect(() => {
    drawLine();
  }, [drawLine]);

  const handleMouseDown = (pointIndex: number) => {
    setError('');
    setPattern([pointIndex]);
    setIsDrawing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing || !gridRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const pointIndex = getPointFromPosition(clientX, clientY);
    
    if (pointIndex && !pattern.includes(pointIndex)) {
      setPattern(prev => [...prev, pointIndex]);
    }
  }, [isDrawing, pattern, getPointFromPosition]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (pattern.length < 3) {
      setError('Le pattern doit contenir au moins 3 points');
      setTimeout(() => {
        setPattern([]);
        setError('');
      }, 1500);
      return;
    }
    
    // Vérifier si le pattern correspond
    if (pattern.length === CORRECT_PATTERN.length && 
        pattern.every((val, idx) => val === CORRECT_PATTERN[idx])) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      setError('Pattern incorrect. Réessayez.');
      setTimeout(() => {
        setPattern([]);
        setError('');
      }, 1500);
    }
  }, [isDrawing, pattern, onSuccess]);

  useEffect(() => {
    if (isDrawing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDrawing, handleMouseMove, handleMouseUp]);

  const handleTouchStart = (e: React.TouchEvent, pointIndex: number) => {
    e.preventDefault();
    handleMouseDown(pointIndex);
  };

  return (
    <PatternLockContainer>
      <Title>Accès Sécurisé</Title>
      <Subtitle>Dessinez le pattern pour accéder au site</Subtitle>
      
      <PatternGrid ref={gridRef}>
        <Line ref={svgRef} />
        <GridContainer>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((pointIndex) => {
            const isActive = pattern[pattern.length - 1] === pointIndex;
            const isVisited = pattern.includes(pointIndex);
            
            return (
              <Point
                key={pointIndex}
                active={isActive}
                visited={isVisited && !isActive}
                onMouseDown={() => handleMouseDown(pointIndex)}
                onTouchStart={(e) => handleTouchStart(e, pointIndex)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            );
          })}
        </GridContainer>
      </PatternGrid>
      
      <AnimatePresence>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </ErrorMessage>
        )}
        {success && (
          <SuccessMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Accès autorisé...
          </SuccessMessage>
        )}
      </AnimatePresence>
    </PatternLockContainer>
  );
};

export default PatternLock;
