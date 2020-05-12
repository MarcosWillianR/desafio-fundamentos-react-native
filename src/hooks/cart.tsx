import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsStoraged = await AsyncStorage.getItem('@goBarber:products');

      if (productsStoraged) {
        setProducts(JSON.parse(productsStoraged));
      } else {
        const response = await api.get<Product[]>('products');

        setProducts(response.data);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const findProduct = products.find(p => p.id === product.id);

      if (findProduct) {
        setProducts(
          products.map(state_product => {
            if (state_product.id === product.id) {
              return {
                ...state_product,
                quantity: state_product.quantity + 1,
              };
            }

            return state_product;
          }),
        );
      } else {
        setProducts(state => [...state, { ...product, quantity: 1 }]);
      }

      await AsyncStorage.setItem(
        '@goBarber:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      setProducts(
        products.map(product => {
          if (product.id === id) {
            return {
              ...product,
              quantity: product.quantity + 1,
            };
          }

          return product;
        }),
      );

      await AsyncStorage.setItem(
        '@goBarber:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      setProducts(
        products.map(product => {
          if (product.id === id) {
            return {
              ...product,
              quantity: product.quantity - 1 < 0 ? 1 : product.quantity - 1,
            };
          }

          return product;
        }),
      );

      await AsyncStorage.setItem(
        '@goBarber:products',
        JSON.stringify(products),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
