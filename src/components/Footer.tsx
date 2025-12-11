import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import logoSolid from '../utils/IconOnly_Transparent_NoBuffer.png';
import { navigateToSection } from '../utils/navigation';

const FooterSection = styled.footer`
  padding: 6rem 2rem 2rem;
  background: linear-gradient(180deg, #0a0a0a 0%, #000000 100%);
  color: #ffffff;
  position: relative;
  overflow: hidden;
`;

const FooterGlow = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.1) 0%, transparent 60%);
  filter: blur(80px);
  z-index: 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const FooterTop = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
`;

const CTAText = styled.h3`
  font-size: 2.5rem;
  font-weight: 800;
  max-width: 500px;
  background: linear-gradient(135deg, #ffffff 0%, #666666 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #007AFF 0%, #34c759 100%);
  color: #ffffff;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 10px 40px rgba(0, 122, 255, 0.3);
  position: relative;
  overflow: hidden;
  
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
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const BrandSection = styled(motion.div)``;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const LogoImg = styled(motion.img)`
  width: 50px;
  height: 50px;
  object-fit: contain;
`;

const LogoText = styled.h3`
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: 0.15em;
`;

const BrandTagline = styled.p`
  color: #666666;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.7;
`;

const FooterColumn = styled(motion.div)``;

const ColumnTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #007AFF 0%, #34c759 100%);
  }
`;

const ColumnLinks = styled.ul`
  list-style: none;
`;

const ColumnLink = styled(motion.li)`
  margin-bottom: 0.75rem;
`;

const StyledLink = styled(Link)`
  color: #666666;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: inline-block;
  
  &:hover {
    color: #ffffff;
    transform: translateX(5px);
  }
`;

const FooterBottom = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #444444;
  font-size: 0.9rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 2.5rem;
`;

const LegalLink = styled(Link)`
  color: #444444;
  font-size: 0.9rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ffffff;
  }
`;

const Newsletter = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 4rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const NewsletterContent = styled.div``;

const NewsletterTitle = styled.h4`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const NewsletterText = styled.p`
  color: #666666;
  font-size: 0.95rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 1rem 1.5rem;
  color: #ffffff;
  font-size: 1rem;
  min-width: 280px;
  
  &::placeholder {
    color: #666666;
  }
  
  &:focus {
    outline: none;
    border-color: #007AFF;
  }
`;

const SubscribeButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  color: #000000;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  white-space: nowrap;
`;

const Footer: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }), []);

  const handleCTAClick = useCallback(() => {
    navigateToSection(navigate, '/contact');
  }, [navigate]);

  const handleLinkClick = useCallback((path: string, anchor?: string) => {
    navigateToSection(navigate, path, anchor);
  }, [navigate]);

  return (
    <FooterSection ref={ref}>
      <FooterGlow
        style={{ top: '-30%', left: '-10%' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <FooterGlow
        style={{ bottom: '-30%', right: '-10%' }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.8, 0.5, 0.8],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <Container>
        <FooterTop
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <CTAText>Ready to protect your property?</CTAText>
          <CTAButton
            onClick={handleCTAClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </CTAButton>
        </FooterTop>

        <Newsletter
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <NewsletterContent>
            <NewsletterTitle>Stay Updated</NewsletterTitle>
            <NewsletterText>Get the latest news and updates about Aerilux technology.</NewsletterText>
          </NewsletterContent>
          <NewsletterForm>
            <NewsletterInput placeholder="Enter your email" type="email" />
            <SubscribeButton
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </SubscribeButton>
          </NewsletterForm>
        </Newsletter>

        <FooterContent>
          <BrandSection
            variants={itemVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <Logo to="/">
              <LogoImg 
                src={logoSolid} 
                alt="Aerilux Logo"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              />
              <LogoText>AERILUX</LogoText>
            </Logo>
            <BrandTagline>
              Pioneering AI-powered solutions for a cleaner, pigeon-free future. 
              Keep it clean with Aerilux.
            </BrandTagline>
          </BrandSection>

          <FooterColumn variants={itemVariants}>
            <ColumnTitle>Product</ColumnTitle>
            <ColumnLinks>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/product"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/product');
                  }}
                >
                  Aerilux Pro
                </StyledLink>
              </ColumnLink>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/product#features"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/product', 'features');
                  }}
                >
                  Features
                </StyledLink>
              </ColumnLink>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/product#specs"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/product', 'specs');
                  }}
                >
                  Specifications
                </StyledLink>
              </ColumnLink>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/', 'pricing');
                  }}
                >
                  Pricing
                </StyledLink>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>

          <FooterColumn variants={itemVariants}>
            <ColumnTitle>Support</ColumnTitle>
            <ColumnLinks>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/contact');
                  }}
                >
                  Contact Us
                </StyledLink>
              </ColumnLink>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/contact#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/contact', 'faq');
                  }}
                >
                  FAQ
                </StyledLink>
              </ColumnLink>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/contact#installation"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/contact', 'installation');
                  }}
                >
                  Installation Guide
                </StyledLink>
              </ColumnLink>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/contact#warranty"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/contact', 'warranty');
                  }}
                >
                  Warranty
                </StyledLink>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>

          <FooterColumn variants={itemVariants}>
            <ColumnTitle>Company</ColumnTitle>
            <ColumnLinks>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/about');
                  }}
                >
                  About Us
                </StyledLink>
              </ColumnLink>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/about#team"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/about', 'team');
                  }}
                >
                  Our Team
                </StyledLink>
              </ColumnLink>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/about#mission"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/about', 'mission');
                  }}
                >
                  Mission
                </StyledLink>
              </ColumnLink>
              <ColumnLink whileHover={{ x: 5 }}>
                <StyledLink 
                  to="/contact#careers"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick('/contact', 'careers');
                  }}
                >
                  Careers
                </StyledLink>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>
        </FooterContent>

        <FooterBottom
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Copyright>
            © {currentYear} Aerilux. All rights reserved.
          </Copyright>
          <LegalLinks>
            <LegalLink to="/privacy">Privacy Policy</LegalLink>
            <LegalLink to="/terms">Terms of Service</LegalLink>
          </LegalLinks>
        </FooterBottom>
      </Container>
    </FooterSection>
  );
});

Footer.displayName = 'Footer';

export default Footer;
