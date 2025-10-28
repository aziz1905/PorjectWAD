import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

import { Product } from '../Admin/types';

// Tipe data untuk item di keranjang dalam Context
export type CartItem = Product & {
  cartItemId: string; // ID unik untuk item dalam keranjang (cth: produkId-ukuran)
  selectedSize: string; // Ukuran yang dipilih pengguna
  quantity: number;
  duration: number; // Durasi sewa dalam hari
  // Tidak perlu 'selected' di sini, ia akan diurus di komponen Keranjang
};

// Tipe untuk nilai Context
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size: string, quantity: number, duration: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItem: (cartItemId: string, updates: Partial<Pick<CartItem, 'quantity' | 'duration'>>) => void;
  clearCart: () => void;
  itemCount: number;
}

// Cipta Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook untuk menggunakan Context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart mesti digunakan di dalam CartProvider');
  }
  return context;
};

// Komponen Provider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  // State untuk menyimpan item keranjang, cuba muat dari localStorage dulu
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem('shoppingCart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Gagal memuat keranjang dari localStorage:", error);
      return [];
    }
  });

  // Simpan ke localStorage setiap kali cartItems berubah
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error("Gagal menyimpan keranjang ke localStorage:", error);
    }
  }, [cartItems]);


  // Fungsi untuk menambah item ke keranjang
  const addToCart = (product: Product, size: string, quantity: number, duration: number) => {
    setCartItems(prevItems => {
      // Cipta ID unik berdasarkan produk dan ukuran
      const cartItemId = `${product.id}-${size}`;
      const existingItemIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);

      if (existingItemIndex > -1) {
        // Jika item sudah ada, kemaskini kuantiti dan durasi (ambil yang terbaru)
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity, // Tambah kuantiti
          duration: duration // Guna durasi terbaru
        };
        return updatedItems;
      } else {
        // Jika item baru, tambah ke senarai
        const newItem: CartItem = {
          ...product,
          cartItemId: cartItemId,
          selectedSize: size,
          quantity: quantity,
          duration: duration,
        };
        return [...prevItems, newItem];
      }
    });
  };

  // Fungsi untuk membuang item dari keranjang
  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  };

  // Fungsi untuk mengemaskini kuantiti atau durasi item
  const updateCartItem = (cartItemId: string, updates: Partial<Pick<CartItem, 'quantity' | 'duration'>>) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemId
          ? {
              ...item,
              // Pastikan nilai tidak kurang dari 1
              quantity: updates.quantity !== undefined ? Math.max(1, updates.quantity) : item.quantity,
              duration: updates.duration !== undefined ? Math.max(1, updates.duration) : item.duration,
            }
          : item
      )
    );
  };

  // Fungsi untuk mengosongkan keranjang
  const clearCart = () => {
    setCartItems([]);
  };

  // Kira jumlah item unik dalam keranjang
  const itemCount = cartItems.length;

  // Nilai yang akan disediakan oleh Context
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
