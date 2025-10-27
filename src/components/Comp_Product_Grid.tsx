import ProductCard from "./Comp_Product_Card";
import { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import { useSearch } from './Comp_Search';
import { useCategory } from './Comp_Kategori';
import api from '../api'; 

export default function ProductGrid() {
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
          apiUrl += `?category=${selectedCategoryId}`; // Pastikan nama param benar
        }
        console.log("Fetching products from:", apiUrl); // Debugging
        const response = await api.get(apiUrl);
        console.log("Data diterima dari API:", response.data); // Debugging
        setProducts(response.data); // Update state 'products'
      } catch (err) {
        setError('Gagal mengambil data produk dari server.');
        console.error("Error fetching products:", err);
        setProducts([]); // Kosongkan jika error
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategoryId]);

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
    // Wrapper utama untuk grid dan pesan 'tidak ditemukan'
    
    <div className="product-grid">
       {/* Kondisi jika TIDAK ADA produk yang cocok */}
       {filteredProducts.length === 0 && !loading ? (
         <div className="text-center text-gray-500 py-10 col-span-full"> 
           <p>Tidak ada produk yang ditemukan{selectedCategoryId ? ` untuk kategori ini` : ''}{searchTerm ? ` dengan kata kunci "${searchTerm}"` : ''}.</p> 
         </div>
       ) : (
          // Jika ADA produk, tampilkan div grid-nya
          <div className="grid col-span-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> 
            {/* Map DI DALAM div grid */}
            {filteredProducts.map((product) => {  

              return ( 
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  sizes={product.sizes}
                  // Ganti tipe di ProductCard jadi string jika masih error tipe
                  age={product.age as string} 
                  gender={product.gender as string}
                  categoryId={product.categoryId}
                  wishlisted={product.wishlisted} 
                  rating={product.rating}
                />
              ); // Akhir return ProductCard
            })} {/* Tutup map */}
          </div> // Tutup div grid
       )} 
    </div>
  ); // Tutup return komponen
}