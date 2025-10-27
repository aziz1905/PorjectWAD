import React, { useState, useEffect } from 'react';
import PesananButton from '../../components/Comp_Button.tsx';
import { Icon } from '@iconify/react';
import Products from '../../data/Produk.ts';
import { Product } from '../../type.ts';
import { Link } from 'react-router-dom';

// Tipe data untuk item di keranjang
type CartItem = Product & {
  quantity: number;
  selected: boolean;
  duration: number; // Durasi sewa dalam hari
};

// Ambil 4 produk pertama sebagai data dummy untuk keranjang
const initialCartItems: CartItem[] = Products.slice(0, 4).map(product => ({
  ...product,
  // Pastikan ID di-convert ke string jika tipe di Produk.ts adalah angka
  id: String(product.id),
  quantity: 1,
  selected: true,
  duration: 3,
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
        // Logika perhitungan harga Anda sebelumnya
        // const dur=0.5;
        // return sum + (item.price * item.quantity * (item.duration*dur));
      
        // Logika yang lebih standar (harga * jumlah * durasi)
        return sum + (item.price * item.quantity * item.duration);
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

  // Fungsi untuk Hapus Item (Versi Dummy)
  const handleRemoveItem = (id: string) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setCartItems(currentItems =>
      currentItems.map(item => ({ ...item, selected: checked }))
    );
  };
 
  const allSelected = cartItems.length > 0 && cartItems.every(item => item.selected);

  // Tampilkan pesan jika keranjang kosong
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <Icon icon="mdi:cart-off" className="text-6xl mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Keranjang Anda Kosong</h2>
        <p className="mb-6">Ayo cari kostum favoritmu!</p>
        <Link to="/beranda" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Mulai Belanja
        </Link>
      </div>
    );
  }

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
          <label>Pilih Semua ({cartItems.length} item)</label>
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
              <img src={item.imageUrl} alt={item.name} className="bg-gray-200 rounded-lg h-16 w-16 object-cover" />
              <div>
                <p className="pesanan-item-name">{item.name}</p>
                <p className="text-sm text-gray-500">Ukuran: {Array.isArray(item.sizes) ? item.sizes[0] : 'All Size'}</p>
              </div>
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
            <div className="flex items-center justify-between">
              <p className="font-bold text-blue-600">{formatRupiah(item.price * item.quantity * item.duration)}</p>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-gray-400 hover:text-red-500 p-1"
                title="Hapus item"
              >
                  <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
              </button>
            </div>
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
          <Link to="/detail-penyewaan" state={{ itemsToCheckout: cartItems.filter(item => item.selected) }}>
          <PesananButton
            buttonType="p_pesanSekarang"
            logoChild={<Icon icon="mdi:login" className="text-white text-2xl" />}
           fontChild={`Sewa Sekarang (${cartItems.filter(item => item.selected).length})`}
            disabled={cartItems.filter(item => item.selected).length === 0}
          />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Keranjang;