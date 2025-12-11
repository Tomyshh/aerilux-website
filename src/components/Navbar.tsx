import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoSolid from '../utils/IconOnly_Transparent_NoBuffer.png';
import { useCart } from '../hooks/useCart';
import MagneticButton from './effects/MagneticButton';

const Nav = styled(motion.nav)<{ $scrolled: boolean; $isHero: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  backdrop-filter: ${props => props.$scrolled ? 'blur(20px)' : 'blur(0px)'};
  background-color: ${props => props.$scrolled 
    ? 'rgba(0, 0, 0, 0.85)' 
    : 'transparent'};
  border-bottom: ${props => props.$scrolled 
    ? '1px solid rgba(255, 255, 255, 0.1)' 
    : 'none'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoImg = styled(motion.img)`
  width: 45px;
  height: 45px;
  object-fit: contain;
`;

const LogoText = styled(motion.h1)`
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  background: linear-gradient(135deg, #ffffff 0%, #cccccc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled(motion.ul)`
  display: flex;
  gap: 2.5rem;
  list-style: none;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinkItem = styled(motion.li)`
  position: relative;
`;

const StyledNavLink = styled(Link)<{ $isActive: boolean }>`
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${props => props.$isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  position: relative;
  padding: 0.5rem 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${props => props.$isActive ? '100%' : '0'};
    height: 2px;
    background: linear-gradient(90deg, #007AFF 0%, #34c759 100%);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #ffffff;
    
    &::after {
      width: 100%;
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const CartButton = styled(motion.button)`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: #ffffff;
  font-size: 1.3rem;
  cursor: pointer;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const CartBadge = styled(motion.span)`
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ff3b30 0%, #ff6b6b 100%);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(255, 59, 48, 0.4);
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  color: #000000;
  padding: 0.75rem 1.75rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1.5rem;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const MobileNavLink = styled(motion(Link))`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  
  &:hover {
    color: #007AFF;
  }
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  color: #ffffff;
  font-size: 2rem;
`;

const Navbar: React.FC = React.memo(() => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  const isHero = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = useMemo(() => [
    { path: '/', label: 'Home' },
    { path: '/product', label: 'Product' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ], []);

  const menuVariants = useMemo(() => ({
    closed: { opacity: 0, x: '100%' },
    open: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  }), []);

  const linkVariants = useMemo(() => ({
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }), []);

  const handleNavigateToCart = useCallback(() => {
    navigate('/cart');
  }, [navigate]);

  const handleNavigateToProduct = useCallback(() => {
    navigate('/product');
  }, [navigate]);

  const handleToggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <Nav
        $scrolled={scrolled}
        $isHero={isHero}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
      >
        <NavContainer>
          <Logo to="/">
            <LogoImg 
              src={logoSolid} 
              alt="Aerilux Logo"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
            <LogoText>AERILUX</LogoText>
          </Logo>
          
          <NavLinks>
            {navLinks.map((link, index) => (
              <NavLinkItem
                key={link.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StyledNavLink 
                  to={link.path}
                  $isActive={location.pathname === link.path}
                >
                  {link.label}
                </StyledNavLink>
              </NavLinkItem>
            ))}
          </NavLinks>

          <NavActions>
            <CartButton
              onClick={handleNavigateToCart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              🛒
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <CartBadge
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  >
                    {cartItemsCount}
                  </CartBadge>
                )}
              </AnimatePresence>
            </CartButton>
            
            <MagneticButton onClick={handleNavigateToProduct}>
              <CTAButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Order Now
              </CTAButton>
            </MagneticButton>
            
            <MobileMenuButton 
              onClick={handleToggleMobileMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ☰
            </MobileMenuButton>
          </NavActions>
        </NavContainer>
      </Nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <CloseButton 
              onClick={handleCloseMobileMenu}
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              ✕
            </CloseButton>
            {navLinks.map((link, index) => (
              <MobileNavLink
                key={link.path}
                to={link.path}
                custom={index}
                variants={linkVariants}
                initial="closed"
                animate="open"
                onClick={handleCloseMobileMenu}
              >
                {link.label}
              </MobileNavLink>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
