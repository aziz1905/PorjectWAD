import React, { useState, useEffect } from 'react';
import PesananButton from '../../components/Comp_Button.tsx';
import { Icon } from '@iconify/react';
import Products from '../../data/Produk.ts';
import { Product } from '../../types.ts';     

type CartItem = Product & {
  quantity: number;
  selected: boolean;
};

// ✅ Buat data keranjang dummy dari data Produk.ts
// Kita ambil 4 produk pertama dan tambahkan properti 'quantity' dan 'selected'
const initialCartItems: CartItem[] = Products.slice(0, 4).map(product => ({
  ...product,
  quantity: 1,
  selected: true,
}));

// Fungsi untuk memformat angka menjadi format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const Keranjang = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => {
      if (item.selected) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);
    setTotalPrice(newTotal);
  }, [cartItems]);

  // ✅ Sesuaikan tipe ID menjadi string jika di data Produk.ts ID-nya string
  const handleQuantityChange = (id: string, amount: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const handleSelectChange = (id: string) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setCartItems(currentItems =>
      currentItems.map(item => ({ ...item, selected: checked }))
    );
  };
  
  const allSelected = cartItems.every(item => item.selected);

  return (
    <> {/* Menggunakan Fragment karena div terluar sudah ada di Pesanan.tsx */}
      {/* Header Tabel */}
      <div className="pesanan-header">
        {/* ... (Konten header tidak berubah) ... */}
      </div>

      {/* Daftar Item */}
      <div className="pesanan-items-list">
        {cartItems.map(item => (
          <div key={item.id} className="pesanan-item">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                className="pesanan-checkbox" 
                checked={item.selected}
                onChange={() => handleSelectChange(item.id)}
              />
              {/* ✅ Gunakan imageUrl dari data produk */}
              <img src={item.imageUrl} alt={item.name} className="pesanan-item-image" />
              <p className="pesanan-item-name">{item.name}</p>
            </div>
            <p>{formatRupiah(item.price)}</p>
            <div className="quantity-control">
              <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
              <input type="text" value={item.quantity} readOnly />
              <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
            </div>
            <p className="font-bold text-blue-600">{formatRupiah(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>
      
      {/* Ringkasan & Checkout */}
      <div className="pesanan-summary">
        {/* ... (Konten summary tidak berubah) ... */}
      </div>
    </>
  );
};

export default Keranjang;