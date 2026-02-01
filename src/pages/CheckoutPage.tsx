import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ANALYTICS_CURRENCY, trackEvent, trackSelectContent } from '../services/analytics';
import { checkoutService } from '../services/checkout';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { useToast } from '../components/ToastProvider';

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

const ReadOnlyInput = styled(Input)`
  opacity: 0.85;
  cursor: not-allowed;
`;

const HostedFieldContainer = styled.div`
  width: 100%;
  min-height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  color: #ffffff;
  display: flex;
  align-items: center;
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

function loadPayMeHostedFieldsScript(): Promise<void> {
  const src = 'https://cdn.paymeservice.com/hf/v1/hostedfields.js';
  const existing = document.querySelector<HTMLScriptElement>('script[data-payme-hostedfields="true"]');
  if (existing) {
    if ((existing as any).__loaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('PayMe script load failed')), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.paymeHostedfields = 'true';
    s.onload = () => {
      (s as any).__loaded = true;
      resolve();
    };
    s.onerror = () => reject(new Error('PayMe script load failed'));
    document.head.appendChild(s);
  });
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const toast = useToast();
  const [paymentMethod] = useState('payme');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymeInstance, setPaymeInstance] = useState<PayMeInstance | null>(null);
  const [paymeReady, setPaymeReady] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    zipCode: '',
    // Pour le moment, vente uniquement en Israël
    country: 'Israel',
  });

  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>(ANALYTICS_CURRENCY);

  useEffect(() => {
    void (async () => {
      try {
        const p = await checkoutService.getPrice();
        setUnitPrice(p.price);
        setCurrency(p.currency || ANALYTICS_CURRENCY);
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        await loadPayMeHostedFieldsScript();
        if (cancelled) return;

        const apiKey = process.env.REACT_APP_PAYME_API_KEY;
        if (!apiKey) {
          setPaymeReady(false);
          setErrorMessage('PayMe: API key manquante (REACT_APP_PAYME_API_KEY)');
          return;
        }

        const testMode =
          (process.env.REACT_APP_PAYME_TEST_MODE || '').toLowerCase() === 'true' ||
          process.env.NODE_ENV !== 'production';

        const PayMe = window.PayMe;
        if (!PayMe) {
          setPaymeReady(false);
          setErrorMessage('PayMe: script chargé mais PayMe indisponible');
          return;
        }

        const instance = await PayMe.create(apiKey, { testMode });
        if (cancelled) return;
        setPaymeInstance(instance);
      } catch (e) {
        if (cancelled) return;
        setPaymeReady(false);
        setErrorMessage((e as any)?.message || 'PayMe: impossible de charger le module de paiement');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!paymeInstance) return;
    const PayMe = window.PayMe;
    if (!PayMe) return;

    try {
      const fields = paymeInstance.hostedFields();
      const cardNumber = fields.create(PayMe.fields.NUMBER);
      const expiration = fields.create(PayMe.fields.EXPIRATION);
      const cvc = fields.create(PayMe.fields.CVC);

      cardNumber.mount('#card-number-container');
      expiration.mount('#expiration-container');
      cvc.mount('#cvc-container');

      setPaymeReady(true);
    } catch (e) {
      setPaymeReady(false);
      setErrorMessage((e as any)?.message || 'PayMe: impossible d’initialiser les champs carte');
    }
  }, [paymeInstance]);

  const qty = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = unitPrice != null ? unitPrice * qty : 0;
  const total = subtotal;

  const analyticsItems = useMemo(
    () =>
      items.map(i => ({
        item_id: i.sku,
        item_name: i.name,
        ...(unitPrice != null ? { price: unitPrice } : {}),
        quantity: i.quantity,
        item_category: 'product',
      })),
    [items, unitPrice]
  );

  useEffect(() => {
    if (items.length === 0) return;
    void trackEvent('begin_checkout', {
      currency,
      value: unitPrice != null ? total : undefined,
      items: analyticsItems,
    });
  }, [items.length, total, analyticsItems, currency, unitPrice]);

  useEffect(() => {
    if (items.length === 0) return;
    void trackEvent('add_payment_info', {
      currency,
      value: unitPrice != null ? total : undefined,
      payment_type: paymentMethod,
      items: analyticsItems,
    });
  }, [paymentMethod, items.length, total, analyticsItems, currency, unitPrice]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      void trackEvent('add_shipping_info', {
        currency,
        value: unitPrice != null ? total : undefined,
        shipping_tier: 'free',
        items: analyticsItems,
      });

      const origin = window.location.origin;
      const returnUrl = `${origin}/checkout/success`;
      const cancelUrl = `${origin}/checkout/cancel`;

      if (!paymeInstance || !paymeReady) {
        throw new Error('PayMe: champs de carte non prêts');
      }
      if (unitPrice == null) {
        throw new Error('Prix indisponible, veuillez réessayer dans un instant.');
      }

      // 1) Tokenisation via PayMe Hosted Fields (aucune donnée carte ne transite chez nous)
      const tokenizeResult = await paymeInstance.tokenize({
        payerFirstName: formData.firstName,
        payerLastName: formData.lastName,
        payerEmail: formData.email,
        payerPhone: formData.phone,
        payerSocialId: '',
        total: {
          label: 'Aerilux Starter Pack',
          amount: { currency: currency || ANALYTICS_CURRENCY, value: String(total) },
        },
      });

      // IMPORTANT: selon la version PayMe, le token peut être exposé sous différents noms.
      // On supporte token / buyer_key / buyerKey pour éviter un body sans buyerToken (JSON.stringify omet undefined).
      const buyerToken =
        (tokenizeResult as any)?.token ||
        (tokenizeResult as any)?.buyer_key ||
        (tokenizeResult as any)?.buyerKey;

      if (!tokenizeResult || tokenizeResult.type !== 'tokenize-success' || !buyerToken) {
        // Aide debug: visible dans DevTools > Console
        // eslint-disable-next-line no-console
        console.error('PayMe tokenize failed:', tokenizeResult);
        throw new Error('PayMe tokenization failed');
      }

      const payload = {
        buyerToken,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          address2: formData.address2 || undefined,
          city: formData.city,
          zipCode: formData.zipCode,
          country: 'Israel',
        },
        items: items.map(i => ({
          name: 'Aerilux Starter Pack',
          sku: i.sku,
          quantity: i.quantity,
        })),
        returnUrl,
        cancelUrl,
        metadata: { source: 'website' },
      };

      const data = await checkoutService.createPaymeSale(payload);

      // Supporte les 2 clés (anciennes + celles demandées).
      localStorage.setItem('orderId', data.orderId);
      localStorage.setItem('orderNumber', data.orderNumber);
      localStorage.setItem('lastOrderId', data.orderId);
      localStorage.setItem('lastOrderNumber', data.orderNumber);
      if (data.paymeSaleId) localStorage.setItem('lastPaymeSaleId', data.paymeSaleId);

      // IMPORTANT: ne pas envoyer l'événement GA4 "purchase" ici (le paiement n'est pas confirmé côté client).
      void trackEvent('checkout_progress', {
        step: data.status === 'paid' ? 'paid' : data.checkoutUrl ? 'redirect_to_payme' : 'pending',
        order_id: data.orderId,
        order_number: data.orderNumber,
      });

      if (data.status === 'paid') {
        toast.success('Paiement confirmé. Merci pour votre commande.');
        navigate('/checkout/success');
        return;
      }
      if (data.checkoutUrl) {
        toast.success('Commande créée. Redirection vers PayMe…');
        window.location.href = data.checkoutUrl;
        return;
      }

      // Fallback: paiement en attente (webhook) → même page de “confirmation en cours”
      toast.info('Commande créée. Validation du paiement en cours…');
      navigate('/checkout/success');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Order failed:', error);

      const err = error as any;
      let msg: string | undefined = err?.message;

      // PayMe JSAPI peut rejeter avec un objet (sans .message), ex: { type: 'tokenize-error', errors: {...} }
      if (!msg && (err?.type === 'tokenize-error' || err?.validationError)) {
        const errors = err?.errors;
        const labelForField = (key: string) => {
          switch (key) {
            case 'cardNumber':
              return 'Numéro de carte';
            case 'cardExpiration':
            case 'expiration':
              return 'Expiration';
            case 'cvc':
              return 'CVC';
            case 'payerFirstName':
              return 'Prénom';
            case 'payerLastName':
              return 'Nom';
            case 'payerEmail':
              return 'Email';
            case 'payerPhone':
              return 'Téléphone';
            case 'payerSocialId':
              return 'ID';
            default:
              return key;
          }
        };

        if (errors && typeof errors === 'object') {
          const parts = Object.entries(errors)
            .slice(0, 6)
            .map(([k, v]) => `${labelForField(String(k))}: ${String(v)}`);
          msg = parts.length
            ? `PayMe: formulaire invalide — ${parts.join(' • ')}`
            : 'PayMe: formulaire invalide (champs carte ou infos manquantes)';
        } else {
          msg = 'PayMe: formulaire invalide (champs carte ou infos manquantes)';
        }
      }

      if (!msg) msg = 'Checkout error';
      setErrorMessage(msg);
      toast.error(msg);
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
        <ProcessingOverlay
          open={isProcessing}
          title="Traitement du paiement"
          subtitle="Nous sécurisons la transaction et préparons la redirection…"
        />
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
                name="address"
                value={formData.address}
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
                  <Label>ZIP Code</Label>
                  <Input
                    type="text"
                name="zipCode"
                value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Country</Label>
                  <ReadOnlyInput type="text" value="Israel" disabled />
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

              <FormGrid>
                <FormGroup fullWidth>
                  <Label>Card number</Label>
                  <HostedFieldContainer id="card-number-container" />
                </FormGroup>
                <FormGroup>
                  <Label>Expiration</Label>
                  <HostedFieldContainer id="expiration-container" />
                </FormGroup>
                <FormGroup>
                  <Label>CVC</Label>
                  <HostedFieldContainer id="cvc-container" />
                </FormGroup>
              </FormGrid>
            </FormSection>

          </CheckoutForm>

          <OrderSummary>
            <SectionTitle>Order Summary</SectionTitle>
            {items.map((item) => (
              <SummaryItem key={item.sku}>
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemQuantity>Qty: {item.quantity}</ItemQuantity>
                </ItemInfo>
                <ItemPrice>
                  {unitPrice != null ? `${currency} ${(unitPrice * item.quantity).toFixed(2)}` : '—'}
                </ItemPrice>
              </SummaryItem>
            ))}
            
            <SummaryRow>
              <SummaryLabel>Subtotal</SummaryLabel>
              <SummaryValue>{unitPrice != null ? `${currency} ${subtotal.toFixed(2)}` : '—'}</SummaryValue>
            </SummaryRow>
            <TotalRow>
              <TotalLabel>Total</TotalLabel>
              <TotalValue>{unitPrice != null ? `${currency} ${total.toFixed(2)}` : '—'}</TotalValue>
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