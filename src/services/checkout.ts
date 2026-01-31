export type PaymeCreateSalePayload = {
  cart: {
    items: Array<{
      productId: string;
      planId: string;
      name: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;
  };
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    currency: string;
  };
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  billingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  returnUrl: string;
  cancelUrl: string;
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

