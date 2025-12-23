import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';

const ConfirmationContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ConfirmationCard = styled(motion.div)`
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 30px;
  padding: 4rem;
  text-align: center;
`;

const SuccessIcon = styled(motion.div)`
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: rgba(59, 158, 255, 0.15);
  border: 2px solid rgba(59, 158, 255, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #3B9EFF;

  svg {
    width: 44px;
    height: 44px;
    stroke-width: 2.2;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #999999;
  margin-bottom: 3rem;
`;

const OrderDetails = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 3rem;
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #999999;
`;

const DetailValue = styled.span`
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const PrimaryButton = styled(motion.button)`
  background-color: #ffffff;
  color: #000000;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
  }
`;

const SecondaryButton = styled(motion.button)`
  background-color: transparent;
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid #ffffff;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #ffffff;
    color: #000000;
  }
`;

const EmailNotice = styled.p`
  margin-top: 3rem;
  font-size: 0.9rem;
  color: #666666;
`;

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <ConfirmationContainer>
      <ConfirmationCard
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <SuccessIcon
          variants={iconVariants}
          initial="hidden"
          animate="visible"
        >
          <Check aria-hidden="true" />
        </SuccessIcon>
        
        <Title>Order Confirmed!</Title>
        <Subtitle>Thank you for your purchase</Subtitle>
        
        <OrderDetails>
          <DetailRow>
            <DetailLabel>Order Number</DetailLabel>
            <DetailValue>#{orderId || 'AER-2024-001'}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Estimated Delivery</DetailLabel>
            <DetailValue>2-3 Business Days</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Shipping Method</DetailLabel>
            <DetailValue>Express Shipping (Free)</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>Payment Status</DetailLabel>
            <DetailValue>Paid</DetailValue>
          </DetailRow>
        </OrderDetails>
        
        <ActionButtons>
          <PrimaryButton onClick={() => navigate('/')}>
            Continue Shopping
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/product')}>
            View Product
          </SecondaryButton>
        </ActionButtons>
        
        <EmailNotice>
          A confirmation email has been sent to your email address with tracking information.
        </EmailNotice>
      </ConfirmationCard>
    </ConfirmationContainer>
  );
};

export default OrderConfirmationPage; 