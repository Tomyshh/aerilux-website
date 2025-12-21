import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import './i18n/config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PinLock from './components/PinLock';
import ErrorBoundary from './components/ErrorBoundary';
import { 
  CustomCursor, 
  SmoothScroll, 
  PageTransition,
  ScrollProgress,
  ParticleBackground 
} from './components/effects';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #000000;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px;
  position: relative;
  z-index: 1;
`;

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: #ffffff;
  font-size: 1.2rem;
`;

// Animated Routes component for page transitions
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  // Handle scroll to anchor on page load or route change
  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = [];
    const hash = location.hash.replace('#', '');
    
    if (hash) {
      // Wait for page to render, then scroll to anchor
      const scrollToHash = () => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 100; // Offset for fixed navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      };

      // Try multiple times with increasing delays
      const attempts = [100, 300, 500, 1000];
      attempts.forEach((delay) => {
        const timeoutId = setTimeout(scrollToHash, delay);
        timeoutIds.push(timeoutId);
      });
    } else {
      // Scroll to top if no hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Cleanup timeouts on unmount or route change
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, [location.pathname, location.hash]);

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );
};

function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    // Vérifier si le site a déjà été déverrouillé dans cette session
    const unlocked = sessionStorage.getItem('aerilux_unlocked');
    return unlocked === 'true';
  });

  useEffect(() => {
    // Si déverrouillé, sauvegarder dans sessionStorage
    if (isUnlocked) {
      sessionStorage.setItem('aerilux_unlocked', 'true');
    }
  }, [isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
  };

  // Si le site n'est pas déverrouillé, afficher le PinLock
  if (!isUnlocked) {
    return <PinLock onSuccess={handleUnlock} />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <SmoothScroll>
          <AppContainer>
            {/* Custom cursor effect */}
            <CustomCursor />
            
            {/* Scroll progress indicator */}
            <ScrollProgress />
            
            {/* Particle background */}
            <ParticleBackground variant="connections" />
            
            <Navbar />
            <MainContent>
              <AnimatedRoutes />
            </MainContent>
            <Footer />
          </AppContainer>
        </SmoothScroll>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
