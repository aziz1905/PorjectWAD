import backgroundImage from '../assets/Props1.png';

export default function HeroProduct() {
  return (
    // 1. Tambahkan `relative` dan gunakan prop `style` untuk background
    <section 
      className="relative text-white" // Hapus bg-blue-800 dari sini
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 2. Tambahkan div overlay untuk membuat teks lebih mudah dibaca */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* 3. Bungkus konten utama dan beri `relative` agar berada di atas overlay */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-16 lg:flex lg:h-[550px] lg:items-center">
        <div className="mx-auto max-w-3xl text-center lg:text-left lg:mx-0">
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Sewa Kostum Terbaik,
            <strong className="mt-2 block font-extrabold text-sky-400">
              Ciptakan Momen Spesialmu.
            </strong>
          </h1>

          <p className="mt-6 max-w-lg mx-auto sm:text-xl/relaxed lg:mx-0">
            Jelajahi ribuan pilihan kostum unik untuk segala jenis acara. Kualitas terbaik dengan harga sewa yang terjangkau dan proses yang mudah.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <a
              href="#"
              className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
            >
              Lihat Katalog
            </a>
            <a
              href="#"
              className="block w-full rounded border border-white px-12 py-3 text-sm font-medium text-white hover:bg-white hover:text-blue-800 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}