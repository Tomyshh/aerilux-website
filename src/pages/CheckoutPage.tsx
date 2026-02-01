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
  font-size: clamp(2rem, 5vw, 2.8rem);
  font-weight: 800;
  margin-bottom: 2.5rem;
  letter-spacing: -0.02em;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2.5rem;
  align-items: start;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.form``;

const FormSection = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: -0.01em;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  color: #ffffff;
  caret-color: #ffffff;
  -webkit-text-fill-color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(59, 158, 255, 0.5);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(59, 158, 255, 0.12);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ReadOnlyInput = styled(Input)`
  opacity: 0.7;
  cursor: not-allowed;
  background: rgba(255, 255, 255, 0.03);
`;

const HostedFieldContainer = styled.div`
  width: 100%;
  height: 44px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 10px;
  padding: 0 0.8rem;
  color: #ffffff;
  position: relative;
  cursor: text;
  transition: all 0.2s ease;
  overflow: hidden;

  /* PayMe Hosted Fields injecte un iframe. On force sa taille pour garantir le focus/click. */
  & iframe {
    width: 100% !important;
    height: 100% !important;
    border: 0 !important;
    display: block;
  }
  
  &:focus-within {
    border-color: rgba(59, 158, 255, 0.5);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(59, 158, 255, 0.12);
  }
`;

const PaymentBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(59, 158, 255, 0.08);
  border: 1px solid rgba(59, 158, 255, 0.18);
  border-radius: 10px;
  margin-bottom: 1.25rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
`;

const OrderSummaryCard = styled(motion.div)`
  position: sticky;
  top: 100px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

const SummaryTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: rgba(255, 255, 255, 0.95);
`;

const SummaryItemCard = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  
  &:last-of-type {
    border-bottom: none;
  }
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.6rem;
`;

const ItemName = styled.p`
  font-weight: 600;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.92);
`;

const ItemPrice = styled.p`
  font-weight: 700;
  font-size: 0.95rem;
  color: #ffffff;
`;

const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QtyButton = styled(motion.button)`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.10);
    border-color: rgba(255, 255, 255, 0.18);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const QtyValue = styled.span`
  min-width: 24px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
`;

const RemoveLink = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 59, 48, 0.75);
  font-size: 0.8rem;
  margin-left: auto;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.15s ease;

  &:hover {
    color: rgba(255, 59, 48, 1);
    background: rgba(255, 59, 48, 0.08);
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 1rem 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
`;

const SummaryLabel = styled.span`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.55);
`;

const SummaryValue = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
`;

const TotalRow = styled(SummaryRow)`
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
`;

const TotalLabel = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
`;

const TotalValue = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
`;

const PlaceOrderButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, #ffffff 0%, #e8e8e8 100%);
  color: #000000;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 1.25rem;
  border: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 30px rgba(255, 255, 255, 0.22);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 1rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45);
`;

