/**
 * src/context/CartContext.tsx
 * Quan ly gio hang toan cuc bang React Context + useReducer.
 * Tu dong luu / doc tu AsyncStorage -> gio hang khong mat khi tat app.
 *
 * Tinh nang 3 cua do an VLXD Sales.
 * Chuan PROG3002: Functional Component + Hooks, no 'any'.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Product } from '../types';
import { calcTotalPrice } from '../utils/format';

/** Khoa luu gio hang trong AsyncStorage */
const STORAGE_KEY = '@vlxd_sales/cart_v1';

/* ================== KIEU DU LIEU ================== */

/** Mot dong trong gio hang */
export interface CartItem {
  product: Product;
  quantity: number;
}

/** State cua gio hang */
interface CartState {
  items: CartItem[];
  /** Da doc xong tu AsyncStorage chua (tranh ghi de khi chua load) */
  hydrated: boolean;
}

/** Cac hanh dong tac dong len gio hang */
type CartAction =
  | { type: 'HYDRATE'; payload: CartItem[] }
  | { type: 'ADD'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE'; payload: { productId: string } }
  | { type: 'SET_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR' };

/* ================== REDUCER ================== */

const initialState: CartState = { items: [], hydrated: false };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'HYDRATE':
      return { items: action.payload, hydrated: true };

    case 'ADD': {
      const { product, quantity } = action.payload;
      const existing = state.items.find(
        (it: CartItem): boolean => it.product.id === product.id,
      );

      if (existing) {
        // Da co -> cong don so luong
        return {
          ...state,
          items: state.items.map((it: CartItem): CartItem =>
            it.product.id === product.id
              ? { ...it, quantity: it.quantity + quantity }
              : it,
          ),
        };
      }
      // Chua co -> them moi
      return { ...state, items: [...state.items, { product, quantity }] };
    }

    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter(
          (it: CartItem): boolean => it.product.id !== action.payload.productId,
        ),
      };

    case 'SET_QUANTITY': {
      const { productId, quantity } = action.payload;
      // So luong <= 0 nghia la xoa khoi gio
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (it: CartItem): boolean => it.product.id !== productId,
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((it: CartItem): CartItem =>
          it.product.id === productId ? { ...it, quantity } : it,
        ),
      };
    }

    case 'CLEAR':
      return { ...state, items: [] };

    default:
      return state;
  }
};

/* ================== CONTEXT ================== */

interface CartContextValue {
  items: CartItem[];
  /** Tong so mon (cong don so luong) - hien tren badge tab bar */
  totalCount: number;
  /** Tong tien ca gio hang (VND) */
  totalAmount: number;
  hydrated: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  /** So luong cua 1 san pham trong gio (0 neu chua co) */
  getQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

/* ================== PROVIDER ================== */

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /* ---- Doc gio hang tu AsyncStorage khi app khoi dong ---- */
  useEffect(() => {
    let mounted = true;

    const loadCart = async (): Promise<void> => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) {
          return;
        }
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'HYDRATE', payload: parsed as CartItem[] });
            return;
          }
        }
        dispatch({ type: 'HYDRATE', payload: [] });
      } catch {
        // Doc loi -> bat dau voi gio rong, khong crash app
        dispatch({ type: 'HYDRATE', payload: [] });
      }
    };

    void loadCart();
    return (): void => {
      mounted = false;
    };
  }, []);

  /* ---- Ghi gio hang xuong AsyncStorage moi khi thay doi ---- */
  useEffect(() => {
    // Chi ghi sau khi da doc xong, tranh ghi de du lieu cu
    if (!state.hydrated) {
      return;
    }
    const persist = async (): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
      } catch {
        // Ghi loi -> bo qua, gio hang van dung trong phien hien tai
      }
    };
    void persist();
  }, [state.items, state.hydrated]);

  /* ---- Actions ---- */
  const addToCart = useCallback(
    (product: Product, quantity = 1): void => {
      dispatch({ type: 'ADD', payload: { product, quantity } });
    },
    [],
  );

  const removeFromCart = useCallback((productId: string): void => {
    dispatch({ type: 'REMOVE', payload: { productId } });
  }, []);

  const setQuantity = useCallback(
    (productId: string, quantity: number): void => {
      dispatch({ type: 'SET_QUANTITY', payload: { productId, quantity } });
    },
    [],
  );

  const clearCart = useCallback((): void => {
    dispatch({ type: 'CLEAR' });
  }, []);

  /* ---- Derived state ---- */
  const totalCount = useMemo<number>(
    () =>
      state.items.reduce(
        (sum: number, it: CartItem): number => sum + it.quantity,
        0,
      ),
    [state.items],
  );

  const totalAmount = useMemo<number>(
    () =>
      state.items.reduce(
        (sum: number, it: CartItem): number =>
          sum + calcTotalPrice(it.quantity, it.product.price),
        0,
      ),
    [state.items],
  );

  const getQuantity = useCallback(
    (productId: string): number =>
      state.items.find((it: CartItem): boolean => it.product.id === productId)
        ?.quantity ?? 0,
    [state.items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      totalCount,
      totalAmount,
      hydrated: state.hydrated,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      getQuantity,
    }),
    [
      state.items,
      state.hydrated,
      totalCount,
      totalAmount,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      getQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/* ================== HOOK ================== */

/**
 * Hook truy cap gio hang. Phai dung ben trong <CartProvider>.
 * Nem loi ro rang neu dung sai cho -> de debug.
 */
export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart phai duoc dung ben trong <CartProvider>');
  }
  return ctx;
};
