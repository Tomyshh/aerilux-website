import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { addScore, getTopScores, LeaderboardEntry } from '../lib/firebase';

// ============== TYPES ==============
type EnemyType = 'pigeon' | 'bat';
type GameState = 'idle' | 'playing' | 'gameover';

interface Enemy {
  id: number;
  x: number;
  y: number;
  type: EnemyType;
  isFleeing: boolean;
  fleeDirection: 'left' | 'right';
  variant: number;
  speedX: number;
  speedY: number;
  directionX: 1 | -1;
  directionY: 1 | -1;
}

interface ScorePopup {
  id: number;
  x: number;
  y: number;
  points: number;
}

// ============== CONSTANTS ==============
const GAME_DURATION = 15;
const INITIAL_ENEMY_COUNT = 6;
const MAX_ENEMIES = 15;
const BASE_SPAWN_INTERVAL = 600; // Much faster base spawn
const MIN_SPAWN_INTERVAL = 150; // Can get very fast
const HITBOX_PADDING = 24;

// ============== ANIMATIONS ==============
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;

const batFloat = keyframes`
  0%, 100% { transform: translateY(0) scaleX(1); }
  50% { transform: translateY(-5px) scaleX(0.96); }
`;

const flyAwayLeft = keyframes`
  0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translate(-200px, -180px) rotate(-20deg) scale(0.15); opacity: 0; }
`;

const flyAwayRight = keyframes`
  0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
  100% { transform: translate(200px, -180px) rotate(20deg) scale(0.15); opacity: 0; }
`;

const wingFlap = keyframes`
  0%, 100% { transform: scaleY(1) rotate(-5deg); }
  50% { transform: scaleY(0.5) rotate(25deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
`;

const urgentPulse = keyframes`
  0%, 100% { color: #ff3b30; text-shadow: 0 0 20px rgba(255, 59, 48, 0.6); }
  50% { color: #ff6b6b; text-shadow: 0 0 30px rgba(255, 59, 48, 0.9); }
`;

const scoreFloat = keyframes`
  0% { transform: translateY(0) scale(0.5); opacity: 0; }
  15% { transform: translateY(-12px) scale(1.15); opacity: 1; }
  100% { transform: translateY(-45px) scale(0.7); opacity: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const targetPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
`;

// ============== STYLED COMPONENTS ==============
const GameContainer = styled.section`
  width: 100%;
  padding: 40px 0 30px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, 
    rgba(0, 0, 0, 0) 0%,
    rgba(6, 10, 20, 0.95) 15%,
    rgba(8, 14, 28, 1) 100%
  );
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
`;

const GameWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 4px;
  height: 40px;
`;

const Timer = styled.div<{ $urgent: boolean }>`
  font-size: 1.8rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: ${p => p.$urgent ? '#ff3b30' : 'rgba(255,255,255,0.9)'};
  ${p => p.$urgent && css`animation: ${urgentPulse} 0.5s ease-in-out infinite;`}
`;

const LiveScore = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  font-variant-numeric: tabular-nums;
  
  span {
    color: #3B9EFF;
  }
`;

const ComboDisplay = styled(motion.div)<{ $level: number }>`
  font-size: 1rem;
  font-weight: 700;
  color: ${p => {
    if (p.$level >= 6) return '#ff3b30';
    if (p.$level >= 4) return '#ff9500';
    if (p.$level >= 2) return '#3B9EFF';
    return 'rgba(59, 158, 255, 0.8)';
  }};
  animation: ${pulse} 0.4s ease-in-out infinite;
`;

const GameArea = styled.div<{ $isPlaying: boolean }>`
  position: relative;
  width: 100%;
  height: 340px;
  border-radius: 16px;
  background: linear-gradient(180deg, 
    rgba(12, 18, 32, 0.5) 0%,
    rgba(8, 14, 26, 0.7) 60%,
    rgba(15, 25, 20, 0.85) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.04);
  overflow: hidden;
  cursor: ${p => p.$isPlaying ? 'crosshair' : 'pointer'};
  contain: layout style paint;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.3) 100%);
    pointer-events: none;
  }
`;

// Idle overlay - more game-like
const IdleOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
  cursor: pointer;
