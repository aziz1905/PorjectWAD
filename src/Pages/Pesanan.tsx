import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

// Tipe data untuk setiap item di keranjang
type CartItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selected: boolean;
};

// Data dummy, nantinya bisa dari API
const initialCartItems: CartItem[] = [
  { id: 1, name: 'Kostum Superhero Anak', image: 'https://placehold.co/150x100/e2e8f0/e2e8f0', price: 50000, quantity: 1, selected: true },
  { id: 2, name: 'Gaun Princess Elsa', image: 'https://placehold.co/150x100/e2e8f0/e2e8f0', price: 75000, quantity: 1, selected: true },
  { id: 3, name: 'Topeng Darth Vader', image: 'https://placehold.co/150x100/e2e8f0/e2e8f0', price: 25000, quantity: 2, selected: false },
  { id: 4, name: 'Jubah Penyihir Hogwarts', image: 'https://placehold.co/150x100/e2e8f0/e2e8f0', price: 60000, quantity: 1, selected: true },
];

// Fungsi untuk memformat angka menjadi format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const Pesanan = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [totalPrice, setTotalPrice] = useState(0);

  // Hitung ulang total harga setiap kali ada perubahan pada cartItems
  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => {
      if (item.selected) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);
    setTotalPrice(newTotal);
  }, [cartItems]);

  // Fungsi untuk mengubah kuantitas
  const handleQuantityChange = (id: number, amount: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) } // Kuantitas minimal 1
          : item
      )
    );
  };

  // Fungsi untuk mengubah status terpilih (selected)
  const handleSelectChange = (id: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Fungsi untuk memilih/batal memilih semua item
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setCartItems(currentItems =>
      currentItems.map(item => ({ ...item, selected: checked }))
    );
  };
  
  const allSelected = cartItems.every(item => item.selected);

  return (
    <div className="pesanan-bg">
      <div className="pesanan-container">
        
        {/* Header Tabel */}
        <div className="pesanan-header">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="pesanan-checkbox"
              checked={allSelected}
              onChange={handleSelectAll} 
            />
            <label>Pilih Semua</label>
          </div>
          <span>Produk</span>
          <span>Harga Sewa</span>
          <span>Jumlah Sewa</span>
          <span>Total Harga</span>
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
                <img src={item.image} alt={item.name} className="pesanan-item-image" />
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
          <div className="summary-content">
            <h3 className="text-xl font-bold">Ringkasan Sewa</h3>
            <div className="summary-total">
              <span>Total</span>
              <span className="text-2xl font-bold text-blue-600">{formatRupiah(totalPrice)}</span>
            </div>
            <button className="checkout-button">
              Sewa Sekarang ({cartItems.filter(item => item.selected).length})
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pesanan;