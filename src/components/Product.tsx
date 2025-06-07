import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ProductSection = styled.section`
  padding: 8rem 2rem;
  background-color: #000000;
  color: #ffffff;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageWrapper = styled(motion.div)`
  position: relative;
  aspect-ratio: 1;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5);
  
  &::before {
    content: 'PRODUCT IMAGE';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #333333;
    font-weight: 800;
    letter-spacing: 0.1em;
  }
`;

const ProductContent = styled(motion.div)``;

const ProductTag = styled.p`
  font-size: 0.9rem;
  color: #999999;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
`;

const ProductTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  line-height: 1.1;
`;

const ProductDescription = styled.p`
  font-size: 1.2rem;
  color: #cccccc;
  line-height: 1.8;
  margin-bottom: 2rem;
`;

const SpecsList = styled.ul`
  list-style: none;
  margin-bottom: 3rem;
`;

const SpecItem = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SpecIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const SpecText = styled.div`
  flex: 1;
`;

const SpecTitle = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
`;

const SpecValue = styled.p`
  font-size: 0.9rem;
  color: #999999;
`;

const PricingInfo = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PricingTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffffff;
`;

const PricingDescription = styled.p`
  font-size: 1rem;
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PricingHighlight = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const CTAButton = styled(motion.button)`
  background-color: #ffffff;
  color: #000000;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
  }
`;

const specs = [
  {
    icon: '📏',
    title: 'Dimensions',
    value: '12" x 8" x 4" (30cm x 20cm x 10cm)',
  },
  {
    icon: '⚖️',
    title: 'Weight',
    value: '2.5 lbs (1.1 kg)',
  },
  {
    icon: '🔋',
    title: 'Battery Life',
    value: 'Up to 30 days on a single charge',
  },
  {
    icon: '📡',
    title: 'Range',
    value: '360° coverage, 50ft (15m) radius',
  },
];

const Product: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <ProductSection id="product" ref={ref}>
      <Container>
        <ProductGrid>
          <ProductImageWrapper
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          />
          
          <ProductContent
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <motion.div variants={itemVariants}>
              <ProductTag>The Device</ProductTag>
              <ProductTitle>Aerilux Pro</ProductTitle>
              <ProductDescription>
                Engineered with precision and powered by advanced AI, the Aerilux Pro 
                is the ultimate solution for pigeon control. Its sleek design seamlessly 
                integrates with any architecture while providing unmatched protection.
              </ProductDescription>
            </motion.div>

            <SpecsList>
              {specs.map((spec, index) => (
                <SpecItem key={index} variants={itemVariants}>
                  <SpecIcon>{spec.icon}</SpecIcon>
                  <SpecText>
                    <SpecTitle>{spec.title}</SpecTitle>
                    <SpecValue>{spec.value}</SpecValue>
                  </SpecText>
                </SpecItem>
              ))}
            </SpecsList>

            <PricingInfo variants={itemVariants}>
              <PricingTitle>Custom Enterprise Solution</PricingTitle>
              <PricingDescription>
                Every Aerilux system is completely customized to meet your specific business needs. 
                Our team works closely with you to design the perfect solution for your property, 
                industry requirements, and operational goals.
              </PricingDescription>
              <PricingHighlight>Starting from $499</PricingHighlight>
              <PricingDescription>
                Final pricing depends on system complexity, number of units, installation requirements, 
                and ongoing support needs. Contact our sales team for a personalized quote.
              </PricingDescription>
            </PricingInfo>

            <motion.div variants={itemVariants}>
              <CTAButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Custom Quote
              </CTAButton>
            </motion.div>
          </ProductContent>
        </ProductGrid>
      </Container>
    </ProductSection>
  );
};

export default Product; 