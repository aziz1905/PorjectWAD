import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Products from '../data/Produk';
import { Product } from '../type';

// Helper function untuk format Rupiah
const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

// Tipe data & Data Dummy untuk halaman ini
type CheckoutItem = Product & { quantity: number; duration: number };

const checkoutItems: CheckoutItem[] = Products.slice(0, 2).map(p => ({ ...p, quantity: 1, duration: 3 }));
const userAddress = { name: 'User Keren', phone: '081234567890', address: 'Jl. Kemang No. 17, Jakarta Timur, DKI Jakarta, 13310' };
const paymentMethods = ['Transfer Bank', 'Bayar Tunai Di Mitra', 'E-Wallet', 'COD'];

// Komponen Utama
const DetailPenyewaan = () => {
  const [selectedPayment, setSelectedPayment] = useState('Transfer Bank');

  const subTotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity * item.duration), 0);
  const shippingCost = 15000; // Contoh biaya pengiriman
  const totalPayment = subTotal + shippingCost;

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* === 1. Alamat Pengiriman === */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Icon icon="mdi:map-marker-outline" className="text-xl text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">Alamat Pengiriman</h2>
          </div>
          <div className="border-t pt-4 text-gray-700">
            <p className="font-semibold">{userAddress.name} ({userAddress.phone})</p>
            <p>{userAddress.address}</p>
          </div>
        </div>

        {/* === 2. Produk Dipesan === */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Icon icon="mdi:package-variant-closed" className="text-xl text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">Produk Dipesan</h2>
          </div>
          <div className="border-t pt-4 space-y-4">
            {/* Header */}
            <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr] text-sm font-semibold text-gray-500">
              <span>Produk</span>
              <span className="text-center">Harga Satuan</span>
              <span className="text-center">Jumlah</span>
              <span className="text-right">Sub Total</span>
            </div>
            {/* Item List */}
            {checkoutItems.map(item => (
              <div key={item.id} className="grid grid-cols-2 md:grid-cols-[3fr_1fr_1fr_1fr] items-center gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md bg-gray-100 object-cover"/>
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.duration} hari</p>
                  </div>
                </div>
                <p className="text-center text-gray-600 hidden md:block">{formatRupiah(item.price)}</p>
                <p className="text-center text-gray-600 hidden md:block">{item.quantity}</p>
                <p className="text-right font-semibold">{formatRupiah(item.price * item.quantity * item.duration)}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between items-center">
            <span className="font-semibold">Total Pesanan</span>
            <span className="font-bold text-lg">{formatRupiah(subTotal)}</span>
          </div>
        </div>

        {/* === 3. Metode Pembayaran === */}
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

        {/* === 4. Total Pembayaran === */}
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
          <button className="w-full bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors">
            Buat Pesanan
          </button>
        </div>

      </div>
    </div>
  );
};

export default DetailPenyewaan;