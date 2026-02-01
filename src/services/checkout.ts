export type CheckoutPriceResponse = { price: number; currency: string };

export type PaymeCreateSalePayload = {
  buyerToken: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    socialId?: string;
    address: string;
    address2?: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    sku?: string;
  }>;
  returnUrl: string;
  cancelUrl: string;
  metadata?: Record<string, unknown>;
};

export type PaymeCreateSaleResponse = {
  orderId: string;
  orderNumber: string;
  paymeSaleId?: string;
  status?: 'paid' | 'pending' | string;
  price?: number;
  total?: number;
  currency?: string;
  checkoutUrl?: string | null;
  payme?: unknown;
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

async function readResponseBodySafe(res: Response): Promise<{ json?: any; text?: string }> {
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  if (contentType.includes('application/json')) {
    try {
      return { json: await res.json() };
    } catch {
      // fall through to text
    }
  }

  try {
    return { text: await res.text() };
  } catch {
    return {};
  }
}

function buildHttpErrorMessage(args: {
  fallback: string;
  res: Response;
  data?: any;
  text?: string;
}): { message: string; code?: string } {
  const { fallback, res, data, text } = args;
  const code = typeof data?.code === 'string' ? data.code : undefined;
  const apiMessage =
    typeof data?.message === 'string'
      ? data.message
      : typeof data?.error === 'string'
        ? data.error
        : undefined;

  if (apiMessage) return { message: apiMessage, code };

  const url = res.url || '(unknown url)';
  const statusLine = `${res.status}${res.statusText ? ` ${res.statusText}` : ''}`;

  // Si c'est une page HTML (typiquement 404/502), on aide le debug avec un extrait.
  const snippet =
    typeof text === 'string' && text.trim()
      ? text.trim().slice(0, 220).replace(/\s+/g, ' ')
      : undefined;

  return {
    message: snippet
      ? `${fallback} (HTTP ${statusLine}) sur ${url} — Réponse: ${snippet}`
      : `${fallback} (HTTP ${statusLine}) sur ${url}`,
    code,
  };
}

export const checkoutService = {
  getPrice: async (): Promise<CheckoutPriceResponse> => {
    const base = getBackendUrl();
    const res = await fetch(`${base}/checkout/price`, { method: 'GET' });
    const body = await readResponseBodySafe(res);
    const data = (body.json ?? {}) as Partial<CheckoutPriceResponse> & { message?: string };
    if (!res.ok) {
      const err = buildHttpErrorMessage({
        fallback: 'Price fetch error',
        res,
        data,
        text: body.text,
      });
      throw new Error(err.message);
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

    const body = await readResponseBodySafe(res);
    const data = (body.json ?? {}) as PaymeCreateSaleResponse;
    if (!res.ok) {
      const info = buildHttpErrorMessage({
        fallback: 'Checkout error',
        res,
        data,
        text: body.text,
      });
      const err = new Error(info.message) as Error & { code?: string };
      if (info.code) err.code = info.code;
      throw err;
    }

    return data;
  },
};

