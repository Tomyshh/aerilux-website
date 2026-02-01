import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'info';

type ToastItem = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  createdAt: number;
  durationMs: number;
};

type ToastContextValue = {
  show: (args: { type: ToastType; title?: string; message: string; durationMs?: number }) => void;
  success: (message: string, opts?: { title?: string; durationMs?: number }) => void;
  error: (message: string, opts?: { title?: string; durationMs?: number }) => void;
  info: (message: string, opts?: { title?: string; durationMs?: number }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function makeId(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const Viewport = styled.div`
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(420px, calc(100vw - 36px));
  pointer-events: none;
`;

const ToastCard = styled(motion.div)<{ $type: ToastType }>`
  pointer-events: auto;
  border-radius: 16px;
  padding: 14px 14px 14px 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(10, 10, 10, 0.72);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.55);
  overflow: hidden;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ $type }) => {
      if ($type === 'success') return 'linear-gradient(135deg, rgba(46, 213, 115, 0.22), rgba(46, 213, 115, 0.00) 60%)';
      if ($type === 'error') return 'linear-gradient(135deg, rgba(255, 59, 48, 0.22), rgba(255, 59, 48, 0.00) 60%)';
      return 'linear-gradient(135deg, rgba(59, 158, 255, 0.22), rgba(59, 158, 255, 0.00) 60%)';
    }};
    pointer-events: none;
  }
`;

const ToastInner = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const IconDot = styled.div<{ $type: ToastType }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 6px;
  background: ${({ $type }) => {
    if ($type === 'success') return 'rgba(46, 213, 115, 1)';
    if ($type === 'error') return 'rgba(255, 59, 48, 1)';
    return 'rgba(59, 158, 255, 1)';
  }};
  box-shadow: ${({ $type }) => {
    if ($type === 'success') return '0 0 18px rgba(46, 213, 115, 0.55)';
    if ($type === 'error') return '0 0 18px rgba(255, 59, 48, 0.45)';
    return '0 0 18px rgba(59, 158, 255, 0.5)';
  }};
  flex: 0 0 auto;
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.2;
  color: #ffffff;
  margin-bottom: 4px;
`;

const Message = styled.div`
  font-size: 0.92rem;
  line-height: 1.35;
  color: rgba(255, 255, 255, 0.82);
  word-break: break-word;
`;

const CloseButton = styled.button`
  margin-left: auto;
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  padding: 6px 10px;
  font-size: 0.85rem;
  line-height: 1;
  transition: all 0.2s ease;

  &:hover {
    color: rgba(255, 255, 255, 0.95);
    border-color: rgba(255, 255, 255, 0.22);
    background: rgba(255, 255, 255, 0.06);
  }
`;

const Progress = styled(motion.div)<{ $type: ToastType }>`
  height: 2px;
  background: ${({ $type }) => {
    if ($type === 'success') return 'rgba(46, 213, 115, 1)';
    if ($type === 'error') return 'rgba(255, 59, 48, 1)';
    return 'rgba(59, 158, 255, 1)';
  }};
  position: absolute;
  left: 0;
  bottom: 0;
`;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Record<string, number>>({});

  const remove = useCallback((id: string) => {
    setItems(prev => prev.filter(t => t.id !== id));
    const t = timeoutsRef.current[id];
    if (t) window.clearTimeout(t);
    delete timeoutsRef.current[id];
  }, []);

  const show = useCallback(
    (args: { type: ToastType; title?: string; message: string; durationMs?: number }) => {
      const durationMs =
        typeof args.durationMs === 'number'
          ? args.durationMs
          : args.type === 'error'
            ? 6500
            : args.type === 'success'
              ? 4200
              : 4500;

      const toast: ToastItem = {
        id: makeId(),
        type: args.type,
        title: args.title,
        message: args.message,
        createdAt: Date.now(),
        durationMs,
      };

      setItems(prev => [toast, ...prev].slice(0, 4));

      timeoutsRef.current[toast.id] = window.setTimeout(() => {
        remove(toast.id);
      }, durationMs);
    },
    [remove]
  );

  const api = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (message, opts) => show({ type: 'success', message, ...opts }),
      error: (message, opts) => show({ type: 'error', message, ...opts }),
      info: (message, opts) => show({ type: 'info', message, ...opts }),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Viewport aria-live="polite" aria-relevant="additions removals">
        <AnimatePresence initial={false}>
          {items.map(t => (
            <ToastCard
              key={t.id}
              $type={t.type}
              initial={{ opacity: 0, y: -14, x: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, x: 10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => remove(t.id)}
              role="status"
            >
              <ToastInner>
                <IconDot $type={t.type} />
                <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                  <Title>{t.title || (t.type === 'success' ? 'Succès' : t.type === 'error' ? 'Erreur' : 'Info')}</Title>
                  <Message>{t.message}</Message>
                </div>
                <CloseButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(t.id);
                  }}
                  aria-label="Fermer"
                >
                  Fermer
                </CloseButton>
              </ToastInner>
              <Progress
                $type={t.type}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: t.durationMs / 1000, ease: 'linear' }}
                style={{ transformOrigin: 'left center' }}
              />
            </ToastCard>
          ))}
        </AnimatePresence>
      </Viewport>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

