import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const CartPageContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 3rem;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div``;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem;
`;

const EmptyCartIcon = styled.div`
  color: #3B9EFF;
  margin-bottom: 1rem;

  svg {
    width: 56px;
    height: 56px;
    stroke-width: 1.6;
  }
`;

const EmptyCartText = styled.p`
  font-size: 1.5rem;
  color: #999999;
  margin-bottom: 2rem;
`;

const ContinueShoppingButton = styled(motion.button)`
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

const CartItem = styled(motion.div)`
  display: grid;
  grid-template-columns: 150px 1fr auto;
  gap: 2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  margin-bottom: 1rem;
`;

const ItemImage = styled.div`
  aspect-ratio: 1;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333333;
  font-weight: 600;
`;

const ItemDetails = styled.div``;

const ItemName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.p`
  font-size: 1.25rem;
  color: #999999;
  margin-bottom: 1rem;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Quantity = styled.span`
  font-size: 1.2rem;
  min-width: 40px;
  text-align: center;
`;

const RemoveButton = styled(motion.button)`
  color: #ff3b30;
  background: none;
  font-size: 0.9rem;
  margin-top: 1rem;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.7;
  }
`;

const ItemTotal = styled.div`
  text-align: right;
`;

const ItemTotalPrice = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
`;

const OrderSummary = styled.div`
  position: sticky;
  top: 100px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  height: fit-content;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SummaryLabel = styled.span`
  color: #999999;
`;

const SummaryValue = styled.span`
  font-weight: 600;
`;

const TotalRow = styled(SummaryRow)`
  border-bottom: none;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  margin-top: 1rem;
  padding-top: 1.5rem;
`;

const TotalLabel = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
`;

const CheckoutButton = styled(motion.button)`
  width: 100%;
  background-color: #ffffff;
  color: #000000;
  padding: 1.25rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.3);
  }
`;

const PromoCode = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const PromoInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  margin-top: 0.5rem;
  
  &::placeholder {
    color: #666666;
  }
`;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <CartPageContainer>
        <Container>
          <PageTitle>Shopping Cart</PageTitle>
          <EmptyCart>
            <EmptyCartIcon>
              <ShoppingCart aria-hidden="true" />
            </EmptyCartIcon>
            <EmptyCartText>Your cart is empty</EmptyCartText>
            <ContinueShoppingButton
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Shopping
            </ContinueShoppingButton>
          </EmptyCart>
        </Container>
      </CartPageContainer>
    );
  }

  return (
    <CartPageContainer>
      <Container>
        <PageTitle>Shopping Cart ({getTotalItems()} items)</PageTitle>
        <CartContent>
          <CartItems>
            {items.map((item) => (
              <CartItem
                key={item.planId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <ItemImage>PRODUCT</ItemImage>
                <ItemDetails>
                  <ItemName>{item.planName}</ItemName>
                  <ItemPrice>${item.price}</ItemPrice>
                  <QuantityControls>
                    <QuantityButton
                      onClick={() => updateQuantity(item.planId, item.quantity - 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      -
                    </QuantityButton>
                    <Quantity>{item.quantity}</Quantity>
                    <QuantityButton
                      onClick={() => updateQuantity(item.planId, item.quantity + 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      +
                    </QuantityButton>
                  </QuantityControls>
                  <RemoveButton
                    onClick={() => removeFromCart(item.planId)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remove
                  </RemoveButton>
                </ItemDetails>
                <ItemTotal>
                  <ItemTotalPrice>${(item.price * item.quantity).toFixed(2)}</ItemTotalPrice>
                </ItemTotal>
              </CartItem>
            ))}
          </CartItems>

          <OrderSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            <SummaryRow>
              <SummaryLabel>Subtotal</SummaryLabel>
              <SummaryValue>${subtotal.toFixed(2)}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Shipping</SummaryLabel>
              <SummaryValue>FREE</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Tax</SummaryLabel>
              <SummaryValue>${tax.toFixed(2)}</SummaryValue>
            </SummaryRow>
            <TotalRow>
              <TotalLabel>Total</TotalLabel>
              <TotalValue>${total.toFixed(2)}</TotalValue>
            </TotalRow>
            
            <CheckoutButton
              onClick={() => navigate('/checkout')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Proceed to Checkout
            </CheckoutButton>

            <PromoCode>
              <SummaryLabel>Promo Code</SummaryLabel>
              <PromoInput placeholder="Enter promo code" />
            </PromoCode>
          </OrderSummary>
        </CartContent>
      </Container>
    </CartPageContainer>
  );
};

export default CartPage; 