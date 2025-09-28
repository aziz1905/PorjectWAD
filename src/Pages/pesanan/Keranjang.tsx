import React, { useState, useEffect } from 'react';
import PesananButton from '../../components/Comp_Button.tsx';
import { Icon } from '@iconify/react';
import Products from '../../data/Produk.ts';
import { Product } from '../../type.ts';

// Tipe data untuk item di keranjang
type CartItem = Product & {
  quantity: number;
  selected: boolean;
  duration: number; // Durasi sewa dalam hari
};

// Ambil 4 produk pertama sebagai data dummy untuk keranjang
const initialCartItems: CartItem[] = Products.slice(0, 4).map(product => ({
  ...product,
  quantity: 1,
  selected: true,
  duration: 3, // Default sewa 3 hari
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
        const dur=0.5;
        return sum + (item.price * item.quantity * (item.duration*dur));
      }
      return sum;
    }, 0);
    setTotalPrice(newTotal);
  }, [cartItems]);

  const handleQuantityChange = (id: string, amount: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const handleDurationChange = (id: string, amount: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, duration: Math.max(1, item.duration + amount) }
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
  
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  return (
    <>
      <div className="pesanan-header">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            className="pesanan-checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
          />
          <label>Pilih Semua</label>
        </div>
        <span>Produk</span>
        <span>Harga Sewa / Hari</span>
        <span>Jumlah Sewa</span>
        <span>Jangka Sewa</span>
        <span>Total Harga</span>
      </div>

      <div className="pesanan-items-list">
        {cartItems.map(item => (
          <div key={item.id} className="pesanan-item">
            <div className="flex items-center gap-5">
              <input 
                type="checkbox" 
                className="pesanan-checkbox" 
                checked={item.selected}
                onChange={() => handleSelectChange(item.id)}
              />
              <img src={item.imageUrl} alt="{item.name}" className="bg-gray-200 rounded-lg h-16 w-30 flex items-center justify-center" />
              <p className="pesanan-item-name">{item.name}</p>
            </div>
            <p>{formatRupiah(item.price)}</p>
            <div className="quantity-control">
              <button className='button-quantity-duration-l'onClick={() => handleQuantityChange(item.id, -1)}>-</button>
              <input 
                type="text" 
                value={item.quantity} 
                readOnly 
                className="w-12 text-center" 
              />
              <button className="button-quantity-duration-r"onClick={() => handleQuantityChange(item.id, 1)}>+</button>
            </div>
            <div className="quantity-control">
              <button className='button-quantity-duration-l' onClick={() => handleDurationChange(item.id, -1)}>-</button>
              <input 
                type="text" 
                value={`${item.duration} Hari`} 
                readOnly 
                className="w-20 text-center" 
              />
              <button className="button-quantity-duration-r" onClick={() => handleDurationChange(item.id, 1)}>+</button>
            </div>
            {/* Total harga per item */}
            <p className="font-bold text-blue-600">{formatRupiah(item.price * item.quantity * item.duration)}</p>
          </div>
        ))}
      </div>
      
      <div className="pesanan-summary">
        <div className="summary-content">
          <h3 className="text-xl font-bold">Ringkasan Sewa</h3>
          <div className="summary-total">
            <span>Total</span>
            <span className="text-2xl font-bold text-blue-600">{formatRupiah(totalPrice)}</span>
          </div>
          <PesananButton
            buttonType="p_pesanSekarang"
            logoChild={<Icon icon="mdi:login" className="text-white text-2xl" />}
            fontChild={`Sewa Sekarang (${cartItems.filter(item => item.selected).length})`}
          />
        </div>
      </div>
    </>
  );
};

export default Keranjang;