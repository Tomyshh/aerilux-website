import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import logoSolid from '../utils/IconOnly_Transparent_NoBuffer.png';
import { useCart } from '../hooks/useCart';

const Nav = styled(motion.nav)<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  backdrop-filter: blur(10px);
  background-color: ${props => props.scrolled ? 'rgba(0, 0, 0, 0.8)' : 'transparent'};
  transition: all 0.3s ease;
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

const LogoImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
`;

const NavLinks = styled.ul`
  display: flex;
  gap: 2rem;
  list-style: none;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const CartButton = styled(motion.button)`
  position: relative;
  background: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    opacity: 0.7;
  }
`;

const CartBadge = styled(motion.span)`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff3b30;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
`;

const CTAButton = styled(motion.button)`
  background-color: #ffffff;
  color: #000000;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  color: #ffffff;
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Nav
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavContainer>
        <Logo to="/">
          <LogoImg src={logoSolid} alt="Aerilux Logo" />
          <LogoText>AERILUX</LogoText>
        </Logo>
        
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/product">Product</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </NavLinks>

        <NavActions>
          <CartButton
            onClick={() => navigate('/cart')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🛒
            {cartItemsCount > 0 && (
              <CartBadge
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                {cartItemsCount}
              </CartBadge>
            )}
          </CartButton>
          
          <CTAButton
            onClick={() => navigate('/product')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Order Now
          </CTAButton>
        </NavActions>
        
        <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          ☰
        </MobileMenuButton>
      </NavContainer>
    </Nav>
  );
};

export default Navbar; 