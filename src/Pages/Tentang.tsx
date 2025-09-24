import React from 'react';

const Tentang = () => {
  return (
     <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-blue-100">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-4">
          Tentang KostumKita
        </h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          Misi kami adalah membuat setiap momen spesial Anda menjadi lebih berkesan dengan kostum terbaik.
        </p>

        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Kisah Kami</h2>
            <p className="text-gray-700 leading-relaxed">
              Berawal dari kecintaan kami terhadap dunia cosplay dan teater, KostumKita didirikan pada tahun 2023 dengan satu tujuan sederhana: menyediakan akses mudah bagi siapa saja untuk menyewa kostum berkualitas tinggi tanpa harus mengeluarkan biaya besar. Kami percaya bahwa mengenakan kostum yang tepat dapat mengubah sebuah acara biasa menjadi kenangan yang tak terlupakan.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Apa yang Kami Tawarkan?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Kami menawarkan ribuan pilihan kostum unik untuk segala jenis acara, mulai dari pesta ulang tahun anak, acara perusahaan, hingga perayaan Halloween dan festival budaya. Setiap kostum dalam koleksi kami dirawat dengan standar kebersihan tertinggi dan diperiksa kualitasnya secara berkala untuk memastikan Anda mendapatkan yang terbaik.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Koleksi Lengkap & Beragam</li>
              <li>Kualitas Terbaik & Terawat</li>
              <li>Harga Sewa Terjangkau</li>
              <li>Proses Peminjaman yang Mudah & Cepat</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Tim Kami</h2>
            <p className="text-gray-700 leading-relaxed">
              Di balik KostumKita, ada tim yang bersemangat dan berdedikasi untuk memberikan pelayanan terbaik. Kami adalah para penggemar budaya pop, desainer, dan event organizer yang siap membantu Anda menemukan kostum impian Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tentang;