`;

const TargetReticle = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  animation: ${targetPulse} 1.5s ease-in-out infinite;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: #3B9EFF;
  }
  
  &::before {
    top: 50%;
    left: 10%;
    right: 10%;
    height: 3px;
    transform: translateY(-50%);
    border-radius: 2px;
  }
  
  &::after {
    left: 50%;
    top: 10%;
    bottom: 10%;
    width: 3px;
    transform: translateX(-50%);
    border-radius: 2px;
  }
`;

const ReticleCircle = styled.div`
  position: absolute;
  inset: 0;
  border: 3px solid;
  border-color: #3B9EFF;
  border-radius: 50%;
  
  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border: 2px dashed rgba(59, 158, 255, 0.5);
    border-radius: 50%;
    animation: spin 8s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const TapText = styled.div`
  margin-top: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  animation: ${bounce} 2s ease-in-out infinite;
`;

const IdlePreviewBirds = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.4;
`;

const PreviewBird = styled.div<{ $x: number; $y: number; $delay: number }>`
  position: absolute;
  left: ${p => p.$x}%;
  top: ${p => p.$y}%;
  animation: ${float} 2s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
`;

const HighScoreBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 0.85rem;
  color: rgba(255, 215, 0, 0.7);
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 20px;
`;

// Decorations
const DecorationLayer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
`;

const Branch = styled.div<{ $left: number; $top: number; $width: number; $flip?: boolean }>`
  position: absolute;
  left: ${p => p.$left}%;
  top: ${p => p.$top}%;
  width: ${p => p.$width}px;
  height: 6px;
  background: linear-gradient(90deg, 
    rgba(60, 45, 30, 0.9) 0%,
    rgba(80, 60, 40, 0.95) 50%,
    rgba(50, 35, 25, 0.8) 100%
  );
  border-radius: 3px;
  transform: ${p => p.$flip ? 'scaleX(-1)' : 'none'};
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  
  &::before {
    content: '';
    position: absolute;
    right: -15px;
    top: -8px;
    width: 20px;
    height: 4px;
    background: rgba(70, 55, 35, 0.8);
    border-radius: 2px;
    transform: rotate(-35deg);
  }
  
  &::after {
    content: '';
    position: absolute;
    right: 20px;
    top: -6px;
    width: 15px;
    height: 3px;
    background: rgba(65, 50, 30, 0.7);
    border-radius: 2px;
    transform: rotate(-25deg);
  }
`;

const Wire = styled.div<{ $top: number }>`
  position: absolute;
  left: 0;
  right: 0;
  top: ${p => p.$top}%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(40, 45, 55, 0.6) 10%,
    rgba(50, 55, 65, 0.8) 50%,
    rgba(40, 45, 55, 0.6) 90%,
    transparent 100%
  );
`;

const Pole = styled.div<{ $left: number }>`
  position: absolute;
  left: ${p => p.$left}%;
  top: 15%;
  bottom: 5%;
  width: 4px;
  background: linear-gradient(180deg,
    rgba(50, 55, 65, 0.9) 0%,
    rgba(35, 40, 50, 0.95) 100%
  );
  border-radius: 2px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -8px;
    width: 20px;
    height: 3px;
    background: rgba(45, 50, 60, 0.8);
    border-radius: 2px;
  }
`;

const Ledge = styled.div<{ $left: number; $bottom: number; $width: number }>`
  position: absolute;
  left: ${p => p.$left}%;
  bottom: ${p => p.$bottom}%;
  width: ${p => p.$width}px;
  height: 8px;
  background: linear-gradient(180deg,
    rgba(70, 75, 85, 0.9) 0%,
    rgba(50, 55, 65, 0.95) 100%
  );
  border-radius: 2px 2px 0 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
`;

const Moon = styled.div`
  position: absolute;
  right: 8%;
  top: 12%;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%,
    rgba(255, 255, 240, 0.95) 0%,
    rgba(230, 230, 210, 0.8) 50%,
    rgba(200, 200, 180, 0.6) 100%
  );
  box-shadow: 0 0 30px rgba(255, 255, 200, 0.3);
`;

