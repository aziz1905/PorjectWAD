import ProductCard from "./Comp_Product_Card";
import { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { useSearch } from './Comp_Search';
import { useCategory } from './Comp_Kategori';
import api from '../api';
import { useAuth } from '../components/AuthContext'; // Asumsi: Anda memiliki hook ini

// UBAH MENJADI INI:
// Beri nilai default berupa Set kosong agar tidak pernah 'undefined'
export default function ProductGrid({ wishlistProductIds = new Set<number>() }) {
  const [products, setProducts] = useState<Product[]>([]); 
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCategoryId } = useCategory();
  const { searchTerm } = useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let apiUrl = '/products';
        if (selectedCategoryId !== null) {
          apiUrl += `?category=${selectedCategoryId}`; 
        }
        const response = await api.get(apiUrl);
        setProducts(response.data || []); 
      } catch (err) {
        setError('Gagal mengambil data produk dari server.');
        setProducts([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategoryId]); // Hanya bergantung pada kategori

  // useEffect untuk search (tidak berubah)
  useEffect(() => {
    const results = products.filter(product =>
      product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  // Effect ini (untuk search) tidak perlu diubah
  useEffect(() => {
    const results = products.filter(product =>
      product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      {filteredProducts.length === 0 && !loading ? (
        <div className="text-center text-gray-500 py-10 col-span-full">
          <p>Tidak ada produk yang ditemukan{selectedCategoryId ? ` untuk kategori ini` : ''}{searchTerm ? ` dengan kata kunci "${searchTerm}"` : ''}.</p>
        </div>
      ) : (
        <div className="grid col-span-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            // Tentukan status wishlist berdasarkan Set
            const isWishlisted = wishlistProductIds.has(product.id);

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                sizes={product.sizes}
                age={product.age as string}
                gender={product.gender as string}
                categoryId={product.categoryId}
                wishlisted={isWishlisted} 
                rating={product.rating}
              />
            ); 
          })}
        </div>
      )}
    </div>
  ); 
}