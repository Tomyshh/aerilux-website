import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/api';
import { ANALYTICS_CURRENCY, trackEvent, trackSelectContent } from '../services/analytics';

const CheckoutPageContainer = styled.div`
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

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.form``;

const FormSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #999999;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: #666666;
  }
`;

const Select = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ffffff;
    background: rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #000000;
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PaymentMethod = styled(motion.div)<{ selected: boolean }>`
  padding: 1.5rem;
  background: ${props => props.selected ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.selected ? '#ffffff' : 'transparent'};
  border-radius: 15px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const PaymentIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const PaymentLabel = styled.p`
  font-size: 0.9rem;
`;

const OrderSummary = styled.div`
  position: sticky;
  top: 100px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  height: fit-content;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.p`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ItemQuantity = styled.p`
  font-size: 0.9rem;
  color: #999999;
`;

const ItemPrice = styled.p`
  font-weight: 600;
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

const PlaceOrderButton = styled(motion.button)`
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecurityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #999999;
`;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const analyticsItems = useMemo(
    () =>
      items.map(i => ({
        item_id: i.planId,
        item_name: i.planName,
        price: i.price,
        quantity: i.quantity,
        item_category: 'plan',
      })),
    [items]
  );

  useEffect(() => {
    if (items.length === 0) return;
    void trackEvent('begin_checkout', {
      currency: ANALYTICS_CURRENCY,
      value: total,
      items: analyticsItems,
    });
  }, [items.length, total, analyticsItems]);

  useEffect(() => {
    if (items.length === 0) return;
    void trackEvent('add_payment_info', {
      currency: ANALYTICS_CURRENCY,
      value: total,
      payment_type: paymentMethod,
      items: analyticsItems,
    });
  }, [paymentMethod, items.length, total, analyticsItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      void trackEvent('add_shipping_info', {
        currency: ANALYTICS_CURRENCY,
        value: total,
        shipping_tier: 'free',
        items: analyticsItems,
      });

      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order
      const order = await orderService.createOrder({
        items: items.map(item => ({
          productId: 'aerilux-pro',
          planId: item.planId,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US',
          phone: '+1234567890',
        },
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US',
          phone: '+1234567890',
        },
      });

      void trackEvent('purchase', {
        transaction_id: order.id,
        currency: ANALYTICS_CURRENCY,
        value: total,
        tax,
        shipping,
        items: analyticsItems,
      });

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Order failed:', error);
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <CheckoutPageContainer>
      <Container>
        <PageTitle>Checkout</PageTitle>
        <CheckoutGrid>
          <CheckoutForm id="checkout-form" onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Shipping Information</SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input type="text" placeholder="John" required />
                </FormGroup>
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input type="text" placeholder="Doe" required />
                </FormGroup>
                <FormGroup fullWidth>
                  <Label>Email</Label>
                  <Input type="email" placeholder="john@example.com" required />
                </FormGroup>
                <FormGroup fullWidth>
                  <Label>Phone</Label>
                  <Input type="tel" placeholder="+1 (555) 123-4567" required />
                </FormGroup>
                <FormGroup fullWidth>
                  <Label>Address</Label>
                  <Input type="text" placeholder="123 Main Street" required />
                </FormGroup>
                <FormGroup fullWidth>
                  <Label>Apartment, suite, etc. (optional)</Label>
                  <Input type="text" placeholder="Apt 4B" />
                </FormGroup>
                <FormGroup>
                  <Label>City</Label>
                  <Input type="text" placeholder="New York" required />
                </FormGroup>
                <FormGroup>
                  <Label>State</Label>
                  <Select required>
                    <option value="">Select State</option>
                    <option value="NY">New York</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>ZIP Code</Label>
                  <Input type="text" placeholder="10001" required />
                </FormGroup>
                <FormGroup>
                  <Label>Country</Label>
                  <Select required>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </Select>
                </FormGroup>
              </FormGrid>
            </FormSection>

            <FormSection>
              <SectionTitle>Payment Method</SectionTitle>
              <PaymentMethods>
                <PaymentMethod
                  selected={paymentMethod === 'card'}
                  onClick={() => setPaymentMethod('card')}
                >
                  <PaymentIcon>💳</PaymentIcon>
                  <PaymentLabel>Credit Card</PaymentLabel>
                </PaymentMethod>
                <PaymentMethod
                  selected={paymentMethod === 'paypal'}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <PaymentIcon>🅿️</PaymentIcon>
                  <PaymentLabel>PayPal</PaymentLabel>
                </PaymentMethod>
                <PaymentMethod
                  selected={paymentMethod === 'apple'}
                  onClick={() => setPaymentMethod('apple')}
                >
                  <PaymentIcon>🍎</PaymentIcon>
                  <PaymentLabel>Apple Pay</PaymentLabel>
                </PaymentMethod>
              </PaymentMethods>

              {paymentMethod === 'card' && (
                <FormGrid>
                  <FormGroup fullWidth>
                    <Label>Card Number</Label>
                    <Input type="text" placeholder="1234 5678 9012 3456" required />
                  </FormGroup>
                  <FormGroup>
                    <Label>Expiry Date</Label>
                    <Input type="text" placeholder="MM/YY" required />
                  </FormGroup>
                  <FormGroup>
                    <Label>CVV</Label>
                    <Input type="text" placeholder="123" required />
                  </FormGroup>
                </FormGrid>
              )}
            </FormSection>
          </CheckoutForm>

          <OrderSummary>
            <SectionTitle>Order Summary</SectionTitle>
            {items.map((item) => (
              <SummaryItem key={item.planId}>
                <ItemInfo>
                  <ItemName>{item.planName}</ItemName>
                  <ItemQuantity>Qty: {item.quantity}</ItemQuantity>
                </ItemInfo>
                <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
              </SummaryItem>
            ))}
            
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
            
            <PlaceOrderButton
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              onClick={() => {
                void trackSelectContent({
                  contentType: 'checkout_place_order_click',
                  location: 'checkout_page',
                });
              }}
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </PlaceOrderButton>

            <SecurityInfo>
              <span>🔒</span>
              <span>Your payment information is secure and encrypted</span>
            </SecurityInfo>
          </OrderSummary>
        </CheckoutGrid>
      </Container>
    </CheckoutPageContainer>
  );
};

export default CheckoutPage; 