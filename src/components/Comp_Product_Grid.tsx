import ProductCard from "./Comp_Product_Card";
import { useState, useEffect } from 'react';
import { Product } from "../type";
import { useSearch } from './Comp_Search'; 
import api from '../api'; 

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { searchTerm } = useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products'); 
        setProducts(response.data); 
      } catch (err) {
        setError('Gagal mengambil data produk dari server.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  if (loading) {
    return <div className="text-center py-12">Memuat produk...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-12">Error: {error}</div>;
  }
  
  return (
    <div className="product-grid">
      {filteredProducts.map((product) => { // Buka kurung kurawal di sini
        
        // TAMBAHKAN INI UNTUK DEBUGGING:
        console.log("Data Produk:", product); 
        console.log("Age:", product.age); // Cek age di dalam specification
        console.log("Gender:", product.gender); // Cek gender di dalam specification
        console.log("Sizes:", product.sizes); // Cek sizes
        
        return ( // Kembalikan JSX di sini
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            imageUrl={product.imageUrl}
            sizes={product.sizes}
            // Pastikan ini mengambil dari specification jika itu struktur datanya
            age={product.age as "Dewasa" | "Remaja" | "Anak-anak" || 'N/A'} 
            gender={product.gender as "Pria" | "Wanita" | "Unisex" || 'N/A'}
            categoryId={product.categoryId}
            wishlisted={product.wishlisted}
            rating={product.rating}
          />
        ); // Tutup kurung JSX
      })} {/* Tutup kurung kurawal map */}
    </div>
  );
}