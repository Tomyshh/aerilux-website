import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProductPageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageGallery = styled.div`
  position: sticky;
  top: 100px;
`;

const MainImage = styled(motion.div)`
  aspect-ratio: 1;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #333333;
  font-weight: 800;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
`;

const Thumbnail = styled(motion.div)<{ active: boolean }>`
  aspect-ratio: 1;
  background: #1a1a1a;
  border-radius: 10px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#ffffff' : 'transparent'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: #333333;
`;

const ProductInfo = styled.div``;

const ProductTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
`;

const ProductSubtitle = styled.p`
  font-size: 1.5rem;
  color: #999999;
  margin-bottom: 2rem;
`;

const PricingSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PricingTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const PricingHighlight = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const PricingDescription = styled.p`
  font-size: 1rem;
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  color: #cccccc;
  margin-bottom: 3rem;
`;

const SpecsSection = styled.div`
  margin-bottom: 3rem;
`;

const SpecsTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SpecsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const SpecItem = styled.div`
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
`;

const SpecLabel = styled.div`
  font-size: 0.9rem;
  color: #999999;
  margin-bottom: 0.5rem;
`;

const SpecValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
`;

const FeaturesSection = styled.div`
  margin-bottom: 3rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
`;

const FeatureItem = styled.li`
  padding: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: '✓';
    color: #3B9EFF;
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AddToCartButton = styled(motion.button)`
  flex: 1;
  background-color: #ffffff;
  color: #000000;
  padding: 1.25rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
  }
`;

const BuyNowButton = styled(motion.button)`
  flex: 1;
  background-color: transparent;
  color: #ffffff;
  padding: 1.25rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  border: 2px solid #ffffff;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ffffff;
    color: #000000;
  }
`;

const ShippingInfo = styled.div`
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
`;

const ShippingItem = styled.div`
  flex: 1;
  text-align: center;
`;

const ShippingIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ShippingText = styled.div`
  font-size: 0.9rem;
  color: #cccccc;
`;

const ProductPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  const images = useMemo(() => [
    'MAIN IMAGE',
    'ANGLE 1',
    'ANGLE 2',
    'ANGLE 3',
  ], []);

  const specs = useMemo(() => [
    { label: 'Dimensions', value: '12" x 8" x 4"' },
    { label: 'Weight', value: '2.5 lbs (1.1 kg)' },
    { label: 'Power', value: 'Solar + Battery' },
    { label: 'Coverage', value: '360° / 50ft radius' },
    { label: 'Weather Rating', value: 'IP67' },
    { label: 'Warranty', value: '2 Years' },
  ], []);

  const features = useMemo(() => [
    'AI-powered pigeon detection with 99.9% accuracy',
    'Humane deterrent using sound and light patterns',
    'Solar-powered with 30-day battery backup',
    'Weather-resistant construction (IP67 rated)',
    'Mobile app for remote monitoring and control',
    'Easy installation - no wiring required',
    'Silent operation mode available',
    'Automatic learning and adaptation to local bird behavior',
  ], []);

  const handleImageSelect = useCallback((index: number) => {
    setSelectedImage(index);
  }, []);

  const handleNavigateToContact = useCallback(() => {
    navigate('/contact');
  }, [navigate]);

  return (
    <ProductPageContainer>
      <Container>
        <ProductGrid>
          <ImageGallery>
            <MainImage>
              {images[selectedImage]}
            </MainImage>
            <ThumbnailGrid>
              {images.map((image, index) => (
                <Thumbnail
                  key={index}
                  active={selectedImage === index}
                  onClick={() => handleImageSelect(index)}
                >
                  {image}
                </Thumbnail>
              ))}
            </ThumbnailGrid>
          </ImageGallery>

          <ProductInfo>
            <ProductTitle>{t('productPage.title')}</ProductTitle>
            <ProductSubtitle>{t('productPage.subtitle')}</ProductSubtitle>
            
            <PricingSection>
              <PricingTitle>{t('productPage.enterprise.title')}</PricingTitle>
              {t('productPage.enterprise.price') && (
                <PricingHighlight>{t('productPage.enterprise.price')}</PricingHighlight>
              )}
              <PricingDescription>
                {t('productPage.enterprise.description1')}
              </PricingDescription>
              <PricingDescription>
                {t('productPage.enterprise.description2')}
              </PricingDescription>
            </PricingSection>
            
            <Description>
              {t('productPage.description')}
            </Description>

            <ActionButtons>
              <AddToCartButton onClick={handleNavigateToContact}>
                {t('product.enterprise.button')}
              </AddToCartButton>
              <BuyNowButton onClick={handleNavigateToContact}>
                {t('pricing.contactSales')}
              </BuyNowButton>
            </ActionButtons>

            <ShippingInfo>
              <ShippingItem>
                <ShippingIcon>🚚</ShippingIcon>
                <ShippingText>Free Shipping</ShippingText>
              </ShippingItem>
              <ShippingItem>
                <ShippingIcon>📦</ShippingIcon>
                <ShippingText>Ships in 2-3 days</ShippingText>
              </ShippingItem>
              <ShippingItem>
                <ShippingIcon>↩️</ShippingIcon>
                <ShippingText>30-day returns</ShippingText>
              </ShippingItem>
            </ShippingInfo>

            <SpecsSection id="specs">
              <SpecsTitle>{t('productPage.specs.title')}</SpecsTitle>
              <SpecsList>
                {specs.map((spec, index) => (
                  <SpecItem key={index}>
                    <SpecLabel>{spec.label}</SpecLabel>
                    <SpecValue>{spec.value}</SpecValue>
                  </SpecItem>
                ))}
              </SpecsList>
            </SpecsSection>

            <FeaturesSection id="features">
              <SpecsTitle>{t('productPage.specs.features.title')}</SpecsTitle>
              <FeaturesList>
                {features.map((feature, index) => (
                  <FeatureItem key={index}>{feature}</FeatureItem>
                ))}
              </FeaturesList>
            </FeaturesSection>
          </ProductInfo>
        </ProductGrid>
      </Container>
    </ProductPageContainer>
  );
};

export default ProductPage; 