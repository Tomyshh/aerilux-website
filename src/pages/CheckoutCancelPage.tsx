import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { trackSelectContent } from '../services/analytics';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled(motion.div)`
  max-width: 720px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
`;

const Text = styled.p`
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const OrderBox = styled.div`
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled(motion.button)<{ $variant: 'primary' | 'secondary' }>`
  background: ${p => (p.$variant === 'primary' ? '#ffffff' : 'transparent')};
  color: ${p => (p.$variant === 'primary' ? '#000000' : '#ffffff')};
  border: ${p => (p.$variant === 'primary' ? 'none' : '2px solid rgba(255,255,255,0.8)')};
  padding: 0.9rem 1.4rem;
  border-radius: 999px;
  font-weight: 700;
`;

const CheckoutCancelPage: React.FC = () => {
  const navigate = useNavigate();

  const orderNumber = useMemo(() => {
    try {
      return localStorage.getItem('orderNumber') || localStorage.getItem('lastOrderNumber');
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    void trackSelectContent({ contentType: 'checkout_return_cancel', location: 'checkout_cancel' });
  }, []);

  return (
    <Container>
      <Card initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Title>Paiement annulé</Title>
        <Text>Vous pouvez réessayer quand vous voulez. Votre panier a été conservé.</Text>

        {orderNumber && (
          <OrderBox>
            <strong>Dernier numéro de commande :</strong> {orderNumber}
          </OrderBox>
        )}

        <Row>
          <Button
            $variant="primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              void trackSelectContent({ contentType: 'checkout_cancel_retry', location: 'checkout_cancel' });
              navigate('/checkout');
            }}
          >
            Réessayer
          </Button>
          <Button
            $variant="secondary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              void trackSelectContent({ contentType: 'checkout_cancel_go_cart', location: 'checkout_cancel' });
              navigate('/cart');
            }}
          >
            Voir le panier
          </Button>
        </Row>
      </Card>
    </Container>
  );
};

export default CheckoutCancelPage;

