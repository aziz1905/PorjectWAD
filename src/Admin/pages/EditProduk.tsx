import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
// 1. Impor tipe yang benar: Product, ProductSize
import { Product, ProductSize } from '../types'; // Sesuaikan path jika perlu
import api from '../../api'; // Sesuaikan path jika perlu
import TambahProdukPopup from '../components/TambahProdukPopup'; // Sesuaikan path
import EditProdukPopup from '../components/EditProdukPopup'; // Sesuaikan path

// Tipe untuk data produk yang ditampilkan di tabel
type ProductDisplay = Product & {
  stockTotal: number;
};

const EditProduk: React.FC = () => {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State untuk Popup
  const [isAddPopupOpen, setAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setEditPopupOpen] = useState(false);
  // State untuk menyimpan data produk YANG AKAN DIEDIT
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Fungsi untuk fetch data produk
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Panggil API GET /products
      // TEMAN ANDA HARUS MEMASTIKAN ENDPOINT INI MENGEMBALIKAN:
      // - Array Product[]
      // - Setiap Product memiliki property 'sizes' yang berupa:
      //   - Array ProductSize[] (ideal, berisi { sizeName: 'S', stock: 10 })
      //   - ATAU Array string[] (kurang ideal, misal ['S', 'M'])
      const response = await api.get<Product[]>('/products');

      // Proses data untuk UI: hitung total stok
      const processedProducts = response.data.map(p => {
         // 2. Tambahkan type guard lebih robust untuk sizes saat reduce
         let totalStock = 0;
         if (Array.isArray(p.sizes) && p.sizes.length > 0) {
            // Cek elemen pertama untuk menentukan tipe array
            if (typeof p.sizes[0] === 'object' && p.sizes[0] !== null && 'stock' in p.sizes[0]) {
               // Ini adalah array ProductSize[]
               totalStock = (p.sizes as ProductSize[]).reduce((acc, size) => acc + (Number(size.stock) || 0), 0);
            } else {
               // Ini mungkin array string[], total stok tidak bisa dihitung dari sini
               totalStock = NaN; // Tandai sebagai tidak diketahui
               console.warn(`Produk ID ${p.id} hanya memiliki data nama ukuran, bukan stok.`);
            }
         } else if (p.sizes === "Stok Habis") {
             totalStock = 0; // Handle case "Stok Habis"
         }


         return {
            ...p,
             // Jika NaN, tampilkan '?' atau 0, selain itu tampilkan totalStock
            stockTotal: isNaN(totalStock) ? 0 : totalStock
         };
      });

      setProducts(processedProducts);
    } catch (err: any) {
      console.error("Gagal fetch produk:", err);
      setError(err.response?.data?.message || err.message || 'Gagal memuat data produk.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat komponen dimuat
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fungsi untuk hapus produk
  const handleDeleteProduct = async (productId: number, productName: string) => {
    // Gunakan konfirmasi browser (ganti dengan modal jika diinginkan)
    if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"?`)) {
      try {
        // TEMAN ANDA PERLU MEMBUAT ENDPOINT INI: DELETE /products/:id
        await api.delete(`/products/${productId}`);
        // Refresh daftar produk setelah berhasil hapus
        fetchProducts();
        alert(`Produk "${productName}" berhasil dihapus.`); // Feedback sukses
      } catch (err: any) {
        console.error("Gagal hapus produk:", err);
        alert('Gagal menghapus produk: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  // Fungsi untuk membuka popup Edit dan menyimpan data produknya
  const openEditPopup = (product: Product) => {
    setProductToEdit(product); // Simpan data produk yang akan diedit
    setEditPopupOpen(true);
  };

  const openAddPopup = () => {
    setAddPopupOpen(false); // Pastikan popup edit tertutup
    setProductToEdit(null); // Kosongkan data edit
    setAddPopupOpen(true);
  };

  // Filter produk berdasarkan pencarian nama atau ID
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 md:p-6"> {/* Tambahkan padding container */}
      {/* Judul Halaman */}
       <div className="flex items-center gap-2 mb-6">
          {/* Ganti ikon sesuai wireframe */}
          <Icon icon="mdi:pencil-box-outline" className="w-7 h-7 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-800">Edit Produk</h1> {/* Sesuaikan judul */}
       </div>


      {/* Header Halaman (Search & Add Button) */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 bg-white p-4 rounded-lg shadow">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Cari Nama / ID Produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <button
          onClick={openAddPopup}
          className="flex items-center bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition duration-150"
        >
          {/* Ganti ikon sesuai wireframe */}
          <Icon icon="mdi:plus-circle-outline" className="mr-2 w-5 h-5" />
          Tambahkan Produk
        </button>
      </div>

      {/* Konten (Tabel Produk) */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <Icon icon="mdi:loading" className="animate-spin text-blue-500 w-12 h-12" />
          </div>
        )}
        {error && (
          <div className="flex flex-col justify-center items-center h-64 text-red-500 p-4 text-center">
            <Icon icon="mdi:alert-circle-outline" className="w-12 h-12 mb-2" />
            <span className="text-lg font-medium">Oops! Terjadi Kesalahan</span>
            <span className="text-sm">{error}</span>
          </div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {/* Sesuaikan header tabel dengan wireframe */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Gambar & Nama Produk</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID Produk</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Stok Barang</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ukuran Tersedia (Stok)</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 && !loading && (
                     <tr>
                        <td colSpan={5} className="text-center p-8 text-gray-500">
                           Tidak ada produk yang cocok dengan pencarian Anda.
                        </td>
                     </tr>
                )}
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    {/* Gambar & Nama */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-md object-cover bg-gray-200"
                            src={product.imageUrl}
                            alt={product.name}
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/48x48/EEE/313131?text=?')}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          {/* Tampilkan gender/age jika perlu */}
                          {/* <div className="text-xs text-gray-500">{product.gender} / {product.age}</div> */}
                        </div>
                      </div>
                    </td>
                    {/* ID Produk */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700 font-mono">{product.id}</div>
                    </td>
                    {/* Total Stok -> Stok Barang */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.stockTotal > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {/* Tampilkan '?' jika total stok tidak diketahui */}
                        {product.stockTotal}
                      </span>
                    </td>
                     {/* Ukuran (Stok) */}
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {/* 3. Perbaiki logika tampilan sizes */}
                        {Array.isArray(product.sizes) && product.sizes.length > 0 ?
                            (typeof product.sizes[0] === 'object' ?
                                // Jika array ProductSize[]
                                (product.sizes as ProductSize[]).filter(size => size.stock > 0).map(size => ( // Filter stok > 0
                                    <span key={size.sizeName} className="text-xs bg-gray-200 px-2 py-0.5 rounded-full font-medium">
                                      {size.sizeName}: {size.stock}
                                    </span>
                                ))
                                :
                                // Jika array string[]
                                (product.sizes as string[]).map(sizeName => (
                                    <span key={sizeName} className="text-xs bg-gray-200 px-2 py-0.5 rounded-full font-medium">
                                      {sizeName}: ?
                                    </span>
                                ))
                            )
                            : product.sizes === "Stok Habis" ? <span className="text-xs text-red-500 italic">Stok Habis</span>
                            : <span className="text-xs text-gray-400 italic">Tidak ada ukuran</span>
                        }
                         {/* Tampilkan pesan jika tidak ada ukuran tersisa */}
                         {Array.isArray(product.sizes) && product.sizes.length > 0 && typeof product.sizes[0] === 'object' && (product.sizes as ProductSize[]).filter(size => size.stock > 0).length === 0 && (
                            <span className="text-xs text-red-500 italic">Semua ukuran habis</span>
                         )}
                      </div>
                    </td>
                     {/* Aksi */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => openEditPopup(product)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors"
                          title="Edit Produk"
                        >
                          <Icon icon="mdi:pencil-outline" className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                          title="Hapus Produk"
                        >
                          <Icon icon="mdi:delete-outline" className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Popups */}
      {isAddPopupOpen && (
        <TambahProdukPopup
          onClose={() => setAddPopupOpen(false)}
          onSuccess={() => {
            setAddPopupOpen(false);
            fetchProducts(); // Refresh data setelah berhasil tambah
          }}
        />
      )}

      {/* Render EditProdukPopup */}
      {isEditPopupOpen && productToEdit && (
        <EditProdukPopup
          productToEdit={productToEdit}
          onClose={() => {
              setEditPopupOpen(false);
              setProductToEdit(null);
          }}
          onSuccess={() => {
            setEditPopupOpen(false);
            setProductToEdit(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

export default EditProduk;