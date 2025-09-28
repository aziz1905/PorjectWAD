// Di sini kita akan menyimpan semua tipe data yang digunakan bersama di seluruh aplikasi

export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string;
}

// Kamu juga bisa menambahkan tipe data lain di sini nanti, misalnya untuk Produk:
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    sizes: readonly string[];
    category: {
        age: string;
        gender: string;
    };
    rating?: number;
    sold?: number;
}