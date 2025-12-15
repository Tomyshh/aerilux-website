import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';

const ParticleWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  will-change: transform;
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  will-change: transform;
`;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  color: string;
}

interface ParticleBackgroundProps {
  variant?: 'default' | 'stars' | 'connections' | 'snow';
}

// Throttle function to limit event frequency
const throttle = <T extends (...args: never[]) => void>(func: T, limit: number): T => {
  let inThrottle = false;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

const ParticleBackground: React.FC<ParticleBackgroundProps> = React.memo(({ variant = 'default' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isVisibleRef = useRef(true);

  // Memoize particle count based on variant - reduced for performance
  const particleCount = useMemo(() => {
    switch (variant) {
      case 'connections': return 40; // Reduced from 60
      case 'stars': return 60; // Reduced from 100
      default: return 35; // Reduced from 50
    }
  }, [variant]);

  const colors = useMemo(() => 
    variant === 'default' ? ['#ffffff', '#007AFF', '#34c759'] : ['#ffffff'],
    [variant]
  );

  // Initialize particles
  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * (variant === 'snow' ? 0.3 : 0.5),
      vy: variant === 'snow' ? Math.random() * 0.8 + 0.3 : (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [particleCount, variant, colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharpness
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      
      // Reinitialize particles on resize
      initParticles(width, height);
    };

    resizeCanvas();

    // Throttled resize handler
    const throttledResize = throttle(resizeCanvas, 250);
    window.addEventListener('resize', throttledResize);

    // Throttled mouse move handler
    const handleMouseMove = throttle((e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }, 50);
    
    if (variant === 'default') {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Visibility change handler to pause animation when tab is hidden
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
      if (isVisibleRef.current && !animationFrameRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Pre-calculate connection distance squared for performance
    const connectionDistSq = 150 * 150;

    const drawConnections = (particles: Particle[], width: number) => {
      const len = particles.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistSq) {
            const opacity = 0.12 * (1 - distSq / connectionDistSq);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      if (!isVisibleRef.current) {
        animationFrameRef.current = null;
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const len = particles.length;

      // Batch draw particles
      for (let i = 0; i < len; i++) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Mouse repulsion for default variant (optimized)
        if (variant === 'default') {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 10000 && distSq > 0) { // 100^2
            const dist = Math.sqrt(distSq);
            const force = 0.02 * (100 - dist) / 100;
            particle.x -= dx * force;
            particle.y -= dy * force;
          }
        }

        // Boundary check
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) {
          if (variant === 'snow') {
            particle.y = 0;
            particle.x = Math.random() * width;
          } else {
            particle.vy *= -1;
          }
        }

        // Twinkle effect for stars (reduced frequency)
        if (variant === 'stars' && Math.random() < 0.1) {
          particle.opacity += (Math.random() - 0.5) * 0.03;
          particle.opacity = Math.max(0.1, Math.min(0.6, particle.opacity));
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        // Convert hex to rgba (cached in particle for performance)
        if (particle.color.startsWith('#')) {
          const hex = particle.color.slice(1);
          const r = parseInt(hex.slice(0, 2), 16);
          const g = parseInt(hex.slice(2, 4), 16);
          const b = parseInt(hex.slice(4, 6), 16);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`;
        }
        
        ctx.fill();
      }

      // Draw connections for connections variant
      if (variant === 'connections') {
        drawConnections(particles, width);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', throttledResize);
      if (variant === 'default') {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      particlesRef.current = [];
    };
  }, [variant, initParticles]);

  return (
    <ParticleWrapper>
      <Canvas ref={canvasRef} />
    </ParticleWrapper>
  );
});

ParticleBackground.displayName = 'ParticleBackground';

export default ParticleBackground;
