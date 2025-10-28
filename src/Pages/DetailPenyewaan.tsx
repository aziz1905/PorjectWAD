import React, { useState } from 'react';
// Ralat: '@iconify/react' tidak dapat diselesaikan. Import ini dialih keluar.
// import { Icon } from '@iconify/react';
// 1. Import hook yang diperlukan
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; // Path dikekalkan, diandaikan betul
import api from '../api'; // Path dikekalkan, diandaikan betul
import { Product } from '../type'; // Sesuaikan path jika perlu

// Helper function untuk format Rupiah (tetap sama)
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

// 2. Tipe data CartItem (bisa diimpor dari Keranjang.tsx jika ada file type global)
type CartItem = Product & {
  quantity: number;
  duration: number;
  selectedSize?: string; // Tambahkan ini jika ada
};

// 3. Hapus data dummy (checkoutItems dan userAddress)
const paymentMethods = ['Transfer Bank', 'Bayar Tunai Di Mitra', 'E-Wallet', 'COD'];

// Komponen Utama
const DetailPenyewaan = () => {
  const [selectedPayment, setSelectedPayment] = useState('Transfer Bank');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // 4. Ambil data user asli

  // 5. Ambil data item dari state navigasi
  const { itemsToCheckout, product, quantity, selectedSize } = (location.state || {}) as {
    itemsToCheckout?: CartItem[];
    product?: Product;
    quantity?: number;
    selectedSize?: string;
  };

  // 6. Normalisasi data: Tentukan item yang akan di-checkout
  let checkoutItems: CartItem[] = [];
  if (itemsToCheckout) {
    // Dari keranjang
    checkoutItems = itemsToCheckout;
  } else if (product && quantity) {
    // Dari halaman detail produk
    // Pastikan product.id dikonversi ke string jika perlu (sesuai tipe Product)
    const productItem = {
      ...product,
      id: String(product.id), // Konversi ID jika perlu
      quantity: quantity,
      duration: 3, // Asumsi durasi default 3 hari jika dari detail
      selectedSize: selectedSize
    };
    checkoutItems = [productItem as CartItem]; // Pastikan tipe sesuai
  }


  // 7. Ambil data alamat asli dari user
  const userAddress = {
    name: user?.fullName || 'Nama Pengguna',
    phone: user?.phone || 'No. Telepon Belum Diisi',
    address: user?.address || 'Alamat Belum Diisi',
  };

  // Kalkulasi (tetap sama, tapi gunakan checkoutItems yang sudah dinormalisasi)
  const subTotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity * (item.duration || 3)), 0);
  const shippingCost = 15000; // Contoh biaya pengiriman
  const totalPayment = subTotal + shippingCost;

  // 8. Fungsi untuk submit pesanan
  const handleBuatPesanan = async () => {
    if (!user) {
      setError("Anda harus login untuk membuat pesanan.");
      return;
    }
    if (checkoutItems.length === 0) {
      setError("Tidak ada item di keranjang.");
      return;
    }
    if (!user.address || !user.phone || user.address === 'Alamat Belum Diisi' || user.phone === 'No. Telepon Belum Diisi') { // Tambahkan pengecekan nilai default
      setError("Harap lengkapi alamat dan nomor telepon di Setting Akun sebelum melanjutkan.");
      return;
    }


    setIsLoading(true);
    setError(null);

    // Siapkan data detail untuk API
    const details = checkoutItems.map(item => ({
      productId: item.id,
      unitPrice: item.price,
      duration: item.duration || 3,
      unit: item.quantity,
      subtotal: item.price * item.quantity * (item.duration || 3),
      sizeName: item.selectedSize || (Array.isArray(item.sizes) ? item.sizes[0] : 'M') // Ambil size
    }));

    // Siapkan data rental untuk API
    const rentalData = {
      totalProduct: checkoutItems.reduce((sum, item) => sum + item.quantity, 0),
      shippingCost: shippingCost,
      totalPayment: totalPayment,
      shippingAddress: user.address, // Gunakan alamat dari user context
      paymentMethod: selectedPayment.replace(' ', '_'), // 'Transfer Bank' -> 'Transfer_Bank'
      details: details
    };


    try {
      // Panggil API
      const response = await api.post('/rentals/createRental', rentalData);

      // Sukses! Arahkan ke halaman status atau histori
      alert(`Pesanan ${response.data.rentalId} berhasil dibuat!`);
      navigate('/pesanan/pengiriman'); // Arahkan ke halaman pengiriman

    } catch (err: any) {
      console.error("Gagal membuat pesanan:", err);
      setError(err.response?.data?.message || 'Gagal membuat pesanan. Stok mungkin habis atau data tidak valid.');
    } finally {
      setIsLoading(false);
    }
  };

  // 9. Tampilkan pesan jika tidak ada item
  if (checkoutItems.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Keranjang / Item Kosong</h2>
        <p className="text-gray-500 mt-2">Silakan tambahkan produk untuk disewa.</p>
      </div>
    );
  }


  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* === 1. Alamat Pengiriman (Data Asli) === */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
             {/* Ralat: '@iconify/react' tidak tersedia. Menggunakan emoji sebagai ganti ikon. */}
            <span className="text-xl text-blue-600" role="img" aria-label="marker">📍</span>
            <h2 className="text-lg font-bold text-gray-800">Alamat Pengiriman</h2>
          </div>
          <div className="border-t pt-4 text-gray-700">
            <p className="font-semibold">{userAddress.name} ({userAddress.phone})</p>
            <p>{userAddress.address}</p>
            {(userAddress.address === 'Alamat Belum Diisi' || userAddress.phone === 'No. Telepon Belum Diisi') && (
              <p className="text-sm text-red-600 mt-2">
                Alamat atau Telepon belum lengkap. Harap perbarui di <a href="/settings" className="font-bold underline">Setting Akun</a>.
              </p>
            )}
          </div>
        </div>

        {/* === 2. Produk Dipesan (Data dari Navigasi) === */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
           <div className="flex items-center gap-3 mb-4">
             {/* Ralat: '@iconify/react' tidak tersedia. Menggunakan emoji sebagai ganti ikon. */}
            <span className="text-xl text-blue-600" role="img" aria-label="package">📦</span>
            <h2 className="text-lg font-bold text-gray-800">Produk Dipesan</h2>
          </div>
          <div className="border-t pt-4 space-y-4">
             {/* Header Tabel */}
            <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr] text-sm font-semibold text-gray-500">
              <span>Produk</span>
              <span className="text-center">Harga Satuan</span>
              <span className="text-center">Jumlah</span>
              <span className="text-right">Sub Total</span>
            </div>
            {/* Item List */}
            {checkoutItems.map(item => (
              // Gunakan kombinasi ID dan ukuran sebagai kunci jika memungkinkan
              <div key={`${item.id}-${item.selectedSize || 'default'}`} className="grid grid-cols-2 md:grid-cols-[3fr_1fr_1fr_1fr] items-center gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md bg-gray-100 object-cover"/>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    {/* Tampilkan ukuran jika ada */}
                    {item.selectedSize && <p className="text-xs text-gray-500">Ukuran: {item.selectedSize}</p>}
                    <p className="text-sm text-gray-500">{item.duration || 3} hari</p>
                  </div>
                </div>
                <p className="text-center text-gray-600 hidden md:block">{formatRupiah(item.price)}</p>
                <p className="text-center text-gray-600 hidden md:block">{item.quantity}</p>
                <p className="text-right font-semibold">{formatRupiah(item.price * item.quantity * (item.duration || 3))}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <span className="font-semibold">Total Pesanan</span>
            <span className="font-bold text-lg">{formatRupiah(subTotal)}</span>
          </div>
        </div>


        {/* === 3. Metode Pembayaran (Tetap sama) === */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Metode Pembayaran</h2>
          <div className="flex flex-wrap gap-3">
            {paymentMethods.map(method => (
              <button
                key={method}
                onClick={() => setSelectedPayment(method)}
                className={`px-4 py-2 text-sm font-semibold border rounded-lg transition-colors ${
                  selectedPayment === method
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* === 4. Total Pembayaran (Tombol diubah) === */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Total Pembayaran</h2>
           <div className="flex justify-between items-center text-gray-600">
            <span>Subtotal Produk</span>
            <span>{formatRupiah(subTotal)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>Biaya Pengiriman</span>
            <span>{formatRupiah(shippingCost)}</span>
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between items-center font-bold text-xl">
            <span>Total</span>
            <span className="text-blue-600">{formatRupiah(totalPayment)}</span>
          </div>

          {/* Tampilkan Error jika ada */}
          {error && (
            <div className="text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</div>
          )}

          <button
            onClick={handleBuatPesanan}
            disabled={isLoading || !user?.address || !user?.phone || user?.address === 'Alamat Belum Diisi' || user?.phone === 'No. Telepon Belum Diisi'} // Nonaktifkan jika loading atau alamat/telepon kosong/default
            className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses Pesanan...' : 'Buat Pesanan'}
          </button>
        </div>


      </div>
    </div>
  );
};

export default DetailPenyewaan;

