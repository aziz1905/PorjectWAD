// src/components/Comp_Reviews.tsx

import React from 'react';

// Data dummy untuk ulasan, bisa Anda ganti dengan data asli
const reviewsData = [
  {
    imageUrl: 'https://images.unsplash.com/photo-1599330282574-d27e745913e2?q=80&w=1887&auto=format&fit=crop',
    category: 'Pesta Ulang Tahun',
    title: 'Kostum Spiderman Jadi Bintang Acara!',
    description: 'Anak saya senang sekali memakai kostum Spiderman dari KostumKita. Bahannya nyaman dan detailnya keren. Semua teman-temannya minta foto bareng!',
    author: {
      name: 'Rina S.',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1542838223-970681a001a1?q=80&w=1887&auto=format&fit=crop',
    category: 'Acara Kantor',
    title: 'Tampil Profesional dengan Kostum Bertema',
    description: 'Untuk acara tahunan kantor, kami menyewa kostum tema 80-an. Kualitasnya bagus, bersih, dan ukurannya pas. Tim kami jadi pusat perhatian!',
    author: {
      name: 'Budi Hartono',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
  },
  {
    imageUrl: 'https://images.unsplash.com/photo-1521478330007-152f6f34e6b3?q=80&w=1887&auto=format&fit=crop',
    category: 'Pernikahan',
    title: 'Gaun Pengantin Tradisional yang Memukau',
    description: 'Menyewa gaun pengantin tradisional di sini adalah keputusan terbaik. Harganya terjangkau dan gaunnya terlihat sangat mewah dan elegan di hari spesial kami.',
    author: {
      name: 'Dewi & Angga',
      avatarUrl: 'https://images.unsplash.com/photo-1521124234389-03ac55b5ba47?w=500',
    },
  },
];

const Comp_Reviews: React.FC = () => {
  return (
    <div className="bg-blue-900 py-16 sm:py-24">
      <div className="margin-side-content">
        {/* Judul Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Kata Mereka Tentang Kami
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-400">
            Simak pengalaman seru dari para pelanggan setia KostumKita.
          </p>
        </div>

        {/* Grid untuk Kartu Ulasan */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {reviewsData.map((review, index) => (
            <article key={index} className="flex flex-col items-start justify-between">
              {/* Gambar Ulasan */}
              <div className="relative w-full">
                <img
                  src={review.imageUrl}
                  alt=""
                  className="aspect-[16/9] w-full rounded-2xl bg-gray-800 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <span className="relative z-10 rounded-full bg-blue-600 px-3 py-1.5 font-medium text-white">
                    {review.category}
                  </span>
                </div>
                
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-white group-hover:text-gray-300">
                    <span className="absolute inset-0" />
                    {review.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-400">
                    {review.description}
                  </p>
                </div>

                {/* Info Penulis Ulasan */}
                <div className="relative mt-8 flex items-center gap-x-4">
                  <img src={review.author.avatarUrl} alt="" className="h-10 w-10 rounded-full bg-gray-800 object-cover" />
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-white">
                      {review.author.name}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comp_Reviews;