import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Ruler, Scale, Battery, Radar } from 'lucide-react';
import { RevealText } from './effects/AnimatedText';
import MagneticButton from './effects/MagneticButton';

const ProductSection = styled.section`
  padding: 10rem 2rem;
  background-color: #000000;
  color: #ffffff;
  position: relative;
  overflow: hidden;
`;

const GlowBackground = styled(motion.div)`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 158, 255, 0.12) 0%, transparent 60%);
  filter: blur(60px);
  z-index: 0;
  will-change: transform, opacity;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  
  @media (max-width: 992px) {
    gap: 3rem;
  }
`;

const ProductImageSection = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

const ProductInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ProductImageWrapper = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.6);
  
  @media (max-width: 768px) {
    aspect-ratio: 4 / 3;
    border-radius: 20px;
  }
`;

const ProductImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.1) 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
  pointer-events: none;
`;

const ImageGlow = styled(motion.div)`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(59, 158, 255, 0.2),
    transparent,
    rgba(59, 158, 255, 0.15),
    transparent
  );
  animation: rotateGlow 10s linear infinite;
  z-index: -1;
  
  @keyframes rotateGlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ProductContent = styled(motion.div)``;

const ProductTag = styled(motion.span)`
  display: inline-block;
  font-size: 0.85rem;
  color: #3B9EFF;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 158, 255, 0.1);
  border-radius: 50px;
  border: 1px solid rgba(59, 158, 255, 0.3);
`;

const ProductTitle = styled.h2`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 2rem;
  line-height: 1.1;
  background: linear-gradient(135deg, #ffffff 0%, #666666 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ProductDescription = styled(motion.p)`
  font-size: 1.2rem;
  color: #999999;
  line-height: 1.9;
  margin-bottom: 3rem;
`;

const SpecsList = styled.ul`
  list-style: none;
  margin-bottom: 3rem;
`;

const SpecItem = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SpecIcon = styled(motion.div)`
  width: 50px;
  height: 50px;
  background: rgba(59, 158, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3B9EFF;
  border: 1px solid rgba(59, 158, 255, 0.28);

  svg {
    width: 22px;
    height: 22px;
    stroke-width: 1.9;
  }
`;

const SpecText = styled.div`
  flex: 1;
`;

const SpecTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
`;

const SpecValue = styled.p`
  font-size: 0.9rem;
  color: #666666;
`;

const PricingInfo = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  margin: 2.5rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
`;

const PricingTitle = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #ffffff;
  font-weight: 700;
`;

const PricingDescription = styled.p`
  font-size: 1rem;
  color: #999999;
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const PricingHighlight = styled(motion.p)`
  font-size: 2rem;
  font-weight: 800;
  color: #3B9EFF;
  margin-bottom: 0.5rem;
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  color: #000000;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(255, 255, 255, 0.2);
  
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
`;

const Product: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const specs = useMemo(() => [
    {
      icon: <Ruler aria-hidden="true" />,
      title: t('product.dimensions.title'),
      value: t('product.dimensions.value'),
    },
    {
      icon: <Scale aria-hidden="true" />,
      title: t('product.weight.title'),
      value: t('product.weight.value'),
    },
    {
      icon: <Battery aria-hidden="true" />,
      title: t('product.battery.title'),
      value: t('product.battery.value'),
    },
    {
      icon: <Radar aria-hidden="true" />,
      title: t('product.range.title'),
      value: t('product.range.value'),
    },
  ], [t]);

  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }), []);

  const handleNavigateToContact = useCallback(() => {
    navigate('/contact');
  }, [navigate]);

  return (
    <ProductSection id="product">
      <GlowBackground
        style={{ top: '0%', right: '-20%' }}
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
      
      <Container ref={ref}>
        <ProductGrid>
          {/* Section Header */}
          <ProductContent
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{ textAlign: 'center', marginBottom: '2rem' }}
          >
            <ProductTag variants={itemVariants}>{t('product.tag')}</ProductTag>
            <RevealText delay={0.2}>
              <ProductTitle>{t('product.title')}</ProductTitle>
            </RevealText>
            <ProductDescription variants={itemVariants} style={{ maxWidth: '800px', margin: '0 auto' }}>
              {t('product.description')}
            </ProductDescription>
          </ProductContent>

          {/* Full Width Image */}
          <ProductImageSection>
            <ProductImageWrapper
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, ease: [0.6, -0.05, 0.01, 0.99] }}
              whileHover={{ scale: 1.02 }}
            >
              <ImageGlow />
              <ProductImage
                src="/exploded-view.jpeg"
                alt="Aerilux Pro - Exploded View"
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
              <ImageOverlay />
            </ProductImageWrapper>
          </ProductImageSection>

          {/* Info Grid */}
          <ProductInfoGrid>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <SpecsList>
                {specs.map((spec, index) => (
                  <SpecItem key={index} variants={itemVariants}>
                    <SpecIcon
                      whileHover={{ scale: 1.06 }}
                      transition={{ duration: 0.3 }}
                    >
                      {spec.icon}
                    </SpecIcon>
                    <SpecText>
                      <SpecTitle>{spec.title}</SpecTitle>
                      <SpecValue>{spec.value}</SpecValue>
                    </SpecText>
                  </SpecItem>
                ))}
              </SpecsList>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <PricingInfo variants={itemVariants}>
                <PricingTitle>{t('product.enterprise.title')}</PricingTitle>
                <PricingDescription>
                  {t('product.enterprise.description')}
                </PricingDescription>
                <PricingHighlight>
                  {t('product.enterprise.price')}
                </PricingHighlight>
                <PricingDescription>
                  {t('product.enterprise.contact')}
                </PricingDescription>
              </PricingInfo>

              <motion.div variants={itemVariants} style={{ marginTop: '2rem' }}>
                <MagneticButton onClick={handleNavigateToContact}>
                  <CTAButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('product.enterprise.button')}
                  </CTAButton>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </ProductInfoGrid>
        </ProductGrid>
      </Container>
    </ProductSection>
  );
});

Product.displayName = 'Product';

export default Product;
