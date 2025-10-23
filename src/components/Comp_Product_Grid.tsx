import ProductCard from "./Comp_Product_Card";
import { useState, useEffect } from 'react';
import { Product } from "../type";
import { useSearch } from './Comp_Search'; 
import api from '../api'; 

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]); // Menyimpan daftar asli dari API
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Menyimpan daftar yang akan ditampilkan
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Ambil searchTerm dari context
  const { searchTerm } = useSearch();

  // Efek ini hanya berjalan sekali untuk mengambil semua produk dari backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products'); // Menggunakan api.get
        setProducts(response.data); // Simpan daftar produk asli
      } catch (err) {
        setError('Gagal mengambil data produk dari server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Dependency array kosong, jadi hanya berjalan saat komponen dimuat

  // 3. Efek ini berjalan setiap kali searchTerm atau daftar produk asli berubah
  useEffect(() => {
    // Lakukan filtering berdasarkan searchTerm
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]); // Bergantung pada searchTerm dan products

  if (loading) {
    return <div className="text-center py-12">Memuat produk...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-12">Error: {error}</div>;
  }
  
  return (
    <div className="product-grid">
      {/* 4. Tampilkan 'filteredProducts', bukan 'products' */}
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          imageUrl={product.imageUrl}
          sizes={product.sizes}
          age={product.age as "Dewasa" | "Remaja" | "Anak-anak"}
          gender={product.gender as "Pria" | "Wanita" | "Unisex"}
          categoryId={product.categoryId}
          wishlisted={product.wishlisted}
        />
      ))}
    </div>
  );
}