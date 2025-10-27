import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import api from '../../api'; // 1. Aktifkan import api
import { AxiosError } from 'axios'; // Import untuk error handling

interface TambahProdukPopupProps {
  onClose: () => void; // Fungsi untuk menutup popup
}

// Tipe data ENUM untuk mencocokkan backend
type ProductAge = "Dewasa" | "Remaja" | "Anak-anak";
type ProductGender = "Pria" | "Wanita" | "Unisex";
type ProductSize = "S" | "M" | "L" | "XL" | "XXL";

const TambahProdukPopup: React.FC<TambahProdukPopupProps> = ({ onClose }) => {
  // 2. State untuk semua field form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState<number | ''>(1); // Default Kategori ID (ganti jika perlu)
  const [age, setAge] = useState<ProductAge>('Dewasa');
  const [gender, setGender] = useState<ProductGender>('Unisex');
  
  // State untuk ukuran (array of objects)
  const [sizes, setSizes] = useState<{ sizeName: ProductSize, stock: number }[]>([
    { sizeName: 'S', stock: 0 },
    { sizeName: 'M', stock: 0 },
    { sizeName: 'L', stock: 0 },
    { sizeName: 'XL', stock: 0 },
  ]);

  // State untuk file gambar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State untuk feedback
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 3. Handler untuk upload gambar
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleImageClick = () => fileInputRef.current?.click();

  // Handler untuk mengubah stok ukuran
  const handleSizeStockChange = (index: number, stock: number) => {
    const newSizes = [...sizes];
    newSizes[index].stock = Math.max(0, stock); // Pastikan stok tidak negatif
    setSizes(newSizes);
  };

  // 4. Logika handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !name || !price || !categoryId) {
      setError('Nama, Harga, Kategori, dan Foto Pakaian wajib diisi.');
      return;
    }
    setLoading(true);
    setError(null);

    // Filter ukuran yang stoknya lebih dari 0
    const validSizes = sizes.filter(s => s.stock > 0);
    if (validSizes.length === 0) {
      setError('Minimal harus ada 1 ukuran dengan stok lebih dari 0.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    // Tambahkan data teks
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price.toString());
    formData.append('categoryId', categoryId.toString());
    formData.append('age', age);
    formData.append('gender', gender);
    // Kirim 'sizes' sebagai string JSON
    formData.append('sizes', JSON.stringify(validSizes));
    // Tambahkan file gambar
    formData.append('productImage', selectedFile); // 'productImage' harus cocok dgn backend

    try {
      // Ganti '/products' dengan endpoint create product Anda
      await api.post('/products/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setLoading(false);
      alert('Produk berhasil ditambahkan!');
      onClose(); // Tutup popup

    } catch (err) {
      setLoading(false);
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Gagal menambahkan produk.';
      setError(errorMessage);
      console.error("Error tambah produk:", err);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto" // Tambah overflow-y-auto
      onClick={onClose} 
    >
      <div 
        className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-lg relative my-8" // Tambah my-8
        onClick={(e) => e.stopPropagation()} 
      >
        <button onClick={onClose} /* ... tombol close ... */ >
          <Icon icon="mdi:close" className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tambahkan Produk</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"> {/* Tambah max-h & overflow */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-600 mb-1">Nama Pakaian</label>
            <input
              id="nama" type="text"
              value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Masukan Nama Pakaian" required
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-600 mb-1">Deskripsi Pakaian</label>
            <textarea
              id="deskripsi"
              value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukan Deskripsi Pakaian"
              rows={3}
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-600 mb-1">Kategori</label>
              {/* TODO: Ambil kategori dari API */}
              <select id="kategori" value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg">
                <option value={1}>Superhero</option>
                <option value={2}>Gaun Pesta</option>
                {/* ... tambahkan kategori lain */}
              </select>
            </div>
            <div>
              <label htmlFor="harga" className="block text-sm font-medium text-gray-600 mb-1">Harga Harian</label>
              <input
                id="harga" type="number"
                value={price} onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="Rp 100000" required
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          
           <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-600 mb-1">Usia</label>
              <select id="age" value={age} onChange={(e) => setAge(e.target.value as ProductAge)} className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg">
                <option value="Dewasa">Dewasa</option>
                <option value="Remaja">Remaja</option>
                <option value="Anak-anak">Anak-anak</option>
              </select>
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
              <select id="gender" value={gender} onChange={(e) => setGender(e.target.value as ProductGender)} className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg">
                <option value="Unisex">Unisex</option>
                <option value="Pria">Pria</option>
                <option value="Wanita">Wanita</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Ukuran & Stok</label>
            <div className="space-y-2">
              {sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-12 p-2 text-center bg-gray-200 rounded-lg text-sm">{size.sizeName}</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Stok"
                    value={size.stock}
                    onChange={(e) => handleSizeStockChange(index, Number(e.target.value))}
                    className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Foto Pakaian</label>
            <div 
              onClick={handleImageClick} // Klik div untuk trigger input
              className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
              ) : (
                <div className="text-center text-gray-500">
                  <Icon icon="mdi:image-outline" className="w-12 h-12 mx-auto" />
                  <p>Klik untuk memasukkan gambar</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/png, image/jpeg, image/jpg" 
              className="hidden" 
              required
            />
          </div>

          {/* Tampilkan pesan error */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              className="bg-black text-white font-bold py-3 px-8 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
              disabled={loading} // Disable tombol saat loading
            >
              {loading ? 'Menambahkan...' : 'Tambahkan Etalase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahProdukPopup;