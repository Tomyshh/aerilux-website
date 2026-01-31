import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, ChevronLeft, ChevronRight, Package, Truck, Shield, Calendar } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { ANALYTICS_CURRENCY, trackEvent, trackSelectContent } from '../services/analytics';

const PRODUCT_ITEM = {
  item_id: 'aerilux-starter-pack',
  item_name: 'Aerilux Starter Pack',
  item_category: 'product',
  price: 1200,
} as const;

const ProductPageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: #000000;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const ImageGallery = styled.div`
  position: sticky;
  top: 100px;
  
  @media (max-width: 992px) {
    position: relative;
    top: 0;
  }
`;

const MainImageContainer = styled(motion.div)`
  aspect-ratio: 4/3;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 1rem;
  cursor: zoom-in;
  position: relative;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    pointer-events: none;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
`;

const Thumbnail = styled(motion.div)<{ $active: boolean }>`
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  background: #0a0a0a;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 12px;
    border: 2px solid ${props => props.$active ? '#ffffff' : 'transparent'};
    transition: all 0.3s ease;
    pointer-events: none;
  }
  
  &:hover::after {
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.className?.includes('active') ? 1 : 0.7};
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Badge = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #3B9EFF;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 0.6rem 1.2rem;
  background: rgba(59, 158, 255, 0.1);
  border-radius: 50px;
  border: 1px solid rgba(59, 158, 255, 0.3);
  width: fit-content;
`;

const ProductTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(135deg, #ffffff 0%, #999999 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ProductSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: #888888;
  line-height: 1.6;
`;

const DeliveryBanner = styled(motion.div)`
  background: linear-gradient(135deg, rgba(59, 158, 255, 0.15) 0%, rgba(59, 158, 255, 0.05) 100%);
  border: 1px solid rgba(59, 158, 255, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DeliveryIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(59, 158, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3B9EFF;
`;

const DeliveryText = styled.div`
  flex: 1;
`;

const DeliveryTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.25rem;
`;

const DeliverySubtext = styled.p`
  font-size: 0.9rem;
  color: #888888;
`;

const PricingCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2rem;
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

const PricingLabel = styled.span`
  font-size: 0.85rem;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0.75rem 0;
`;

const Price = styled.span`
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
`;

const PriceNote = styled.span`
  font-size: 1rem;
  color: #666666;
`;

const PricingDescription = styled.p`
  font-size: 0.95rem;
  color: #888888;
  line-height: 1.6;
  margin-top: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(motion.button)`
  flex: 1;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  color: #000000;
  padding: 1.25rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 10px 40px rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 50px rgba(255, 255, 255, 0.25);
  }
`;

const SecondaryButton = styled(motion.button)`
  flex: 1;
  background: transparent;
  color: #ffffff;
  padding: 1.25rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const FeatureIcon = styled.div`
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3B9EFF;
`;

const FeatureText = styled.span`
  font-size: 0.9rem;
  color: #cccccc;
`;

// Lightbox styles
const LightboxOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.98);
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
`;

const LightboxContent = styled(motion.div)`
  position: relative;
  width: 90vw;
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LightboxImage = styled(motion.img)`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
`;

const LightboxClose = styled(motion.button)`
  position: fixed;
  top: 6rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  z-index: 10002;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const LightboxNav = styled(motion.button)<{ $direction: 'left' | 'right' }>`
  position: fixed;
  ${props => props.$direction}: 2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  z-index: 10002;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-50%) scale(1.1);
  }
`;

const LightboxCounter = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  z-index: 10002;
`;

const LightboxThumbnails = styled.div`
  position: fixed;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10002;
`;

const LightboxThumb = styled.div<{ $active: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  opacity: ${props => props.$active ? 1 : 0.5};
  border: 2px solid ${props => props.$active ? '#ffffff' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 1;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const IncludesSection = styled.div`
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #ffffff;
`;

const IncludesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const IncludesCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2rem;
  
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    color: #888888;
    line-height: 1.6;
  }
`;

const ProductPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const images = [
    '/product/pres1.jpeg',
    '/product/pres2.jpeg',
    '/product/pres3.jpeg',
    '/product/pres4.jpeg',
    '/product/pres5.jpeg',
  ];

  const handleImageSelect = useCallback((index: number) => {
    setSelectedImage(index);
    void trackSelectContent({
      contentType: 'product_image_select',
      itemId: PRODUCT_ITEM.item_id,
      itemName: `${PRODUCT_ITEM.item_name} - image_${index + 1}`,
      location: 'product_page',
    });
  }, []);

  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
    void trackSelectContent({
      contentType: 'product_image_zoom',
      itemId: PRODUCT_ITEM.item_id,
      itemName: PRODUCT_ITEM.item_name,
      location: 'product_page',
    });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback(() => {
    setSelectedImage(prev => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setSelectedImage(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  // GA4 ecommerce: view_item
  useEffect(() => {
    void trackEvent('view_item', {
      currency: ANALYTICS_CURRENCY,
      value: PRODUCT_ITEM.price,
      items: [PRODUCT_ITEM],
    });
  }, []);

  const features = [
    { icon: <Package size={18} />, text: t('productPage.starterPack.features.complete') },
    { icon: <Shield size={18} />, text: t('productPage.starterPack.features.warranty') },
    { icon: <Truck size={18} />, text: t('productPage.starterPack.features.shipping') },
    { icon: <Calendar size={18} />, text: t('productPage.starterPack.features.support') },
  ];

  const includes = [
    {
      title: t('productPage.starterPack.includes.unit.title'),
      description: t('productPage.starterPack.includes.unit.description')
    },
    {
      title: t('productPage.starterPack.includes.mounting.title'),
      description: t('productPage.starterPack.includes.mounting.description')
    },
    {
      title: t('productPage.starterPack.includes.solar.title'),
      description: t('productPage.starterPack.includes.solar.description')
    },
    {
      title: t('productPage.starterPack.includes.app.title'),
      description: t('productPage.starterPack.includes.app.description')
    },
  ];

  return (
    <ProductPageContainer>
      <Container>
        <ProductGrid>
          <ImageGallery>
            <MainImageContainer
              onClick={openLightbox}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <MainImage 
                src={images[selectedImage]} 
                alt={`Aerilux Starter Pack - Vue ${selectedImage + 1}`}
              />
            </MainImageContainer>
            <ThumbnailGrid>
              {images.map((image, index) => (
                <Thumbnail
                  key={index}
                  $active={selectedImage === index}
                  onClick={() => handleImageSelect(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbnailImage 
                    src={image} 
                    alt={`Miniature ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                  />
                </Thumbnail>
              ))}
            </ThumbnailGrid>
          </ImageGallery>

          <ProductInfo>
            <Badge
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Calendar size={14} />
              {t('productPage.starterPack.badge')}
            </Badge>

            <ProductTitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t('productPage.starterPack.title')}
            </ProductTitle>

            <ProductSubtitle
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('productPage.starterPack.subtitle')}
            </ProductSubtitle>

            <DeliveryBanner
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <DeliveryIcon>
                <Truck size={24} />
              </DeliveryIcon>
              <DeliveryText>
                <DeliveryTitle>{t('productPage.starterPack.deliveryTitle')}</DeliveryTitle>
                <DeliverySubtext>{t('productPage.starterPack.deliverySubtitle')}</DeliverySubtext>
              </DeliveryText>
            </DeliveryBanner>

            <PricingCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <PricingLabel>{t('productPage.starterPack.priceLabel')}</PricingLabel>
              <PriceContainer>
                <Price>{t('productPage.starterPack.price')}</Price>
                <PriceNote>{t('productPage.starterPack.priceCurrency')}</PriceNote>
              </PriceContainer>
              <PricingDescription>
                {t('productPage.starterPack.priceNote')}
              </PricingDescription>
            </PricingCard>

            <ButtonGroup>
              <PrimaryButton
                onClick={() => {
                  addToCart({
                    planId: PRODUCT_ITEM.item_id,
                    planName: PRODUCT_ITEM.item_name,
                    price: PRODUCT_ITEM.price,
                  });
                  navigate('/checkout');
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Package size={20} />
                {t('productPage.starterPack.preorderButton')}
              </PrimaryButton>
              <SecondaryButton
                onClick={() => {
                  void trackSelectContent({
                    contentType: 'product_learn_more',
                    itemId: PRODUCT_ITEM.item_id,
                    itemName: PRODUCT_ITEM.item_name,
                    location: 'product_page',
                  });
                  navigate('/contact');
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('productPage.starterPack.learnMoreButton')}
              </SecondaryButton>
            </ButtonGroup>

            <FeaturesGrid>
              {features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <FeatureText>{feature.text}</FeatureText>
                </FeatureItem>
              ))}
            </FeaturesGrid>
          </ProductInfo>
        </ProductGrid>

        <IncludesSection>
          <SectionTitle>{t('productPage.starterPack.includesTitle')}</SectionTitle>
          <IncludesGrid>
            {includes.map((item, index) => (
              <IncludesCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </IncludesCard>
            ))}
          </IncludesGrid>
        </IncludesSection>
      </Container>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <LightboxClose
              onClick={closeLightbox}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={24} />
            </LightboxClose>

            <LightboxNav
              $direction="left"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={28} />
            </LightboxNav>

            <LightboxContent onClick={(e) => e.stopPropagation()}>
              <LightboxImage
                key={selectedImage}
                src={images[selectedImage]}
                alt={`Aerilux Starter Pack - Vue ${selectedImage + 1}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              />
            </LightboxContent>

            <LightboxNav
              $direction="right"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={28} />
            </LightboxNav>

            <LightboxThumbnails onClick={(e) => e.stopPropagation()}>
              {images.map((image, index) => (
                <LightboxThumb
                  key={index}
                  $active={selectedImage === index}
                  onClick={() => handleImageSelect(index)}
                >
                  <img src={image} alt={`Miniature ${index + 1}`} />
                </LightboxThumb>
              ))}
            </LightboxThumbnails>

            <LightboxCounter>
              {selectedImage + 1} / {images.length}
            </LightboxCounter>
          </LightboxOverlay>
        )}
      </AnimatePresence>
    </ProductPageContainer>
  );
};

export default ProductPage;
