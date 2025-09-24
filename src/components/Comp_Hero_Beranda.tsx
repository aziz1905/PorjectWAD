export default function HeroProduct() {
  return (
     <section className="bg-blue-800 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-16 lg:flex lg:h-[550px] lg:items-center">
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
              className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-gray-300 focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
            >
              Lihat Katalog
            </a>

            <a
              href="#"
              className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white  hover:text-gray-300 hover:border-none focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
