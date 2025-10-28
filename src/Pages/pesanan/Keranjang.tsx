import React, { useState, useEffect } from 'react';
import { useCart } from '../../components/CartContext';
import PesananButton from '../../components/Comp_Button.tsx';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

// Fungsi format Rupiah (kekal sama)
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Komponen Keranjang
const Keranjang = () => {
  // 5. Guna state dari context
  const { cartItems, removeFromCart, updateCartItem } = useCart();

  // 6. State lokal untuk item yang dipilih UNTUK checkout
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});

  // 7. State lokal untuk harga total item yang DIPILIH
  const [totalPrice, setTotalPrice] = useState(0);

  // Inisialisasi item terpilih semasa muat (pilih semua secara lalai)
   useEffect(() => {
     const initialSelected: { [key: string]: boolean } = {};
     cartItems.forEach(item => {
       initialSelected[item.cartItemId] = true; // Pilih semua secara lalai
     });
     setSelectedItems(initialSelected);
   }, [cartItems]); // Jalankan semula jika cartItems berubah

  // Kesan perubahan pada cartItems ATAU selectedItems untuk mengira semula harga total
  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => {
      // Hanya kira jika item ada dalam state cart DAN dipilih dalam state lokal
      if (selectedItems[item.cartItemId]) {
        // Guna harga dari item context
        return sum + (item.price * item.quantity * item.duration);
      }
      return sum;
    }, 0);
    setTotalPrice(newTotal);
  }, [cartItems, selectedItems]); // Bergantung pada kedua-dua state

  // 8. Handler guna fungsi dari context
  const handleQuantityChange = (cartItemId: string, amount: number) => {
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (item) {
      updateCartItem(cartItemId, { quantity: item.quantity + amount });
    }
  };

  const handleDurationChange = (cartItemId: string, amount: number) => {
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (item) {
      updateCartItem(cartItemId, { duration: item.duration + amount });
    }
  };

  // Handler untuk checkbox item individu (state lokal)
  const handleSelectChange = (cartItemId: string) => {
    setSelectedItems(prevSelected => ({
      ...prevSelected,
      [cartItemId]: !prevSelected[cartItemId],
    }));
  };

  // Handler untuk checkbox "Pilih Semua" (state lokal)
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const newSelectedItems: { [key: string]: boolean } = {};
    cartItems.forEach(item => {
      newSelectedItems[item.cartItemId] = checked;
    });
    setSelectedItems(newSelectedItems);
  };

  // Kira sama ada semua item DIPILIH (berdasarkan state lokal)
   const allSelected = cartItems.length > 0 && cartItems.every(item => selectedItems[item.cartItemId]);
   // Kira jumlah item yang DIPILIH
   const selectedCount = Object.values(selectedItems).filter(isSelected => isSelected).length;

  // Tampilkan pesan jika keranjang kosong (guna cartItems dari context)
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        {/* Guna emoji jika Iconify bermasalah */}
        <span className="text-6xl mx-auto mb-4" role="img" aria-label="empty cart">🛒💨</span>
        {/* <Icon icon="mdi:cart-off" className="text-6xl mx-auto mb-4" /> */}
        <h2 className="text-2xl font-semibold mb-2">Keranjang Anda Kosong</h2>
        <p className="mb-6">Ayo cari kostum favoritmu!</p>
        <Link to="/beranda" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  // Siapkan data untuk dihantar ke checkout (hanya item yang dipilih)
   const itemsToCheckout = cartItems.filter(item => selectedItems[item.cartItemId]);


  return (
    <>
      {/* Header (kekal sama, tapi guna cartItems.length) */}
      <div className="pesanan-header">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            className="pesanan-checkbox"
            checked={allSelected}
            onChange={handleSelectAll}
            disabled={cartItems.length === 0} // Nonaktifkan jika tiada item
          />
          {/* Tunjuk jumlah item dalam keranjang */}
          <label>Pilih Semua ({cartItems.length} item)</label>
        </div>
        <span>Produk</span>
        <span>Harga Sewa / Hari</span>
        <span>Jumlah Sewa</span>
        <span>Jangka Sewa</span>
        <span>Total Harga</span>
      </div>

      {/* Senarai Item (map dari cartItems context) */}
      <div className="pesanan-items-list">
        {cartItems.map(item => (
          <div key={item.cartItemId} className="pesanan-item"> {/* Guna cartItemId */}
            <div className="flex items-center gap-5">
              <input
                type="checkbox"
                className="pesanan-checkbox"
                // Checked berdasarkan state lokal selectedItems
                checked={!!selectedItems[item.cartItemId]}
                onChange={() => handleSelectChange(item.cartItemId)}
              />
              <img src={item.imageUrl} alt={item.name} className="bg-gray-200 rounded-lg h-16 w-16 object-cover" />
              <div>
                <p className="pesanan-item-name">{item.name}</p>
                 {/* Tunjuk ukuran yang dipilih */}
                <p className="text-sm text-gray-500">Ukuran: {item.selectedSize}</p>
              </div>
            </div>
            <p>{formatRupiah(item.price)}</p>
            {/* Butang kuantiti guna cartItemId */}
            <div className="quantity-control">
              <button className='button-quantity-duration-l' onClick={() => handleQuantityChange(item.cartItemId, -1)}>-</button>
              <input type="text" value={item.quantity} readOnly className="w-12 text-center" />
              <button className="button-quantity-duration-r" onClick={() => handleQuantityChange(item.cartItemId, 1)}>+</button>
            </div>
             {/* Butang durasi guna cartItemId */}
            <div className="quantity-control">
              <button className='button-quantity-duration-l' onClick={() => handleDurationChange(item.cartItemId, -1)}>-</button>
              <input type="text" value={`${item.duration} Hari`} readOnly className="w-20 text-center" />
              <button className="button-quantity-duration-r" onClick={() => handleDurationChange(item.cartItemId, 1)}>+</button>
            </div>
            {/* Total harga dan butang hapus */}
            <div className="flex items-center justify-between">
              <p className="font-bold text-blue-600">{formatRupiah(item.price * item.quantity * item.duration)}</p>
              <button
                // Guna removeFromCart dari context
                onClick={() => removeFromCart(item.cartItemId)}
                className="text-gray-400 hover:text-red-500 p-1"
                title="Hapus item"
              >
                {/* Guna emoji jika Iconify bermasalah */}
                <span role="img" aria-label="delete">🗑️</span>
                {/* <Icon icon="mdi:trash-can-outline" className="w-5 h-5" /> */}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ringkasan (guna totalPrice dari state lokal dan selectedCount) */}
      <div className="pesanan-summary">
        <div className="summary-content">
          <h3 className="text-xl font-bold">Ringkasan Sewa</h3>
          <div className="summary-total">
            <span>Total</span>
            {/* Guna totalPrice dari state lokal */}
            <span className="text-2xl font-bold text-blue-600">{formatRupiah(totalPrice)}</span>
          </div>
          {/* Hantar itemsToCheckout (yang sudah ditapis) ke halaman seterusnya */}
          <Link to="/detail-penyewaan" state={{ itemsToCheckout: itemsToCheckout }}>
            <PesananButton
              buttonType="p_pesanSekarang"
              // Guna emoji jika Iconify bermasalah
              logoChild={<span role="img" aria-label="checkout" className="text-white text-2xl">➡️</span>}
              // logoChild={<Icon icon="mdi:arrow-right-bold-box-outline" className="text-white text-2xl" />}
              // Tunjuk jumlah item yang DIPILIH
              fontChild={`Sewa Sekarang (${selectedCount})`}
              // Nonaktifkan jika tiada item dipilih
              disabled={selectedCount === 0}
            />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Keranjang;