const Star = styled.div<{ $left: number; $top: number; $size: number; $delay: number }>`
  position: absolute;
  left: ${p => p.$left}%;
  top: ${p => p.$top}%;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: ${pulse} ${p => 2 + p.$delay}s ease-in-out infinite;
  animation-delay: ${p => p.$delay}s;
`;

// Flying area
const FlyingArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
`;

const EnemyWrapper = styled.div<{ 
  $x: number;
  $y: number;
  $isFleeing: boolean; 
  $fleeDirection: 'left' | 'right';
  $type: EnemyType;
}>`
  position: absolute;
  left: ${p => p.$x}%;
  top: ${p => p.$y}%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 20;
  padding: ${HITBOX_PADDING}px;
  margin: -${HITBOX_PADDING}px;
  will-change: transform, opacity;
  pointer-events: auto;
  
  ${p => p.$isFleeing ? css`
    animation: ${p.$fleeDirection === 'left' ? flyAwayLeft : flyAwayRight} 0.4s ease-out forwards;
    pointer-events: none;
  ` : css`
    animation: ${p.$type === 'bat' ? batFloat : float} ${p.$type === 'bat' ? '0.5s' : '1.6s'} ease-in-out infinite;
    
    &:hover {
      transform: translate(-50%, -50%) scale(1.15);
    }
    
    &:active {
      transform: translate(-50%, -50%) scale(0.85);
    }
  `}
