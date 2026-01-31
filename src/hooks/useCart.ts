import { useState, useCallback, useEffect } from 'react';
import { ANALYTICS_CURRENCY, trackEvent, type AnalyticsItem } from '../services/analytics';

interface CartItem {
  planId: string;
  planName: string;
  price: number;
  quantity: number;
}

interface UseCartReturn {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (planId: string) => void;
  updateQuantity: (planId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CART_STORAGE_KEY = 'aerilux_cart';

function cartItemToAnalyticsItem(item: CartItem): AnalyticsItem {
  return {
    item_id: item.planId,
    item_name: item.planName,
    price: item.price,
    quantity: item.quantity,
    item_category: 'plan',
  };
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.planId === item.planId);
      
      if (existingItem) {
        return prevItems.map(i =>
          i.planId === item.planId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      
      return [...prevItems, { ...item, quantity: 1 }];
    });

    void trackEvent('add_to_cart', {
      currency: ANALYTICS_CURRENCY,
      value: item.price,
      items: [
        {
          item_id: item.planId,
          item_name: item.planName,
          price: item.price,
          quantity: 1,
          item_category: 'plan',
        },
      ],
    });
  }, []);

  const removeFromCart = useCallback((planId: string) => {
    setItems(prevItems => {
      const existing = prevItems.find(item => item.planId === planId);
      if (existing) {
        void trackEvent('remove_from_cart', {
          currency: ANALYTICS_CURRENCY,
          value: existing.price * existing.quantity,
          items: [cartItemToAnalyticsItem(existing)],
        });
      }
      return prevItems.filter(item => item.planId !== planId);
    });
  }, []);

  const updateQuantity = useCallback((planId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(planId);
      return;
    }
    
    setItems(prevItems => {
      const existing = prevItems.find(item => item.planId === planId);
      if (existing) {
        const delta = quantity - existing.quantity;
        if (delta !== 0) {
          const eventName = delta > 0 ? 'add_to_cart' : 'remove_from_cart';
          const qty = Math.abs(delta);
          void trackEvent(eventName, {
            currency: ANALYTICS_CURRENCY,
            value: existing.price * qty,
            items: [
              {
                ...cartItemToAnalyticsItem(existing),
                quantity: qty,
              },
            ],
          });
        }
      }
      return prevItems.map(item =>
        item.planId === planId ? { ...item, quantity } : item
      );
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);

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