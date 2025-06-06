import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import logoSolid from '../utils/IconOnly_Transparent_NoBuffer.png';

const FooterSection = styled.footer`
  padding: 4rem 2rem 2rem;
  background-color: #000000;
  color: #ffffff;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const BrandSection = styled.div``;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const LogoImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const LogoText = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
`;

const BrandTagline = styled.p`
  color: #999999;
  margin-bottom: 1.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled(motion.a)`
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ffffff;
    color: #000000;
  }
`;

const FooterColumn = styled.div``;

const ColumnTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ColumnLinks = styled.ul`
  list-style: none;
`;

const ColumnLink = styled.li`
  margin-bottom: 0.75rem;
`;

const Link = styled.a`
  color: #999999;
  transition: color 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    color: #ffffff;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Copyright = styled.p`
  color: #999999;
  font-size: 0.9rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterSection>
      <Container>
        <FooterContent>
          <BrandSection>
            <Logo>
              <LogoImg src={logoSolid} alt="Aerilux Logo" />
              <LogoText>AERILUX</LogoText>
            </Logo>
            <BrandTagline>Keep It Clean</BrandTagline>
            <SocialLinks>
              <SocialLink
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                𝕏
              </SocialLink>
              <SocialLink
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                in
              </SocialLink>
              <SocialLink
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                f
              </SocialLink>
            </SocialLinks>
          </BrandSection>

          <FooterColumn>
            <ColumnTitle>Product</ColumnTitle>
            <ColumnLinks>
              <ColumnLink>
                <Link href="#features">Features</Link>
              </ColumnLink>
              <ColumnLink>
                <Link href="#technology">Technology</Link>
              </ColumnLink>
              <ColumnLink>
                <Link href="#pricing">Pricing</Link>
              </ColumnLink>
              <ColumnLink>
                <Link href="#">Specifications</Link>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Support</ColumnTitle>
            <ColumnLinks>
              <ColumnLink>
                <Link href="#">Documentation</Link>
              </ColumnLink>
              <ColumnLink>
                <Link href="#">Installation Guide</Link>
              </ColumnLink>
              <ColumnLink>
                <Link href="#">FAQ</Link>
              </ColumnLink>
              <ColumnLink>
                <Link href="#">Contact</Link>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>

          <FooterColumn>
            <ColumnTitle>Company</ColumnTitle>
            <ColumnLinks>
              <ColumnLink>
                <Link href="#">About Us</Link>
              </ColumnLink>
              <ColumnLink>
                <Link href="#">Patents</Link>
              </ColumnLink>
              <ColumnLink>
                <Link href="#">Press</Link>
              </ColumnLink>
              <ColumnLink>
                <Link href="#">Careers</Link>
              </ColumnLink>
            </ColumnLinks>
          </FooterColumn>
        </FooterContent>

        <FooterBottom>
          <Copyright>
            © {currentYear} Aerilux. All rights reserved.
          </Copyright>
          <LegalLinks>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </LegalLinks>
        </FooterBottom>
      </Container>
    </FooterSection>
  );
};

export default Footer; 