`;

const PigeonSvg = styled.svg<{ $variant: number; $isFleeing: boolean }>`
  width: 44px;
  height: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  display: block;
  
  .body { fill: ${p => ['#8090a0', '#7a8a9a', '#909aa8', '#6a7a8a'][p.$variant % 4]}; }
  .wing {
    fill: ${p => ['#6a7a8a', '#5a6a7a', '#7a8a98', '#4a5a6a'][p.$variant % 4]};
    transform-origin: center;
    ${p => p.$isFleeing && css`animation: ${wingFlap} 0.06s ease-in-out infinite;`}
  }
  .head { fill: ${p => ['#607080', '#506070', '#708090', '#405060'][p.$variant % 4]}; }
  .eye { fill: #ff6b35; }
  .beak { fill: #d4a574; }
`;

const BatSvg = styled.svg<{ $variant: number; $isFleeing: boolean }>`
  width: 48px;
  height: 36px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
  display: block;
  
  .body { fill: ${p => ['#2d2d3a', '#3a3a4a', '#252535', '#1f1f2f'][p.$variant % 4]}; }
  .wing {
    fill: ${p => ['#1a1a25', '#252535', '#1f1f2a', '#151520'][p.$variant % 4]};
    transform-origin: center;
    ${p => p.$isFleeing && css`animation: ${wingFlap} 0.05s ease-in-out infinite;`}
  }
  .ear { fill: ${p => ['#3a3a4a', '#454555', '#353545', '#2a2a3a'][p.$variant % 4]}; }
  .eye { fill: #ff4444; }
`;

const ScorePopupEl = styled.div<{ $x: number; $y: number }>`
  position: absolute;
  left: ${p => p.$x}%;
  top: ${p => p.$y}%;
  font-size: 1.2rem;
  font-weight: 700;
  color: #3B9EFF;
  text-shadow: 0 0 10px rgba(59, 158, 255, 0.6);
  pointer-events: none;
  z-index: 100;
  animation: ${scoreFloat} 0.5s ease-out forwards;
`;

// Game Over Modal
const GameOverModal = styled(motion.div)`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 1000;
  padding: 20px;
`;

const GameOverContent = styled(motion.div)`
  background: linear-gradient(180deg, rgba(18, 22, 38, 0.98) 0%, rgba(10, 14, 26, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 32px;
  max-width: 380px;
  width: 100%;
  text-align: center;
`;

const FinalScore = styled.div`
  font-size: 4rem;
  font-weight: 800;
  color: #3B9EFF;
  margin: 16px 0;
  line-height: 1;
`;

const NewRecord = styled(motion.div)`
  color: #ffd700;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 16px;
  animation: ${pulse} 1s ease-in-out infinite;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 20px 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  
  span {
    color: #fff;
    font-weight: 600;
  }
`;

const NameInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 1rem;
  color: #fff;
  text-align: center;
  margin-bottom: 14px;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: rgba(59, 158, 255, 0.5);
  }
  
  &::placeholder { color: rgba(255, 255, 255, 0.25); }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionBtn = styled(motion.button)<{ $primary?: boolean }>`
  flex: 1;
  background: ${p => p.$primary 
    ? '#3B9EFF'
    : 'rgba(255, 255, 255, 0.06)'};
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${p => p.$primary ? '#000000' : '#ffffff'};
  cursor: pointer;
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const StatusMsg = styled.div<{ $error?: boolean }>`
  color: ${p => p.$error ? '#ff6b6b' : '#3B9EFF'};
  font-size: 0.85rem;
  margin-bottom: 10px;
`;

// Leaderboard
const LeaderboardWrap = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 12px;
`;

const LeaderboardItem = styled.div<{ $rank: number }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: ${p => p.$rank === 1 ? 'linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent)' : 'transparent'};
  border-radius: 6px;
  animation: ${fadeIn} 0.3s ease forwards;
  animation-delay: ${p => p.$rank * 0.03}s;
  opacity: 0;
  
  .rank {
    width: 20px;
    font-weight: 700;
    font-size: 0.8rem;
    color: ${p => p.$rank === 1 ? '#ffd700' : p.$rank === 2 ? '#c0c0c0' : p.$rank === 3 ? '#cd7f32' : 'rgba(255,255,255,0.4)'};
  }
  
  .name {
    flex: 1;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.8);
  }
  
  .score {
    font-weight: 700;
    font-size: 0.85rem;
    color: #3B9EFF;
  }
`;

// ============== SUB-COMPONENTS ==============
const PigeonIcon = memo(({ variant, isFleeing }: { variant: number; isFleeing: boolean }) => (
  <PigeonSvg viewBox="0 0 44 40" $variant={variant} $isFleeing={isFleeing}>
    <ellipse className="body" cx="22" cy="27" rx="12" ry="10" />
    <ellipse className="wing" cx="27" cy="25" rx="10" ry="7" />
    <path d="M 37 27 Q 44 25 42 32 Q 39 31 37 29 Z" fill="#5a6a7a" />
    <g className="head">
      <circle cx="10" cy="16" r="8" />
      <circle className="eye" cx="7" cy="14" r="2" />
      <circle fill="#fff" cx="6.5" cy="13.5" r="0.7" />
      <path className="beak" d="M 2 16 L 5 14 L 5 18 Z" />
    </g>
    <ellipse cx="13" cy="21" rx="4" ry="2.5" fill="#6a50a0" opacity="0.6" />
    <line x1="18" y1="36" x2="16" y2="42" stroke="#d4a574" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="26" y1="36" x2="28" y2="42" stroke="#d4a574" strokeWidth="1.8" strokeLinecap="round" />
  </PigeonSvg>
));

const BatIcon = memo(({ variant, isFleeing }: { variant: number; isFleeing: boolean }) => (
  <BatSvg viewBox="0 0 48 36" $variant={variant} $isFleeing={isFleeing}>
    <ellipse className="body" cx="24" cy="20" rx="8" ry="10" />
    <path className="wing" d="M 16 18 Q 5 10 1 20 Q 4 22 8 21 Q 10 25 14 23 Q 16 24 16 22 Z" />
    <path className="wing" d="M 32 18 Q 43 10 47 20 Q 44 22 40 21 Q 38 25 34 23 Q 32 24 32 22 Z" />
    <path className="ear" d="M 20 11 L 18 5 L 22 9 Z" />
    <path className="ear" d="M 28 11 L 30 5 L 26 9 Z" />
    <circle className="eye" cx="21" cy="17" r="2" />
    <circle className="eye" cx="27" cy="17" r="2" />
    <circle fill="#fff" cx="20.5" cy="16.5" r="0.6" />
    <circle fill="#fff" cx="26.5" cy="16.5" r="0.6" />
  </BatSvg>
));

const SmallPigeonIcon = memo(() => (
  <svg viewBox="0 0 44 40" width="32" height="28">
    <ellipse fill="#8090a0" cx="22" cy="27" rx="12" ry="10" />
    <ellipse fill="#6a7a8a" cx="27" cy="25" rx="10" ry="7" />
    <circle fill="#607080" cx="10" cy="16" r="8" />
    <circle fill="#ff6b35" cx="7" cy="14" r="2" />
  </svg>
));

// ============== MAIN COMPONENT ==============
const PigeonGame: React.FC = () => {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GameState>('idle');
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [highScore, setHighScore] = useState(0);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [killRate, setKillRate] = useState(0);

  // Refs
  const gameLoopRef = useRef<number | null>(null);
  const spawnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupIdRef = useRef(0);
  const enemyIdRef = useRef(0);
  const killsRef = useRef(0);
  const gameStartTimeRef = useRef(Date.now());

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('pg_hs_v5');
    if (saved) setHighScore(parseInt(saved, 10));
    getTopScores(5).then(setLeaderboard).catch((error: any) => {
      // Ignorer les erreurs AbortError (normales lors du rechargement)
      if (error?.name !== 'AbortError' && !error?.message?.includes('aborted')) {
        console.error('Error loading leaderboard:', error);
      }
    });
  }, []);

  // Create enemy
  const createEnemy = useCallback((): Enemy => {
    const type: EnemyType = Math.random() < 0.25 ? 'bat' : 'pigeon';
    return {
      id: enemyIdRef.current++,
      x: 8 + Math.random() * 84,
      y: 12 + Math.random() * 65,
      type,
      isFleeing: false,
      fleeDirection: Math.random() > 0.5 ? 'left' : 'right',
      variant: Math.floor(Math.random() * 4),
      speedX: 0.15 + Math.random() * 0.2,
      speedY: 0.1 + Math.random() * 0.12,
      directionX: Math.random() > 0.5 ? 1 : -1,
      directionY: Math.random() > 0.5 ? 1 : -1,
    };
  }, []);

  // Init enemies
  const initEnemies = useCallback(() => {
    const initial: Enemy[] = [];
    for (let i = 0; i < INITIAL_ENEMY_COUNT; i++) {
      initial.push(createEnemy());
    }
    setEnemies(initial);
  }, [createEnemy]);

  // Game loop
  const gameLoop = useCallback(() => {
    setEnemies(prev => prev.map(e => {
      if (e.isFleeing) return e;
      
      let nx = e.x + e.speedX * e.directionX;
      let ny = e.y + e.speedY * e.directionY;
      let dx = e.directionX;
      let dy = e.directionY;
      
      if (nx < 5) { nx = 5; dx = 1; }
      if (nx > 95) { nx = 95; dx = -1; }
      if (ny < 8) { ny = 8; dy = 1; }
      if (ny > 82) { ny = 82; dy = -1; }
      
      if (Math.random() < 0.004) dx = dx === 1 ? -1 : 1;
      if (Math.random() < 0.006) dy = dy === 1 ? -1 : 1;
      
      return { ...e, x: nx, y: ny, directionX: dx, directionY: dy };
    }).filter(e => !e.isFleeing || Math.random() > 0.015));
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, []);

  // Adaptive spawn - much faster
  const scheduleSpawn = useCallback(() => {
    // Calculate spawn interval based on kill rate - much more aggressive
    const interval = Math.max(MIN_SPAWN_INTERVAL, BASE_SPAWN_INTERVAL - killRate * 100);
    
    spawnTimeoutRef.current = setTimeout(() => {
      setEnemies(prev => {
        const activeCount = prev.filter(e => !e.isFleeing).length;
        if (activeCount < MAX_ENEMIES) {
          // Spawn 1-2 enemies at once when low
          const toSpawn = activeCount < 4 ? 2 : 1;
          const newEnemies = [];
          for (let i = 0; i < toSpawn; i++) {
            newEnemies.push(createEnemy());
          }
          return [...prev, ...newEnemies];
        }
        return prev;
      });
      scheduleSpawn();
    }, interval);
  }, [createEnemy, killRate]);

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(GAME_DURATION);
    setScorePopups([]);
    setIsNewHighScore(false);
    setSaveStatus('idle');
    setKillRate(0);
    killsRef.current = 0;
    gameStartTimeRef.current = Date.now();
    
    initEnemies();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    scheduleSpawn();
  }, [initEnemies, gameLoop, scheduleSpawn]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  // Cleanup on game over
  useEffect(() => {
    if (gameState === 'gameover') {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
      
      if (score > highScore) {
        setHighScore(score);
        setIsNewHighScore(true);
        localStorage.setItem('pg_hs_v5', score.toString());
      }
      
      getTopScores(5).then(setLeaderboard).catch((error: any) => {
        // Ignorer les erreurs AbortError (normales lors du rechargement)
        if (error?.name !== 'AbortError' && !error?.message?.includes('aborted')) {
          console.error('Error loading leaderboard:', error);
        }
      });
    }
  }, [gameState, score, highScore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
      if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    };
  }, []);

  // Scare enemy
  const scareEnemy = useCallback((id: number, x: number, y: number, type: EnemyType) => {
    if (gameState !== 'playing') return;
    
    setEnemies(prev => prev.map(e => 
      e.id === id ? { ...e, isFleeing: true, fleeDirection: x < 50 ? 'right' : 'left' } : e
    ));
    
    // Update kill rate
    killsRef.current++;
    const elapsed = (Date.now() - gameStartTimeRef.current) / 1000;
    if (elapsed > 0.5) {
      setKillRate(Math.min(8, killsRef.current / elapsed));
    }
    
    // Combo
    if (comboTimeoutRef.current) clearTimeout(comboTimeoutRef.current);
    setCombo(prev => {
      const next = prev + 1;
      setMaxCombo(m => Math.max(m, next));
      return next;
    });
    comboTimeoutRef.current = setTimeout(() => setCombo(0), 800);
    
    // Score
    const base = type === 'bat' ? 25 : 10;
    const mult = Math.min(combo + 1, 10);
    const pts = base * mult;
    setScore(prev => prev + pts);
    
    // Popup
    const pid = popupIdRef.current++;
    setScorePopups(prev => [...prev, { id: pid, x, y, points: pts }]);
    setTimeout(() => setScorePopups(prev => prev.filter(p => p.id !== pid)), 500);
    
    // Remove
    setTimeout(() => setEnemies(prev => prev.filter(e => e.id !== id)), 400);
  }, [gameState, combo]);

  // Save score
  const saveScore = useCallback(async () => {
    if (!playerName.trim() || isSaving) return;
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      await addScore({
        playerName: playerName.trim(),
        score,
        pigeonsScared: 0,
        batsScared: 0,
        maxCombo,
      });
      setSaveStatus('success');
      const lb = await getTopScores(5);
      setLeaderboard(lb);
      setTimeout(() => {
        setGameState('idle');
        setPlayerName('');
      }, 1200);
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [playerName, score, maxCombo, isSaving]);

  const replay = useCallback(() => {
    setGameState('idle');
    setPlayerName('');
    setSaveStatus('idle');
  }, []);

  // Stars & preview birds positions
  const stars = [
    { left: 12, top: 8, size: 2, delay: 0 },
    { left: 28, top: 15, size: 1.5, delay: 0.5 },
    { left: 45, top: 6, size: 2, delay: 1 },
    { left: 65, top: 12, size: 1.5, delay: 0.3 },
    { left: 78, top: 5, size: 2, delay: 0.8 },
    { left: 5, top: 20, size: 1.5, delay: 1.2 },
  ];

  const previewBirds = [
    { x: 20, y: 35, delay: 0 },
    { x: 45, y: 55, delay: 0.3 },
    { x: 70, y: 40, delay: 0.6 },
    { x: 85, y: 65, delay: 0.9 },
  ];

  return (
    <GameContainer id="pigeon-game">
      <ContentWrapper>
        <GameWrapper>
          {gameState === 'playing' && (
            <TopBar>
              <Timer $urgent={timeLeft <= 5}>{timeLeft}</Timer>
              <LiveScore><span>{score}</span></LiveScore>
              {combo > 1 && (
                <ComboDisplay $level={combo} key={combo}>
                  ×{combo}
                </ComboDisplay>
              )}
            </TopBar>
          )}

          <GameArea $isPlaying={gameState === 'playing'} onClick={gameState === 'idle' ? startGame : undefined}>
            {/* Decorations */}
            <DecorationLayer>
              <Moon />
              {stars.map((s, i) => (
                <Star key={i} $left={s.left} $top={s.top} $size={s.size} $delay={s.delay} />
              ))}
              <Wire $top={28} />
              <Wire $top={45} />
              <Pole $left={8} />
              <Pole $left={92} />
              <Branch $left={5} $top={35} $width={70} />
              <Branch $left={75} $top={52} $width={90} $flip />
              <Branch $left={60} $top={25} $width={55} />
              <Ledge $left={25} $bottom={15} $width={80} />
              <Ledge $left={55} $bottom={25} $width={60} />
              <Ledge $left={80} $bottom={10} $width={70} />
            </DecorationLayer>

            {/* Idle overlay */}
            {gameState === 'idle' && (
              <IdleOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Preview birds in background */}
                <IdlePreviewBirds>
                  {previewBirds.map((b, i) => (
                    <PreviewBird key={i} $x={b.x} $y={b.y} $delay={b.delay}>
                      <SmallPigeonIcon />
                    </PreviewBird>
                  ))}
                </IdlePreviewBirds>

                {/* High score badge */}
                {highScore > 0 && (
                  <HighScoreBadge>
                    🏆 {highScore}
                  </HighScoreBadge>
                )}

                {/* Target reticle */}
                <TargetReticle>
                  <ReticleCircle />
                </TargetReticle>
                
                <TapText>{t('game.tapToHunt')}</TapText>
              </IdleOverlay>
            )}

            {/* Game content */}
            {gameState === 'playing' && (
              <FlyingArea>
                {scorePopups.map(p => (
                  <ScorePopupEl key={p.id} $x={p.x} $y={p.y}>+{p.points}</ScorePopupEl>
                ))}
                {enemies.map(e => (
                  <EnemyWrapper
                    key={e.id}
                    $x={e.x}
                    $y={e.y}
                    $isFleeing={e.isFleeing}
                    $fleeDirection={e.fleeDirection}
                    $type={e.type}
                    onClick={() => !e.isFleeing && scareEnemy(e.id, e.x, e.y, e.type)}
                  >
                    {e.type === 'pigeon' ? (
                      <PigeonIcon variant={e.variant} isFleeing={e.isFleeing} />
                    ) : (
                      <BatIcon variant={e.variant} isFleeing={e.isFleeing} />
                    )}
                  </EnemyWrapper>
                ))}
              </FlyingArea>
            )}
          </GameArea>

          {/* Leaderboard when idle */}
          {gameState === 'idle' && leaderboard.length > 0 && (
            <LeaderboardWrap>
              {leaderboard.map((e, i) => (
                <LeaderboardItem key={e.id} $rank={i + 1}>
                  <div className="rank">{i + 1}</div>
                  <div className="name">{e.playerName}</div>
                  <div className="score">{e.score}</div>
                </LeaderboardItem>
              ))}
            </LeaderboardWrap>
          )}
        </GameWrapper>
      </ContentWrapper>

      {/* Game Over */}
      <AnimatePresence>
        {gameState === 'gameover' && (
          <GameOverModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameOverContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              {isNewHighScore && <NewRecord>{t('game.gameOver.newRecord')}</NewRecord>}
              <FinalScore>{score}</FinalScore>
              
              <StatsRow>
                <div>{t('game.gameOver.maxCombo')} <span>×{maxCombo}</span></div>
              </StatsRow>

              {saveStatus === 'success' && <StatusMsg>{t('game.gameOver.saved')}</StatusMsg>}
              {saveStatus === 'error' && <StatusMsg $error>{t('game.gameOver.error')}</StatusMsg>}

              {saveStatus !== 'success' && (
                <>
                  <NameInput
                    placeholder={t('game.gameOver.namePlaceholder')}
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value.slice(0, 15))}
                    maxLength={15}
                    disabled={isSaving}
                  />
                  <ButtonRow>
                    <ActionBtn $primary onClick={saveScore} disabled={!playerName.trim() || isSaving}>
                      {isSaving ? '...' : t('game.gameOver.save')}
                    </ActionBtn>
                    <ActionBtn onClick={replay} disabled={isSaving}>
                      {t('game.gameOver.replay')}
                    </ActionBtn>
                  </ButtonRow>
                </>
              )}
            </GameOverContent>
          </GameOverModal>
        )}
      </AnimatePresence>
    </GameContainer>
  );
};

export default PigeonGame;
