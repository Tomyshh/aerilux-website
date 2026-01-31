import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ANALYTICS_CURRENCY, trackEvent, trackSelectContent } from '../services/analytics';
import { checkoutService } from '../services/checkout';

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
  grid-template-columns: 1fr;
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
  const { items, getTotalPrice } = useCart();
  const [paymentMethod] = useState('payme');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingData, setBillingData] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
  });

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      void trackEvent('add_shipping_info', {
        currency: ANALYTICS_CURRENCY,
        value: total,
        shipping_tier: 'free',
        items: analyticsItems,
      });

      const origin = window.location.origin;
      const returnUrl = `${origin}/checkout/success`;
      const cancelUrl = `${origin}/checkout/cancel`;

      const payload = {
        cart: {
          items: items.map(item => ({
            productId: 'aerilux-starter-pack',
            planId: item.planId,
            name: item.planName,
            quantity: item.quantity,
            unitPrice: item.price,
            lineTotal: item.price * item.quantity,
          })),
        },
        totals: {
          subtotal,
          shipping,
          tax,
          total,
          currency: ANALYTICS_CURRENCY,
        },
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address1: formData.address1,
          address2: formData.address2 || undefined,
          city: formData.city,
          state: formData.state || undefined,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        billingAddress: billingSameAsShipping
          ? {
              address1: formData.address1,
              address2: formData.address2 || undefined,
              city: formData.city,
              state: formData.state || undefined,
              postalCode: formData.postalCode,
              country: formData.country,
            }
          : {
              address1: billingData.address1,
              address2: billingData.address2 || undefined,
              city: billingData.city,
              state: billingData.state || undefined,
              postalCode: billingData.postalCode,
              country: billingData.country,
            },
        returnUrl,
        cancelUrl,
      };

      const data = await checkoutService.createPaymeSale(payload);
      if (!data.checkoutUrl) {
        throw new Error("PayMe n’a pas renvoyé de checkoutUrl");
      }

      localStorage.setItem('lastOrderId', data.orderId);
      localStorage.setItem('lastOrderNumber', data.orderNumber);
      if (data.paymeSaleId) localStorage.setItem('lastPaymeSaleId', data.paymeSaleId);

      // IMPORTANT: ne pas envoyer l'événement GA4 "purchase" ici (le paiement n'est pas confirmé côté client).
      void trackEvent('checkout_progress', {
        step: 'redirect_to_payme',
        order_id: data.orderId,
        order_number: data.orderNumber,
      });

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Order failed:', error);
      const msg = (error as any)?.message || 'Checkout error';
      setErrorMessage(msg);
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
        {errorMessage && (
          <div
            style={{
              background: 'rgba(255, 59, 48, 0.12)',
              border: '1px solid rgba(255, 59, 48, 0.35)',
              color: '#ff6b6b',
              padding: '1rem 1.25rem',
              borderRadius: 12,
              marginBottom: '1.5rem',
            }}
          >
            {errorMessage}
          </div>
        )}
        <CheckoutGrid>
          <CheckoutForm id="checkout-form" onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Shipping Information</SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    required
                  />
                </FormGroup>
                <FormGroup fullWidth>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </FormGroup>
                <FormGroup fullWidth>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </FormGroup>
                <FormGroup fullWidth>
                  <Label>Address</Label>
                  <Input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    required
                  />
                </FormGroup>
                <FormGroup fullWidth>
                  <Label>Apartment, suite, etc. (optional)</Label>
                  <Input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder="Apt 4B"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>City</Label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>State</Label>
                  <Select name="state" value={formData.state} onChange={handleInputChange} required>
                    <option value="">Select State</option>
                    <option value="NY">New York</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>ZIP Code</Label>
                  <Input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Country</Label>
                  <Select name="country" value={formData.country} onChange={handleInputChange} required>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                  </Select>
                </FormGroup>
              </FormGrid>
            </FormSection>

            <FormSection>
              <SectionTitle>Payment</SectionTitle>
              <PaymentMethods>
                <PaymentMethod
                  selected={paymentMethod === 'payme'}
                >
                  <PaymentIcon>🔒</PaymentIcon>
                  <PaymentLabel>PayMe (secure checkout)</PaymentLabel>
                </PaymentMethod>
              </PaymentMethods>
            </FormSection>

            <FormSection>
              <SectionTitle>Billing Address</SectionTitle>
              <div style={{ marginBottom: '1rem', color: '#cccccc' }}>
                <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  />
                  Same as shipping address
                </label>
              </div>

              {!billingSameAsShipping && (
                <FormGrid>
                  <FormGroup fullWidth>
                    <Label>Address</Label>
                    <Input
                      type="text"
                      name="address1"
                      value={billingData.address1}
                      onChange={handleBillingChange}
                      placeholder="123 Main Street"
                      required
                    />
                  </FormGroup>
                  <FormGroup fullWidth>
                    <Label>Apartment, suite, etc. (optional)</Label>
                    <Input
                      type="text"
                      name="address2"
                      value={billingData.address2}
                      onChange={handleBillingChange}
                      placeholder="Apt 4B"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>City</Label>
                    <Input
                      type="text"
                      name="city"
                      value={billingData.city}
                      onChange={handleBillingChange}
                      placeholder="New York"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>State</Label>
                    <Select name="state" value={billingData.state} onChange={handleBillingChange} required>
                      <option value="">Select State</option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label>ZIP Code</Label>
                    <Input
                      type="text"
                      name="postalCode"
                      value={billingData.postalCode}
                      onChange={handleBillingChange}
                      placeholder="10001"
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Country</Label>
                    <Select name="country" value={billingData.country} onChange={handleBillingChange} required>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </Select>
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
              <span>You will be redirected to PayMe to complete the payment.</span>
            </SecurityInfo>
          </OrderSummary>
        </CheckoutGrid>
      </Container>
    </CheckoutPageContainer>
  );
};

export default CheckoutPage; 