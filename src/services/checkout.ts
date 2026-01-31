export type CheckoutPriceResponse = { price: number; currency: string };

export type PaymeCreateSalePayload = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    address2?: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    sku: string;
    quantity: number;
  }>;
  returnUrl: string;
  cancelUrl: string;
  metadata?: Record<string, unknown>;
};

export type PaymeCreateSaleResponse = {
  orderId: string;
  orderNumber: string;
  checkoutUrl?: string;
  paymeSaleId?: string;
  code?: string;
  message?: string;
};

function getBackendUrl(): string {
  // IMPORTANT: le backend PayMe est hors /api.
  return (
    process.env.REACT_APP_BACKEND_URL ||
    process.env.REACT_APP_BACKEND ||
    process.env.REACT_APP_API_URL ||
    'http://localhost:3001'
  ).replace(/\/+$/, '');
}

export const checkoutService = {
  getPrice: async (): Promise<CheckoutPriceResponse> => {
    const base = getBackendUrl();
    const res = await fetch(`${base}/checkout/price`, { method: 'GET' });
    const data = (await res.json().catch(() => ({}))) as Partial<CheckoutPriceResponse> & {
      message?: string;
    };
    if (!res.ok) {
      throw new Error(data?.message || 'Price fetch error');
    }
    if (typeof data.price !== 'number' || !data.currency) {
      throw new Error('Invalid price response');
    }
    return { price: data.price, currency: data.currency };
  },

  createPaymeSale: async (
    payload: PaymeCreateSalePayload
  ): Promise<PaymeCreateSaleResponse> => {
    const base = getBackendUrl();
    const res = await fetch(`${base}/checkout/payme/create-sale`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = (await res.json().catch(() => ({}))) as PaymeCreateSaleResponse;
    if (!res.ok) {
      const msg = data?.message || 'Checkout error';
      const err = new Error(msg) as Error & { code?: string };
      if (data?.code) err.code = data.code;
      throw err;
    }

    return data;
  },
};

