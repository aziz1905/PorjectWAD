import React, { useState, useEffect } from 'react';
import PesananButton from '../../components/Comp_Button.tsx';
import { Icon } from '@iconify/react';
import Products from '../../data/Produk.ts';
import { Product } from '../../types.ts';

// Tipe data untuk item di keranjang, gabungan dari Product + properti keranjang
type CartItem = Product & {
  quantity: number;
  selected: boolean;
};

// Ambil 4 produk pertama sebagai data dummy untuk keranjang
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

  // ✅ PERBAIKAN: Fungsi-fungsi event handler dirapikan
  // Fungsi untuk mengubah kuantitas
  const handleQuantityChange = (id: string, amount: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) } // Kuantitas minimal 1
          : item
      )
    );
  };

  // Fungsi untuk mengubah status terpilih (selected)
  const handleSelectChange = (id: string) => {
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
  
  // Cek apakah semua item sudah terpilih untuk status checkbox "Pilih Semua"
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  return (
    <>
      {/* Header Tabel */}
      <div className="pesanan-header">
        {/* ✅ DITAMBAHKAN: Bagian header "Pilih Semua" */}
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
        {/* ✅ DITAMBAHKAN: Bagian ringkasan sewa */}
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