const ErrorBanner = styled(motion.div)`
  background: rgba(255, 59, 48, 0.08);
  border: 1px solid rgba(255, 59, 48, 0.22);
  color: rgba(255, 107, 107, 0.95);
  padding: 0.9rem 1.1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.45;
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
  const { items, updateQuantity, removeFromCart } = useCart();
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
      // PayMe Hosted Fields: `create(field, options)` accepte `styles` (docs PayMe).
      const createOptions = (placeholder: string) => ({
        placeholder,
        styles: {
          base: {
            color: '#ffffff',
            'font-size': '16px',
            'letter-spacing': '0.02em',
            '::placeholder': { color: 'rgba(255,255,255,0.35)' },
          },
          // On garde le texte en blanc même si invalide (UX souhaitée).
          invalid: { color: '#ffffff' },
          valid: { color: '#ffffff' },
        },
      });

      const safeCreate = (fieldType: any, placeholder: string) => {
        try {
          return (fields as any).create(fieldType, createOptions(placeholder));
        } catch {
          return fields.create(fieldType);
        }
      };

      const cardNumber = safeCreate(PayMe.fields.NUMBER, 'XXXX XXXX XXXX XXXX');
      const expiration = safeCreate(PayMe.fields.EXPIRATION, 'MM/YY');
      const cvc = safeCreate(PayMe.fields.CVC, '123');

      cardNumber.mount('#card-number-container');
      expiration.mount('#expiration-container');
      cvc.mount('#cvc-container');

      setPaymeReady(true);
    } catch (e) {
      setPaymeReady(false);
      setErrorMessage((e as any)?.message || 'PayMe: impossible d\'initialiser les champs carte');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      const buyerToken =
        (tokenizeResult as any)?.token ||
        (tokenizeResult as any)?.buyer_key ||
        (tokenizeResult as any)?.buyerKey;

      if (!tokenizeResult || tokenizeResult.type !== 'tokenize-success' || !buyerToken) {
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

      localStorage.setItem('orderId', data.orderId);
      localStorage.setItem('orderNumber', data.orderNumber);
      localStorage.setItem('lastOrderId', data.orderId);
      localStorage.setItem('lastOrderNumber', data.orderNumber);
      if (data.paymeSaleId) localStorage.setItem('lastPaymeSaleId', data.paymeSaleId);

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

      toast.info('Commande créée. Validation du paiement en cours…');
      navigate('/checkout/success');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Order failed:', error);

      const err = error as any;
      let msg: string | undefined = err?.message;

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
          subtitle="Nous sécurisons la transaction…"
        />
        {errorMessage && (
          <ErrorBanner
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {errorMessage}
          </ErrorBanner>
        )}
        <CheckoutGrid>
          <CheckoutForm id="checkout-form" onSubmit={handleSubmit} autoComplete="on">
            <FormSection
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionTitle>Shipping</SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    autoComplete="shipping given-name"
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
                    autoComplete="shipping family-name"
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
                    autoComplete="shipping email"
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
                    autoComplete="shipping tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+972 50 123 4567"
                    required
                  />
                </FormGroup>
                <FormGroup fullWidth>
                  <Label>Address</Label>
                  <Input
                    type="text"
                    name="address"
                    autoComplete="shipping street-address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Herzl Street"
                    required
                  />
                </FormGroup>
                <FormGroup fullWidth>
                  <Label>Apt / Suite (optional)</Label>
                  <Input
                    type="text"
                    name="address2"
                    autoComplete="shipping address-line2"
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
                    autoComplete="shipping address-level2"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Tel Aviv"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>ZIP Code</Label>
                  <Input
                    type="text"
                    name="zipCode"
                    autoComplete="shipping postal-code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="6100000"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Country</Label>
                  <ReadOnlyInput type="text" value="Israel" disabled />
                </FormGroup>
              </FormGrid>
            </FormSection>

            <FormSection
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <SectionTitle>Payment</SectionTitle>
              <PaymentBadge>
                <span>🔒</span>
                <span>Secure checkout via PayMe</span>
              </PaymentBadge>
              <FormGrid>
                <FormGroup fullWidth>
                  <Label>Card Number</Label>
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

          <OrderSummaryCard
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <SummaryTitle>Order Summary</SummaryTitle>
            
            {items.map((item) => (
              <SummaryItemCard key={item.sku}>
                <ItemHeader>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>
                    {unitPrice != null ? `${currency} ${(unitPrice * item.quantity).toFixed(2)}` : '—'}
                  </ItemPrice>
                </ItemHeader>
                <QuantityRow>
                  <QtyButton
                    type="button"
                    onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                    whileTap={{ scale: 0.92 }}
                    disabled={item.quantity <= 1}
                    aria-label="Diminuer"
                  >
                    −
                  </QtyButton>
                  <QtyValue>{item.quantity}</QtyValue>
                  <QtyButton
                    type="button"
                    onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Augmenter"
                  >
                    +
                  </QtyButton>
                  <RemoveLink type="button" onClick={() => removeFromCart(item.sku)}>
                    Remove
                  </RemoveLink>
                </QuantityRow>
              </SummaryItemCard>
            ))}

            <Divider />

            <SummaryRow>
              <SummaryLabel>Subtotal</SummaryLabel>
              <SummaryValue>
                {unitPrice != null ? `${currency} ${subtotal.toFixed(2)}` : '—'}
              </SummaryValue>
            </SummaryRow>

            <TotalRow>
              <TotalLabel>Total</TotalLabel>
              <TotalValue>
                {unitPrice != null ? `${currency} ${total.toFixed(2)}` : '—'}
              </TotalValue>
            </TotalRow>

            <PlaceOrderButton
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                void trackSelectContent({
                  contentType: 'checkout_place_order_click',
                  location: 'checkout_page',
                });
              }}
            >
              {isProcessing ? 'Processing…' : 'Place Order'}
            </PlaceOrderButton>

            <SecurityNote>
              <span>🔒</span>
              <span>Secure payment via PayMe</span>
            </SecurityNote>
          </OrderSummaryCard>
        </CheckoutGrid>
      </Container>
    </CheckoutPageContainer>
  );
};

export default CheckoutPage;
