import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

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
      const productsStoraged = await AsyncStorage.getItem(
        '@GoMarketplace:products',
      );
      if (productsStoraged) {
        setProducts([...JSON.parse(productsStoraged)]);
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (product: Product) => {
      const productExist = products.find(p => p.id === product.id);
      if (productExist) {
        const productsAdded = products.map(p =>
          p.id === product.id
            ? {
                ...product,
                quantity: p.quantity + 1,
              }
            : p,
        );

        setProducts(productsAdded);
        await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify(productsAdded),
        );
      } else {
        const productsAdded = [...products, { ...product, quantity: 1 }];

        setProducts(productsAdded);
        await AsyncStorage.setItem(
          '@GoMarketplace:products',
          JSON.stringify(productsAdded),
        );
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productIncremented = products.map(product =>
        product.id === id
          ? {
              ...product,
              quantity: product.quantity + 1,
            }
          : product,
      );

      setProducts(productIncremented);
      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(productIncremented),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const product = products.find(p => p.id === id);
      let productDecremented = products;
      if (product && product.quantity > 1) {
        productDecremented = products.map(p =>
          p.id === product.id
            ? {
                ...product,
                quantity: product.quantity - 1,
              }
            : product,
        );
      }
      setProducts(productDecremented);
      await AsyncStorage.setItem(
        '@GoMarketplace:products',
        JSON.stringify(productDecremented),
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
