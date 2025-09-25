import React from 'react';
import { Icon } from '@iconify/react';
import Testimonial from '../components/Comp_Review';

const Tentang = () => {
  return (
      <div className="bg-gray-50">
      <div className="tentang-container">

        <header className="tentang-header">
          <div className="tentang-header-content inline-grid gap-x-4">
            <div className="flex items-center gap-x-0">
              <h1 className="text-4xl font-bold text-gray-200">Tentang </h1>
              <h1 className="opacity-0
              ">|||</h1>
              <h1 className="text-4xl font-bold text-sky-400">Kostum</h1>
              <h1 className="text-4xl font-bold text-gray-200">Kita</h1>
              <h1 className="text-4xl font-bold text-sky-400">.</h1>
            </div>
            <p className="mt-4 text-lg text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="tentang-header-image">

            <Icon icon="mdi:account-group" className="text-gray-300 w-32 h-32" />
          </div>
        </header>
        <div className="margin-side-content">
           <section className="tentang-section">
          <h2 className="section-title">Cara Kerja Website KostumKita</h2>
          <div className="cara-kerja-grid">
            <div className="cara-kerja-card">
              <div className="cara-kerja-number">1</div>
              <div>
                <h3 className="card-title">Pilih Kostum</h3>
                <p className="card-text">Jelajahi ribuan koleksi dan temukan kostum impian Anda.</p>
              </div>
            </div>
            <div className="cara-kerja-card">
              <div className="cara-kerja-number">2</div>
              <div>
                <h3 className="card-title">Sewa & Bayar</h3>
                <p className="card-text">Pilih tanggal sewa dan lakukan pembayaran dengan aman.</p>
              </div>
            </div>
            <div className="cara-kerja-card">
              <div className="cara-kerja-number">3</div>
              <div>
                <h3 className="card-title">Pakai & Kembalikan</h3>
                <p className="card-text">Nikmati momen spesial Anda dan kembalikan kostum dengan mudah.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="tentang-section">
          <h2 className="section-title">Layanan KostumKita</h2>
          <div className="layanan-grid">
            <div className="layanan-item">
              <Icon icon="mdi:hanger" className="layanan-icon"/>
              <p>Sewa Kostum</p>
            </div>
            
            <div className="layanan-item">
              <Icon icon="mdi:magic-staff" className="layanan-icon"/>
              <p>Aksesoris</p>
            </div>
          </div>
        </section>

        <section className="tentang-section">
          <div className="visi-misi-grid">
            <div className="visi-misi-card">
              <h3 className="card-title text-2xl">Visi KostumKita</h3>
              <p className="card-text mt-2">Menjadi platform penyewaan kostum nomor satu di Indonesia yang menginspirasi kreativitas dan momen tak terlupakan bagi semua orang.</p>
            </div>
            <div className="visi-misi-card">
              <h3 className="card-title text-2xl">Misi KostumKita</h3>
              <p className="card-text mt-2">Menyediakan koleksi kostum terlengkap dengan kualitas terbaik, proses peminjaman yang mudah, dan layanan pelanggan yang luar biasa.</p>
            </div>
          </div>
        </section>
        </div>
      </div>
      <Testimonial />
    </div>
  );
};

export default Tentang;