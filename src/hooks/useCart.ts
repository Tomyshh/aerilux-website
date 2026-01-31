import { useState, useCallback, useEffect } from 'react';
import { ANALYTICS_CURRENCY, trackEvent, type AnalyticsItem } from '../services/analytics';
import { checkoutService } from '../services/checkout';

interface CartItem {
  sku: string;
  name: string;
  quantity: number;
}

interface UseCartReturn {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CART_STORAGE_KEY = 'aerilux_cart';

function cartItemToAnalyticsItem(item: CartItem): AnalyticsItem {
  return {
    item_id: item.sku,
    item_name: item.name,
    quantity: item.quantity,
    item_category: 'product',
  };
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedCart) return [];
    // Migration: ancien format { planId, planName, price, quantity }
    try {
      const parsed = JSON.parse(storedCart) as any[];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((x: any) => {
          if (x?.sku && x?.name && typeof x?.quantity === 'number') {
            return { sku: String(x.sku), name: String(x.name), quantity: Number(x.quantity) } as CartItem;
          }
          if (x?.planId && x?.planName && typeof x?.quantity === 'number') {
            return {
              sku: String(x.planId),
              name: String(x.planName),
              quantity: Number(x.quantity),
            } as CartItem;
          }
          return null;
        })
        .filter(Boolean) as CartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.sku === item.sku);
      
      if (existingItem) {
        return prevItems.map(i =>
          i.sku === item.sku
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      
      return [...prevItems, { ...item, quantity: 1 }];
    });

    void (async () => {
      try {
        const price = await checkoutService.getPrice();
        void trackEvent('add_to_cart', {
          currency: price.currency || ANALYTICS_CURRENCY,
          value: price.price,
          items: [
            {
              item_id: item.sku,
              item_name: item.name,
              price: price.price,
              quantity: 1,
              item_category: 'product',
            },
          ],
        });
      } catch {
        void trackEvent('add_to_cart', {
          currency: ANALYTICS_CURRENCY,
          items: [
            {
              item_id: item.sku,
              item_name: item.name,
              quantity: 1,
              item_category: 'product',
            },
          ],
        });
      }
    })();
  }, []);

  const removeFromCart = useCallback((sku: string) => {
    setItems(prevItems => {
      const existing = prevItems.find(item => item.sku === sku);
      if (existing) {
        void (async () => {
          try {
            const price = await checkoutService.getPrice();
            void trackEvent('remove_from_cart', {
              currency: price.currency || ANALYTICS_CURRENCY,
              value: price.price * existing.quantity,
              items: [
                {
                  item_id: existing.sku,
                  item_name: existing.name,
                  price: price.price,
                  quantity: existing.quantity,
                  item_category: 'product',
                },
              ],
            });
          } catch {
            void trackEvent('remove_from_cart', {
              currency: ANALYTICS_CURRENCY,
              items: [cartItemToAnalyticsItem(existing)],
            });
          }
        })();
      }
      return prevItems.filter(item => item.sku !== sku);
    });
  }, []);

  const updateQuantity = useCallback((sku: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    
    setItems(prevItems => {
      const existing = prevItems.find(item => item.sku === sku);
      if (existing) {
        const delta = quantity - existing.quantity;
        if (delta !== 0) {
          const eventName = delta > 0 ? 'add_to_cart' : 'remove_from_cart';
          const qty = Math.abs(delta);
          void (async () => {
            try {
              const price = await checkoutService.getPrice();
              void trackEvent(eventName, {
                currency: price.currency || ANALYTICS_CURRENCY,
                value: price.price * qty,
                items: [
                  {
                    item_id: existing.sku,
                    item_name: existing.name,
                    price: price.price,
                    quantity: qty,
                    item_category: 'product',
                  },
                ],
              });
            } catch {
              void trackEvent(eventName, {
                currency: ANALYTICS_CURRENCY,
                items: [
                  {
                    ...cartItemToAnalyticsItem(existing),
                    quantity: qty,
                  },
                ],
              });
            }
          })();
        }
      }
      return prevItems.map(item =>
        item.sku === sku ? { ...item, quantity } : item
      );
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    // Deprecated: le prix vient du backend. Gardé pour compatibilité UI si besoin.
    return 0;
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
}; 