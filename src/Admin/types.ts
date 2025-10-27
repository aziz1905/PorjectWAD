// Admin/types.ts

// Kategori (dari API /categories)
export interface Category {
  id: number;
  name: string;
}

// Ukuran Produk (sub-bagian dari Product)
export interface ProductSize {
  id?: number; // Mungkin tidak ada saat membuat baru
  productId?: number; // Mungkin tidak ada saat membuat baru
  sizeName: 'S' | 'M' | 'L' | 'XL' | 'XXL'; // Sesuaikan dengan enum backend
  stock: number;
}

// Produk (data lengkap dari API /products atau /products/:id/details)
export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: string; // API mungkin mengembalikan string untuk decimal
  imageUrl: string;
  age: 'Anak' | 'Remaja' | 'Dewasa'; // Sesuaikan dengan enum backend
  gender: 'Pria' | 'Wanita' | 'Unisex'; // Sesuaikan dengan enum backend
  rating?: string; // Opsional
  rentCount?: number; // Opsional
  // API /products mungkin mengembalikan sizes sebagai array of string atau array ProductSize
  // Kita buat union type untuk menangani keduanya di halaman list
  sizes: (ProductSize[] | string[]);
}

// Data yang dibutuhkan untuk form Tambah/Edit Produk
// Mirip Product, tapi beberapa field berbeda tipe atau opsional
export interface ProductFormData {
    id?: number; // Ada saat edit, tidak ada saat tambah
    categoryId: number | ''; // Bisa string kosong saat inisialisasi
    name: string;
    description: string;
    price: number | ''; // Bisa string kosong atau number
    imageUrl: string; // URL gambar (bisa URL lama atau baru)
    age: 'Anak' | 'Remaja' | 'Dewasa';
    gender: 'Pria' | 'Wanita' | 'Unisex';
    // Ukuran di form selalu array of object
    sizes: {
      sizeName: 'S' | 'M' | 'L' | 'XL' | 'XXL';
      stock: number | ''; // Bisa string kosong saat input
    }[];
}

// Data yang dikirim ke API POST /products/addProduct
export interface NewProductApiData {
  categoryId: number;
  name: string;
  description: string;
  price: number; // Harus number
  imageUrl: string;
  age: 'Anak' | 'Remaja' | 'Dewasa';
  gender: 'Pria' | 'Wanita' | 'Unisex';
  sizes: { // Harus array object dengan stock number
    sizeName: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    stock: number;
  }[];
}

// Data yang dikirim ke API PUT /products/:id
export interface UpdateProductApiData {
  categoryId: number;
  name: string;
  description: string;
  price: number; // Harus number
  imageUrl?: string; // Opsional, hanya jika gambar diubah
  age: 'Anak' | 'Remaja' | 'Dewasa';
  gender: 'Pria' | 'Wanita' | 'Unisex';
  sizes: { // Harus array object dengan stock number
    sizeName: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    stock: number;
  }[];
}
